const crypto = require('crypto');
const axios = require('axios');

function hashSHA256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

async function processPayload(req, res) {
  try {
    console.log('Dados recebidos:', req.body);

    const { data, partner_agent } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid payload format' });
    }

    data.forEach(event => {
      if (!event.event_time) {
        return res.status(400).json({ error: 'event_time is required' });
      }

      if (event.user_data) {
        if (event.user_data.em) {
          event.user_data.em = hashSHA256(event.user_data.em);
        }
        if (event.user_data.ph) {
          event.user_data.ph = hashSHA256(event.user_data.ph);
        }

        delete event.user_data.page_scoped_user_id;
      }
    });

    const facebookApiUrl = 'https://graph.facebook.com/v16.0/987830626061730/events?access_token=EAAR26OSzZCGUBOxasbZBZCK84UumcmcmhRZAKRKJs178FsmZB6su3cWbZC5vTw819ukUxW9Em0kwJa2txxvH2yT2ucmB12AWe0K8DrB4rf5OWdl3Sm8VdaLu0caTFRgICxxBbP194iZCXKU4H76EpXZAU9G5IPuH7crTOfgPY5c9LbhK9ETtnBlmux50d0M0aQkZBZBgZDZD';

    console.log('Enviando dados para a API do Facebook:', {
      data,
      partner_agent
    });

    const responseToFacebook = await axios.post(facebookApiUrl, {
      data,
      partner_agent
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Resposta da API do Facebook:', responseToFacebook.data);

    res.json({
      status: 'Payload sent successfully',
      facebook_response: responseToFacebook.data
    });
  } catch (error) {
    console.error('Erro ao processar payload:', error);

    res.status(error.response ? error.response.status : 500).json({
      error: error.message,
      facebook_response: error.response ? error.response.data : null
    });
  }
}

module.exports = { processPayload };

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
      console.log('Erro: formato de payload inválido');
      return res.status(400).json({ error: 'Invalid payload format' });
    }

    const processedData = data.map(event => {
      if (!event.event_time) {
        console.log('Erro: falta event_time');
        throw new Error('event_time is required');
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

      return event;
    });

    const payload = {
      data: processedData,
      partner_agent
    };

    console.log('Enviando dados para a API do Facebook:', payload);

    const facebookApiUrl = 'https://graph.facebook.com/v16.0/405083305939509/events?access_token=EAB1u1MXHeo8BO7UfgrdKtQRjAXP0ZC7kyrAbA4CSJzj2xmoEtSVFZCPxuDYU0WOnUbwnHvVjZALHzE8iZACEWETeagiZA1qhv4ZAwIgsNZAGFUZBRREPmRcpZCBYKPndlUGHqtaHOgZBFm4SSSjpyCV15n2xONZCHINeMbo36yCpIxfxwNNhN33aqoG9ki5ScDHNCTLXQZDZD';

    const responseToFacebook = await axios.post(facebookApiUrl, payload, {
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

const crypto = require('crypto');
const axios = require('axios');

// Função para gerar hash SHA256
function hashSHA256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// Função para processar o payload recebido e enviar para a API do Facebook
async function processPayload(req, res) {
  try {
    // Exibir os dados recebidos
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

    const facebookApiUrl = 'https://graph.facebook.com/v16.0/405083305939509/events?access_token=EAB1u1MXHeo8BO7UfgrdKtQRjAXP0ZC7kyrAbA4CSJzj2xmoEtSVFZCPxuDYU0WOnUbwnHvVjZALHzE8iZACEWETeagiZA1qhv4ZAwIgsNZAGFUZBRREPmRcpZCBYKPndlUGHqtaHOgZBFm4SSSjpyCV15n2xONZCHINeMbo36yCpIxfxwNNhN33aqoG9ki5ScDHNCTLXQZDZD';

    // Exibir dados que serão enviados para o Facebook
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

    // Exibir a resposta da API do Facebook
    console.log('Resposta da API do Facebook:', responseToFacebook.data);

    res.json({
      status: 'Payload sent successfully',
      facebook_response: responseToFacebook.data
    });
  } catch (error) {
    // Exibir o erro ocorrido
    console.error('Erro ao processar payload:', error);

    res.status(error.response ? error.response.status : 500).json({
      error: error.message,
      facebook_response: error.response ? error.response.data : null
    });
  }
}

module.exports = { processPayload };

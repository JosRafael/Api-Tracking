const crypto = require('crypto');

exports.hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

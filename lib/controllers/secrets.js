const { Router } = require('express');
const authenticate = require('../middleware/authenticate.js');
const Secret = require('../models/Secret');

module.exports = Router().get('/', [authenticate], async (req, res) => {
  const resp = await Secret.getAllSecrets();

  res.json(resp);
});

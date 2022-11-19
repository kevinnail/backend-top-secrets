const { Router } = require('express');
const authenticate = require('../middleware/authenticate.js');
const authorize = require('../middleware/authorize.js');
const Secret = require('../models/Secret');

module.exports = Router()
  .get('/', [authenticate, authorize], async (req, res) => {
    const resp = await Secret.getAllSecrets();

    res.json(resp);
  })

  .post('/', [authenticate], async (req, res) => {
    const secret = await Secret.postNewSecret(req.body);
    res.json(secret);
  });

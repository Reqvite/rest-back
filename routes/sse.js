const express = require('express');
const router = express.Router();
const { sse } = require('../controllers');

router.get('/:restId', sse.connection);

module.exports = router;

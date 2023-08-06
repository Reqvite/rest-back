const express = require('express');
const router = express.Router();
const { sse } = require('../controllers');
const { validateObjectId } = require('../middleware/validations');
const checkRestId = require('../middleware/checkRestId');

router.get('/:restId', validateObjectId, checkRestId, sse.connection);

module.exports = router;

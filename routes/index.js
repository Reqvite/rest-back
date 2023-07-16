const express = require('express');
const indexController = require('../controllers/IndexController');
const router = express.Router();

//this can be used for some starting page/homepage

router.get('/', indexController.index);

module.exports = router;

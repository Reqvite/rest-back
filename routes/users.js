
//user files are test and should be deleted or changed later.

const express = require('express');
const usersController = require('../controllers/UserController');
const router = express.Router();

router.get('/', usersController.index);

module.exports = router;

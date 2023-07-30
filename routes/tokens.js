const express = require("express");
const tokenController = require("../controllers/TokenController");
const router = express.Router();

router.get("/", tokenController.getUserToken);

module.exports = router;

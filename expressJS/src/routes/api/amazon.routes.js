const express = require("express");
const router = express.Router();
const amazonController = require("../../controllers/amazon.controller");

router.post("/amazonCrawler", amazonController);

module.exports = router;

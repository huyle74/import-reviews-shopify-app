const express = require("express");
const router = express.Router();

const aliExpressController = require("../../controllers/aliExpress.controller");

router.post("/aliExpressCrawler", aliExpressController);

module.exports = router;

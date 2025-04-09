const express = require("express");
const router = express.Router();
const googleExtensionController = require("../../controllers/headerGoogleExtension.controller");

router.post("/googleExtension", googleExtensionController);

module.exports = router;

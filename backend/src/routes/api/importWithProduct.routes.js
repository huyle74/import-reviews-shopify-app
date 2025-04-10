const express = require("express");
const router = express.Router();
const { importWithProductController, updateAfterImportController } = require("../../controllers/importWithProduct.controller");

router.get("/getProductInfo", importWithProductController);
router.post("/updateDataAfterImported", updateAfterImportController);

module.exports = router;

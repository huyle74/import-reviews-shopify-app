const entryImportPageService = require("../services/importWithProduct/entryPage.service");
const updateAfterImportService = require("../services/importWithProduct/updateDataAfterImported.service");

const importWithProductController = async (req, res) => {
  const { shopify_product_id } = req.query;
  const productInfo = await entryImportPageService(shopify_product_id);
  res.json({ productInfo });
};

const updateAfterImportController = async (req, res) => {
  const { shopify_product_id } = req.query;
  const response = await updateAfterImportService(shopify_product_id);

  res.json(response);
};

module.exports = { importWithProductController, updateAfterImportController };

const CrawlFromAliExpress = require("../services/aliExpress/index");

const aliExpressController = async (req, res) => {
  try {
    const { url, billing, shop_id, shopify_product_id } = req.query;
    const { reviews, review_id } = await CrawlFromAliExpress(url, billing, shop_id,shopify_product_id);
    if (reviews.length) {
      res.json({ reviews, review_id, success: true });
    } else {
      res.json({ reviews, review_id, success: false });
    }
  } catch (error) {
    console.error("Controller AliExpress bug >>", error);
  }
};

module.exports = aliExpressController;

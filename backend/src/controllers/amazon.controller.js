const AmazonCrawler = require("../services/amazon/index");

async function amazonController(req, res) {
  try {
    const { url, shop_id, billing, shopify_product_id } = req.query;
    const { reviews, review_id } = await AmazonCrawler(url, shop_id, billing, shopify_product_id);
    if (reviews.length) {
      res.json({ reviews, review_id, success: true });
    } else {
      res.json({ reviews: null, review_id: null, success: false });
    }
  } catch (error) {
    console.error("Controller - Amazon: stuck ", error);
  }
}

module.exports = amazonController;

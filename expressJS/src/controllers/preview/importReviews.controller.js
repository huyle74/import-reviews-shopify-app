const confirmImportReviews = require("../../services/preview/confirmImportReviews");

const confirmImportReviewsController = async (req, res) => {
  const { shop_id, review_id } = req.query;
  const response = await confirmImportReviews(shop_id, review_id);
  if (response) res.json({ success: true });
};

module.exports = confirmImportReviewsController;

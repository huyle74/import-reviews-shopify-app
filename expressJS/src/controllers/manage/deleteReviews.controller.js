const deleteReviewsService = require("../../services/manageReviews/deleteReviews.service");

const deleteReviewsController = async (req, res) => {
  const { id, shopify_product_id } = req.body;

  console.log(id, shopify_product_id);

  const success = await deleteReviewsService(id, shopify_product_id);

  if (success) {
    res.json({ success });
  } else {
    res.status(400).json({ success });
  }
};

module.exports = deleteReviewsController;

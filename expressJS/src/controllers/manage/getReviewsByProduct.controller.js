const reviewByProductService = require("../../services/manageReviews/getReviewsFromProduct.service");

const getReviewsByProductController = async (req, res) => {
  const { shopify_product_id } = req.query;
  const { cursor, hasImage = [], hasContent = [], countries = [], sortBy = "id", direction = "next", order, rating = [] } = req.body;

  const reviews = await reviewByProductService({ shopify_product_id, cursor, hasImage, hasContent, countries, sortBy, direction, order, rating });
  res.json(reviews);
};

module.exports = getReviewsByProductController;

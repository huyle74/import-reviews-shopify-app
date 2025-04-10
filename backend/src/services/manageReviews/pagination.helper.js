const { query } = require("../../utils/db");
const pageSize = 50;

const paginationReviewsHelper = async (shopify_product_id) => {
  try {
    const reviews = await query(`SELECT id FROM reviews WHERE shopify_product_id = $1`, [shopify_product_id]);
    if (reviews.rowCount > pageSize) {
      return { hasPagination: true, totalPage: Math.ceil(reviews.rowCount / pageSize), totalReviews: reviews.rowCount };
    } else {
      return { hasPagination: false, totalPage: null, totalReviews: reviews.rowCount };
    }
  } catch (error) {
    console.log("Pagination failed: ", error);
  }
};

module.exports = paginationReviewsHelper;

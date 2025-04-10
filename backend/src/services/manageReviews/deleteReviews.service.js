const { query } = require("../../utils/db");
const queryDeleteReviews = `DELETE FROM reviews WHERE id = ANY($1) AND shopify_product_id = $2;`;

const deleteReviewsService = async (id, shopify_product_id) => {
  try {
    const deleteReviews = await query(queryDeleteReviews, [id, shopify_product_id]);
    if (deleteReviews.rowCount > 0) {
      console.log("Delete reviews successfully!!");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("CANNOT DELETE IMAGE >>", error);
  }
};

module.exports = deleteReviewsService;

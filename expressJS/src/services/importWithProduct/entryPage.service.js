const { query } = require("../../utils/db");
const queryGetProductInfo = `SELECT
  COALESCE(COUNT(*), 0) AS total_reviews,
  COALESCE(SUM(
    CASE 
      WHEN review_image IS NOT NULL THEN COALESCE(array_length(review_image, 1), 0)
      ELSE 0 
    END
  ), 0) AS total_photos,
  COALESCE(ROUND(AVG(rating)::numeric, 2), 0) AS average_rating
FROM reviews
WHERE shopify_product_id = $1;
`;

const entryImportPageService = async (shopify_product_id) => {
  try {
    const info = await query(queryGetProductInfo, [shopify_product_id]);
    return info.rows;
  } catch (error) {
    console.error("Cannot get product info from DB", error);
  }
};

module.exports = entryImportPageService;

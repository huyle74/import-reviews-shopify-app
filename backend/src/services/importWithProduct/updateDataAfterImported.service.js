const { query } = require("../../utils/db");

const queryReviewsInfo = `SELECT 
    shopify_product_id,
    COUNT(*) AS totalReviews,
    AVG(rating)::numeric(10, 2) AS averageRating
    FROM reviews
    WHERE shopify_product_id = $1
    GROUP BY shopify_product_id;`;

const updateAfterImportService = async (shopify_product_id) => {
  try {
    const results = await query(queryReviewsInfo, [shopify_product_id]);

    const [data] = results.rows;

    return { totalReviews: data.totalreviews, averageRating: data.averagerating };
  } catch (error) {
    console.error("Cannot Update: ", error);
  }
};

module.exports = updateAfterImportService;

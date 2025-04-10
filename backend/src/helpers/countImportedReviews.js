const { query } = require("../utils/db");

const queryImportedReviews = `
  SELECT 
    shopify_product_id, 
    COUNT(*) AS count, 
    COALESCE(AVG(rating)::numeric(10, 1), 0) AS average_rating
  FROM reviews 
  WHERE shopify_product_id = ANY($1) 
  GROUP BY shopify_product_id
`;

const addCountImportedReviews = async (products) => {
  try {
    const productId = products.map((product) => product.id);
    const reviews = await query(queryImportedReviews, [productId]);

    const addCount = products.map((product) => {
      const reviewStats = reviews.rows.find(
        (item) => item.shopify_product_id === product.id
      );

      product.totalReviews = reviewStats ? parseInt(reviewStats.count) : 0;
      product.averageRating = reviewStats ? parseFloat(reviewStats.average_rating) : 0;
      return product;
    });

    return addCount;
  } catch (error) {
    console.error("Cannot check Imported reviews >> ", error);
  }
};

module.exports = { addCountImportedReviews };

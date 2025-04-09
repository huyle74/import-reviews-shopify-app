const { query } = require("../../utils/db");
const querySaveReviews = `  
INSERT INTO reviews (shop_id, platform_id, product_id, shopify_product_id, review_name, nation, review_content, rating, avatar, date, review_image, review_id)
SELECT shop_id, platform_id, product_id, shopify_product_id, review_name, nation, review_content, rating, avatar, date, review_image, review_id
FROM pending_reviews
WHERE shop_id = $1 and review_id = $2`;
const queryDeleteAfterSave = `DELETE FROM pending_reviews WHERE shop_id = $1`;

const confirmImportReviews = async (shopId, review_id) => {
  try {
    await query(querySaveReviews, [shopId, review_id]);
    const results = await query(queryDeleteAfterSave, [shopId]);

    if (results.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Save reviews got bug >>", error);
  }
};

module.exports = confirmImportReviews;

const { query } = require("../../utils/db");
const queryDeleteMulti = `DELETE FROM pending_reviews WHERE id = ANY($1::VARCHAR[]) AND review_id = $2`;
const queryAfterDelete = `SELECT * FROM pending_reviews WHERE review_id=$1`;

const deleteMultiReviewsService = async (id, review_id) => {
  console.log("\n--Delete reviews in preview trigger:", id, review_id);
  try {
    await query(queryDeleteMulti, [id, review_id]);

    const reviews = await query(queryAfterDelete, [review_id]);
    return { success: true, reviews: reviews.rows };
  } catch (error) {
    console.error("CANNOT DELETE REVIEWS SELECTED >> ", error);
  }
};

const queryDeleteById = `DELETE FROM pending_reviews WHERE id = $1 AND review_id = $2`;

const deleteOneReviewService = async (id, review_id) => {
  console.log("Delete reviews by Id: ", id);
  try {
    await query(queryDeleteById, [String(id), String(review_id)]);
    const reviews = await query(queryAfterDelete, [review_id]);
    return { success: true, reviews: reviews.rows };
  } catch (error) {
    console.error("Delete reviews in Preview by ID >>>", error);
  }
};

module.exports = { deleteMultiReviewsService, deleteOneReviewService };

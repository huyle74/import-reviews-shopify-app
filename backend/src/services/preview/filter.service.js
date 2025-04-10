const { query } = require("../../utils/db");

const queryPg = `SELECT * FROM pending_reviews
WHERE review_id = $1
  AND ($7::BOOLEAN IS FALSE OR rating = ANY($2))
  AND (
  $3::BOOLEAN IS NULL
  OR ($3::BOOLEAN IS TRUE AND review_content IS NOT NULL AND LENGTH(review_content) > 0)
  OR ($3::BOOLEAN IS FALSE AND (review_content IS NULL OR LENGTH(review_content) = 0))
  )
 AND (
  $4::BOOLEAN IS NULL
  OR ($4::BOOLEAN IS TRUE AND review_image IS NOT NULL AND array_length(review_image, 1) > 0)
  OR ($4::BOOLEAN IS FALSE AND (review_image IS NULL OR coalesce(array_length(review_image, 1), 0) = 0))
  )
  AND ($6::BOOLEAN IS FALSE OR nation = ANY($5))
`;

const filterReviewsService = async (filter, review_id) => {
  try {
    console.log(filter, review_id);

    const { rating, nation, hasContent, hasImage } = filter;
    const applyRatingFilter = rating.length > 0;
    const applyNationFilter = nation.length > 0;
    const applyContentFilter = hasContent.length > 0 ? hasContent[0] : null;
    const applyImageFilter = hasImage.length > 0 ? hasImage[0] : null;
    const results = await query(queryPg, [review_id, rating, applyContentFilter, applyImageFilter, nation, applyNationFilter, applyRatingFilter]);

    console.log("Total filtered reviews: ", results.rowCount);

    return results.rows;
  } catch (error) {
    console.error("Cannot filter reviews > ", error);
  }
};

module.exports = filterReviewsService;

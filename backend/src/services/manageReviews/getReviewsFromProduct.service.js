const { query } = require("../../utils/db");

const getPaginatedReviews = async ({
  shopify_product_id,
  cursor = null,
  hasImage = null,
  hasContent = null,
  countries = [],
  sortBy = "id",
  direction = "next",
  pageSize = 50,
  rating = [],
  order = "ASC",
}) => {
  try {
    let index = 2;
    const isPrev = direction === "prev";
    let cursorClause = "",
      orderBy = "";
    const values = [shopify_product_id];
    console.log(hasImage, hasContent, countries, rating);

    if (order === "ASC") {
      if (sortBy === "rating") {
        orderBy = isPrev ? "rating DESC, id DESC" : "rating ASC, id ASC";
        if (cursor && cursor.id && cursor.rating) {
          cursorClause = `AND (rating, id) ${isPrev ? "<" : ">"} ($${index}, $${index + 1})`;
          console.log("cursor rating", cursor.rating, cursor.id);
          values.push(cursor.rating, cursor.id);
          index += 2;
        }
      } else if (sortBy === "date") {
        orderBy = isPrev ? `date DESC, id DESC` : "date ASC, id ASC";
        if (cursor && cursor.id && cursor.date) {
          cursorClause = `AND (date, id) ${isPrev ? "<" : ">"} ($${index}, $${index + 1})`;
          values.push(cursor.date, cursor.id);
          index += 2;
        }
      } else {
        orderBy = isPrev ? "id DESC" : "id ASC";
        if (cursor && cursor.id) {
          cursorClause = `AND id ${isPrev ? "<" : ">"} $${index}`;
          values.push(cursor.id);
          index += 1;
        }
      }
    } else {
      if (sortBy === "rating") {
        orderBy = isPrev ? "rating ASC, id ASC" : "rating DESC, id DESC";
        if (cursor && cursor.id && cursor.rating) {
          cursorClause = `AND (rating, id) ${isPrev ? ">" : "<"} ($${index}, $${index + 1})`;
          values.push(cursor.rating, cursor.id);
          index += 2;
        }
      } else if (sortBy === "date") {
        orderBy = isPrev ? `date ASC, id ASC` : "date DESC, id DESC";
        if (cursor && cursor.id && cursor.date) {
          cursorClause = `AND (date, id) ${isPrev ? ">" : "<"} ($${index}, $${index + 1})`;
          values.push(cursor.date, cursor.id);
          index += 2;
        }
      } else {
        orderBy = isPrev ? "id ASC" : "id DESC";
        if (cursor && cursor.id) {
          cursorClause = `AND id ${isPrev ? ">" : "<"} $${index}`;
          values.push(cursor.id);
          index += 1;
        }
      }
    }

    const sql = `
    SELECT * FROM reviews
    WHERE shopify_product_id = $1
    ${cursorClause}
    AND (
    $${index}::text = 'any' OR 
    ($${index} = 'true' AND array_length(review_image, 1) > 0) OR
    ($${index} = 'false' AND (review_image IS NULL OR array_length(review_image, 1) = 0))
    )
    AND (
    $${index + 1}::text = 'any' OR 
    ($${index + 1} = 'true' AND review_content IS NOT NULL AND length(trim(review_content)) > 0) OR
    ($${index + 1} = 'false' AND (review_content IS NULL OR length(trim(review_content)) = 0))
    )
    AND ($${index + 2}::text[] IS NULL OR nation = ANY($${index + 2}))
    AND ($${index + 3}::int[] IS NULL OR rating = ANY($${index + 3}))
    ORDER BY ${orderBy}
    LIMIT $${index + 4};
  `;
    const imageFilter = hasImage.length === 0 ? "any" : String(hasImage[0]);
    const contentFilter = hasContent.length === 0 ? "any" : String(hasContent[0]);

    values.push(imageFilter, contentFilter, countries.length ? countries : null, rating.length ? rating : null, pageSize);

    const result = await query(sql, values);
    let reviews = result.rows;
    const amountReviews = await query(
      `
    SELECT nation FROM reviews
    WHERE shopify_product_id = $1
    AND (
      $2::text = 'any' OR 
      ($2 = 'true' AND array_length(review_image, 1) > 0) OR
      ($2 = 'false' AND (review_image IS NULL OR array_length(review_image, 1) = 0))
    )
    AND (
      $3::text = 'any' OR 
      ($3 = 'true' AND review_content IS NOT NULL AND length(trim(review_content)) > 0) OR
      ($3 = 'false' AND (review_content IS NULL OR length(trim(review_content)) = 0))
    )
    AND ($4::text[] IS NULL OR nation = ANY($4))
    AND ($5::int[] IS NULL OR rating = ANY($5))
      `,
      [shopify_product_id, imageFilter, contentFilter, countries.length ? countries : null, rating.length ? rating : null]
    );
    const nations = [
      ...new Set(
        amountReviews.rows.map((row) => {
          return row.nation;
        })
      ),
    ];

    if (isPrev) {
      reviews = reviews.reverse();
    }

    // PAGINATION info
    const first = reviews[0];
    const last = reviews.at(-1);
    const nextCursor = last
      ? sortBy === "rating"
        ? {
            rating: last.rating,
            id: last.id,
          }
        : sortBy === "date"
        ? {
            date: last.date,
            id: last.id,
          }
        : {
            id: last.id,
          }
      : null;

    const prevCursor = cursor
      ? first
        ? sortBy === "rating"
          ? {
              rating: first.rating,
              id: first.id,
            }
          : sortBy === "date"
          ? {
              date: first.date,
              id: first.id,
            }
          : {
              id: first.id,
            }
        : null
      : null;

    const totalReviews = Number(amountReviews.rowCount);

    let start = cursor && cursor.range ? cursor.range : 0;
    start = isPrev && start !== 0 ? cursor.range - reviews.length : start + 1;
    const end = start + reviews.length > totalReviews ? totalReviews : start + reviews.length - 1;
    const range = [start, end];

    console.log("\nprevious:", prevCursor, "| Next: ", nextCursor, "\nTotal Reviews:", totalReviews, " | range:", range);

    return {
      reviews,
      pagination: {
        prevCursor,
        nextCursor,
        totalReviews,
        hasPagination: totalReviews > pageSize ? true : false,
        range,
      },
      nations,
    };
  } catch (error) {
    console.error("Pagination failed:", error);
    return { reviews: [], nextCursor: null, prevCursor: null };
  }
};

module.exports = getPaginatedReviews;

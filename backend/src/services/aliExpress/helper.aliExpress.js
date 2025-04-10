const { query } = require("../../utils/db");

async function parseAliExpressUrl(url) {
  try {
    let productId, pagesNumb;
    const regex = /\/item\/(\d+)\.html/;
    const match = url.match(regex);
    if (match) {
      productId = match[1];
    } else {
      console.error("No product Id found");
    }
    const response = await fetch(
      `https://feedback.aliexpress.com/pc/searchEvaluation.do?productId=${productId}&lang=en_US&country=US&page=1&pageSize=10&filter=all&sort=complex_default`,
      {
        method: "get",
      }
    );
    const results = await response.json();
    if (results.data.length !== 0) {
      numb = results.displayMessage?.numRatings.replace(/\s*ratings\b/, "");
      pagesNumb = Number(numb);
    } else {
      console.log("Failed: ", results);
      return (pagesNumb = null);
    }

    return { productId, pagesNumb: pagesNumb };
  } catch (error) {
    console.error("get Product Id stuck here >> ", error);
  }
}

async function reviewUrl(productId, page) {
  return `https://feedback.aliexpress.com/pc/searchEvaluation.do?productId=${productId}&lang=eng_US&country=US&page=${page}&pageSize=10&filter=all&sort=complex_default`;
}

async function crapingReviews(productId, billing, shop_id, shopify_product_id) {
  try {
    let reviews = [];
    const review_id = `${productId}-${Date.now()}-${shop_id}`;

    const queryToAdd =
      " INSERT INTO reviews (id, review_name, avatar, review_content, rating, nation, date, review_image, shop_id, product_id, platform_id, review_id,shopify_product_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ,$12, $13) RETURNING *;";

    console.log("payment >>", billing);
    const pages = billing === true || billing === "true" ? 20 : 1;

    console.log("page here >> ", pages);
    for (let i = 1; i <= pages; i++) {
      const url = await reviewUrl(productId, i);
      const response = await fetch(url, {
        method: "get",
      });
      const results = await response.json();
      const reviewData = results?.data?.evaViewList;
      // BREAK IF NO MORE PAGINATION
      if (!reviewData.length) break;
      for (const dt of reviewData) {
        const id = Math.floor(Math.random() * dt.evaluationId);
        const review_name = dt.buyerName || "";
        const review_content = dt.buyerTranslationFeedback || "";
        const rating = Number(Math.floor(Number(dt.buyerEval) / 20));
        const avatar = dt.buyerHeadPortrait || null;
        const review_image = dt.images || [];
        const date = dt.evalDate;
        const nation = new Intl.DisplayNames(["en"], { type: "region" }).of(dt.buyerCountry);
        await query(queryToAdd, [
          id,
          review_name,
          avatar,
          review_content,
          rating,
          nation,
          date,
          Array.isArray(review_image) ? review_image : [],
          shop_id,
          productId,
          2,
          review_id,
          shopify_product_id,
        ]);
        reviews.push({
          id,
          review_name,
          review_content,
          rating,
          avatar,
          review_image,
          date,
          nation,
        });
      }
    }
    return { reviews, review_id };
  } catch (error) {
    console.error("Get reviews on Ali stuck here >> ", error);
  }
}

module.exports = { parseAliExpressUrl, crapingReviews };

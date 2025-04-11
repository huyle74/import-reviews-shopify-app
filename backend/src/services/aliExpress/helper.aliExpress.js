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

    console.log("payment >>", billing);
    const pages = billing === true || billing === "true" ? 20 : 1;

    const urls = await Promise.all(Array.from({ length: pages }, (_, i) => reviewUrl(productId, i + 1)));
    const responses = await Promise.all(
      urls.map((url) => {
        return fetch(url).then((res) => {
          return res.json();
        });
      })
    );

    for (const result of responses) {
      const reviewData = result?.data?.evaViewList || [];
      for (const review of reviewData) {
        if (review?.buyerEval === 0) continue;
        const id = Math.floor(Math.random() * review?.evaluationId);
        const review_name = review?.buyerName || "";
        const review_content = review?.buyerTranslationFeedback || "";
        const rating = Number(Math.floor(Number(review?.buyerEval) / 20));
        const avatar = review?.buyerHeadPortrait || null;
        const review_image = review.images || [];
        const date = review.evalDate;
        const nation = new Intl.DisplayNames(["en"], { type: "region" }).of(review?.buyerCountry);

        reviews.push([
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
      }
    }
    console.log("total pages >> ", pages);
    if (reviews.length > 0) {
      const values = reviews
        .map(
          (_, i) =>
            `($${i * 13 + 1}, $${i * 13 + 2}, $${i * 13 + 3}, $${i * 13 + 4}, $${i * 13 + 5}, $${i * 13 + 6}, $${i * 13 + 7}, $${i * 13 + 8}, $${i * 13 + 9}, $${i * 13 + 10}, $${
              i * 13 + 11
            }, $${i * 13 + 12}, $${i * 13 + 13})`
        )
        .join(", ");
      const flatValues = reviews.flat();

      const queryToAdd = `
        INSERT INTO reviews 
        (id, review_name, avatar, review_content, rating, nation, date, review_image, shop_id, product_id, platform_id, review_id, shopify_product_id)
        VALUES ${values};
      `;
      await query(queryToAdd, flatValues);
    }

    return {
      reviews: reviews.map(([id, name, , content, rating, , date, images]) => ({
        id,
        review_name: name,
        review_content: content,
        rating,
        date,
        review_image: images,
      })),
      review_id,
    };
  } catch (error) {
    console.error("Get reviews on Ali stuck here >> ", error);
  }
}

module.exports = { parseAliExpressUrl, crapingReviews };

const { performance } = require("perf_hooks");
require("dotenv").config;

const { parseAliExpressUrl, crapingReviews } = require("./helper.aliExpress");

async function CrawlFromAliExpress(url, billing, shop_id, shopify_product_id) {
  const start = performance.now();
  console.log("-----AliExpress Trigger-----");
  console.log(url.slice(0, 40), billing, shop_id);
  try {
    const { productId, pagesNumb } = await parseAliExpressUrl(url);

    if (pagesNumb !== null) {
      const { reviews, review_id } = await crapingReviews(productId, billing, shop_id, shopify_product_id);

      console.log("Total reviews: ", reviews.length);
      const end = performance.now();
      console.log("Total Time execution >>> ", ((end - start) / 1000).toFixed(3));
      return { reviews, review_id };
    } else return { reviews: null, review_id: null };
  } catch (error) {
    console.error("Crawled from aliExpress get bug here >> ", error);
  }
}

module.exports = CrawlFromAliExpress;

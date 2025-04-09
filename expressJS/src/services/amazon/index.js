const { performance } = require("perf_hooks");
const { extractAmazonUrl } = require("../../helpers/extractURL");
const { query } = require("../../utils/db");
const pageToCrawl = require("./crawler");
const setHeaders = require("./headerBrowser.helper");

require("dotenv").config;

const domain = process.env.AMAZON || "https://www.amazon.com/";

async function AmazonCrawler(url, shop_id, billing, shopify_product_id) {
  const start = performance.now();
  console.log("-----------------------------------\nGET AMAZON PAGE TRIGGER*****");
  let allReviews = [];
  try {
    const productCode = extractAmazonUrl(url);
    const headerCookies = await query("SELECT headers FROM shops WHERE shop_id=$1", [shop_id]);
    const validHeader = await setHeaders(headerCookies.rows[0].headers);
    const queryToAdd =
      " INSERT INTO reviews (id, review_name, avatar, review_content, rating, nation, date, review_image, shop_id, product_id, platform_id, review_id, shopify_product_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ,$12, $13) RETURNING *;";
    const review_id = `${productCode}-${Date.now()}-${shop_id}`;
    const pages = billing === true || billing === "true" ? 10 : 1;
    console.log(billing, pages);
    // CRAWLING HANDLE
    for (let i = 1; i <= pages; i++) {
      try {
        const url = domain + "dp/product-reviews/" + productCode + "/" + `ref=cm_cr_arp_d_paging_btm_${i}?ie=UTF8&pageNumber=${i}&reviewerType=all_reviews`;
        console.log("ENTERED PAGE NO.", i);
        const reviewsResult = await pageToCrawl(url, validHeader);

        if (!reviewsResult || reviewsResult.length === 0) break;
        allReviews.push(reviewsResult);
        for (const review of reviewsResult) {
          const { id, review_name, avatar, review_content, rating, nation, date, review_image } = review;
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
            productCode,
            1,
            review_id,
            shopify_product_id,
          ]);
        }
      } catch (error) {
        console.error("LOOP EACH PAGE BUG HERE >>> ", error);
      }
    }
    const reviews = allReviews.flat();
    console.log(`DONE!!! >> Total: ${reviews.length} reviews were craped`);
    const end = performance.now();
    console.log("Total Time execution >>> ", ((end - start) / 1000).toFixed(2));
    return { reviews, review_id };
  } catch (error) {
    console.log("Bug HERE >>> ", error);
  }
}

module.exports = AmazonCrawler;

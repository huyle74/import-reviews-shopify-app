const { chromium } = require("playwright");
const { performance } = require("perf_hooks");
require("dotenv").config;

async function pageToCrawl(url, headers) {
  let browser,
    allReviews = [];
  const start = performance.now();

  try {
    if (!url) return;
    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setExtraHTTPHeaders(headers);

    await page.goto(url);
    await page.waitForLoadState("load");
    const checkPageExist = await page.locator('[data-hook="review"]').first();
    if (checkPageExist.isVisible()) {
      const reviewDiv = await page.locator('[data-hook="review"]').all();
      for (const el of reviewDiv) {
        // USER NAME
        const review_name = await el.locator(".a-profile-name").first().innerText();
        const avatar = await el.locator(".a-profile-avatar-wrapper div img").first().getAttribute("src");
        // set ID
        const randomId = Math.floor(Math.random() * 10000 + 1000);
        const id = `${review_name.slice(0, 4)}` + "-" + `${randomId}` + `${Date.now()}`;

        let review_content;
        const userReviewDiv = await el.locator(`[data-hook="review-body"] span`).first();
        if (await userReviewDiv.isVisible()) {
          review_content = await userReviewDiv.innerText();
          review_content = review_content.replace(/\n|\+/g, " ");
        } else {
          review_content = "";
        }

        // RATING
        const rate = await el.locator(".a-icon-alt").first().innerText();
        const rating = Number(rate[0]);

        // DATE & NATION
        const postDate = await el.locator(`[data-hook="review-date"]`).first().innerText();
        const infoPost = postDate.match(/Reviewed in (.*?) on (.*)/);
        let nation = (date = null);
        if (infoPost) {
          nation = infoPost[1] === "the United States" ? "United States" : infoPost[1];
          date = infoPost[2];
        }
        // IMAGES
        const imageReviewDiv = await el.locator(".review-image-tile-section").all();
        let review_image = [];
        if (imageReviewDiv.length !== 0) {
          for (const img of imageReviewDiv) {
            const imageDiv = await img.locator(`[data-hook="review-image-tile"]`).all();
            for (const eachImage of imageDiv) {
              const image = await eachImage.getAttribute("src");
              const finalImage = image.replace("_SY88.jpg", "jpg");
              review_image.push(finalImage);
            }
          }
        }
        allReviews.push({
          id,
          review_name,
          avatar,
          review_content,
          rating,
          nation,
          date,
          review_image,
        });
      }
    } else {
      allReviews = [];
    }
    const end = performance.now();
    console.log(`Execution cost ${((end - start) / 1000).toFixed(2)}`);
    return allReviews;
  } catch (error) {
    console.error("BUG when enter each page here >>>> ", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = pageToCrawl;

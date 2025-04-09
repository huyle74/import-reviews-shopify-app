const express = require("express");
const router = express.Router();

const amazonRouter = require("./api/amazon.routes");

const shopifyRouter = require("./api/shopify.routes");
const aliExpressRouter = require("./api/aliExpress.routes");
const googleExtensionRouter = require("./api/googleExtension.routes");
const previewsRouter = require("./api/preview.routes");
const importWithProductRouter = require("./api/importWithProduct.routes");
const manageReviewsRouter = require("./api/manageReviews.routes");

// SHOPIFY
router.use("/shopify", shopifyRouter);

// REVIEWs IMPORT
router.use("/amazon", amazonRouter);
router.use("/aliExpress", aliExpressRouter);
router.use("/google", googleExtensionRouter);

// GET PRODUCT INFO IN DATABASE
router.use("/importReviewPage", importWithProductRouter);

// PREVIEW REVIEWS
router.use("/preview", previewsRouter);

// MANAGE REVIEWS
router.use("/manage", manageReviewsRouter);

module.exports = router;

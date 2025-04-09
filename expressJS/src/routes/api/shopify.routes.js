const express = require("express");
const router = express.Router();
const {
  paginationController,
  allProductsController,
  cancelSubscriptionController,
  sortedProductsController,
  subscriptionController,
  searchTitleController,
} = require("../../controllers/shopify.controller");
const verifyToken = require("../../middlewares/verifyToken.middleware");

// PRODUCT RELATION
router.get("/allProducts", verifyToken, allProductsController);
router.post("/sort", verifyToken, sortedProductsController);
router.post("/pagination", verifyToken, paginationController);
router.post("/searchTitle", verifyToken, searchTitleController);

// SUBSCRIPTION
router.post("/subscription", verifyToken, subscriptionController);
router.post("/cancelSubscription", verifyToken, cancelSubscriptionController);

module.exports = router;

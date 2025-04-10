const express = require("express");
const router = express.Router();
const getReviewsByProductController = require("../../controllers/manage/getReviewsByProduct.controller");
const deleteImageController = require("../../controllers/manage/deleteImage.controller");
const deleteReviewsController = require("../../controllers/manage/deleteReviews.controller");

router.post("/getReviewsByProduct", getReviewsByProductController);
router.post("/deleteImage", deleteImageController);
router.post("/deleteReviews", deleteReviewsController);

module.exports = router;

const express = require("express");
const router = express.Router();

const filterPreviewController = require("../../controllers/preview/filterReviews.controller");
const { deletePreviewMultiController, deletePreviewByIdController } = require("../../controllers/preview/deleteReviews.controller");
const confirmImportReviewsController = require("../../controllers/preview/importReviews.controller");

router.post("/filterReviews", filterPreviewController);
router.post("/deleteMultiPreview", deletePreviewMultiController);
router.post("/deleteOnePreview", deletePreviewByIdController);
router.post("/saveReviews", confirmImportReviewsController);

module.exports = router;

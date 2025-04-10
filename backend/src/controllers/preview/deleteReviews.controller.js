const { deleteMultiReviewsService, deleteOneReviewService } = require("../../services/preview/delete.service");

const deletePreviewMultiController = async (req, res) => {
  const { review_id } = req.query;
  const { id } = req.body;
  const { success, reviews } = await deleteMultiReviewsService(id, review_id);
  res.json({ success, reviews });
};

const deletePreviewByIdController = async (req, res) => {
  const { review_id, id } = req.query;
  const { success, reviews } = await deleteOneReviewService(id, review_id);
  res.json({ success, reviews });
};

module.exports = { deletePreviewMultiController, deletePreviewByIdController };

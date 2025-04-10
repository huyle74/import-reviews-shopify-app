const deleteImageService = require("../../services/manageReviews/deleteOneImage.service");

const deleteImageController = async (req, res) => {
  const { id, image } = req.query;
  const success = await deleteImageService(id, image);
  res.json({ success });
};

module.exports = deleteImageController;

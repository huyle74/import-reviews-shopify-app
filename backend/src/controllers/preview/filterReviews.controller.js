const filterReviewsService = require("../../services/preview/filter.service");

const filterReviewsController = async (req, res) => {
  try {
    const filter = req.body;
    const { review_id } = req.query;
    const reviews = await filterReviewsService(filter, review_id);

    res.json({ reviews });
  } catch (error) {
    console.error("Controller Filter reviews >> ", error);
  }
};

module.exports = filterReviewsController;

const { query } = require("../../utils/db");
const queryDeleteImage = `UPDATE reviews SET review_image = array_remove(review_image, $2) WHERE id = $1;`;

const deleteImageService = async (Id, image) => {
  try {
    const deleteImage = await query(queryDeleteImage, [Id, image]);
    if (deleteImage.rowCount > 0) {
      console.log("Delete image successfully!!");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("CANNOT DELETE IMAGE >>", error);
  }
};
module.exports = deleteImageService;

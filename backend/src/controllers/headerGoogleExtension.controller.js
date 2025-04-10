const headerFromExtension = require("../handler/getHeader.googleExtension");

const googleExtensionController = async (req) => {
  try {
    const headers = req.body.headers;
    const shop_id = req.body.shop_id;
    await headerFromExtension(headers, shop_id);
    console.log("<< Got amazon header cookies from user browser >>");
  } catch (error) {
    console.error("Controller Google Extension >> ", error);
  }
};

module.exports = googleExtensionController;

const { query } = require("../../../utils/db");
const { graphqlUrl } = require("../../../utils/config");
const convertProductData = require("../helper/convert.productData");
const getProductFromShop = require("../helper/query.graphQL");
const { queryEntry } = require("../helper/query.config");
const { addCountImportedReviews } = require("../../../helpers/countImportedReviews");

async function queryAllProducts(accessToken, storeName) {
  try {
    const url = graphqlUrl(storeName);
    const queryString = queryEntry();

    const data = await getProductFromShop(url, queryString, {}, accessToken);
    console.log("---------Shopify API get products------------");
    const { edges, pageInfo } = data.products;
    const products = convertProductData(edges);
    const finalProductInfo = await addCountImportedReviews(products);

    return { finalProductInfo, pageInfo };
  } catch (error) {
    console.error("CANNOT GET SHOP INFORMATION BUG HERE >>>> ", error);
    res.status(400).json({ ERROR: "CANNOT GET SHOP INFORMATION" });
  }
}

async function getProduct(req, res) {
  console.log("<<<< Get review information from product >>>>>");
  try {
    const id = req.productId;
    const checkProductId = await query("SELECT * FROM reviews WHERE product_id = $1", [id]);
    if (checkProductId.rows.length > 0) {
      const ratingResult = await query("SELECT AVG(rating) as averageRating, COUNT(*) as totalReviews FROM reviews WHERE product_id = $1", [productId]);
      const { averageRating, totalReviews } = ratingResult.rows[0];
      return res.json({ averageRating, totalReviews });
    } else {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }
  } catch (error) {
    console.error("Cannot get product information bug here >>>> ", error);
  }
}

module.exports = {
  queryAllProducts,
  getProduct,
};

const { querySearchTerm } = require("../helper/query.config");
const convertProductData = require("../helper/convert.productData");
const { graphqlUrl } = require("../../../utils/config");
const getProductFromShop = require("../helper/query.graphQL");
const { addCountImportedReviews } = require("../../../helpers/countImportedReviews");

async function searchByProductTitle(accessToken, storeName, searchTerm) {
  try {
    console.log("---SEARCH PRODUCT TRIGGER!!----");
    const url = graphqlUrl(storeName);
    const { query, variables } = querySearchTerm(searchTerm);
    const data = await getProductFromShop(url, query, variables, accessToken);
    const { edges, pageInfo } = data.products;
    if (data) {
      const products = convertProductData(edges);
      const finalProductInfo = await addCountImportedReviews(products);
      return { finalProductInfo, pageInfo, success: true };
    } else {
      return { finalProductInfo: null, pageInfo: null, success: false };
    }
  } catch (error) {
    console.error("CANNOT SEARCH PRODUCT >> ", error);
  }
}

module.exports = searchByProductTitle;

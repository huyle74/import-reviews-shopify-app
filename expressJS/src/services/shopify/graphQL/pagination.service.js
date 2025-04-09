const { queryProductPagination } = require("../helper/query.config");
const convertProductData = require("../helper/convert.productData");
const { graphqlUrl } = require("../../../utils/config");
const getProductFromShop = require("../helper/query.graphQL");
const { addCountImportedReviews } = require("../../../helpers/countImportedReviews");

async function paginationProducts(move, cursor, accessToken, storeName) {
  try {
    console.log("---Pagination trigger-------");
    const { query, variables } = queryProductPagination(move, cursor);

    const url = graphqlUrl(storeName);
    const data = await getProductFromShop(url, query, variables, accessToken);
    const { edges, pageInfo } = data.products;
    if (data) {
      const products = convertProductData(edges);
      const finalProductInfo = await addCountImportedReviews(products);
      console.log("---successfully pagination-----");
      return { finalProductInfo, pageInfo, success: true };
    } else {
      return { finalProductInfo: null, pageInfo: null, success: false };
    }
  } catch (error) {
    console.error("Get pagination get bug here >> ", error);
  }
}

module.exports = paginationProducts;

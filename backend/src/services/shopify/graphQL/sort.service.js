const convertProductData = require("../helper/convert.productData");
const { queryProductSort } = require("../helper/query.config");
const { graphqlUrl } = require("../../../utils/config");
const getProductFromShop = require("../helper/query.graphQL");
const { addCountImportedReviews } = require("../../../helpers/countImportedReviews");

async function sortProductsByName(sort, accessToken, storeName) {
  try {
    const query = queryProductSort(sort);
    const url = graphqlUrl(storeName);
    const data = await getProductFromShop(url, query, {}, accessToken);
    console.log(data);
    if (data) {
      const { edges, pageInfo } = data.products;
      const products = convertProductData(edges);
      const finalProductInfo = await addCountImportedReviews(products);
      return { finalProductInfo, pageInfo, success: true };
    } else return { finalProductInfo: null, pageInfo: null, success: false };
  } catch (error) {
    console.error("Sort Product failed >> ", error);
  }
}

module.exports = sortProductsByName;

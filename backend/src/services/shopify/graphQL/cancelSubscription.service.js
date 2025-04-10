const { graphqlUrl } = require("../../../config/index");
const getProductFromShop = require("../helper/query.graphQL");

async function cancelSubscription(accessToken, storeName, id) {
  try {
    console.log("---------Cancel subscription billing------------");
    const gqlQuery = `
      mutation AppSubscriptionCancel($id: ID!, $prorate: Boolean) {
    appSubscriptionCancel(id: $id, prorate: $prorate) { 
      userErrors {
        field
        message
      }
      appSubscription {
        id
        status
      }
    }
  }
    `;
    const variables = {
      id: id,
      prorate: true,
    };
    const url = graphqlUrl(storeName);

    const data = await getProductFromShop(url, gqlQuery, variables, accessToken);

    if (data.appSubscriptionCancel.userErrors.length == 0) {
      return true;
    } else return false;
  } catch (error) {
    console.error("CANCEL SUBSCRIPTION GET BUG >>> ", error);
  }
}
module.exports = cancelSubscription;

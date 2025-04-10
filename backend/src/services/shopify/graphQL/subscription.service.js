const { graphqlUrl } = require("../../../config/index");
const getProductFromShop = require("../helper/query.graphQL");

async function subscription(accessToken, storeName, plan) {
  try {
    console.log(plan);
    const price = plan === "advanced" ? 29.9 : 4.9;
    const planName = plan === "advanced" ? "advanced" : "basic";
    const gqlQuery = ` 
      mutation AppSubscriptionCreate(
        $name: String!
        $lineItems: [AppSubscriptionLineItemInput!]!
        $returnUrl: URL!
      ) {
        appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems) {
          userErrors {
            field
            message
          }
          appSubscription {
            id
          }
          confirmationUrl
        }
      }
    `;

    const variables = {
      name: planName,
      returnUrl: `https://admin.shopify.com/store/${storeName}/apps/remix-frontend-review-app/`,
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails: {
              price: {
                amount: price,
                currencyCode: "USD",
              },
              interval: "EVERY_30_DAYS",
            },
          },
        },
      ],
    };

    const url = graphqlUrl(storeName);
    const data = await getProductFromShop(url, gqlQuery, variables, accessToken);
    const state = data?.appSubscriptionCreate;
    console.log(state);
    if (state?.userErrors.length == 0) {
      console.log("---------create subscription billing------------");
      return { confirmationUrl: state.confirmationUrl };
    } else return { confirmationUrl: null };
  } catch (error) {
    console.log("service PAYMENT ---> ", error);
  }
}

module.exports = subscription;

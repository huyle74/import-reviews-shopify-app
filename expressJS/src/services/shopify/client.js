const { queryAllProducts } = require("./graphQL/allProducts.service");
const cancelSubscription = require("./graphQL/cancelSubscription.service");
const subscription = require("./graphQL/subscription.service");
const paginationProducts = require("./graphQL/pagination.service");
const sortProductsByName = require("./graphQL/sort.service");
const searchByProductTitle = require("./graphQL/searchByTitle.service");

module.exports = { queryAllProducts, cancelSubscription, subscription, sortProductsByName, searchByProductTitle, paginationProducts };

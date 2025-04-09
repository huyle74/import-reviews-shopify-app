const { queryAllProducts, cancelSubscription, subscription, sortProductsByName, searchByProductTitle, paginationProducts } = require("../services/shopify/client");

async function allProductsController(req, res) {
  try {
    const { accessToken, storeName } = req.data;
    const data = await queryAllProducts(accessToken, storeName);
    res.json(data);
  } catch (error) {
    console.error("Controller get All products >> ", error);
  }
}

const sortedProductsController = async (req, res) => {
  try {
    const { sort } = req.query;
    const { accessToken, storeName } = req.data;

    const data = await sortProductsByName(sort, accessToken, storeName);
    res.json(data);
  } catch (error) {
    console.error("Controller sort Product >> ", error);
  }
};

const searchTitleController = async (req, res) => {
  try {
    const { accessToken, storeName } = req.data;
    const { searchTerm } = req.query;
    const data = await searchByProductTitle(accessToken, storeName, searchTerm);
    res.json(data);
  } catch (error) {
    console.error("Controller search Title >> ", error);
  }
};

const paginationController = async (req, res) => {
  try {
    const { move, cursor } = req.query;
    const { accessToken, storeName } = req.data;
    const { finalProductInfo, pageInfo, success } = await paginationProducts(move, cursor, accessToken, storeName);
    res.json({ finalProductInfo, pageInfo, success });
  } catch (error) {
    console.error("Controller shopify pagination >> ", error);
  }
};

const subscriptionController = async (req, res) => {
  try {
    const { accessToken, storeName } = req.data;
    const { plan } = req.query;
    const { confirmationUrl } = await subscription(accessToken, storeName, plan);
    if (confirmationUrl !== null) {
      res.json({ confirmationUrl, success: true });
    } else res.json({ confirmationUrl, success: false });
  } catch (error) {
    console.error("Controller subscription failed >> ", error);
  }
};

async function cancelSubscriptionController(req, res) {
  try {
    const { accessToken, storeName } = req.data;
    const { id } = req.query;
    const response = await cancelSubscription(accessToken, storeName, id);
    if (response) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Controller cancel Subscription >> ", error);
  }
}

module.exports = { paginationController, allProductsController, cancelSubscriptionController, sortedProductsController, subscriptionController, searchTitleController };

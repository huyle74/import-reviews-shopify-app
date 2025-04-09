require("dotenv").config();
const { shopifyApp } = require("@shopify/shopify-app-express");
const { BillingInterval } = require("@shopify/shopify-api");
const {
  PostgreSQLSessionStorage,
} = require("@shopify/shopify-app-session-storage-postgresql");
const { DeliveryMethod } = require("@shopify/shopify-api");

const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_KEY,
    apiSecretKey: process.env.SHOPIFY_SECRET_KEY,
    scopes: ["read_products", "read_shop"],
    hostScheme: "http",
    hostName: `localhost:8080`,
    billing: {
      "My plan": {
        amount: 10,
        currencyCode: "USD",
        interval: BillingInterval.Every30Days,
      },
    },
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
    callback: () => {
      console.log("We are here -----");
    },
  },
  webhooks: {
    path: "/api/webhooks",
    callback: () => {
      console.log("We are here -----");
    },
  },
  sessionStorage: new PostgreSQLSessionStorage(process.env.DATABASE_URL),
});

const webhookHandlers = {
  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/products/update",
    callback: async (topic, shop, body) => {
      console.log(`🛍️ Product update webhook received for shop ${shop}:`, body);
    },
  },
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/app-uninstalled",
    callback: async (topic, shop, body) => {
      console.log(`❌ App uninstalled for shop ${shop}`);
    },
  },
};

module.exports = { shopify, webhookHandlers };

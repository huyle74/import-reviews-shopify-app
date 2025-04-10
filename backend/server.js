require("dotenv").config();
const express = require("express");
const { pathToFileURL } = require("url");
const fs = require("fs");
const toml = require("toml");
const path = require("path");
const cors = require("cors");
const { corsOption } = require("./src/utils/config");
const { createTables } = require("./src/utils/db");
const routes = require("./src/routes");
const { createRequestHandler } = require("@remix-run/express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

// Load Shopify app config from TOML
const tomlContent = fs.readFileSync(path.join(__dirname, "../frontend/shopify.app.toml"), "utf-8");
const config = toml.parse(tomlContent);
process.env.SHOPIFY_APP_URL = config.application_url || "http://localhost:8080";

// Server start logic
const PORT = process.env.PORT || 8080;

async function startServer() {
  if (process.env.NODE_ENV === "development") {
    // Proxy frontend dev server
    app.use(
      "*",
      createProxyMiddleware({
        target: "http://localhost:3000",
        changeOrigin: true,
      })
    );
  } else {
    // Serve built frontend and public assets
    app.use("/assets", express.static(path.join(__dirname, "../frontend/build/client/assets")));
    app.use(express.static(path.join(__dirname, "../frontend/public")));

    // Dynamically import ESM Remix build
    const remixBuild = await import(pathToFileURL(path.join(__dirname, "../frontend/build/server/index.js")).href);

    app.all(
      "*",
      createRequestHandler({
        build: remixBuild,
        getLoadContext: () => ({ APP_URL: process.env.SHOPIFY_APP_URL }),
      })
    );
  }

  app.listen(PORT, async () => {
    await createTables();
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

startServer();

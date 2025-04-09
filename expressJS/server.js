require("dotenv").config();
const express = require("express");
const { createRequestHandler } = require("@remix-run/express");

const fs = require("fs");
const toml = require("toml");
const path = require("path");
const cors = require("cors");
const { corsOption } = require("./src/utils/config");
const { createTables } = require("./src/utils/db");
const routes = require("./src/routes");

const app = express();
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

const tomlContent = fs.readFileSync(path.join(__dirname, "../frontend/shopify.app.toml"), "utf-8");
const config = toml.parse(tomlContent);

if (process.env.NODE_ENV === "development") {
  app.use(
    "*",
    createProxyMiddleware({
      target: "http://localhost:3000",
      changeOrigin: true,
    })
  );
} else {
  app.use("/assets", express.static(path.join(__dirname, "../frontend/build/client/assets")));
  app.use(express.static(path.join(__dirname, "../frontend/public")));

  const remixBuild = require(path.join(__dirname, "../frontend/build/server/index.js"));

  app.all(
    "*",
    createRequestHandler({
      build: remixBuild,
      getLoadContext: () => ({ APP_URL: process.env.SHOPIFY_APP_URL }),
    })
  );
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  await createTables();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

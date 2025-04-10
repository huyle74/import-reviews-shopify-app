const corsOption = {
  origin: (origin, callback) => {
    if (
      !origin || // allow server-to-server or mobile apps
      origin.startsWith("chrome-extension://") ||
      origin === "http://localhost:3000" ||
      origin === "http://localhost:8080" ||
      origin.endsWith(".trycloudflare.com")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const productPerPage = 13;

function graphqlUrl(store) {
  return `https://${store}.myshopify.com/admin/api/2025-01/graphql.json`;
}

module.exports = { corsOption, productPerPage, graphqlUrl };

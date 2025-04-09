const corsOption = {
  origin: ["chrome-extension://hcpdoheohhaanoakegkdhhfcfpcbkadn", "http://localhost:3000", "https://thursday-oliver-race-graduation.trycloudflare.com"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const productPerPage = 13;

function graphqlUrl(store) {
  return `https://${store}.myshopify.com/admin/api/2025-01/graphql.json`;
}

module.exports = { corsOption, productPerPage, graphqlUrl };

const jwt = require("jsonwebtoken");
require("dotenv").config();

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("AutHeader Not fount >>>");
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token, { complete: true });
    const shop = decoded.payload.dest.replace(/^https?:\/\//, "").replace(/\.myshopify\.com\/?$/, "");

    console.log("Shop NAme is >>>>>>> ", shop);

    const url = new URL(`https://${shop}.myshopify.com/admin/oauth/access_token`);
    const body = {
      client_id: process.env.SHOPIFY_KEY,
      client_secret: process.env.SHOPIFY_SECRET_KEY,
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      subject_token: token,
      subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
      requested_token_type: "urn:shopify:params:oauth:token-type:online-access-token",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange token: ${response.statusText}`);
    }
    const dataSession = await response.json();
    const accessToken = dataSession.access_token;
    req.data = { accessToken, storeName: shop };
    next();
  } catch (error) {
    console.log("Token not found---", error);
  }
}

module.exports = verifyToken;

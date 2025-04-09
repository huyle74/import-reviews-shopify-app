function extractAmazonUrl(url) {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/);
  return match ? match[1] : "ASIN Not Found";
}

module.exports = { extractAmazonUrl };

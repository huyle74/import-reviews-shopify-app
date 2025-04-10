async function getProductFromShop(url, query, variables = {}, accessToken) {
  try {
    const fetchProducts = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });
    const { data } = await fetchProducts.json();
    if (data) {
      return data;
    } else return undefined;
  } catch (error) {
    console.error("Get Product from Store get bug >> ", error);
  }
}

module.exports = getProductFromShop;

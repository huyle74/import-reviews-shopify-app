function convertProductData(data) {
  let finalProductInfo = [];
  data.forEach((prod) => {
    const title = prod.node.title;
    let imageUrl;
    if (prod.node.media.edges[0]) {
      imageUrl = prod.node.media.edges[0].node.preview.image.url;
    } else {
      imageUrl = "";
    }
    const id = prod.node.id.split("/").pop();
    return finalProductInfo.push({
      id,
      title,
      imageUrl,
    });
  });
  return finalProductInfo;
}

module.exports = convertProductData;

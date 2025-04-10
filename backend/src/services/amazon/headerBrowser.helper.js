async function setHeaders(cookies) {
  try {
    return {
      Cookie: cookies,
      Connection: "keep-alive",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      Accept: "*/*",
      "Cache-Control": "no-cache",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
    };
  } catch (error) {
    console.log("Set header get bug here >>>", error);
    return {};
  }
}

module.exports = setHeaders;

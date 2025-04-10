const { productPerPage } = require("../../../utils/config");

function queryEntry() {
  return `{
      products(first: ${productPerPage}) {
        edges {
          node {
            id
            title
            media(first: 1) {
              edges {
                node {
                  preview {
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
  }}
    `;
}

function queryProductPagination(move, cursor) {
  const { point, position } = move === "next" ? { point: "after", position: "first" } : { point: "before", position: "last" };
  const query = `
      query products($cursor: String) {
        products(${position}: ${productPerPage}, ${point}: $cursor) {
            edges {
            node {
                id
                title
                media(first: 1) {
                edges {
                    node {
                    preview {
                        image {
                        url
                        }
                    }
                    }
                }
                }
            }
            }
                pageInfo {
                hasNextPage
                hasPreviousPage
                endCursor
                startCursor
                }   
        }
        }
    `;
  const variables = { cursor };
  return { query, variables };
}

function queryProductSort(order) {
  return `query products {
  products(first: ${productPerPage}, reverse: ${order}) {
    edges {
      node {
        id
        title
        media(first: 1) {
          edges {
            node {
              preview {
                image {
                  url
                }
              }
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
  }
}`;
}

function querySearchTerm(searchTerm) {
  const query = `
  query searchProducts($searchTerm: String!) {
    products(first: 10, query: $searchTerm) {
      edges {
        node {
          id
          title
          handle
          description
          media(first: 1) {
            edges {
              node {
                preview {
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;
  const variables = {
    searchTerm: `${searchTerm}`,
  };

  return { query, variables };
}

module.exports = { queryProductPagination, queryProductSort, queryEntry, querySearchTerm };

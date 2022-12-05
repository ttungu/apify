const MAX_REQUESTS = 1000;
let products = [];

/**
 *
 * @param {*} url resource (API URL) which is fetched
 * @returns
 * @example of fetched data
 * {
 *     "total": 99999,
 *     "count": 1000,
 *     "products": [{}, {}, ...]
 * }
 */
const getDataRes = async (url) => {
  try {
    const res = await fetch(url);
    try {
      const data = await res.json();
      return data;
    } catch (e) {
      throw Error(e);
    }
  } catch (e) {
    throw Error(e);
  }
};

/**
 *
 * @param {*} min Minimum price of the price range, which is passed as query param
 * @param {*} max Maximum price of the price range, which is passed as query param
 *
 */
const fetchData = async (min, max) => {
  const urlApify = `https://api.ecommerce.com/products?minPrice=${min}&maxPrice=${max}`;
  try {
    const data = await getDataRes(urlApify);
    const { total, count } = data;

    if (total == MAX_REQUESTS && count == MAX_REQUESTS) {
      products.push(data.products);
      return;
    } else if (count < MAX_REQUESTS) {
      products.push(data.products);
      return;
    } else if (count == 0) {
      return;
    } else {
      await fetchData(min, max / 2);
      await fetchData(max / 2 + 1, max);
    }
  } catch (e) {
    throw Error(e);
  }
};

/**
 * Check if final array of products is complete
 *
 */
const checkLengthProducts = async () => {
  const min = 0;
  const max = 100000;
  const urlApify = `https://api.ecommerce.com/products?minPrice=${min}&maxPrice=${max}`;
  const data = getDataRes(urlApify);
  if (products.length != data.total) {
    console.log("oops, something went wrong");
  }
};

fetchData(0, 100000);
checkLengthProducts();

/**
 * Expectations:
 * 1) the number of products for 1 price does not exceed 1000 - e.g. price range $1-$1 returns more than 1000 products
 * 2) minPrice & maxPrice works only with non-negative integers. If floats are accepted the code would have to change accordingly - i.e. calling fetchData(max / 2 + 0.01) instead of fetchData(max / 2 + 1)
 */

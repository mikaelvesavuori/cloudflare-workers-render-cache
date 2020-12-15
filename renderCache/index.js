const ENDPOINT = process.env.ENDPOINT;

/**
 * Get cached result for a given URL (in query string)
 * If cache key is empty, do a proxy request and fill cache key with the expected data
 * Return cached or new content to user
 *
 * @async
 * @function
 * @param {Request} request - The incoming request data
 * @returns {Response} - Return cached or fetched data to user
 */
async function renderCache(request) {
  const url = new URL(request.url);
  if (!url) throw new Error('Missing request URL!');

  const PATHNAME = url.pathname;
  if (PATHNAME === undefined ||PATHNAME === null) return new Response("No pathname received!", headers(400));
  if (request.method !== "GET") return new Response("Unallowed HTTP method!", headers(405));

  // START timer
  let timeStart = Date.now();

  const HASH_KEY = hash(PATHNAME);
  const FULL_URL = ENDPOINT + PATHNAME;

  let responseData = await getFromCache(HASH_KEY);
  if (!responseData) responseData = await getData(FULL_URL, HASH_KEY);

  // END timer
  let timeEnd = Date.now();
  console.log("Call took", timeEnd - timeStart, "ms");

  return new Response(responseData, headers());
}

/**
 * @description TODO
 *
 * @param {*} status
 */
const headers = (status = 200) => {
  return {
    headers: {
      "Content-Type": "text/html"
    },
    status
  };
};

/**
 * @description TODO
 *
 * @see Reference: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
 * @param {*} str
 */
function hash(str) {
  return str.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}

/**
 * @description TODO
 * @param {*} hashKey
 */
async function getFromCache(hashKey) {
  const data = await HTML_CACHE.get(hashKey);
  console.log(`Finished getting data from cache at key ${hashKey}`);
  return JSON.parse(data);
}

/**
 * @description TODO
 *
 * @param {*} url
 * @param {*} hashKey
 */
async function getData(url, hashKey) {
  const HEADERS = {
    headers: {
      Accept: "text/html",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/html"
    },
    method: "GET"
  };

  responseData = await fetch(url, HEADERS).then(res => res.text());
  await cacheData(hashKey, responseData);
  return responseData;
}

/**
 * @description TODO
 *
 * @param {*} key
 * @param {*} data
 */
async function cacheData(key, data) {
  const TTL = 60; // Seconds from now
  await HTML_CACHE.put(key, JSON.stringify(data), { expirationTtl: TTL });
  console.log(`Finished putting new data in cache at key ${key}`);
}

/**
 * @description TODO
 */
addEventListener("fetch", event => {
  event.respondWith(renderCache(event.request));
});

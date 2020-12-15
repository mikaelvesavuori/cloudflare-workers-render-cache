const STORAGE_BUCKET = process.env.STORAGE_BUCKET_URL;

/**
 * Get asset from proxy (very basic implementation)
 *
 * @async
 * @function
 * @param {Request} request - The incoming request data
 * @returns {*} - Returns fetched response
 */
async function assetProxy(request) {
  if (!STORAGE_BUCKET) throw new Error('Missing storage bucket URL!');
  const url = new URL(request.url);
  if (!url) throw new Error('Missing request URL!');

  const PATHNAME = url.pathname;
  if (request.method !== "GET") return new Response("Unallowed HTTP method!", {
    headers: {
      "Content-Type": "text/html"
    },
    status
  });

  return await fetch(`${STORAGE_BUCKET}${PATHNAME}`, request)
}

/**
 * @description Call asset proxy
 */
addEventListener("fetch", event => {
  event.respondWith(assetProxy(event.request));
});

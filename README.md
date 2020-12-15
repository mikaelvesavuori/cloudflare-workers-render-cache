# Cloudflare Workers render cache using KV (+ asset proxy)

If you want to serve ultra-fast, globally available sites or apps you've found the right place. This repo gives you the basic setup to do "render caching"—that is, fetching HTML from a requested endpoint, caching it, and returning the cached content to anyone requesting the same URL. The magic of Cloudflare is that their Workers and KV edge-side key-value store is _extremely_ fast. I'm personally seeing server-side rendered sites go from 300-500 ms to around 30ms.

You should add more logic around validating request headers and content types and any other production-readiness stuff before going too far with this, I suppose.

The original context for this was (as alluded to above) to render cache SSR applications, so there's also an asset proxy in this repo.

## How does the render cache work?

1. You request your site `https://my-amazing-site.dev/something`
2. The render cache (edge worker function) will run before going to the origin (your `ENDPOINT` environment variable)
3. The function will check the KV cache if the subpath/pathname `something` is cached; if it's not it will go to the origin and cache it; if it's cached, return the cached content
4. In 60 seconds (your TTL value), the cached key (path) will automatically expire

## How does the asset proxy work?

1. You request your site `https://my-amazing-site.dev/something`
2. Because that URL has HTML that points to an image at `https://my-amazing-site.dev/assets/image.jpg`, the asset proxy edge worker will trigger (the exact path is set in `assetProxy/wrangler.toml` and the `route` field)
3. The asset will be proxied from `https://awesome-cloud-provider.net/my-bucket-123/assets/image.jpg` because you specified `https://awesome-cloud-provider.net/my-bucket-123/` in xx and the `assetProxy/wrangler.toml` variable)

## Can I combine them to edge-cache proxied assets?

Certainly, though this repo does not currently do so.

## Prerequisites

Since this uses [Cloudflare Workers](https://workers.cloudflare.com) and [KV](https://www.cloudflare.com/products/workers-kv/), you need to have a Cloudflare account. Workers and KV are available even in their free account, so go get one if you don't have one already.

I assume you have [Wrangler](https://github.com/cloudflare/wrangler) installed.

You will need to provide both an endpoint URL (the site that you are going to cache), and an assets storage bucket path for the asset proxying.

Make sure to rename set all the empty/dummy fields in `wrangler.toml` files to your own values.

## Develop and test

Run `wrangler dev` in the respective subfolders. Go to `http://127.0.0.1:8787` and whatever sub-route you need to start testing your work!

## Deployment

**Standard way**: Run `wrangler publish` in the respective subfolders.

To deploy both, I've provided a tiny helper script called `deploy.sh` to deploy them for you.

You can also just copy-paste copy into the online editor.

## Resources

- [Wrangler on GitHub](https://github.com/cloudflare/wrangler)
- [Reference: KV API](https://developers.cloudflare.com/workers/reference/apis/kv/)
- [Debugging Workers](https://developers.cloudflare.com/workers/learning/debugging-workers)

### Similar (and more elaborate) solutions

- [https://github.com/MaxRatmeyer/workers-asset-cache](https://github.com/MaxRatmeyer/workers-asset-cache)
- [https://github.com/JCDubs/cf-assets-worker/blob/master/src/RequestHandler.js](https://github.com/JCDubs/cf-assets-worker/blob/master/src/RequestHandler.js)
- [https://github.com/adamchasetaylor/cf-worker-proxy/blob/master/index.js](https://github.com/adamchasetaylor/cf-worker-proxy/blob/master/index.js)

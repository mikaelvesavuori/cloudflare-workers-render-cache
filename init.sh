# Inform that you will need the Cloudflare Workers CLI, "wrangler"
echo 'You will need the Cloudflare Workers CLI, "wrangler", for the following steps...'

# Create KV namespaces
wrangler kv:namespace create "HTML_CACHE"
wrangler kv:namespace create "HTML_CACHE_PREVIEW" --preview
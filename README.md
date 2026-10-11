# Meera

An animated AI companion. She chats, teaches small things, and shows 11 emotions (laughing, crying, shy, dancing, in love and more) as she talks. The whole site is one static file, `index.html`, with her drawn in SVG.

Live site: https://pankqx.github.io/Aigf/

## Live replies

Without a model behind it, Meera answers with a small set of built-in phrases and still shows every emotion. Pick one way to give her real conversation:

**For you only.** Open the site, press Settings in the chat header, and paste your OpenRouter key. It is stored in your browser and sent only to OpenRouter.

**For every visitor.** Never put an API key in `index.html` or anywhere in this repo. A public site exposes it to everyone. Use the proxy in `worker/` instead:

1. `npm i -g wrangler` and `wrangler login`
2. In `worker/`, run `wrangler init meera-proxy` or create a Worker and paste in `worker.js`
3. `wrangler secret put OPENROUTER_KEY` (paste the key when asked)
4. `wrangler secret put ALLOWED_ORIGIN` and enter `https://pankqx.github.io`
5. `wrangler deploy`, then copy the Worker URL
6. Put that URL in `PROXY_URL` near the top of the script in `index.html`, commit, and push

Set a spend limit on the key in your OpenRouter dashboard. The origin check stops other websites, not people calling the Worker directly.

## Run locally

Open `index.html` in a browser. No build step.

## Credits

Meera is an AI character and says so. She is not a replacement for friends, family or a counselor.

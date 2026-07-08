# The Collector's Ledger — deployment guide
:)
A static tracker page (`public/index.html`) backed by one serverless
function (`api/state.js`) that stores your whole state as a single JSON
value in Upstash Redis, so it survives across devices and browser data
clears.

## 1. Push this folder to GitHub

```bash
cd museum-tracker
git init
git add .
git commit -m "Museum tracker"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

(Vercel can also deploy straight from a local folder with `vercel deploy`,
but connecting a GitHub repo gets you auto-deploys on every push.)

## 2. Import the project into Vercel

- Go to vercel.com → **Add New → Project** → import the GitHub repo.
- Framework preset: leave as **Other** (it's static HTML + serverless
  functions, no build step needed).
- Deploy.

## 3. Add the Upstash Redis database

From your project in the Vercel dashboard:

```bash
vercel install upstash
```

or via the dashboard: **Storage → Create Database → Marketplace →
Upstash → Redis**, then connect it to this project. Vercel will
automatically inject `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN` as environment variables — that's all
`api/state.js` needs (`Redis.fromEnv()` picks them up automatically).

Redeploy after connecting the database so the new env vars take effect.

## 4. (Optional but recommended) Set a PIN

Since the deployed URL is public, add a simple shared PIN so only you
can view/edit your collection:

- Project → **Settings → Environment Variables** → add
  `MUSEUM_PIN` = something only you know.
- Redeploy.
- The first time you load the site (or after the PIN changes) it'll
  prompt you once and remember it in that browser.

Leave `MUSEUM_PIN` unset if you don't want any gate at all.

## Local development

```bash
npm install
vercel dev
```

`vercel dev` runs both the static file and the `/api/state` function
locally, pulling env vars from `vercel env pull` / `.env.local`.

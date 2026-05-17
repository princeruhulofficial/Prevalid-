# Prevalid MCP SDK + Web Preview

Prevalid is trust middleware for AI outputs.

## One-line integration goal

```js
const safeClient = withPrevalid(client, { endpoint: 'https://api.prevalid.ai/v1/run', apiKey: process.env.PREVALID_API_KEY });
```

Then use:

```js
const result = await safeClient.run({ prompt: '...' });
```

## What this starter does

- Works with any client that exposes `run(payload)`.
- Sends `{input, output, metadata, policy}` to Prevalid verification endpoint.
- Returns either:
  - verified output (`blocked: false`), or
  - blocked payload with risk details (`blocked: true`).

## Local preview

```bash
npm start
```

Open: `http://localhost:4173`

## Vercel deploy (mobile-friendly quick setup)

Because Vercel serves the project root, `index.html` is now at the root and automatically loads the dark UI from `/web/*`.

1. Push this repo to GitHub.
2. In Vercel: **New Project → Import repo**.
3. Framework preset: **Other** (or keep auto-detected).
4. Build command: **leave empty**.
5. Output directory: **leave empty**.
6. Deploy.

After deploy, opening your Vercel domain should directly show the Prevalid preview.

## Vercel 404 (NOT_FOUND) troubleshooting

If you see `404: NOT_FOUND` with no deploy-time error, it usually means routing/project-root mismatch, not app crash.

1. In Vercel project settings, confirm **Root Directory** is repository root (`/`).
2. Confirm branch is deployed (Production or Preview) and open the latest deployment URL (not old one).
3. Keep Framework Preset as **Other**.
4. Build Command: empty. Output Directory: empty.
5. Redeploy after this commit (`vercel.json` + root `index.html`).

This repo now includes explicit rewrites to force `/` -> `/index.html` on Vercel.

## API

### `withPrevalid(client, config)`

`client.run(payload)` is required.

`config`:
- `endpoint` (default: `https://api.prevalid.ai/v1/run`)
- `apiKey`
- `minTrustScore` (default: `60`)
- `source` (optional metadata tag)

## Next build steps

1. Add `prevalid.trace(auditId)` for full audit retrieval.
2. Add built-in PII masking before client call.
3. Add adapters for OpenAI/Anthropic/Vertex to reduce integration code to one import.
4. Add retry/circuit breaker and telemetry hooks.

# Prevalid MCP SDK (Starter)

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

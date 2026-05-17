/**
 * Create a Prevalid middleware wrapper for any AI client.
 *
 * One-line usage:
 * const safeClient = withPrevalid(client, { endpoint, apiKey })
 */
function withPrevalid(client, config = {}) {
  if (!client || typeof client.run !== 'function') {
    throw new Error('withPrevalid requires a client with a run(payload) function');
  }

  const endpoint = config.endpoint || 'https://api.prevalid.ai/v1/run';
  const apiKey = config.apiKey || '';
  const minTrustScore = Number.isFinite(config.minTrustScore)
    ? config.minTrustScore
    : 60;

  return {
    async run(payload = {}) {
      const modelResponse = await client.run(payload);

      const verificationPayload = {
        input: payload,
        output: modelResponse,
        metadata: {
          source: config.source || 'unknown',
          timestamp: new Date().toISOString()
        },
        policy: {
          minTrustScore
        }
      };

      const verificationResult = await postJson(endpoint, verificationPayload, apiKey);

      if (verificationResult.trustScore < minTrustScore) {
        return {
          blocked: true,
          reason: 'trust_score_below_threshold',
          trustScore: verificationResult.trustScore,
          auditId: verificationResult.auditId,
          issues: verificationResult.issues || [],
          output: verificationResult.safeOutput || null
        };
      }

      return {
        blocked: false,
        trustScore: verificationResult.trustScore,
        auditId: verificationResult.auditId,
        citations: verificationResult.citations || [],
        output: verificationResult.safeOutput || modelResponse
      };
    }
  };
}

async function postJson(url, body, apiKey) {
  const headers = { 'content-type': 'application/json' };
  if (apiKey) headers.authorization = `Bearer ${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Prevalid request failed (${res.status}): ${text}`);
  }

  return res.json();
}

module.exports = {
  withPrevalid
};

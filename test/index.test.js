const test = require('node:test');
const assert = require('node:assert/strict');
const { withPrevalid } = require('../src/index');

test('withPrevalid returns safe output when trust score passes threshold', async () => {
  const client = { run: async () => ({ text: 'answer' }) };

  global.fetch = async () => ({
    ok: true,
    json: async () => ({ trustScore: 92, auditId: 'aud_1', safeOutput: { text: 'verified' } })
  });

  const safeClient = withPrevalid(client, { endpoint: 'https://example.com' });
  const result = await safeClient.run({ prompt: 'hello' });

  assert.equal(result.blocked, false);
  assert.equal(result.trustScore, 92);
  assert.deepEqual(result.output, { text: 'verified' });
});

test('withPrevalid blocks output when trust score is below threshold', async () => {
  const client = { run: async () => ({ text: 'possibly risky' }) };

  global.fetch = async () => ({
    ok: true,
    json: async () => ({ trustScore: 30, auditId: 'aud_2', issues: ['unsupported_claim'] })
  });

  const safeClient = withPrevalid(client, { endpoint: 'https://example.com', minTrustScore: 50 });
  const result = await safeClient.run({ prompt: 'hello' });

  assert.equal(result.blocked, true);
  assert.equal(result.reason, 'trust_score_below_threshold');
  assert.equal(result.trustScore, 30);
});

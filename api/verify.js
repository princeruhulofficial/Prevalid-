function trustFromText(text) {
  const len = (text || '').length;
  if (!len) return 45;
  if (len < 20) return 58;
  if (len < 80) return 74;
  return 90;
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const prompt = String((req.body && req.body.prompt) || '');
  const trustScore = trustFromText(prompt);

  res.status(200).json({
    trustScore,
    status: trustScore >= 60 ? 'verified' : 'blocked',
    auditId: `aud_${Date.now()}`,
    issues: trustScore >= 60 ? [] : ['insufficient_context'],
    safeOutput: `Verified preview: ${prompt || 'No input provided.'}`
  });
};

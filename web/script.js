const verifyBtn = document.getElementById('verifyBtn');
const promptInput = document.getElementById('promptInput');
const verifyResult = document.getElementById('verifyResult');
const chips = document.querySelectorAll('.chip');
const installCmd = document.getElementById('installCmd');
const copyInstall = document.getElementById('copyInstall');

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    installCmd.textContent = chip.dataset.cmd;
  });
});

copyInstall?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(installCmd.textContent);
    copyInstall.textContent = 'Copied';
    setTimeout(() => (copyInstall.textContent = 'Copy'), 1200);
  } catch {
    copyInstall.textContent = 'Copy failed';
  }
});

verifyBtn?.addEventListener('click', async () => {
  verifyResult.textContent = 'Verifying...';
  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: promptInput.value })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'verification_failed');
    verifyResult.textContent = `Status: ${data.status.toUpperCase()} | Trust: ${data.trustScore} | Audit: ${data.auditId}\n${data.safeOutput}`;
  } catch (err) {
    verifyResult.textContent = `Error: ${err.message}`;
  }
});

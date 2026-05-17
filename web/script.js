const previewBtn = document.getElementById('previewBtn');
const input = document.getElementById('docInput');
const list = document.getElementById('fileList');
const verifyBtn = document.getElementById('verifyBtn');
const promptInput = document.getElementById('promptInput');
const verifyResult = document.getElementById('verifyResult');

previewBtn.addEventListener('click', () => {
  list.innerHTML = '';
  const files = Array.from(input.files || []);
  if (!files.length) {
    list.innerHTML = '<li>No files selected yet.</li>';
    return;
  }

  files.forEach((file) => {
    const li = document.createElement('li');
    li.textContent = `${file.name} — ${(file.size / 1024).toFixed(1)} KB`;
    list.appendChild(li);
  });
});

verifyBtn.addEventListener('click', async () => {
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

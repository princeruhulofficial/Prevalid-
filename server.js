const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = process.env.PORT || 4173;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function sendJson(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function trustFromText(text) {
  const len = (text || '').length;
  if (!len) return 45;
  if (len < 20) return 58;
  if (len < 80) return 74;
  return 90;
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/verify') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const prompt = String(payload.prompt || '');
        const trustScore = trustFromText(prompt);
        sendJson(res, 200, {
          trustScore,
          status: trustScore >= 60 ? 'verified' : 'blocked',
          auditId: `aud_${Date.now()}`,
          issues: trustScore >= 60 ? [] : ['insufficient_context'],
          safeOutput: `Verified preview: ${prompt || 'No input provided.'}`
        });
      } catch {
        sendJson(res, 400, { error: 'invalid_json' });
      }
    });
    return;
  }

  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.normalize(path.join(root, urlPath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    res.writeHead(200, { 'content-type': types[path.extname(filePath)] || 'text/plain' });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`Prevalid preview running on http://localhost:${port}`);
});

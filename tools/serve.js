const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'frontend');
const port = Number(process.env.PORT) || 5500;
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let filePath = path.resolve(root, '.' + pathname);

  if (!filePath.startsWith(root + path.sep) && filePath !== root) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isDirectory()) filePath = path.join(filePath, 'index.html');
    fs.stat(filePath, (fileError) => {
      if (fileError) filePath = path.join(root, 'index.html');

      fs.readFile(filePath, (readError, content) => {
        if (readError) {
          res.writeHead(500).end('Server error');
          return;
        }

        res.writeHead(200, {
          'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
          'Cache-Control': 'no-store'
        });
        res.end(content);
      });
    });
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`LASU Navigator running at http://127.0.0.1:${port}`);
});

const http = require('http');
const { processTransactions } = require('./service');

const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '0.0.0.0';

/**
 * Creates and starts the HTTP server.
 */
function startServer(port = PORT, host = HOST) {
  const server = http.createServer((req, res) => {
    // Health check endpoint for Kubernetes probes
    if (req.url === '/healthz' || req.url === '/readyz' || req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'UP', service: 'creative-cash-draw' }));
      return;
    }

    if (req.method === 'POST' && (req.url === '/process' || req.url === '/')) {
      let body = '';
      req.setEncoding('utf8');
      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          let inputText = body;
          let configOverride = null;

          const contentType = req.headers['content-type'] || '';
          if (contentType.includes('application/json')) {
            const parsed = JSON.parse(body);
            inputText = parsed.input || parsed.data || '';
            configOverride = parsed.config || null;
          }

          const outputText = processTransactions(inputText, configOverride);

          res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8'
          });
          res.end(outputText);
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found', endpoints: ['POST /process', 'GET /healthz'] }));
  });

  server.listen(port, host, () => {
    console.log(`Creative Cash Draw service listening on http://${host}:${port}`);
  });

  return server;
}

if (require.main === module) {
  const server = startServer();

  const shutdown = () => {
    console.log('Gracefully stopping server...');
    server.close(() => {
      console.log('Server stopped.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = {
  startServer
};

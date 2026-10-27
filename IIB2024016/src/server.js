/**
 * XSS Security Lab — Main Express Server
 * College Web Server Security Assignment
 */

const express = require('express');
const path = require('path');
const labRoutes = require('./routes/labRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, '../public')));

// Parse URL-encoded bodies and query strings
app.use(express.urlencoded({ extended: true }));

// Mount lab routes
app.use('/', labRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>404 - Not Found | XSS Security Lab</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body style="display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;">
      <div style="background-color:#161b22;padding:3rem;border-radius:12px;border:1px solid #30363d;max-width:500px;">
        <h1 style="font-size:3rem;color:#f87171;margin-bottom:1rem;">404</h1>
        <p style="color:#8b949e;margin-bottom:1.5rem;">The requested laboratory endpoint does not exist.</p>
        <a href="/" class="btn btn-secured">&larr; Return to Lab Home</a>
      </div>
    </body>
    </html>
  `);
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log('================================================================');
  console.log('  🛡️  XSS Security Lab — Reflected XSS Research Platform');
  console.log(`  🚀 Server running at: http://localhost:${PORT}`);
  console.log('  ⚠️  Mode: Educational Localhost Environment Only');
  console.log('================================================================');
});

module.exports = { app, server };

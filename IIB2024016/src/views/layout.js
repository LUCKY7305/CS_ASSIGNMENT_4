/**
 * Base Layout Template
 * Provides the shared HTML shell, navigation bar, security disclaimer, and assets.
 */

function renderLayout({ title, activeNav = 'home', bodyContent }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | XSS Security Lab</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>

  <!-- Educational Disclaimer Banner -->
  <div class="disclaimer-banner">
    <span class="disclaimer-badge">Academic Testbed</span>
    <span>Intended strictly for local educational security research on <code>localhost</code>. Never test payloads against external systems.</span>
  </div>

  <!-- Main Navigation Header -->
  <header class="header">
    <div class="container header-content">
      <a href="/" class="brand">
        <span class="brand-icon">🛡️</span>
        <span>XSS Security Lab</span>
      </a>
      <nav>
        <ul class="nav-links">
          <li class="nav-item ${activeNav === 'home' ? 'active' : ''}">
            <a href="/">Overview</a>
          </li>
          <li class="nav-item vulnerable ${activeNav === 'vulnerable' ? 'active' : ''}">
            <a href="/vulnerable">⚠️ Vulnerable Portal</a>
          </li>
          <li class="nav-item secured ${activeNav === 'secured' ? 'active' : ''}">
            <a href="/secured">🔒 Secured Portal</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Body Content Injection -->
  <main class="main-wrapper">
    <div class="container">
      ${bodyContent}
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="container footer-content">
      <div>
        <strong>XSS Security Lab</strong> &bull; College Web Server Security Assignment
      </div>
      <div>
        Reflected Cross-Site Scripting (XSS) Demonstration & Mitigation
      </div>
    </div>
  </footer>

  <script src="/js/lab-helper.js"></script>
</body>
</html>`;
}

module.exports = {
  renderLayout
};

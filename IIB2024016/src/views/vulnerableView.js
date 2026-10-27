/**
 * Vulnerable View — Implements Unsafe Input Reflection (Type 1 Reflected XSS)
 * 
 * Root Cause:
 * The query parameter (req.query.q) is directly interpolated into the HTML template string
 * without context-aware output encoding. When a browser parses the HTML response, any injected
 * tags (<script>, <img>, <iframe>) transition the tokenizer into an execution state.
 */

const { renderLayout } = require('./layout');

function renderVulnerableView(query = '', results = [], allArticles = []) {
  const isSearchPerformed = query.trim().length > 0;
  const articlesToDisplay = isSearchPerformed ? results : allArticles;

  // Safely format input attribute to avoid corrupting the form element itself,
  // ensuring the vulnerability is cleanly isolated to the HTML text reflection context below.
  const inputSafeValue = String(query).replace(/"/g, '&quot;');

  // Render article cards
  const articlesHtml = articlesToDisplay.length > 0
    ? articlesToDisplay.map(article => `
        <article class="article-item">
          <div class="article-category">${article.category}</div>
          <h3 class="article-title">${article.title}</h3>
          <p class="article-summary">${article.summary}</p>
          <div class="article-tags">
            ${article.tags.map(tag => `<span class="article-tag">#${tag}</span>`).join('')}
          </div>
        </article>
      `).join('')
    : `
        <div class="no-results" style="grid-column: 1 / -1;">
          <p>No knowledge base records matched the query.</p>
        </div>
      `;

  // Reflection section (INTENTIONALLY VULNERABLE):
  // ${query} is directly interpolated unencoded into the HTML stream!
  const reflectionHtml = isSearchPerformed
    ? `
      <section class="reflection-card vulnerable">
        <div class="reflection-header">
          <span class="reflection-title">Unsafe Reflection Output (Raw HTML Context)</span>
          <span class="mode-badge vulnerable">⚠️ Unencoded Injection Point</span>
        </div>
        <div class="reflection-target-box">
          Query reflected in HTML response: <strong>${query}</strong>
        </div>
        <div class="reflection-meta-note">
          Vulnerable Source: <code>req.query.q</code> &bull; Context: HTML Body Text &bull; Output Encoding: <strong>NONE (Raw Interpolation)</strong>
        </div>
      </section>
    `
    : '';

  const bodyContent = `
    <!-- Visible Warning Notice -->
    <div class="warning-box">
      <div class="warning-icon">⚠️</div>
      <div>
        <div class="warning-title">Notice: Intentionally Vulnerable Educational Route</div>
        <div class="warning-desc">
          This portal does not sanitize or encode user-supplied query parameters. Untrusted input from <code>req.query.q</code> is reflected directly into the HTML body. <strong>Strictly for local educational research on localhost. Never deploy to production.</strong>
        </div>
      </div>
    </div>

    <!-- Portal Header -->
    <header class="portal-header">
      <div class="portal-title-row">
        <h1 class="portal-title">Vulnerable Search Portal</h1>
        <span class="mode-badge vulnerable">Status: Unsecured Reflection Active</span>
      </div>
      <p class="portal-subtitle">
        Search our mock cybersecurity repository. Because the query is reflected without HTML entity encoding, any markup or script tags injected in <code>?q=</code> will be parsed and executed by the browser.
      </p>
    </header>

    <!-- Search Form & Test Payload Toolbar -->
    <section class="search-card">
      <form id="search-form" action="/vulnerable" method="GET" class="search-form">
        <div class="search-input-wrapper">
          <input
            type="text"
            id="search-input"
            name="q"
            class="search-input"
            placeholder="Search cybersecurity articles or test an XSS payload..."
            value="${inputSafeValue}"
            autocomplete="off"
          />
        </div>
        <div class="search-actions">
          <button type="submit" class="btn btn-vulnerable">Search</button>
          <a href="/vulnerable" class="btn btn-secondary">Clear</a>
        </div>
      </form>

      <!-- Quick Payload Helper Chips -->
      <div class="payload-toolbar">
        <div class="payload-toolbar-title">⚡ Quick Test Payloads (Click to Insert):</div>
        <div class="payload-chips">
          <button type="button" class="payload-chip" data-payload="cybersecurity">
            <span>Normal:</span> <code>cybersecurity</code>
          </button>
          <button type="button" class="payload-chip chip-vuln" data-payload="<script>alert('Reflected-XSS-Demonstration')</script>">
            <span>PoC 1 (Script):</span> <code>&lt;script&gt;alert('Reflected-XSS-Demonstration')&lt;/script&gt;</code>
          </button>
          <button type="button" class="payload-chip chip-vuln" data-payload="<img src=x onerror=alert('Reflected-XSS-Demonstration')>">
            <span>PoC 2 (Image):</span> <code>&lt;img src=x onerror=alert(...)&gt;</code>
          </button>
          <button type="button" class="payload-chip" data-payload="<b>Special Characters & &quot;Quotes&quot; <Test></b>">
            <span>Special Chars:</span> <code>&lt;b&gt;Special &amp; &quot;Chars&quot;&lt;/b&gt;</code>
          </button>
        </div>
      </div>
    </section>

    <!-- Unsafe Reflection Point -->
    ${reflectionHtml}

    <!-- Search Results / Catalog Section -->
    <section class="results-section">
      <div class="results-header">
        <h2 class="section-heading" style="font-size: 1.25rem; margin-bottom: 0;">
          ${isSearchPerformed ? `Search Results (${articlesToDisplay.length})` : `All Knowledge Base Documents (${allArticles.length})`}
        </h2>
        <span class="results-count">
          ${isSearchPerformed ? `Filtered by query` : `Showing full catalog`}
        </span>
      </div>

      <div class="articles-grid">
        ${articlesHtml}
      </div>
    </section>

    <!-- Root Cause Analysis Explanation Box -->
    <section class="analysis-panel">
      <h2 class="analysis-title">🔬 Root Cause Analysis: Why Does the Script Execute?</h2>
      <p class="analysis-text">
        The vulnerability occurs in <code>src/views/vulnerableView.js</code> because the application treats untrusted user input as trusted HTML markup:
      </p>
      <div class="code-snippet-box">
// Insecure String Interpolation in server response (src/views/vulnerableView.js):
const responseHtml = '&lt;div class="reflection-target-box"&gt;' +
  'Query reflected in HTML response: &lt;strong&gt;' + 
  '<span style="background: rgba(239, 68, 68, 0.25); color: #fca5a5; font-weight: bold; padding: 2px 6px; border-radius: 3px; border: 1px solid #ef4444;">' + query + '</span>' + // &lt;-- ROOT CAUSE: RAW UNENCODED USER DATA
  '&lt;/strong&gt;&lt;/div&gt;';
      </div>
      <p class="analysis-text">
        When the victim requests <code>/vulnerable?q=&lt;script&gt;alert('Reflected-XSS-Demonstration')&lt;/script&gt;</code>, the Express server injects those exact bytes into the response stream. As the browser’s HTML parser processes the document, encountering <code>&lt;script&gt;</code> transitions the tokenizer from <em>Character Data State</em> to <em>Script Data State</em>, executing the script within the origin's context.
      </p>
    </section>
  `;

  return renderLayout({
    title: 'Vulnerable Portal (Reflected XSS)',
    activeNav: 'vulnerable',
    bodyContent
  });
}

module.exports = {
  renderVulnerableView
};

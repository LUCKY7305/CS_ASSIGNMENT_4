/**
 * Secured View — Implements Context-Aware Output Encoding Mitigation
 * 
 * Mitigation Mechanism:
 * Untrusted query parameters (req.query.q) pass through encodeHTML() before being interpolated
 * into the HTML template string. This converts syntactic control characters (<, >, &, ", ', /)
 * into safe HTML entities, instructing the browser tokenizer to treat them as pure character data
 * rather than executable markup or script tokens.
 */

const { renderLayout } = require('./layout');
const { encodeHTML } = require('../utils/encoder');

function renderSecuredView(query = '', results = [], allArticles = []) {
  const isSearchPerformed = query.trim().length > 0;
  const articlesToDisplay = isSearchPerformed ? results : allArticles;

  // Apply context-aware HTML entity encoding
  const safeQuery = encodeHTML(query);
  const inputSafeValue = encodeHTML(query);

  // Render article cards
  const articlesHtml = articlesToDisplay.length > 0
    ? articlesToDisplay.map(article => `
        <article class="article-item">
          <div class="article-category" style="color: #34d399;">${article.category}</div>
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

  // Reflection section (MITIGATED / SECURED):
  // ${safeQuery} is safely rendered using HTML entity encoding!
  const reflectionHtml = isSearchPerformed
    ? `
      <section class="reflection-card secured">
        <div class="reflection-header">
          <span class="reflection-title">Mitigated Reflection Output (Safe Text Context)</span>
          <span class="mode-badge secured">🔒 Output Encoded</span>
        </div>
        <div class="reflection-target-box">
          Query reflected in HTML response: <strong>${safeQuery}</strong>
        </div>
        <div class="reflection-meta-note">
          Input Source: <code>req.query.q</code> &bull; Encoding: <code>encodeHTML()</code> applied &bull; Browser Interpretation: <strong>Literal Character Text Only</strong>
        </div>
      </section>
    `
    : '';

  const bodyContent = `
    <!-- Secured Status Banner -->
    <div class="warning-box" style="background-color: var(--status-secured-bg); border-color: var(--status-secured-border); border-left-color: var(--status-secured-border);">
      <div class="warning-icon">🛡️</div>
      <div>
        <div class="warning-title" style="color: var(--status-secured-text);">Secured Portal: Context-Aware Output Encoding Active</div>
        <div class="warning-desc" style="color: #a7f3d0;">
          All user input from <code>req.query.q</code> is filtered through <code>encodeHTML()</code> before interpolation into the HTML body. Any injected tags are converted to HTML character entities, neutralizing script execution while preserving benign search capabilities.
        </div>
      </div>
    </div>

    <!-- Portal Header -->
    <header class="portal-header">
      <div class="portal-title-row">
        <h1 class="portal-title">Secured Search Portal</h1>
        <span class="mode-badge secured">Status: Mitigation Active (HTML Entity Encoded)</span>
      </div>
      <p class="portal-subtitle">
        Search our mock cybersecurity repository. Notice that submitting identical XSS payloads here renders the markup as harmless plain text without firing any browser alerts.
      </p>
    </header>

    <!-- Search Form & Test Payload Toolbar -->
    <section class="search-card">
      <form id="search-form" action="/secured" method="GET" class="search-form">
        <div class="search-input-wrapper">
          <input
            type="text"
            id="search-input"
            name="q"
            class="search-input"
            placeholder="Test the exact same XSS payload on this secured portal..."
            value="${inputSafeValue}"
            autocomplete="off"
          />
        </div>
        <div class="search-actions">
          <button type="submit" class="btn btn-secured">Search</button>
          <a href="/secured" class="btn btn-secondary">Clear</a>
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

    <!-- Safe Reflection Point -->
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

    <!-- Side-by-Side Mitigation Analysis Panel -->
    <section class="analysis-panel" style="border-top: 4px solid var(--status-secured-border);">
      <h2 class="analysis-title" style="color: var(--status-secured-text);">
        🛡️ Mitigation Analysis: How HTML Entity Encoding Prevents Execution
      </h2>
      <p class="analysis-text">
        Compare the server-side implementation between the vulnerable and secured endpoints:
      </p>

      <div class="code-snippet-box" style="color: #34d399; border-color: rgba(16, 185, 129, 0.4);">
// 1. Vulnerable Implementation (Raw Interpolation):
// responseHtml = '&lt;strong&gt;' + req.query.q + '&lt;/strong&gt;'; // Executable!

// 2. Secured Implementation (Context-Aware Output Encoding):
const safeQuery = encodeHTML(req.query.q);
// responseHtml = '&lt;strong&gt;' + safeQuery + '&lt;/strong&gt;'; // Neutralized!
      </div>

      <h3 style="font-size: 1.05rem; font-weight: 700; margin: 1.25rem 0 0.5rem; color: var(--text-primary);">
        Before-and-After Technical Comparison:
      </h3>
      <div class="table-responsive">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Evaluation Metric</th>
              <th>Vulnerable Portal (/vulnerable)</th>
              <th>Secured Portal (/secured)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Server Output Handling</strong></td>
              <td><code>&lt;strong&gt;\${query}&lt;/strong&gt;</code> (Raw Unescaped)</td>
              <td><code>&lt;strong&gt;\${encodeHTML(query)}&lt;/strong&gt;</code> (Entity Encoded)</td>
            </tr>
            <tr>
              <td><strong>Test Payload: Script Tag</strong></td>
              <td><code>&lt;script&gt;alert(...)&lt;/script&gt;</code></td>
              <td><code>&amp;lt;script&amp;gt;alert(...)&amp;lt;&#x2F;script&amp;gt;</code></td>
            </tr>
            <tr>
              <td><strong>HTML Parser State</strong></td>
              <td>Switches to <em>Tag Open</em> &rarr; <em>Script Data State</em></td>
              <td>Remains in <em>Character Data State</em></td>
            </tr>
            <tr>
              <td><strong>DOM Representation</strong></td>
              <td><code>HTMLScriptElement</code> (Executes JavaScript)</td>
              <td><code>Text</code> Node (Renders plain text glyphs)</td>
            </tr>
            <tr>
              <td><strong>Client Browser Impact</strong></td>
              <td><span style="color: #f87171; font-weight: 700;">Popup Alert Modal Executes</span></td>
              <td><span style="color: #34d399; font-weight: 700;">Neutralized &mdash; Zero Script Execution</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 style="font-size: 1.05rem; font-weight: 700; margin: 1.25rem 0 0.5rem; color: var(--text-primary);">
        Browser Tokenizer State Transition:
      </h3>
      <ul style="list-style: none; margin-bottom: 1rem;">
        <li style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
          &bull; <strong style="color: #f87171;">Vulnerable:</strong> Encountering raw <code>&lt;</code> transitions the browser HTML tokenizer from <em>Data State</em> to <em>Tag Open State</em>, creating an active DOM element and invoking the JavaScript engine.
        </li>
        <li style="font-size: 0.9rem; color: var(--text-secondary);">
          &bull; <strong style="color: #34d399;">Secured:</strong> Encountering <code>&amp;lt;</code> keeps the tokenizer in <em>Data State</em>. The browser decodes the entity solely for graphical presentation, creating a simple text node.
        </li>
      </ul>

      <h3 style="font-size: 1.05rem; font-weight: 700; margin: 1.25rem 0 0.5rem; color: var(--text-primary);">
        Important Context-Specificity Note:
      </h3>
      <p class="analysis-text" style="margin-bottom: 0;">
        HTML entity encoding is the mathematically correct mitigation for an <strong>HTML Body Text Context</strong>. However, it is <em>not</em> sufficient for other browser contexts. An attribute context (e.g., <code>href="..."</code>) requires URL validation and attribute quoting, a script context (e.g., <code>&lt;script&gt;var x = "...";&lt;/script&gt;</code>) requires JavaScript escaping, and style contexts require strict CSS property encoding.
      </p>
    </section>
  `;

  return renderLayout({
    title: 'Secured Portal (Mitigated Reflected XSS)',
    activeNav: 'secured',
    bodyContent
  });
}

module.exports = {
  renderSecuredView
};

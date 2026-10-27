/**
 * Home View (Dashboard & Comprehensive Educational Reference)
 * 
 * Includes:
 * 1. Project overview & learning objectives.
 * 2. Navigation cards to Vulnerable and Secured portals.
 * 3. Reflected XSS attack flow architecture visualizer.
 * 4. Deep-dive technical explanations (parser tokenizer mechanics, root cause).
 * 5. Archetype comparison (Reflected vs Stored vs DOM-based XSS).
 * 6. Analysis of alternative and complementary mitigation techniques.
 */

const { renderLayout } = require('./layout');

function renderHomeView() {
  const bodyContent = `
    <!-- Hero Banner -->
    <section class="hero">
      <div class="hero-tag">College Web Server Security &bull; Lab Assignment 4</div>
      <h1 class="hero-title">Reflected Cross-Site Scripting (XSS) Lab</h1>
      <p class="hero-subtitle">
        An interactive laboratory demonstrating how untrusted query parameters reflected into server responses create execution vulnerabilities, and how context-aware output encoding eliminates them.
      </p>
    </section>

    <!-- Lab Portals Navigation Grid -->
    <section class="modes-grid">
      <!-- Vulnerable Mode Card -->
      <article class="mode-card vulnerable">
        <span class="mode-badge vulnerable">⚠️ Intentionally Vulnerable</span>
        <h2 class="mode-title">Vulnerable Portal</h2>
        <p class="mode-desc">
          Demonstrates how directly concatenating unencoded user parameters into the returned HTML document enables client-side code execution.
        </p>
        <ul class="mode-features">
          <li>&bull; Reads <code>req.query.q</code> from HTTP request</li>
          <li>&bull; Interpolates raw text directly into template strings</li>
          <li>&bull; Browser parser instantiates injected script elements</li>
        </ul>
        <a href="/vulnerable" class="btn btn-vulnerable">Explore Vulnerable Portal &rarr;</a>
      </article>

      <!-- Secured Mode Card -->
      <article class="mode-card secured">
        <span class="mode-badge secured">🔒 Mitigated Implementation</span>
        <h2 class="mode-title">Secured Portal</h2>
        <p class="mode-desc">
          Applies context-aware HTML entity encoding to ensure special characters are treated strictly as character data and never as markup tokens.
        </p>
        <ul class="mode-features">
          <li>&bull; Filters input with <code>encodeHTML()</code> (&amp; encoded first)</li>
          <li>&bull; Preserves normal search capability for benign queries</li>
          <li>&bull; Safely neutralizes malicious script payloads</li>
        </ul>
        <a href="/secured" class="btn btn-secured">Explore Secured Portal &rarr;</a>
      </article>
    </section>

    <!-- Learning Objectives -->
    <section class="objectives-card">
      <h2 class="section-heading">🎯 Project Learning Objectives</h2>
      <p class="section-subtext" style="margin-bottom: 0;">
        This assignment develops practical competency in diagnosing, reproducing, and mitigating injection vulnerabilities at the web application layer.
      </p>
      <div class="objectives-grid">
        <div class="objective-item">
          <div class="objective-num">Objective 01</div>
          <div class="objective-title">Trace Data Flow</div>
          <p class="objective-desc">Understand how untrusted input flows from client-side URL parameters through Express routing into the response document.</p>
        </div>
        <div class="objective-item">
          <div class="objective-num">Objective 02</div>
          <div class="objective-title">Browser Tokenizer Mechanics</div>
          <p class="objective-desc">Observe how unencoded characters cause the HTML parser to switch state from Character Data to Tag Open / Script Data.</p>
        </div>
        <div class="objective-item">
          <div class="objective-num">Objective 03</div>
          <div class="objective-title">Safe Harmless PoC Testing</div>
          <p class="objective-desc">Safely verify XSS execution using benign alert and error-handler payloads on localhost without collecting sensitive data.</p>
        </div>
        <div class="objective-item">
          <div class="objective-num">Objective 04</div>
          <div class="objective-title">Contextual Output Encoding</div>
          <p class="objective-desc">Implement and verify server-side HTML entity encoding (&amp;amp;, &amp;lt;, &amp;gt;, &amp;quot;, &amp;#x27;) as the primary technical defense.</p>
        </div>
      </div>
    </section>

    <!-- Architecture & Attack Flow Diagram -->
    <section class="diagram-section">
      <h2 class="section-heading">🔍 Anatomy of Reflected XSS: The 3-Step Lifecycle</h2>
      <p class="section-subtext">
        Follow the exact lifecycle of an untrusted query parameter from request arrival to browser execution or mitigation.
      </p>

      <div class="flow-container">
        <!-- Step 1 -->
        <div class="flow-step">
          <div class="step-num">Step 01 &bull; Delivery</div>
          <h3 class="step-title">User / Attacker Input</h3>
          <p class="step-desc">
            An HTTP GET request is transmitted to the server with user-controlled input encoded in the URL query string.
          </p>
          <div class="step-code">GET /search?q=&lt;script&gt;alert(1)&lt;/script&gt;</div>
        </div>

        <!-- Step 2 -->
        <div class="flow-step">
          <div class="step-num">Step 02 &bull; Reflection</div>
          <h3 class="step-title">Server Response</h3>
          <p class="step-desc">
            The server constructs an HTML response body and immediately reflects the query parameter back to the client.
          </p>
          <div class="step-code">Vulnerable: &lt;strong&gt;${'${query}'}&lt;/strong&gt;<br>Secured: &lt;strong&gt;&amp;lt;script&amp;gt;...&lt;/strong&gt;</div>
        </div>

        <!-- Step 3 -->
        <div class="flow-step">
          <div class="step-num">Step 03 &bull; Tokenization</div>
          <h3 class="step-title">Browser Rendering</h3>
          <p class="step-desc">
            The browser parser tokenizes the stream. Unencoded tags create executable DOM nodes; encoded entities render as literal text.
          </p>
          <div class="step-code">Vulnerable: Executes script<br>Secured: Renders harmless text</div>
        </div>
      </div>
    </section>

    <!-- XSS Archetypes Comparison -->
    <section class="diagram-section">
      <h2 class="section-heading">📚 The Three Primary Archetypes of Cross-Site Scripting</h2>
      <p class="section-subtext">
        Understanding the core differences between Reflected, Stored, and DOM-based XSS is a foundational requirement for web security defense.
      </p>

      <div class="table-responsive">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>XSS Type</th>
              <th>Persistence</th>
              <th>Data Path & Delivery</th>
              <th>Execution Location</th>
              <th>Primary Mitigation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong style="color: var(--accent-cyan);">Reflected XSS (Type 1)</strong><br><em>(Subject of this Lab)</em></td>
              <td>Non-Persistent (Immediate)</td>
              <td>Injected via HTTP request parameter (URL query/form), reflected directly in the immediate HTTP response body.</td>
              <td>Browser parses the returned HTML response on page load.</td>
              <td>Context-aware output encoding of reflected parameters.</td>
            </tr>
            <tr>
              <td><strong style="color: #f59e0b);">Stored XSS (Type 2)</strong></td>
              <td>Persistent (Stored)</td>
              <td>Injected payload is stored permanently in a database, filesystem, or message board and served to multiple victims.</td>
              <td>Browser parses stored data whenever any user requests the compromised page.</td>
              <td>Context-aware output encoding on render + server-side HTML sanitization.</td>
            </tr>
            <tr>
              <td><strong style="color: #ec4899);">DOM-based XSS (Type 0)</strong></td>
              <td>Client-Side State</td>
              <td>Payload is processed entirely in client-side JavaScript from a source (e.g., <code>location.hash</code>) to a sink (e.g., <code>innerHTML</code>).</td>
              <td>Client-side JavaScript runtime executes the payload dynamically.</td>
              <td>Avoid dangerous sinks (use <code>textContent</code>, <code>setAttribute</code>); client-side sanitization.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Complementary Mitigation Techniques & Limitations -->
    <section class="diagram-section">
      <h2 class="section-heading">🛡️ Defense-in-Depth: Mitigation Techniques & Their Limits</h2>
      <p class="section-subtext">
        Modern web security requires a defense-in-depth architecture. Each technique plays a specific, distinct role with clear technical boundaries.
      </p>

      <div class="objectives-grid">
        <div class="objective-item">
          <div class="objective-num" style="color: #10b981;">Technique 01 &bull; Primary Defense</div>
          <div class="objective-title">Context-Aware Output Encoding</div>
          <p class="objective-desc">
            <strong>Role:</strong> Converts syntactic characters to safe character entities for the specific target context (HTML body, attributes, JavaScript, CSS).<br>
            <strong>Limitation:</strong> Must match the precise rendering context. HTML entity encoding does not protect within <code>&lt;script&gt;</code> blocks or <code>href="javascript:..."</code>.
          </p>
        </div>

        <div class="objective-item">
          <div class="objective-num" style="color: #38bdf8;">Technique 02 &bull; Modern Frameworks</div>
          <div class="objective-title">Framework Auto-Escaping</div>
          <p class="objective-desc">
            <strong>Role:</strong> Template engines (EJS <code>&lt;%= %&gt;</code>) and frameworks (React, Angular) automatically HTML-escape data bindings.<br>
            <strong>Limitation:</strong> Developers can bypass protections using escape hatches (e.g., <code>dangerouslySetInnerHTML</code> or EJS <code>&lt;%- %&gt;</code>).
          </p>
        </div>

        <div class="objective-item">
          <div class="objective-num" style="color: #f59e0b;">Technique 03 &bull; Rich Text Markup</div>
          <div class="objective-title">HTML Sanitization</div>
          <p class="objective-desc">
            <strong>Role:</strong> Used when applications intentionally accept user HTML (e.g., blog editors). Robust libraries (DOMPurify, sanitize-html) strip malicious tags and event handlers.<br>
            <strong>Limitation:</strong> High CPU overhead; requires regular updates to defend against parser mutation (mXSS) bypasses.
          </p>
        </div>

        <div class="objective-item">
          <div class="objective-num" style="color: #a855f7;">Technique 04 &bull; Browser Policy</div>
          <div class="objective-title">Content Security Policy (CSP)</div>
          <p class="objective-desc">
            <strong>Role:</strong> HTTP response header (e.g., <code>script-src 'self' 'nonce-...'</code>) restricting allowable script sources.<br>
            <strong>Limitation:</strong> Defense-in-depth only. <em>CSP is not a replacement for output encoding</em>; misconfigured policies (e.g., <code>'unsafe-inline'</code>) nullify protection.
          </p>
        </div>

        <div class="objective-item">
          <div class="objective-num" style="color: #ec4899;">Technique 05 &bull; Session Protection</div>
          <div class="objective-title">HttpOnly Cookies</div>
          <p class="objective-desc">
            <strong>Role:</strong> Cookie flag instructing the browser to forbid JavaScript access via <code>document.cookie</code>.<br>
            <strong>Limitation:</strong> Mitigates token exfiltration, but <em>does not prevent XSS itself</em>. Injected scripts can still perform actions on behalf of the user via CSRF/fetch.
          </p>
        </div>

        <div class="objective-item">
          <div class="objective-num" style="color: #6366f1;">Technique 06 &bull; Client-Side DOM</div>
          <div class="objective-title">Safe DOM Sinks &amp; APIs</div>
          <p class="objective-desc">
            <strong>Role:</strong> Utilizing programmatic DOM methods (<code>element.textContent = data;</code>) instead of dangerous parsing sinks (<code>element.innerHTML = data;</code>).<br>
            <strong>Limitation:</strong> Applies to client-side scripts only; does not protect against server-rendered HTML string concatenation.
          </p>
        </div>
      </div>
    </section>
  `;

  return renderLayout({
    title: 'Dashboard & Architecture Overview',
    activeNav: 'home',
    bodyContent
  });
}

module.exports = {
  renderHomeView
};

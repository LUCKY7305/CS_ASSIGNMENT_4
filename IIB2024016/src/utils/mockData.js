/**
 * Mock Knowledge Base Data for XSS Security Lab
 * Used for demonstrating realistic keyword search functionality without a database.
 */

const mockArticles = [
  {
    id: 1,
    title: 'Understanding Reflected Cross-Site Scripting (Type 1 XSS)',
    category: 'Vulnerability Analysis',
    tags: ['cybersecurity', 'xss', 'reflected-xss', 'injection', 'web-security'],
    summary: 'Reflected XSS occurs when an application receives untrusted data in an HTTP request and immediately includes that data within the immediate response without adequate validation or escaping.',
    content: 'In a Reflected XSS attack, the malicious script is delivered through a crafted URL link containing query parameters. When a victim clicks the link, the server reflects the payload straight into the rendered HTML body. Because the browser perceives the response as coming directly from the trusted host, the script executes within the victim’s origin context.'
  },
  {
    id: 2,
    title: 'Context-Aware Output Encoding Principles',
    category: 'Defense & Mitigation',
    tags: ['cybersecurity', 'encoding', 'mitigation', 'owasp', 'defense-in-depth'],
    summary: 'Output encoding transforms untrusted characters into safe, non-executable representations suitable for the target browser context (HTML body, attributes, JavaScript, or CSS).',
    content: 'To prevent HTML body injection, characters such as ampersand (&), less-than (<), greater-than (>), double quotes ("), and single quotes (\') must be converted into their respective HTML entities (&amp;, &lt;, &gt;, &quot;, &#x27;). This forces the browser parsing engine to render user input as pure character data rather than actionable tags.'
  },
  {
    id: 3,
    title: 'Content Security Policy (CSP) Implementation Guide',
    category: 'Architecture',
    tags: ['csp', 'headers', 'mitigation', 'defense-in-depth'],
    summary: 'CSP is an HTTP response header that provides a defense-in-depth layer against XSS by declaring trusted sources of executable content.',
    content: 'By establishing strict directives such as "default-src \'self\';" and eliminating "unsafe-inline", developers can prevent the browser from executing inline scripts injected via XSS attacks, thereby stopping malicious payloads even if input reflection occurs.'
  },
  {
    id: 4,
    title: 'Securing Session Identifiers with HttpOnly and SameSite',
    category: 'Session Management',
    tags: ['cookies', 'httponly', 'sessions', 'cookie-theft'],
    summary: 'The HttpOnly flag prevents client-side scripts from reading session cookies via document.cookie, reducing the impact of successful XSS.',
    content: 'While HttpOnly does not prevent XSS execution or actions performed via cross-site request forgery, it blocks malicious scripts from directly exfiltrating session tokens to an attacker-controlled server.'
  },
  {
    id: 5,
    title: 'Input Validation vs. Output Encoding',
    category: 'Secure Coding',
    tags: ['validation', 'encoding', 'best-practices'],
    summary: 'Understanding why input validation is essential for business logic but output encoding is the true technical antidote to XSS.',
    content: 'Input validation (allowlisting alphanumeric characters, length checks, type casting) ensures data integrity and rejects malformed inputs. However, because legitimate inputs can legitimately include characters like apostrophes or ampersands, output encoding is the primary barrier preventing markup breakout.'
  },
  {
    id: 6,
    title: 'Browser Parsing Mechanics: HTML Tokenizer vs Script Engine',
    category: 'Browser Internals',
    tags: ['browser', 'tokenizer', 'dom', 'parsing'],
    summary: 'How browsers distinguish markup tags from data and why unescaped reflections confuse the HTML parser.',
    content: 'When an HTTP response arrives, the browser tokenizer streams characters statefully. Encountering an unescaped "<" character immediately transitions the state machine from Data State to Tag Open State. If output encoding is applied, the entity remains in Data State and no script element is instantiated.'
  }
];

module.exports = {
  mockArticles,
  searchArticles: (query) => {
    if (!query || typeof query !== 'string') return [];
    const normalized = query.trim().toLowerCase();
    return mockArticles.filter(article =>
      article.title.toLowerCase().includes(normalized) ||
      article.summary.toLowerCase().includes(normalized) ||
      article.tags.some(t => t.toLowerCase().includes(normalized))
    );
  }
};

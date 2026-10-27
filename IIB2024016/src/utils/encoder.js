/**
 * Context-Aware Output Encoder
 * 
 * Purpose:
 * Mitigates Reflected Cross-Site Scripting (XSS) in an HTML Body Text Context.
 * 
 * Mechanics:
 * Converts syntactic HTML control characters into their corresponding HTML character entities.
 * When the browser's HTML tokenizer parses these entities, it treats them strictly as character
 * data (rendering the visual glyphs) rather than syntactic markup tokens (which would open tags
 * or switch the parser into Script Data State).
 * 
 * Order of Execution:
 * Ampersand (&) MUST be encoded first so that the newly generated '&' symbols in subsequent
 * entities (&lt;, &gt;, &quot;, &#x27;) are not double-encoded.
 */

function encodeHTML(input) {
  if (input === null || input === undefined) return '';
  
  // Coerce input safely to a string
  const str = String(input);

  return str
    .replace(/&/g, '&amp;')    // 1. MUST BE ENCODED FIRST: prevents double-encoding subsequent entities
    .replace(/</g, '&lt;')     // 2. Encodes '<': prevents the tokenizer from entering Tag Open State
    .replace(/>/g, '&gt;')     // 3. Encodes '>': prevents premature closing of HTML elements
    .replace(/"/g, '&quot;')   // 4. Encodes '"': prevents breakout of double-quoted contexts
    .replace(/'/g, '&#x27;')   // 5. Encodes '\'': prevents breakout of single-quoted contexts
    .replace(/\//g, '&#x2F;');  // 6. Encodes '/': neutralizes closing tag sequences (e.g., </script>)
}

module.exports = {
  encodeHTML
};

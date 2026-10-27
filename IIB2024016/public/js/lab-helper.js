/**
 * XSS Security Lab Client-Side Helper
 * Provides educational interaction and test payload shortcuts.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c[XSS Security Lab] Client environment loaded.', 'color: #38bdf8; font-weight: bold;');
  console.log('%cNotice: This application is configured strictly for localhost educational research.', 'color: #facc15;');

  // Expose global helper for payload testing
  window.xssLab = {
    fillPayload: function(payload, autoSubmit = false) {
      const searchInput = document.getElementById('search-input');
      const searchForm = document.getElementById('search-form');
      if (searchInput) {
        searchInput.value = payload;
        searchInput.focus();
        if (autoSubmit && searchForm) {
          searchForm.submit();
        }
      }
    }
  };

  // Wire up payload chips
  document.querySelectorAll('.payload-chip[data-payload]').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const payload = chip.getAttribute('data-payload');
      window.xssLab.fillPayload(payload);
    });
  });
});

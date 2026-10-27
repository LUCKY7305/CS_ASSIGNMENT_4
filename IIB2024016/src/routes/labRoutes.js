/**
 * Lab Routes Definition
 * Handles routing for the overview landing page, vulnerable portal, and secured portal.
 */

const express = require('express');
const router = express.Router();

const { renderHomeView } = require('../views/homeView');
const { renderVulnerableView } = require('../views/vulnerableView');
const { renderSecuredView } = require('../views/securedView');
const { mockArticles, searchArticles } = require('../utils/mockData');

// Landing / Overview route
router.get('/', (req, res) => {
  res.send(renderHomeView());
});

// Vulnerable Portal route (Phase 3 Implementation)
router.get('/vulnerable', (req, res) => {
  // Safe extraction of user query: ensure string type and handle missing values
  let query = req.query.q;
  if (typeof query !== 'string') {
    query = '';
  }

  // Perform search against mock knowledge base if a query exists
  const results = query.trim().length > 0 ? searchArticles(query) : [];

  // Pass unencoded query directly to view for reflected demonstration
  res.send(renderVulnerableView(query, results, mockArticles));
});

// Secured Portal route (Phase 4 Implementation)
router.get('/secured', (req, res) => {
  // Safe extraction of user query: ensure string type and handle missing/non-string values
  let query = req.query.q;
  if (typeof query !== 'string') {
    query = '';
  }

  // Perform search against mock knowledge base if a query exists
  const results = query.trim().length > 0 ? searchArticles(query) : [];

  // Pass query to secured view which applies encodeHTML before output interpolation
  res.send(renderSecuredView(query, results, mockArticles));
});

module.exports = router;

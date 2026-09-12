const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { test } = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');

test('PMNO shell exposes responsive map, mobile bottom sheet, and desktop intelligence regions', () => {
  assert.match(html, /class="app-shell"/);
  assert.match(html, /class="mobile-sheet"/);
  assert.match(html, /class="detail-panel desktop-intelligence"/);
  assert.match(html, /id="map"/);
  assert.match(css, /@media \(orientation:\s*portrait\)/);
  assert.match(css, /@media \(orientation:\s*landscape\)/);
  assert.match(css, /@media \(min-width:\s*1100px\)/);
});

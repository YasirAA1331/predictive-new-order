const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeCandidateCoordinates } = require('./map');

test('maps geographic candidates into relative map coordinates around the new order', () => {
  const origin = { latitude: -6.9818, longitude: 110.4093 };
  const candidates = [
    { site_id: 'A', latitude: -6.9818, longitude: 110.4093 },
    { site_id: 'B', latitude: -6.9728, longitude: 110.4193 }
  ];
  const result = normalizeCandidateCoordinates(candidates, origin);
  assert.equal(result[0].x, 50);
  assert.equal(result[0].y, 50);
  assert.ok(result[1].x > 50);
  assert.ok(result[1].y < 50);
});

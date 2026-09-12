const test = require('node:test');
const assert = require('node:assert/strict');
const { rankColloCandidates } = require('../src/decision');

test('preserves nearest towers separately while ranking Top 5 by opportunity score', () => {
  const candidates = [
    { site_id: 'A', distance_m: 400, opportunity_score: 61, irr: 12 },
    { site_id: 'B', distance_m: 900, opportunity_score: 82, irr: 18 },
    { site_id: 'C', distance_m: 1200, opportunity_score: 76, irr: 15 },
    { site_id: 'D', distance_m: 700, opportunity_score: 70, irr: 14 },
    { site_id: 'E', distance_m: 1500, opportunity_score: 79, irr: 16 },
    { site_id: 'F', distance_m: 1800, opportunity_score: 65, irr: 11 }
  ];
  const result = rankColloCandidates(candidates, 10.73);
  assert.equal(result.nearest[0].site_id, 'A');
  assert.deepEqual(result.top5.map(x => x.site_id), ['B', 'E', 'C', 'D', 'F']);
  assert.equal(result.recommended.site_id, 'B');
});

test('IRR below target cannot be marked as viable even with a high opportunity score', () => {
  const candidates = [
    { site_id: 'A', distance_m: 500, opportunity_score: 95, irr: 9.8 },
    { site_id: 'B', distance_m: 900, opportunity_score: 80, irr: 11.2 }
  ];
  const result = rankColloCandidates(candidates, 10.73);
  assert.equal(result.top5[0].site_id, 'A');
  assert.equal(result.top5[0].viable, false);
  assert.equal(result.recommended.site_id, 'B');
});

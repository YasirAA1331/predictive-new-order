function rankColloCandidates(candidates, targetIrr = 10.73) {
  const nearest = [...candidates].sort((a, b) => a.distance_m - b.distance_m);
  const top5 = [...candidates]
    .sort((a, b) => b.opportunity_score - a.opportunity_score)
    .slice(0, 5)
    .map((candidate, index) => ({
      ...candidate,
      rank: index + 1,
      viable: Number(candidate.irr) >= targetIrr
    }));

  const recommended = top5
    .filter(candidate => candidate.viable)
    .sort((a, b) => b.opportunity_score - a.opportunity_score)[0] || null;

  return { nearest, top5, recommended, targetIrr };
}

module.exports = { rankColloCandidates };

function normalizeCandidateCoordinates(candidates, origin) {
  const scale = 0.012;
  return candidates.map((candidate) => ({
    ...candidate,
    x: 50 + ((candidate.longitude - origin.longitude) / scale) * 50,
    y: 50 - ((candidate.latitude - origin.latitude) / scale) * 50
  }));
}

if (typeof module !== 'undefined') module.exports = { normalizeCandidateCoordinates };

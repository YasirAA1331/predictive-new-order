# PMNO — Predictive Mapping New Order

Clickable MVP prototype for executive visualization of New Order feasibility.

## Run

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

The current build uses deterministic synthetic Semarang demo data. The next integration point is the PMNO Supabase decision engine (`calculate_pmno_decision`) so the same UI can consume live analysis results.

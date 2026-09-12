# PMNO MVP Design

## Goal
Create a clickable executive PMNO prototype that starts from New Order coordinates and target tenant, visualizes the nearest existing towers, ranks the Top 5 COLLO opportunities, and clearly identifies the recommended COLLO or New Site fallback.

## UX
- Dark navy executive dashboard.
- Left control panel: latitude, longitude, target tenant, radius, Analyze.
- Main canvas: map with New Order marker, nearest-tower markers, Top 5 COLLO markers, and a highlighted #1 recommendation.
- Right detail panel: decision, Opportunity Score, IRR vs Target IRR 10.73%, Kualitas Signal, engineering, network density, risk, CAPEX and challenges.
- A candidate can be clicked to update the detail panel.
- A fallback New Site card appears when no viable COLLO exists.

## Decision logic
1. Search COLLO candidates first.
2. Show nearest towers independently from recommendation ranking.
3. Rank COLLO candidates by COLLO Opportunity Score, not distance alone.
4. A high score cannot override an economically infeasible candidate: IRR must meet Target IRR 10.73% for a viable COLLO.
5. If no COLLO candidate is viable, show Predictive New Site/B2S fallback.

## Prototype data
Use deterministic synthetic Semarang-area data modeled on the PMNO database outputs so the prototype is immediately understandable. Label the data as demo/synthetic in the UI.

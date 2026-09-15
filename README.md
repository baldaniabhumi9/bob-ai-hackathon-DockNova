# DockNova
### Port Operations Control Tower & AI Congestion Predictor

> A real-time control room that turns uncoordinated port arrivals into an optimized, queue-free berth schedule — powered by machine learning forecasting, mathematical optimization, and an IBM Bob AI Copilot.

---

## Team

| Role | Name | Email |
| :--- | :--- | :--- |
| Team Name | **[YOUR TEAM NAME]** | — |
| Track | **AI** | — |
| Lead | Bhumi Baldania | 24dcs003@charusat.edu.in |
| Member | Krina Patel | 24dit041@charusat.edu.in |
| Member | Rishi Ramani | 24dit058@charusat.edu.in |
| Member | Shalvi Patel | 24dit050@charusat.edu.in |

---

## Problem Statement

Global container ports face catastrophic berth congestion, uncoordinated vessel queues, and inefficient manual quay allocation. When vessel arrivals surge beyond quayside berth capacity, or unexpected bottlenecks (crane breakdowns, yard saturation, bad weather) slow throughput, Ultra-Large Container Vessels can incur **$15,000–$35,000 USD per day** in demurrage and charter penalties while idling at anchorage — burning auxiliary fuel and emitting thousands of metric tons of excess CO₂ and SOₓ annually per terminal.

Port Managers, Vessel Operators, and System Administrators — the people who actually run this process — are underserved by today's tools: static spreadsheets and whiteboards can't re-optimize when an ETA shifts, and legacy Terminal Operating Systems track quayside movement but have no predictive engine to see congestion coming 24–72 hours ahead.

## Solution

DockNova unifies three engines into one role-gated, real-time control room:

1. **ML Congestion Forecasting** — an XGBoost classifier and Gradient Boosting regressor predict hourly congestion risk level and expected wait time up to 72 hours ahead, using live terminal feature vectors (arrivals, queue size, yard occupancy %, crane utilization %).
2. **Google OR-Tools CP-SAT Optimization** — an exact constraint-programming solver computes mathematically optimal berth and crane schedules, respecting real physical constraints (vessel draft, length, cargo-type compatibility) and priority weighting (High = 3×, Medium = 2×, Low = 1×).
3. **IBM Bob AI Copilot** — a conversational assistant that answers natural-language operational questions, returning Explainable AI (XAI) confidence scores, model source attribution, and one-click action chips.

Together these turn a reactive, manual dispatch process into a proactive, mathematically optimized one.

## Key Features

- **Port Control Tower Overview** — live snapshot of total vessels, waiting queue, berth availability, and yard occupancy.
- **72-Hour Congestion Prediction Engine** — interactive risk-trend chart with per-hour hotspot breakdown.
- **Per-Berth Risk Matrix** — real-time 0–100 risk score per berth (NORMAL < 40, WARNING 40–70, CRITICAL ≥ 70).
- **AI 72-Hour Operations Planner** — one-click OR-Tools berth/crane re-optimization with before/after efficiency metrics.
- **Optimal Route Advisor** — STAY vs REROUTE recommendation against alternate ports (e.g., JNPT Mumbai, Kandla, Hazira, Port of Tanjung Pelepas) with net cost-benefit.
- **Emergency Disruption Simulator** — inject crane failure, berth closure, weather delay, staff shortage, or equipment breakdown and see immediate metric impact.
- **IBM Bob AI Copilot** — natural-language Q&A with XAI breakdown and actionable navigation chips.
- **Role-Based Access Control** — signed mock JWT auth, protected routes for Manager / Vessel Operator / Administrator.
- **Cryptographic Audit Logs** — SHA-256 signed log explorer of user actions, logins, and solver triggers.
- **Integrations & AI Config** — management panel for external connectors and ML hyperparameters.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend Framework | React 18 + Vite |
| Type Safety | TypeScript 5.3 |
| Styling | Tailwind CSS 3.4 |
| Animation | Framer Motion 13 |
| Data Visualization | Recharts 3.10 |
| Backend Framework | FastAPI 0.104 (Python 3.11+) |
| Optimization Solver | Google OR-Tools 9.12 (CP-SAT) |
| ML Inference | XGBoost 2.0 / Scikit-Learn 1.3 |
| Data Manipulation | Pandas 2.0 + NumPy 1.24 |
| IBM Technology | IBM Bob AI Copilot (simulated watsonx.ai Granite-13B Maritime / Prescriptive Planner v3 inference) |

Full details: [`docs/architecture.md`](docs/architecture.md)

## How to Run

```bash
# 1. Backend
cd src/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 2. Frontend (in a new terminal)
cd src/frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Full step-by-step instructions, demo accounts, and troubleshooting: [`docs/setup-guide.md`](docs/setup-guide.md)

## Demo

- Demo video: see [`demo/demo-video-link.txt`](demo/demo-video-link.txt)
- Live demo URL: see [`demo/live-demo-url.txt`](demo/live-demo-url.txt)
- Screenshots: see [`demo/screenshots/`](demo/screenshots/)
- Suggested 3-minute judge walkthrough: [`docs/setup-guide.md#judge-demo-script`](docs/setup-guide.md)

## Known Limitations

DockNova is transparent about what is real and what is simulated in this build:

- **Simulated external integrations** — MPA (Singapore Maritime and Port Authority), TOS Portnet, NOAA Weather, and TradeNet connectors are simulated and clearly labeled `Simulated (demo)` in the UI; no live external network calls are made to them.
- **Simulated audit-log persistence** — Cryptographic (SHA-256) audit log entries are generated realistically but stored in client-side mock memory rather than an external immutable ledger.
- **Simulated IBM Bob / watsonx connection** — In this demo build, IBM Bob runs on a client-side conversational service (`bobService.ts`) that simulates watsonx.ai inference with an artificial 1500ms delay, contextual intent resolution, and XAI metadata — it does not make a live network call to a watsonx REST endpoint.
- **Real components**: the FastAPI REST API, the OR-Tools CP-SAT berth/crane solvers, the XGBoost ML predictor, the live operational-state clock, and the React control room UI are all genuinely implemented and functional.

## What We're Most Proud Of

The **AI 72-Hour Operations Planner**: it takes a genuine NP-hard combinatorial problem (the Berth Allocation Problem) and solves it exactly with Google OR-Tools CP-SAT — respecting real vessel draft/length/cargo-type constraints and priority weighting — rather than falling back to a greedy first-come-first-served heuristic like most legacy tools. Paired with the 72-hour ML congestion forecast and the IBM Bob Copilot's explainable natural-language interface, it turns a traditionally reactive dispatch process into a proactive, provably optimized one.

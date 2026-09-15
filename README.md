# DockNova
### Port Operations Control Tower & AI Congestion Predictor

> A real-time control room that turns uncoordinated port arrivals into an optimized, queue-free berth schedule — powered by machine learning forecasting, mathematical optimization, and an IBM Bob AI Copilot.

---

## Team

| Role | Name | Email |
| :--- | :--- | :--- |
| Team Name | **DockNova** | — |
| Track | **AI** | — |
| Lead | Bhumi Baldania | 24dcs003@charusat.edu.in |
| Member | Krina Patel | 24dit041@charusat.edu.in |
| Member | Rishi Ramani | 24dit058@charusat.edu.in |
| Member | Shalvi Patel | 24dit050@charusat.edu.in |

---

## Problem Statement

Global container ports face catastrophic berth congestion, uncoordinated vessel queues, and inefficient manual quay allocation. When vessel arrivals surge beyond quayside berth capacity, or unexpected bottlenecks (crane breakdowns, yard saturation, bad weather) slow throughput, Ultra-Large Container Vessels can incur **15,000–1.2L INR per day** in demurrage and charter penalties while idling at anchorage — burning auxiliary fuel and emitting thousands of metric tons of excess CO₂ and SOₓ annually per terminal.

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
| Frontend | React 18.2, Vite 5.0, TypeScript 5.3, React Router 6.30, Tailwind CSS 3.4, Framer Motion 13, Recharts 3.10 |
| Backend | Python 3.13, FastAPI, Uvicorn |
| Database | PostgreSQL, Neon PostgreSQL, SQLAlchemy 2.x, psycopg 3, Alembic |
| ML / Data | XGBoost, Scikit-learn 1.6.1, Pandas, NumPy, Joblib |
| Optimization | Google OR-Tools 9.12 CP-SAT |
| AI Copilot | IBM Bob AI Copilot with simulated IBM watsonx.ai inference in the current frontend implementation |
| Testing | Pytest |
| CI/CD | GitHub Actions submission validation workflow |

Full details: [`docs/architecture.md`](docs/architecture.md)

## Database

DockNova now uses **Neon PostgreSQL** for persistent backend data. The FastAPI backend connects through **SQLAlchemy 2.x** using the **psycopg 3** PostgreSQL driver, and **Alembic** manages database schema migrations.

The current migration creates these PostgreSQL tables:

| Table | Purpose |
| :--- | :--- |
| `vessels` | Vessel schedule and operational metadata |
| `berths` | Berth capacity, compatibility, and status data |
| `cranes` | Crane inventory and berth assignments |
| `vessel_workloads` | TEU workload values used by crane optimization |
| `historical_metrics` | Time-series metrics used by congestion forecasting |
| `alternative_ports` | Alternate port data used by route recommendations |
| `alembic_version` | Alembic migration tracking |

Do not commit real database credentials. Use `src/.env.example` as the safe template and keep real Neon connection strings in `src/.env` or environment-specific secret storage only.

## Project Structure

```text
.
├── src/
│   ├── frontend/       # React + Vite + TypeScript web client
│   ├── backend/        # FastAPI backend, ML services, optimization services, API routers
│   ├── database/       # Alembic config, migrations, schema/seed/script folders
│   ├── ai/             # AI/ML workspace folders for models, prediction, optimisation, simulation, notebooks
│   └── shared/         # Shared TypeScript constants, schemas, and types
├── docs/               # Architecture, setup, solution, and problem documentation
├── demo/               # Demo links and screenshots
├── presentation/       # Presentation artifacts
└── .github/workflows/  # GitHub Actions validation workflow
```

## How to Run

DockNova currently targets **Python 3.13** for the backend.

### 1. Backend Setup

```bash
cd src/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Environment

Create `src/.env` from the safe template:

```bash
cp ../.env.example ../.env
```

Set `DATABASE_URL` using the Neon PostgreSQL connection string from your Neon dashboard:

```env
DATABASE_URL=postgresql+psycopg://YOUR_USERNAME:YOUR_PASSWORD@YOUR_HOST/YOUR_DATABASE?sslmode=require
```

Never put the real Neon connection string, username, password, or secret values in the README or committed files.

### 3. Database Migration

From `src/backend`, run:

```bash
PYTHONPATH=. python -m alembic -c ../database/config/alembic.ini upgrade head
```

This creates or updates the PostgreSQL schema managed by Alembic.

### 4. Database Seed

From `src/backend`, run:

```bash
PYTHONPATH=. python -m app.data.seed_postgres
```

This loads DockNova demo/seed data into PostgreSQL without duplicating existing seed records.

### 5. Start Backend

From `src/backend`, run:

```bash
python -m uvicorn main:app --reload --port 8000
```

### 6. Frontend

In a new terminal:

```bash
cd src/frontend
npm install
npm run dev
```

The frontend runs on the Vite development server. By default, Vite serves the app at `http://localhost:5173` unless the local environment selects another available port.

## Verification

After starting the backend, verify these URLs return HTTP `200`:

- `http://localhost:8000/health`
- `http://localhost:8000/docs`
- `http://localhost:8000/api/vessels`

Then start the frontend and open the Vite URL shown in the terminal.

## Security

- Never commit `src/.env`.
- Never expose the Neon `DATABASE_URL`.
- Use `src/.env.example` as the safe template for environment variables.
- Keep real credentials local or in environment-specific secret storage.

## Demo

- Demo video: see [`demo/demo-video-link.txt`](https://drive.google.com/file/d/1d04yppDCy8qrJYb_3_tmmrrd-Z5RcxJ9/view?usp=sharing)
- Live demo URL: [https://docknova.vercel.app](https://docknova.vercel.app)
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

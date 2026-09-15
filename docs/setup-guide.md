# Setup Guide

This guide assumes the reader has never seen this repository before. Follow the steps in order.

## Prerequisites

- Python 3.10+ (Python 3.11 recommended)
- Node.js v18+ and npm v9+

## Environment Variables

The project handbook does not document a set of custom environment variables beyond the pinned dependency versions noted below. If your `src/.env.example` file lists additional variables, populate `src/.env` with dummy or real values as appropriate before running the backend — do not commit the real `.env` file (it is already covered by `.gitignore`).

> **Python Protobuf / OR-Tools compatibility note**: If running Python 3.12+, `protobuf` version conflicts with `ortools` may occur. `requirements.txt` locks `protobuf==5.29.3` and `ortools==9.12.4544` to guarantee zero compilation errors.

## 1. Backend Startup

```bash
# Navigate to backend directory
cd src/backend

# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install required dependencies
pip install -r requirements.txt

# Start the FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```

## 2. Frontend Startup

```bash
# Open a new terminal and navigate to the frontend directory
cd src/frontend

# Install dependencies
npm install

# Launch the Vite development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## 3. Preset Demo Accounts

| Role | Email Address | Password | Landing Target |
| :--- | :--- | :--- | :--- |
| Port Operations Manager | `captain@docknova.com` | `Maritime2026!` | `/manager` |
| Vessel Operator / Carrier | `operator@docknova.com` | `Maritime2026!` | `/user` |
| System Administrator | `admin@docknova.com` | `Maritime2026!` | `/admin` |

## 4. How to Verify It's Working

1. Confirm the backend health check responds: open `http://localhost:8000/health` and confirm a successful response.
2. Confirm the frontend loads at `http://localhost:5173` and shows the login screen.
3. Log in with `captain@docknova.com` / `Maritime2026!` and confirm you land on `/manager` with the Control Tower Overview showing live vessel, queue, and berth counts.
4. From the Manager dashboard, open **72-Hour Congestion** and confirm the hourly risk-trend chart renders.
5. Click **AI 72-Hour Operations Planner → Run Berth Optimization** and confirm a before/after metrics card appears.
6. Open **IBM Bob Copilot** and send a test prompt (see the Judge Demo Script below) and confirm a markdown response with an XAI breakdown card is returned.
7. Log in as `admin@docknova.com`, open the **Emergency Disruption Simulator**, trigger a `CRANE_FAILURE`, and confirm the terminal metrics update.

If all seven checks pass, the environment is correctly reproducing the submitted build.

## 5. Judge Demo Script (3 Minutes)

**Step 1 — Manager Dashboard Overview (0:00–0:45)**
Log in as `captain@docknova.com` / `Maritime2026!`. The Control Tower dashboard gives an instant snapshot of 40 tracked vessels, 12 waiting at anchorage, and 5 active berths. Note the real-time live clock control bar at the top of the screen.

**Step 2 — Congestion Forecast & OR-Tools Optimization (0:45–1:45)**
Click **72-Hour Congestion** in the sidebar, then **AI 72-Hour Operations Planner**, then **Run Berth Optimization**. The ML engine forecasts a 94% congestion spike at Berth B04; triggering the Google OR-Tools CP-SAT solver re-allocates waiting vessels to optimal berth slots, reducing average wait time by 4.2 hours. Watch the before/after metrics card update with the calculated efficiency gain percentage.

**Step 3 — IBM Bob Copilot Interaction (1:45–2:30)**
Click **IBM Bob Copilot** in the sidebar and type: `"When will MV Ocean Star berth?"`. Note the 1.5-second processing delay simulating watsonx inference. Bob analyzes quayside telemetry and advises shifting MV Ocean Star to Berth B5, saving ₹14,800 in demurrage. Show the XAI breakdown card with the model confidence score (97%) and the dynamic navigation action buttons.

**Step 4 — Emergency Simulation (2:30–3:00)**
Log in as `admin@docknova.com`, navigate to **Emergency Disruption Simulator**, select **CRANE_FAILURE**, and click **Trigger Simulation**. DockNova instantly recalculates terminal queue impact, demonstrating resilience under crisis conditions.

## 6. Troubleshooting Table

| Problem | Likely Cause | Fix |
| :--- | :--- | :--- |
| Backend fails to install `ortools` | Python 3.12+ protobuf conflict | Use the pinned versions in `requirements.txt` (`protobuf==5.29.3`, `ortools==9.12.4544`), or use Python 3.10/3.11 |
| Frontend shows a blank page / API errors | Backend not running or wrong port | Confirm `uvicorn main:app --reload --port 8000` is running before starting the frontend |
| Login fails with demo credentials | Browser LocalStorage not seeded yet | Reload the app once so `authService.ts` can seed `docknova_registered_users`, then retry login |
| IBM Bob Copilot doesn't respond | Expected — includes a deliberate ~1500ms simulated delay | Wait for the delay to complete; this simulates watsonx.ai inference latency (see Known Limitations) |
| GitHub Action `Validate Submission` fails | Missing/empty required field in `submission.yaml`, or invalid YAML | Open the failing Actions run, read the reported error, fix indentation/quoting or fill the missing field, and push again |

## Additional Notes for Judges

- Real vs. simulated components are labeled transparently throughout the UI and in the README's **Known Limitations** section — please review that section before scoring "Working Demo & Functionality" and "Documentation & Reproducibility."
- The fastest way to reproduce the full experience end-to-end is to follow the 4-step Judge Demo Script above after completing Sections 1–3.

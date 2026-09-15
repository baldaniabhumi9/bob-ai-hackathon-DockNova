# Solution Overview

## In Plain Terms

Imagine a single screen that tells a port manager, in real time: how many ships are waiting, which berths are about to become dangerously congested, what the mathematically best schedule looks like for the next 72 hours, and — if they just ask in plain English — why any of that is happening and what to do about it. That screen is DockNova.

## The Core Mechanism

DockNova is not a single tool but three engines working together inside one role-gated control room:

1. **A forecasting brain (Machine Learning)** — continuously estimates how congested each berth will get over the next 24–72 hours, and how long vessels will have to wait, based on live terminal conditions (arrival rate, queue size, yard occupancy, crane utilization).
2. **A scheduling brain (Mathematical Optimization)** — once congestion risk is known, this engine works out the actual best assignment of vessels to berths and cranes, obeying hard physical rules (a vessel can't dock at a berth too shallow or too short for it, or one that doesn't handle its cargo type) and business priorities (higher-priority vessels get preference).
3. **A conversational brain (IBM Bob AI Copilot)** — sits on top of both engines so a human operator can simply ask a question — "When will MV Ocean Star berth?" — and get back a plain-language answer with the reasoning behind it, not just a number.

## What Makes It Different From Naive Alternatives

A naive alternative to DockNova would be a first-come-first-served dispatch board, or a static spreadsheet updated by hand. Those approaches share one weakness: they cannot re-optimize dynamically when conditions change, and they have no way to see congestion coming before it happens.

DockNova is different in three concrete ways:

- It uses a genuine **dual ML model** (an XGBoost classifier for risk level, plus a Gradient Boosting regressor for wait time) rather than a static historical average, so its forecast reacts to what is actually happening on the quay right now.
- It uses **Google OR-Tools CP-SAT**, an exact constraint-programming solver, to compute the mathematically optimal berth schedule — enforcing non-overlapping berth-time intervals, real draft/length limits, and priority weighting (High = 3×, Medium = 2×, Low = 1×) — instead of a greedy heuristic that just assigns the next available berth.
- It exposes all of this through a **natural-language, explainable interface** (IBM Bob), so the reasoning behind a recommendation is visible to the person making the decision, not hidden inside a black box.

## Key Design Decisions and Why They Were Made

- **Role-gated views instead of one dashboard for everyone**: Port Managers, Vessel Operators, and System Administrators need different information and different levels of control, so DockNova authenticates users with a signed JWT and routes each role to its own dashboard (`/manager`, `/user`, `/admin`).
- **Deterministic risk scoring alongside ML forecasting**: Beyond the ML congestion forecast, DockNova also computes a lightweight, deterministic 0–100 per-berth risk score (occupancy + vessel priority + crane status) so operators get an instantaneous signal without waiting on a model call.
- **Transparent labeling of simulated components**: Wherever a component is simulated rather than connected to a live external system — external maritime data feeds, the audit-log ledger, or the watsonx LLM connection — DockNova labels it clearly with a `Simulated (demo)` badge in the UI. This was a deliberate choice to keep the system honest about what is real versus illustrative in the current build (see `docs/architecture.md` and the Known Limitations section of the README for full detail).
- **Explainability by design**: Every IBM Bob response returns not just an answer but an XAI (Explainable AI) breakdown — a confidence score, the model identifier it is attributing the answer to, and the underlying data sources — so operators can judge how much to trust a given recommendation.

## What the User Experience Looks Like

A Port Operations Manager logs in and immediately sees a Control Tower overview: total vessels, how many are waiting, how many berths are free, and yard occupancy. From there they can open the 72-Hour Congestion view to see an hourly risk trend chart and per-berth hotspots, then trigger the AI 72-Hour Operations Planner with a single click to re-optimize berth and crane assignments — watching a before/after metrics card show the calculated efficiency gain.

A Vessel Operator instead sees a fleet radar of their own vessels' live status, and can open the Optimal Route Advisor to compare staying in queue against rerouting to an alternate terminal, with the cost-benefit spelled out.

A System Administrator can open the Emergency Disruption Simulator to inject a crane failure or berth closure and watch the system immediately recompute the terminal-wide impact — proving the platform's resilience under crisis conditions before any real-world change is made.

Throughout all three roles, the IBM Bob Copilot is available as a conversational shortcut: instead of navigating through menus, a user can simply type a question and receive a markdown answer, an XAI confidence breakdown, and clickable action chips that jump straight to the relevant screen.

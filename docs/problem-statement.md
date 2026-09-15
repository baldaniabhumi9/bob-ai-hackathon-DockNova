# Problem Statement

## Who Is Affected

DockNova targets three distinct groups of people who deal with port congestion every day:

- **Port Operations Managers** — responsible for overall quayside throughput, real-time congestion risk, and berth re-allocation decisions.
- **Vessel Operators / Carriers** — responsible for individual vessel ETA/ETD status, delay exposure, and decisions about whether to divert a vessel to another port.
- **System Administrators** — responsible for system security, external data integrations, and stress-testing terminal resilience against disruptions.

All three currently work with tools that were not built to handle the speed and unpredictability of modern container shipping.

## The Real-World Dynamics of Port Congestion

Port congestion occurs when vessel arrivals surge beyond quayside berth capacity, or when unexpected quayside bottlenecks — crane breakdowns, yard stacking saturation, bad weather — slow down container throughput. When container vessels are forced to dwell at outer anchorages waiting for an available quay, the effects cascade across the entire supply chain:

- **Demurrage & Charter Penalties**: Ultra-Large Container Vessels (ULCVs) incur **$15,000–$35,000 USD per day** in berth-waiting costs and vessel charter fees.
- **Bunker Fuel Waste & Emissions**: Auxiliary engines burning fuel during 24–48 hour anchorage waits account for thousands of metric tons of excess CO₂ and SOₓ emissions annually per terminal.
- **Downstream Supply Chain Shock**: Delayed vessel discharges disrupt hinterland rail and trucking schedules, stranding inventory and worsening yard container stack density.

These are not isolated incidents — they compound. A single delayed vessel can push back berth availability for every vessel behind it in the queue, and the disruption propagates into rail and trucking schedules well beyond the port gate.

## Why Existing Solutions Don't Solve It

1. **Static Excel & Paper Planning** — Terminal dispatchers still manually assign berths using static spreadsheets or whiteboards. These tools cannot dynamically re-optimize when a vessel's ETA shifts by even two hours; every change requires manual rework.
2. **Siloed Terminal Operating Systems (TOS)** — Traditional TOS platforms manage quayside movement locally but have no predictive machine learning engine capable of forecasting congestion 24–72 hours in advance. They tell you what is happening now, not what is about to happen.
3. **Reactive Emergency Handling** — When a quay crane breaks down, operators today react manually. Without an instant re-optimization capability, a single equipment failure can create a multi-day queuing cascade instead of being absorbed by an immediate, mathematically optimal reroute.

In short: existing tools are backward-looking and manual, while the problem — vessel scheduling under uncertainty — is fundamentally forward-looking and combinatorial. Closing that gap is what DockNova is built to do.

## Why This Problem Matters Now

Container shipping volumes and vessel sizes have grown to the point where even small scheduling inefficiencies translate into tens of thousands of dollars in demurrage per vessel, per day, and into measurable excess carbon and sulfur emissions at anchorage. As ports operate closer to capacity, the margin for manual error shrinks — a two-hour ETA shift or a single crane failure can now cascade into days of queuing rather than being quietly absorbed. Terminals need a way to see congestion coming and to react to it with a mathematically sound plan in seconds, not with a spreadsheet and a phone call. That is the gap DockNova is built to close.

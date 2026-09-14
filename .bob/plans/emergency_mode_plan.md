# Emergency Mode Implementation Plan

## Pre-flight: Critical Check Results

### Admin Panel Status: ✅ EXISTS
- Route: `/admin/*` (protected, `allowedRoles: ['admin']`)
- Page: `src/frontend/src/pages/admin/index.tsx` — 5-section nav via `activeNav` state
  - `dashboard`, `users`, `config`, `integrations`, `audit`
- Layout: `src/frontend/src/layouts/AdminLayout.tsx` — `ADMIN_NAV_SECTIONS` array drives sidebar
- The sidebar nav is defined in `ADMIN_NAV_SECTIONS` in `AdminLayout.tsx`

### Disruption Types — Verified vs Request
The task specifies 5 types: CRANE_FAILURE, BERTH_CLOSURE, WEATHER_DELAY, STAFF_SHORTAGE, EQUIPMENT_BREAKDOWN.
No alternate "innovation-features" doc was found (docs/ only has PROJECT_CONTRACT.md, architecture.md, problem-statement.md, solution-overview.md, setup-guide.md, template-guide.md).
**Using the 5 types exactly as specified in the task — will flag this explicitly in the report.**

### Router Location: `src/backend/app/api/routers/`
- Pattern: `router = APIRouter(prefix="/api/...", tags=[...])`
- Registered in `src/backend/main.py` via `app.include_router()`
- New router: `app/api/routers/emergency.py` → `POST /api/emergency/simulate`

### No HTTP Client in Frontend Services
- `src/frontend/src/services/index.ts` is empty
- `src/frontend/src/services/authService.ts` uses mock localStorage only
- **Pattern to follow**: Add a real `emergencyService.ts` in `src/frontend/src/services/` with a direct `fetch()` call — matching the existing project style (no axios, no wrapper)

---

## Files to Create

### Backend (new files only)
1. `src/backend/app/services/optimization/emergency_simulation.py` — service layer
2. `src/backend/app/api/routers/emergency.py` — router

### Backend (modifications)
3. `src/backend/app/api/routers/__init__.py` — add `emergency_router` export
4. `src/backend/main.py` — add `app.include_router(emergency_router)`
5. `src/backend/tests/test_emergency.py` — test file

### Frontend (new files only)
6. `src/frontend/src/services/emergencyService.ts` — API service function
7. `src/frontend/src/features/admin/components/EmergencySimulator.tsx` — feature component

### Frontend (modifications)
8. `src/frontend/src/features/admin/index.ts` — export new component
9. `src/frontend/src/pages/admin/index.tsx` — add `emergency` nav case
10. `src/frontend/src/layouts/AdminLayout.tsx` — add nav item to `ADMIN_NAV_SECTIONS`

---

## Backend Design

### `emergency_simulation.py`

```python
# Pydantic models
class DisruptionType(str, Enum):
    CRANE_FAILURE = "CRANE_FAILURE"
    BERTH_CLOSURE = "BERTH_CLOSURE"
    WEATHER_DELAY = "WEATHER_DELAY"
    STAFF_SHORTAGE = "STAFF_SHORTAGE"
    EQUIPMENT_BREAKDOWN = "EQUIPMENT_BREAKDOWN"

class EmergencySimulationRequest(CamelModel):
    disruption_type: DisruptionType
    target_id: Optional[str] = None   # crane ID or berth ID
    value: Optional[float] = None     # delay hours or reduction %

class PortStateSnapshot(CamelModel):
    available_cranes: int
    total_cranes: int
    congestion_pct: float
    risk_level: str
    predicted_wait_time_hours: float

class EmergencySimulationResult(CamelModel):
    before: PortStateSnapshot
    after: PortStateSnapshot
    impact_summary: str
    generated_at: datetime
```

### `_build_port_state(vessels, berths, cranes) -> dict`
- Constructs the `current_state` dict for `predict_congestion()`
- Keys: vessel_arrivals, waiting_vessels, berth_utilization_pct,
  crane_utilization_pct, yard_occupancy_pct, avg_service_time_hours,
  hour_of_day, vessel_priority_avg
- Deriving from real loader data

### `_snapshot_from_state(vessels, berths, cranes) -> PortStateSnapshot`
- Calls `_build_port_state()` then `predict_congestion(current_state)`
- Returns `PortStateSnapshot` with available_cranes count and congestion fields

### 5 disruption handlers (each returns modified copies)

**CRANE_FAILURE** (`target_id` = crane ID):
- Filter out matching crane from cranes list (mark as MAINTENANCE or remove)
- `available_cranes` drops by 1, congestion reruns with fewer cranes → higher crane_utilization_pct

**BERTH_CLOSURE** (`target_id` = berth ID):
- Change matching berth status to MAINTENANCE
- available berths drop → higher berth_utilization_pct → reruns predict_congestion

**WEATHER_DELAY** (`value` = hours):
- Shift all vessel ETAs forward by `value` hours
- Increases waiting_vessels count (vessels that now arrive later = more queued)
- Actually: shifts ETAs *further out* = vessels haven't arrived yet but berths stay occupied = more waiting when they do arrive. Simple: add `value` hours to each vessel ETA → recalculate berth_utilization_pct with more simultaneous arrivals window

**STAFF_SHORTAGE** (`value` = reduction_pct, 0-100):
- Reduce crane capacity_teu_per_hour by `value`% for all cranes
- Manifests as higher crane_utilization_pct → higher congestion probability

**EQUIPMENT_BREAKDOWN** (`target_id` = berth ID, `value` = reduction_pct):
- Reduce crane count at that berth by `value`% (remove that fraction of cranes)
- Similar to CRANE_FAILURE but for a specific berth's entire crane complement

### `simulate_emergency(request) -> EmergencySimulationResult`
- Load real data: `get_vessel_models()`, `get_berth_models()`, `get_crane_models()`
- Compute `before` snapshot
- Apply disruption to produce modified copies
- Compute `after` snapshot  
- Generate `impact_summary` string
- Return `EmergencySimulationResult`

---

## Feature Engineering for `predict_congestion`

The feature dict needs 8 keys (from `features.py`):
```
vessel_arrivals, waiting_vessels, berth_utilization_pct,
crane_utilization_pct, yard_occupancy_pct, avg_service_time_hours,
hour_of_day, vessel_priority_avg
```

Build from real data:
- `vessel_arrivals`: count of WAITING + SCHEDULED vessels
- `waiting_vessels`: count of WAITING + SCHEDULED vessels
- `berth_utilization_pct`: OCCUPIED berths / total usable berths * 100
- `crane_utilization_pct`: OPERATIONAL cranes / total cranes * 100
- `yard_occupancy_pct`: derived from waiting vessels (heuristic: min(95, waiting * 8))
- `avg_service_time_hours`: mean of estimated_handling_hours
- `hour_of_day`: current UTC hour
- `vessel_priority_avg`: mean priority weight (HIGH=3, MED=2, LOW=1)

---

## Router

```python
# src/backend/app/api/routers/emergency.py
router = APIRouter(prefix="/api/emergency", tags=["Emergency"])

@router.post("/simulate", response_model=ApiResponseEnvelope[EmergencySimulationResult])
def simulate_emergency_endpoint(body: EmergencySimulationRequest) -> ...:
    result = simulate_emergency(body)
    return ApiResponseEnvelope(success=True, data=result, error=None)
```

---

## Frontend Design

### Navigation Addition
Add to `ADMIN_NAV_SECTIONS` in `AdminLayout.tsx`:
```tsx
{
  id: 'emergency',
  label: 'Emergency Mode',
  icon: <Siren className="w-5 h-5" />,  // or AlertTriangle
  path: '/admin/emergency',
  badge: 'SIM',
}
```

### `AdminPage` (`pages/admin/index.tsx`)
- Add `emergency` to `getInitialNav()` pathname check
- Add page title: `'Emergency Disruption Simulator'`
- Add `{activeNav === 'emergency' && <EmergencySimulator />}`

### `EmergencySimulator.tsx` Component

**State:**
- `disruptionType: DisruptionType | ''`
- `targetId: string` (crane/berth dropdown)
- `value: string` (numeric input)
- `loading: boolean`
- `result: EmergencySimulationResult | null`
- `error: string | null`
- Available cranes/berths from `mock_data` constants (hard-coded list for dropdown)

**Form section:**
- Dropdown: 5 disruption types
- Conditional inputs:
  - CRANE_FAILURE: crane ID dropdown (CR01–CR12)
  - BERTH_CLOSURE: berth ID dropdown (B01–B05)
  - WEATHER_DELAY: number input (hours, 1–72)
  - STAFF_SHORTAGE: number input (%, 10–90)
  - EQUIPMENT_BREAKDOWN: berth ID dropdown + number input (%, 10–90)
- Big red "🚨 SIMULATE DISRUPTION" button

**Results section (conditional):**
- Two panels side-by-side (BEFORE / AFTER) using same card pattern as AdminDashboard
- Each panel shows: available cranes, congestion %, risk level (with color badge), predicted wait hours
- Risk level uses same color pattern: LOW=green, MEDIUM=yellow, HIGH=orange, CRITICAL=red
- `impact_summary` text displayed prominently below panels

### `emergencyService.ts`
```typescript
const API_BASE = 'http://localhost:8000';

export interface EmergencySimulationRequest { ... }
export interface EmergencySimulationResult { ... }

export async function simulateEmergency(
  req: EmergencySimulationRequest
): Promise<EmergencySimulationResult> {
  const res = await fetch(`${API_BASE}/api/emergency/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const envelope = await res.json();
  if (!envelope.success) throw new Error(envelope.error?.message ?? 'Unknown error');
  return envelope.data;
}
```

---

## Test File Pattern

```python
# src/backend/tests/test_emergency.py
# Pattern matches test_simulation.py: pytest + TestClient + service-level

def test_crane_failure_raises_congestion(client): ...
def test_berth_closure_raises_congestion(client): ...
def test_weather_delay_raises_congestion(client): ...
def test_staff_shortage_raises_congestion(client): ...
def test_equipment_breakdown_raises_congestion(client): ...
def test_before_after_always_differ(client): ...  # congestion_pct after >= before
def test_generated_at_is_iso8601(client): ...
```

---

## Ownership / Touch Map

| File | Action | Owner Impact |
|------|--------|-------------|
| `app/services/optimization/emergency_simulation.py` | CREATE | Rishi area — new file only |
| `app/api/routers/emergency.py` | CREATE | Rishi area — new file only |
| `app/api/routers/__init__.py` | ADD IMPORT LINE | Rishi area — additive only |
| `main.py` | ADD `include_router` LINE | Rishi area — additive only |
| `tests/test_emergency.py` | CREATE | New file only |
| `src/frontend/src/services/emergencyService.ts` | CREATE | New file only |
| `src/frontend/src/features/admin/components/EmergencySimulator.tsx` | CREATE | Admin only |
| `src/frontend/src/features/admin/index.ts` | ADD EXPORT LINE | Admin only |
| `src/frontend/src/pages/admin/index.tsx` | ADD nav case | Admin only |
| `src/frontend/src/layouts/AdminLayout.tsx` | ADD nav item | Admin only |
| Manager pages | NOT TOUCHED | ✅ Bhumi safe |
| User pages | NOT TOUCHED | ✅ Krina safe |

---

## Verification Steps

1. Run existing tests: `cd src/backend && python -m pytest tests/ -v` — all must pass
2. Run new tests: `python -m pytest tests/test_emergency.py -v`
3. Start backend: `uvicorn main:app --reload`
4. Test Swagger: `http://localhost:8000/docs` → POST /api/emergency/simulate
5. Test each disruption type in Swagger, verify before.congestion_pct != after.congestion_pct
6. Start frontend: `npm run dev`
7. Log in as admin, navigate to Emergency Mode tab
8. Try each disruption type, confirm form shows correct conditional inputs
9. Submit, verify BEFORE/AFTER panels show different numbers
10. Check browser console for no errors

/**
 * Emergency Disruption Simulation API service.
 *
 * Provides a typed interface to POST /api/emergency/simulate.
 * Follows the project's existing pattern of direct fetch() calls
 * (no axios wrapper) matching authService.ts conventions.
 */

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8000';

// ---------------------------------------------------------------------------
// Request / Response types (camelCase — matches CamelModel serialisation)
// ---------------------------------------------------------------------------

export type DisruptionType =
  | 'CRANE_FAILURE'
  | 'BERTH_CLOSURE'
  | 'WEATHER_DELAY'
  | 'STAFF_SHORTAGE'
  | 'EQUIPMENT_BREAKDOWN';

export interface EmergencySimulationRequest {
  disruptionType: DisruptionType;
  /** Crane ID (CRANE_FAILURE) or Berth ID (BERTH_CLOSURE, EQUIPMENT_BREAKDOWN) */
  targetId?: string;
  /** Delay hours (WEATHER_DELAY) or reduction % (STAFF_SHORTAGE, EQUIPMENT_BREAKDOWN) */
  value?: number;
}

export interface PortStateSnapshot {
  availableCranes: number;
  totalCranes: number;
  /** 0–100 */
  congestionPct: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  predictedWaitTimeHours: number;
}

export interface EmergencySimulationResult {
  before: PortStateSnapshot;
  after: PortStateSnapshot;
  impactSummary: string;
  generatedAt: string; // ISO 8601
}

// ---------------------------------------------------------------------------
// Public API function
// ---------------------------------------------------------------------------

/**
 * Simulate a port disruption and receive a before/after snapshot.
 *
 * @throws {Error} if the HTTP request fails or the server returns success: false
 */
export async function simulateEmergency(
  request: EmergencySimulationRequest
): Promise<EmergencySimulationResult> {
  const response = await fetch(`${API_BASE}/api/emergency/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const envelope = await response.json();

  if (!envelope.success) {
    const msg = envelope.error?.message ?? 'Emergency simulation failed';
    throw new Error(msg);
  }

  return envelope.data as EmergencySimulationResult;
}

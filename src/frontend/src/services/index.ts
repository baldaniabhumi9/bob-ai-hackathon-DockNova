// ─── Core live state types ──────────────────────────────────────────────────

export interface LiveVessel {
	id: string;
	name: string;
	imo: string;
	type: string;
	status: string;
	eta: string;
	etd: string;
	priority: string;
}

export interface LiveBerth {
	id: string;
	code: string;
	name: string;
	status: string;
	currentVesselId?: string | null;
	maxDraftMeters: number;
}

export interface LiveCrane {
	id: string;
	name: string;
	berthId: string;
	status: string;
	capacityTEUPerHour: number;
}

export interface LiveState {
	currentTime: string;
	running: boolean;
	speed: number;
	vessels: LiveVessel[];
	berths: LiveBerth[];
	cranes: LiveCrane[];
	waitingVessels: number;
	occupiedBerths: number;
	events: Array<{ timestamp: string; vesselId: string; message: string }>;
}

export interface ApiEnvelope<T> {
	success: boolean;
	data: T;
	error?: { code: string; message: string } | null;
}

export interface PortStatus {
	totalVessels: number;
	waitingVessels: number;
	availableBerths: number;
	availableCranes: number;
	yardOccupancyPct: number;
}

export interface CongestionForecast {
	forecastTime?: string;
	congestionProbability: number;
	predictedWaitTimeHours: number;
	riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	hotspot?: { berthId: string; berthName: string; predictedUtilizationPct: number } | null;
}

// ─── 72-hour operations plan ─────────────────────────────────────────────────

export interface OperationsPlanEntry {
	vesselId: string;
	vesselName: string;
	vesselType: string;
	priority: string;
	eta: string;
	etd: string;
	berthId: string;
	berthName: string;
	startTime: string;
	endTime: string;
	craneCount: number;
	craneIds: string[];
	serviceDurationHours: number;
	workloadTEU: number;
	status: string;
	recommendedAction: string;
}

// ─── Berth optimization result ───────────────────────────────────────────────

export interface BerthAssignment {
	vesselId: string;
	vesselName: string;
	berthId: string;
	berthName: string;
	startTime: string;
	endTime: string;
}

export interface MetricsSnapshot {
	waitingVessels: number;
	avgWaitingTimeHours: number;
	berthUtilizationPct: number;
}

export interface BerthOptimizationResult {
	id: string;
	timestamp: string;
	assignments: BerthAssignment[];
	beforeMetrics: MetricsSnapshot;
	afterMetrics: MetricsSnapshot;
	efficiencyGainPercentage: number;
	estimatedWaitTimeReductionHours: number;
	solverStatus: string;
}

// ─── What-if simulation result ───────────────────────────────────────────────

export interface WhatIfSimulationResult {
	simulationId: string;
	totalVesselsInSimulation: number;
	realVesselCount: number;
	simulatedVesselCount: number;
	optimizationResult: BerthOptimizationResult;
}

// ─── API client ──────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:8000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_BASE}${path}`, init);
	if (!response.ok) throw new Error(`DockNova API request failed: ${response.status}`);
	return response.json() as Promise<T>;
}

const JSON_POST: RequestInit = {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: '{}',
};

export const api = {
	// ── Live simulation clock ──
	getLiveState: () => request<LiveState>('/api/live/state'),
	start: (speed: number) => request<LiveState>(`/api/live/start?speed=${speed}`, { method: 'POST' }),
	pause: () => request<LiveState>('/api/live/pause', { method: 'POST' }),
	reset: () => request<LiveState>('/api/live/reset', { method: 'POST' }),
	setSpeed: (speed: number) => request<LiveState>(`/api/live/speed/${speed}`, { method: 'POST' }),
	advance: (hours: number) => request<LiveState>(`/api/live/advance/${hours}`, { method: 'POST' }),

	// ── Port status & congestion ──
	getPortStatus: async () => (await request<ApiEnvelope<PortStatus>>('/api/port/status')).data,
	getCongestion: async () =>
		(await request<ApiEnvelope<CongestionForecast>>('/api/congestion/predict', JSON_POST)).data,
	getCongestionForecast: async (): Promise<CongestionForecast[]> =>
		(await request<ApiEnvelope<CongestionForecast[]>>('/api/congestion/forecast')).data,

	// ── Vessels ──
	getVessels: async (status?: string): Promise<LiveVessel[]> => {
		const qs = status ? `?status=${status}` : '';
		return (await request<ApiEnvelope<LiveVessel[]>>(`/api/vessels${qs}`)).data as unknown as LiveVessel[];
	},

	// ── Operations plan ──
	get72hPlan: async (): Promise<OperationsPlanEntry[]> =>
		(await request<ApiEnvelope<OperationsPlanEntry[]>>('/api/operations/72-hour')).data,

	// ── Berth optimization ──
	optimizeBerths: async (vesselIds?: string[]): Promise<BerthOptimizationResult> =>
		(
			await request<ApiEnvelope<BerthOptimizationResult>>('/api/optimization/berths', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: vesselIds ? JSON.stringify({ vesselIds }) : '{}',
			})
		).data,

	// ── What-if simulation ──
	runSimulation: async (extraVesselCount = 3): Promise<WhatIfSimulationResult> =>
		(
			await request<ApiEnvelope<WhatIfSimulationResult>>('/api/optimization/simulate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ extraVesselCount }),
			})
		).data,
};

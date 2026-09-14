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
	berthId: string;
	status: string;
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
}

export interface PortStatus {
	totalVessels: number;
	waitingVessels: number;
	availableBerths: number;
	availableCranes: number;
	yardOccupancyPct: number;
}

export interface CongestionForecast {
	congestionProbability: number;
	predictedWaitTimeHours: number;
	riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	hotspot?: { berthId: string; berthName: string; predictedUtilizationPct: number } | null;
}

const API_BASE = 'http://localhost:8000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_BASE}${path}`, init);
	if (!response.ok) throw new Error(`DockNova API request failed: ${response.status}`);
	return response.json() as Promise<T>;
}

export const api = {
	getLiveState: () => request<LiveState>('/api/live/state'),
	getPortStatus: async () => (await request<ApiEnvelope<PortStatus>>('/api/port/status')).data,
	getCongestion: async () => (await request<ApiEnvelope<CongestionForecast>>('/api/congestion/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).data,
	start: (speed: number) => request<LiveState>(`/api/live/start?speed=${speed}`, { method: 'POST' }),
	pause: () => request<LiveState>('/api/live/pause', { method: 'POST' }),
	reset: () => request<LiveState>('/api/live/reset', { method: 'POST' }),
	setSpeed: (speed: number) => request<LiveState>(`/api/live/speed/${speed}`, { method: 'POST' }),
};

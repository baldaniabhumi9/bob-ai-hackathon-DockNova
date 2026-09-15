import { useEffect, useState } from 'react';
import {
	api,
	CongestionForecast,
	getCurrentForecast,
	LiveState,
	PortStatus,
} from '@/services';
import { MOCK_VESSELS } from '@/features/vessels/mockVessels';

const createFallbackState = (): LiveState => ({
	currentTime: new Date().toISOString(),
	running: false,
	speed: 1,
	vessels: MOCK_VESSELS.slice(0, 4).map((vessel) => ({
		id: vessel.id,
		name: vessel.name,
		imo: vessel.imo,
		type: vessel.cargoType,
		status: vessel.status === 'Delayed' ? 'WAITING' : vessel.status === 'At Berth' ? 'AT_BERTH' : 'SCHEDULED',
		eta: new Date().toISOString(),
		etd: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
		priority: vessel.congestionRisk && vessel.congestionRisk > 50 ? 'HIGH' : 'MEDIUM',
	})),
	berths: [
		{ id: 'B1', code: 'B1', name: 'Container North', status: 'OCCUPIED', currentVesselId: 'v2', maxDraftMeters: 14.5 },
		{ id: 'B2', code: 'B2', name: 'Container North', status: 'OCCUPIED', currentVesselId: 'v2', maxDraftMeters: 15 },
		{ id: 'B3', code: 'B3', name: 'Bulk Terminal', status: 'AVAILABLE', currentVesselId: null, maxDraftMeters: 13.8 },
		{ id: 'B4', code: 'B4', name: 'Deepwater Hub', status: 'MAINTENANCE', currentVesselId: null, maxDraftMeters: 16.2 },
		{ id: 'B5', code: 'B5', name: 'Feeder Terminal', status: 'AVAILABLE', currentVesselId: null, maxDraftMeters: 12.5 },
		{ id: 'B6', code: 'B6', name: 'Multipurpose', status: 'AVAILABLE', currentVesselId: null, maxDraftMeters: 12 },
	],
	cranes: Array.from({ length: 6 }, (_, index) => ({
		id: `C${index + 1}`,
		name: `Crane C${index + 1}`,
		berthId: `B${(index % 3) + 1}`,
		status: index === 3 ? 'IDLE' : 'OPERATIONAL',
		capacityTEUPerHour: 35,
	})),
	waitingVessels: 1,
	occupiedBerths: 2,
	events: [
		{ timestamp: new Date().toISOString(), vesselId: 'v1', message: 'MV Ocean Star is waiting for berth allocation.' },
		{ timestamp: new Date().toISOString(), vesselId: 'v2', message: 'MV Horizon is processing cargo at B2.' },
	],
});

const FALLBACK_CONGESTION: CongestionForecast = {
	congestionProbability: 0.68,
	predictedWaitTimeHours: 1.4,
	riskLevel: 'MEDIUM',
	hotspot: { berthId: 'B4', berthName: 'Deepwater Hub', predictedUtilizationPct: 92 },
};

const FALLBACK_STATUS: PortStatus = {
	totalVessels: 4,
	waitingVessels: 1,
	availableBerths: 3,
	availableCranes: 5,
	yardOccupancyPct: 68,
};

export const useLiveOperations = (intervalMs = 15000) => {
	const [state, setState] = useState<LiveState | null>(null);
	const [portStatus, setPortStatus] = useState<PortStatus | null>(null);
	const [congestion, setCongestion] = useState<CongestionForecast | null>(null);
	const [forecast, setForecast] = useState<CongestionForecast[]>([]);
	const [fallbackMode, setFallbackMode] = useState(false);

	const refresh = async () => {
		try {
			const [nextState, nextStatus, nextForecast] = await Promise.all([
				api.getLiveState(),
				api.getPortStatus(),
				api.getCongestionForecast(),
			]);
			setState(nextState);
			setPortStatus(nextStatus);
			setForecast(nextForecast);
			setCongestion(getCurrentForecast(nextForecast, nextState.currentTime));
			setFallbackMode(false);
		} catch {
			setFallbackMode(true);
			setState((current) => current ?? createFallbackState());
			setPortStatus((current) => current ?? FALLBACK_STATUS);
			setCongestion((current) => current ?? FALLBACK_CONGESTION);
		}
	};

	useEffect(() => {
		void refresh();
		const timer = window.setInterval(() => void refresh(), intervalMs);
		return () => window.clearInterval(timer);
	}, [intervalMs]);

	useEffect(() => {
		if (!fallbackMode || !state?.running) return undefined;

		const timer = window.setInterval(() => {
			setState((current) => {
				if (!current) return current;
				const nextTime = new Date(current.currentTime).getTime() + current.speed * 60 * 1000;
				return { ...current, currentTime: new Date(nextTime).toISOString() };
			});
		}, 1000);

		return () => window.clearInterval(timer);
	}, [fallbackMode, state?.running, state?.speed]);

	const runFallbackControl = (update: (current: LiveState) => LiveState) => {
		setState((current) => update(current ?? createFallbackState()));
	};

	const start = async () => {
		try { setState(await api.start(state?.speed ?? 1)); } catch { runFallbackControl((current) => ({ ...current, running: true })); }
	};
	const pause = async () => {
		try { setState(await api.pause()); } catch { runFallbackControl((current) => ({ ...current, running: false })); }
	};
	const reset = async () => {
		try { setState(await api.reset()); } catch { runFallbackControl(() => createFallbackState()); }
	};
	const setSpeed = async (speed: number) => {
		try { setState(await api.setSpeed(speed)); } catch { runFallbackControl((current) => ({ ...current, speed })); }
	};

	return { state, portStatus, congestion, forecast, refresh, start, pause, reset, setSpeed, fallbackMode };
};

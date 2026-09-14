import { useEffect, useState } from 'react';
import {
	api,
	CongestionForecast,
	getCurrentForecast,
	LiveState,
	PortStatus,
} from '@/services';

export const useLiveOperations = (intervalMs = 15000) => {
	const [state, setState] = useState<LiveState | null>(null);
	const [portStatus, setPortStatus] = useState<PortStatus | null>(null);
	const [congestion, setCongestion] = useState<CongestionForecast | null>(null);
	const [forecast, setForecast] = useState<CongestionForecast[]>([]);

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
		} catch {
			// Keep the last good snapshot while the backend is unavailable.
		}
	};

	useEffect(() => {
		void refresh();
		const timer = window.setInterval(() => void refresh(), intervalMs);
		return () => window.clearInterval(timer);
	}, [intervalMs]);

	return { state, portStatus, congestion, forecast, refresh };
};

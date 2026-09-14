import { useEffect, useState } from 'react';
import { api, CongestionForecast, LiveState, PortStatus } from '@/services';

export const useLiveOperations = (intervalMs = 15000) => {
  const [state, setState] = useState<LiveState | null>(null);
  const [portStatus, setPortStatus] = useState<PortStatus | null>(null);
  const [congestion, setCongestion] = useState<CongestionForecast | null>(null);

  const refresh = async () => {
    try {
      const [nextState, nextStatus, nextCongestion] = await Promise.all([
        api.getLiveState(),
        api.getPortStatus(),
        api.getCongestion(),
      ]);
      setState(nextState);
      setPortStatus(nextStatus);
      setCongestion(nextCongestion);
    } catch {
      // Keep the last good snapshot while the backend is unavailable.
    }
  };

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return { state, portStatus, congestion, refresh };
};
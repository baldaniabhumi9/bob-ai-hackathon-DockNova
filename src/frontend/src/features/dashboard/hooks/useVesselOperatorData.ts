/**
 * useVesselOperatorData
 *
 * Fetches all four real API endpoints needed by the Vessel Operator dashboard
 * in parallel. Each fetch has its own loading + error state so that a partial
 * failure degrades gracefully (failed panel → labeled "Simulated" fallback).
 *
 * Auto-refreshes every REFRESH_MS milliseconds.
 */
import { useState, useEffect, useCallback } from 'react';
import { api, LiveVessel, PortStatus, BerthRisk, CongestionForecast } from '@/services';

const REFRESH_MS = 30_000;

export interface VesselOperatorData {
  vessels: LiveVessel[];
  portStatus: PortStatus | null;
  berthRisks: BerthRisk[];
  forecast: CongestionForecast | null;

  loading: {
    vessels: boolean;
    portStatus: boolean;
    berthRisks: boolean;
    forecast: boolean;
  };

  errors: {
    vessels: string | null;
    portStatus: string | null;
    berthRisks: string | null;
    forecast: string | null;
  };

  kpi: {
    activeVessels: number | null;
    upcomingArrivals: number | null;
    delayedVessels: number | null;
    forecastWaitHours: number | null;
  };

  refresh: () => void;
  lastRefreshed: string | null;
}

const INITIAL_LOADING = { vessels: true, portStatus: true, berthRisks: true, forecast: true };
const NO_ERRORS = { vessels: null, portStatus: null, berthRisks: null, forecast: null };

function computeKpi(
  vessels: LiveVessel[],
  portStatus: PortStatus | null,
  forecast: CongestionForecast | null,
  errors: VesselOperatorData['errors'],
): VesselOperatorData['kpi'] {
  const now = Date.now();
  const H24 = 24 * 60 * 60 * 1000;

  const activeVessels = errors.portStatus ? null : (portStatus?.totalVessels ?? null);

  const upcomingArrivals = errors.vessels
    ? null
    : vessels.filter((v) => {
        if (!v.eta) return false;
        const eta = new Date(v.eta).getTime();
        return eta > now && eta <= now + H24;
      }).length;

  const delayedVessels = errors.vessels
    ? null
    : vessels.filter((v) => v.status?.toUpperCase() === 'DELAYED').length;

  const forecastWaitHours = errors.forecast ? null : (forecast?.predictedWaitTimeHours ?? null);

  return { activeVessels, upcomingArrivals, delayedVessels, forecastWaitHours };
}

export function useVesselOperatorData(): VesselOperatorData {
  const [vessels, setVessels] = useState<LiveVessel[]>([]);
  const [portStatus, setPortStatus] = useState<PortStatus | null>(null);
  const [berthRisks, setBerthRisks] = useState<BerthRisk[]>([]);
  const [forecast, setForecast] = useState<CongestionForecast | null>(null);

  const [loading, setLoading] = useState<VesselOperatorData['loading']>(INITIAL_LOADING);
  const [errors, setErrors] = useState<VesselOperatorData['errors']>(NO_ERRORS);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(INITIAL_LOADING);

    const results = await Promise.allSettled([
      api.getVessels(),
      api.getPortStatus(),
      api.getBerthRisk(),
      api.getCongestionForecast(),
    ]);

    const [rVessels, rPortStatus, rBerthRisks, rForecast] = results;

    setVessels(rVessels.status === 'fulfilled' ? rVessels.value : []);
    setPortStatus(rPortStatus.status === 'fulfilled' ? rPortStatus.value : null);
    setBerthRisks(rBerthRisks.status === 'fulfilled' ? rBerthRisks.value : []);

    const forecastArr =
      rForecast.status === 'fulfilled' && Array.isArray(rForecast.value)
        ? (rForecast.value as CongestionForecast[])
        : [];
    setForecast(forecastArr.length > 0 ? forecastArr[0] : null);

    setErrors({
      vessels: rVessels.status === 'rejected' ? String((rVessels as PromiseRejectedResult).reason) : null,
      portStatus: rPortStatus.status === 'rejected' ? String((rPortStatus as PromiseRejectedResult).reason) : null,
      berthRisks: rBerthRisks.status === 'rejected' ? String((rBerthRisks as PromiseRejectedResult).reason) : null,
      forecast: rForecast.status === 'rejected' ? String((rForecast as PromiseRejectedResult).reason) : null,
    });

    setLoading({ vessels: false, portStatus: false, berthRisks: false, forecast: false });
    setLastRefreshed(new Date().toISOString());
  }, []);

  useEffect(() => {
    void fetchAll();
    const interval = setInterval(() => void fetchAll(), REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const kpi = computeKpi(vessels, portStatus, forecast, errors);

  return { vessels, portStatus, berthRisks, forecast, loading, errors, kpi, refresh: fetchAll, lastRefreshed };
}

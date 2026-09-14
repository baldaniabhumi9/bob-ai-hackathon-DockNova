import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Server,
	RefreshCw,
} from 'lucide-react';
import {
	MOCK_ADMIN_KPIS,
	MOCK_ACCURACY_HISTORY,
	MOCK_HOURLY_PREDICTIONS,
	MOCK_USER_GROWTH,
	MOCK_SYSTEM_ALERTS,
	MOCK_TERMINALS_TABLE,
	AdminKpiData,
	TerminalUtilizationSlice,
} from './mockAdminData';
import { AdminKpiRow } from './components/AdminKpiRow';
import { ModelAccuracyChart } from './components/ModelAccuracyChart';
import { PredictionVolumeChart } from './components/PredictionVolumeChart';
import { UserGrowthChart } from './components/UserGrowthChart';
import { TerminalUtilizationDonut } from './components/TerminalUtilizationDonut';
import { RecentAlertsList } from './components/RecentAlertsList';
import { TopTerminalsTable } from './components/TopTerminalsTable';
import { api, ML_MODEL_ACCURACY_PCT } from '@/services';

export const AdminDashboard: React.FC = () => {
	const [kpiData, setKpiData] = useState<AdminKpiData>({
		...MOCK_ADMIN_KPIS,
		modelAccuracy: ML_MODEL_ACCURACY_PCT,
	});
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('30d');
	const [terminalUtilization, setTerminalUtilization] = useState<TerminalUtilizationSlice[]>([]);
	const [healthStatusText, setHealthStatusText] = useState<string>('Checking...');

	const loadLiveData = useCallback(async () => {
		try {
			const [health, liveState, portStatus] = await Promise.all([
				api.getHealth(),
				api.getLiveState(),
				api.getPortStatus(),
			]);

			const isHealthy = health.status === 'healthy';
			setHealthStatusText(isHealthy ? 'healthy' : health.status);
			setKpiData((prev) => ({
				...prev,
				modelAccuracy: ML_MODEL_ACCURACY_PCT,
				systemHealth: isHealthy ? 'Operational' : 'Degraded',
				activePredictions24h: portStatus.totalVessels,
				activePredictionsTrend: `${portStatus.waitingVessels} waiting · live vessel count`,
			}));

			const totalBerths = liveState.berths.length;
			const occupied = liveState.occupiedBerths;
			const available = totalBerths - occupied;
			const occupiedPct = totalBerths ? Math.round((occupied / totalBerths) * 100) : 0;
			const availablePct = totalBerths ? 100 - occupiedPct : 0;

			setTerminalUtilization([
				{
					name: 'Occupied Berths',
					value: occupiedPct,
					berthCount: occupied,
					color: '#F472B6',
				},
				{
					name: 'Available Berths',
					value: availablePct,
					berthCount: available,
					color: '#34D399',
				},
			]);
		} catch {
			setHealthStatusText('unreachable');
			setKpiData((prev) => ({
				...prev,
				systemHealth: 'Degraded',
			}));
		}
	}, []);

	useEffect(() => {
		void loadLiveData();
	}, [loadLiveData]);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		await loadLiveData();
		setIsRefreshing(false);
	};

	const donutData = useMemo(
		() =>
			terminalUtilization.length > 0
				? terminalUtilization
				: [
						{
							name: 'Awaiting live berth data',
							value: 100,
							berthCount: 0,
							color: '#64748B',
						},
					],
		[terminalUtilization],
	);

	return (
		<div className="space-y-6">
			{/* 1. Datadog-Style Mission Control Header */}
			<div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex items-start gap-4">
					<div className="p-3 rounded-xl bg-gradient-to-tr from-accent/20 to-primary/20 text-accent border border-accent/30 shrink-0 mt-0.5">
						<Server className="w-6 h-6 text-accent" />
					</div>
					<div>
						<div className="flex items-center gap-2.5 flex-wrap">
							<h2 className="font-heading font-bold text-xl sm:text-2xl text-text-primary tracking-tight">
								System Mission Control
							</h2>
							<span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-accent/15 text-accent border border-accent/30">
								DockNova Admin Core v2.4
							</span>
						</div>
						<p className="text-xs text-text-secondary mt-1">
							Cluster health from GET /health; berth occupancy from live state. Charts marked simulated have no backend telemetry.
						</p>
					</div>
				</div>

				{/* Live Controls & Indicators */}
				<div className="flex items-center gap-3 self-end md:self-center flex-wrap">
					<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-subtle text-xs font-mono text-text-secondary">
						<span
							className={`w-2 h-2 rounded-full ${
								kpiData.systemHealth === 'Operational' ? 'bg-success animate-ping' : 'bg-warning animate-pulse'
							}`}
						/>
						<span className="text-text-primary font-semibold">
							{kpiData.systemHealth === 'Operational' ? 'All Systems Nominal' : 'Degraded Cluster'}
						</span>
						<span className="text-text-muted">• API {healthStatusText}</span>
					</div>

					<div className="flex items-center p-1 rounded-xl bg-surface-2 border border-subtle text-xs font-mono">
						{(['24h', '7d', '30d'] as const).map((range) => (
							<button
								key={range}
								onClick={() => setTimeRange(range)}
								className={`px-2.5 py-1 rounded-lg transition-all ${
									timeRange === range
										? 'bg-accent text-text-primary font-bold shadow-sm'
										: 'text-text-muted hover:text-text-primary'
								}`}
							>
								{range}
							</button>
						))}
					</div>

					<button
						onClick={() => void handleRefresh()}
						title="Refresh live health & berth data"
						className="p-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-subtle text-text-muted hover:text-text-primary transition-all duration-150"
					>
						<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
					</button>
				</div>
			</div>

			<AdminKpiRow kpis={kpiData} healthStatusText={healthStatusText} />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ModelAccuracyChart data={MOCK_ACCURACY_HISTORY} simulated />
				<PredictionVolumeChart data={MOCK_HOURLY_PREDICTIONS} simulated />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<UserGrowthChart data={MOCK_USER_GROWTH} simulated />
				<TerminalUtilizationDonut data={donutData} liveData={terminalUtilization.length > 0} />
				<RecentAlertsList alerts={MOCK_SYSTEM_ALERTS} simulated />
			</div>

			<TopTerminalsTable terminals={MOCK_TERMINALS_TABLE} simulated />
		</div>
	);
};

export default AdminDashboard;

import { api, LiveBerth, LiveCrane, LiveState, LiveVessel } from '@/services';
import { Berth, Crane, Terminal } from './types';

const DEFAULT_TERMINAL: Terminal = {
	id: 'term-api',
	code: 'DN-01',
	name: 'DockNova Terminal',
	location: 'Singapore Port Sector',
	status: 'Operational',
	totalBerths: 0,
	activeCranes: 0,
	avgUtilization: 0,
	quayLengthMeters: 2000,
	description: 'Live port infrastructure synced from DockNova API.',
	establishedYear: 2020,
};

function mapBerthStatus(status: string): Berth['status'] {
	if (status === 'OCCUPIED') return 'Occupied';
	if (status === 'MAINTENANCE') return 'Maintenance';
	if (status === 'AVAILABLE') return 'Available';
	return 'Offline';
}

function mapCraneStatus(status: string): Crane['status'] {
	if (status === 'MAINTENANCE') return 'Maintenance';
	if (status === 'OPERATIONAL' || status === 'IDLE') return 'Operational';
	return 'Fault';
}

export function mapLiveStateToPortConfig(
	liveState: LiveState,
	vessels: LiveVessel[],
): { terminals: Terminal[]; berths: Berth[]; cranes: Crane[] } {
	const vesselById = new Map(vessels.map((v) => [v.id, v]));
	const occupiedPct = liveState.berths.length
		? Math.round((liveState.occupiedBerths / liveState.berths.length) * 100)
		: 0;
	const operationalCranes = liveState.cranes.filter(
		(c) => c.status === 'OPERATIONAL' || c.status === 'IDLE',
	).length;

	const terminal: Terminal = {
		...DEFAULT_TERMINAL,
		totalBerths: liveState.berths.length,
		activeCranes: operationalCranes,
		avgUtilization: occupiedPct,
		quayLengthMeters: liveState.berths.length * 400,
	};

	const berths: Berth[] = liveState.berths.map((berth: LiveBerth) => {
		const vessel = berth.currentVesselId ? vesselById.get(berth.currentVesselId) : undefined;
		return {
			id: berth.id.toLowerCase(),
			code: berth.id,
			name: berth.name,
			terminalId: terminal.id,
			terminalName: terminal.name,
			lengthMeters: 420,
			depthMeters: berth.maxDraftMeters,
			status: mapBerthStatus(berth.status),
			currentVesselId: berth.currentVesselId ?? undefined,
			currentVesselName: vessel?.name,
			currentVesselImo: vessel?.imo,
			cranesAssigned: liveState.cranes
				.filter((c) => c.berthId === berth.id)
				.map((c) => c.id),
			maxDraftMeters: berth.maxDraftMeters,
			lastInspectionDate: new Date().toISOString().split('T')[0],
		};
	});

	const cranes: Crane[] = liveState.cranes.map((crane: LiveCrane) => ({
		id: crane.id.toLowerCase(),
		code: crane.id,
		type: 'STS',
		terminalId: terminal.id,
		terminalName: terminal.name,
		assignedBerthId: crane.berthId.toLowerCase(),
		assignedBerthCode: crane.berthId,
		status: mapCraneStatus(crane.status),
		efficiencyRating: 4.5,
		lastMaintenanceDate: new Date().toISOString().split('T')[0],
		movesPerHour: crane.capacityTEUPerHour,
		manufacturer: crane.name,
	}));

	return { terminals: [terminal], berths, cranes };
}

export async function fetchPortConfigFromApi(): Promise<{
	terminals: Terminal[];
	berths: Berth[];
	cranes: Crane[];
}> {
	const [liveState, vessels] = await Promise.all([api.getLiveState(), api.getVessels()]);
	return mapLiveStateToPortConfig(liveState, vessels);
}

import React, { useEffect, useMemo, useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { BerthData } from '@/features/berths/mockBerths';
import { api, BerthRisk, CongestionForecast, LiveBerth, LiveCrane, LiveVessel } from '@/services';

export interface PortMapProps {
	berths: LiveBerth[];
	cranes: LiveCrane[];
	vessels: LiveVessel[];
	congestion: CongestionForecast | null;
	onSelectBerth: (berth: BerthData) => void;
}

// Map BerthRiskLevel to the Badge variant used throughout the app
function riskVariant(level: BerthRisk['riskLevel']): BerthData['statusVariant'] {
	if (level === 'CRITICAL') return 'critical';
	if (level === 'WARNING') return 'warning';
	return 'success';
}

function riskToStatus(level: BerthRisk['riskLevel']): BerthData['status'] {
	if (level === 'CRITICAL') return 'Critical';
	if (level === 'WARNING') return 'Warning';
	return 'Normal';
}

function mapLiveBerth(
	berth: LiveBerth,
	congestion: CongestionForecast | null,
	vesselName: string | undefined,
	cranesActive: number,
	berthRisk: BerthRisk | null,
): BerthData {
	// ── Real per-berth risk data available from /api/port/berth-risk ──
	if (berthRisk) {
		// For the hotspot berth, prefer the ML forecast utilization % if available
		const isHotspot = congestion?.hotspot?.berthId === berth.id;
		const utilPct = isHotspot && congestion?.hotspot?.predictedUtilizationPct != null
			? Math.round(congestion.hotspot.predictedUtilizationPct)
			: Math.round(berthRisk.utilizationPct);

		// If the ML forecast escalates the hotspot beyond the formula score, use it
		let level = berthRisk.riskLevel;
		if (isHotspot && congestion) {
			if (congestion.riskLevel === 'CRITICAL' && level !== 'CRITICAL') level = 'CRITICAL';
			else if (congestion.riskLevel === 'HIGH' && level === 'NORMAL') level = 'WARNING';
		}

		return {
			id: berth.id,
			name: berth.name,
			code: berth.id,
			status: riskToStatus(level),
			statusVariant: riskVariant(level),
			utilisationPercentage: utilPct,
			assignedVessel: vesselName,
			cranesActive,
			maxDraftMeters: berth.maxDraftMeters,
			isHotspot,
			predictionText: isHotspot
				? `${congestion?.riskLevel ?? 'Forecast'} risk at hotspot`
				: `Score ${Math.round(berthRisk.riskScore)}/100`,
		};
	}

	// ── Fallback: hotspot-only logic (used while API loads) ──
	const isHotspot = congestion?.hotspot?.berthId === berth.id;
	let status: BerthData['status'] = 'Normal';
	let statusVariant: BerthData['statusVariant'] = 'success';

	if (berth.status === 'MAINTENANCE') {
		status = 'Warning';
		statusVariant = 'warning';
	} else if (isHotspot && congestion) {
		if (congestion.riskLevel === 'CRITICAL') { status = 'Critical'; statusVariant = 'critical'; }
		else if (congestion.riskLevel === 'HIGH' || congestion.riskLevel === 'MEDIUM') { status = 'Warning'; statusVariant = 'warning'; }
	}

	let utilisationPercentage: number = 0;
	if (isHotspot && congestion?.hotspot?.predictedUtilizationPct != null) {
		utilisationPercentage = Math.round(congestion.hotspot.predictedUtilizationPct);
	} else if (berth.status === 'OCCUPIED') {
		utilisationPercentage = 100;
	}

	return {
		id: berth.id,
		name: berth.name,
		code: berth.id,
		status,
		statusVariant,
		utilisationPercentage,
		assignedVessel: vesselName,
		cranesActive,
		maxDraftMeters: berth.maxDraftMeters,
		isHotspot,
		predictionText: isHotspot ? `${congestion?.riskLevel ?? 'Forecast'} risk at hotspot` : undefined,
	};
}

function utilisationLabel(berth: BerthData, liveStatus: string, riskScore?: number): string {
	if (berth.isHotspot) {
		return `${berth.utilisationPercentage}% utilisation (forecast)`;
	}
	if (riskScore !== undefined) {
		return `Risk score ${Math.round(riskScore)}/100`;
	}
	if (liveStatus === 'OCCUPIED') return 'Occupied (100%)';
	if (liveStatus === 'AVAILABLE') return 'Available (0%)';
	if (liveStatus === 'MAINTENANCE') return 'Under maintenance';
	return 'Status-based occupancy';
}

export const PortMap: React.FC<PortMapProps> = ({
	berths,
	cranes,
	vessels,
	congestion,
	onSelectBerth,
}) => {
	const [berthRisks, setBerthRisks] = useState<BerthRisk[]>([]);

	// Fetch per-berth risk scores — refresh whenever berths prop changes
	// (berths changes each time useLiveOperations polls)
	useEffect(() => {
		let cancelled = false;
		api.getBerthRisk()
			.then((risks) => { if (!cancelled) setBerthRisks(risks); })
			.catch(() => { /* keep previous data on transient failure */ });
		return () => { cancelled = true; };
	}, [berths]);   // re-fetch when live berth state updates

	const riskById = useMemo(
		() => new Map(berthRisks.map((r) => [r.berthId, r])),
		[berthRisks],
	);

	const displayBerths = useMemo(() => {
		const vesselById = new Map(vessels.map((v) => [v.id, v]));
		return berths.map((berth) => {
			const vessel = berth.currentVesselId ? vesselById.get(berth.currentVesselId) : undefined;
			const cranesActive = cranes.filter(
				(c) => c.berthId === berth.id && (c.status === 'OPERATIONAL' || c.status === 'IDLE'),
			).length;
			const berthRisk = riskById.get(berth.id) ?? null;
			return {
				liveStatus: berth.status,
				riskScore: berthRisk?.riskScore,
				data: mapLiveBerth(berth, congestion, vessel?.name, cranesActive, berthRisk),
			};
		});
	}, [berths, cranes, vessels, congestion, riskById]);

	return (
		<div
			style={{
				backgroundColor: colors.surface,
				borderRadius: radius.md,
				border: `1px solid ${colors.surfaceBorder}`,
				padding: spacing.lg,
				display: 'flex',
				flexDirection: 'column',
				gap: spacing.md,
			}}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: colors.primaryText }}>
					Port Map
				</h3>
				<div style={{ display: 'flex', gap: spacing.md, fontSize: '0.75rem', color: colors.secondaryText }}>
					<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
						<span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.success }} /> Normal
					</span>
					<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
						<span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.warning }} /> Warning
					</span>
					<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
						<span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.critical }} /> Critical
					</span>
				</div>
			</div>

			{displayBerths.length === 0 ? (
				<div style={{ fontSize: '0.8125rem', color: colors.secondaryText }}>Loading berth data...</div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md }}>
					{displayBerths.map(({ liveStatus, riskScore, data: berth }) => {
						const isCritical = berth.statusVariant === 'critical';

						return (
							<div
								key={berth.id}
								onClick={() => onSelectBerth(berth)}
								style={{
									backgroundColor: colors.background,
									borderRadius: radius.md,
									border: `1px solid ${isCritical ? colors.critical : colors.surfaceBorder}`,
									padding: spacing.md,
									display: 'flex',
									flexDirection: 'column',
									gap: spacing.xs,
									cursor: 'pointer',
									transition: 'all 0.15s ease',
								}}
								onMouseEnter={(e) =>
									(e.currentTarget.style.borderColor = isCritical ? colors.critical : colors.novaCyan)
								}
								onMouseLeave={(e) =>
									(e.currentTarget.style.borderColor = isCritical ? colors.critical : colors.surfaceBorder)
								}
							>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<span style={{ fontSize: '1.125rem', fontWeight: 700, color: colors.primaryText }}>
										{berth.code}
									</span>
									<Badge variant={berth.statusVariant}>{berth.status}</Badge>
								</div>

								<div style={{ fontSize: '0.8125rem', color: colors.secondaryText, marginTop: '4px' }}>
									{utilisationLabel(berth, liveStatus, riskScore)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

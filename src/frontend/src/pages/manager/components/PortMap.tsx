import React, { useMemo } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { BerthData } from '@/features/berths/mockBerths';
import { CongestionForecast, LiveBerth, LiveCrane, LiveVessel } from '@/services';

export interface PortMapProps {
	berths: LiveBerth[];
	cranes: LiveCrane[];
	vessels: LiveVessel[];
	congestion: CongestionForecast | null;
	onSelectBerth: (berth: BerthData) => void;
}

function mapLiveBerthToDisplay(
	berth: LiveBerth,
	congestion: CongestionForecast | null,
	vesselName: string | undefined,
	cranesActive: number,
): BerthData {
	const isHotspot = congestion?.hotspot?.berthId === berth.id;
	let status: BerthData['status'] = 'Normal';
	let statusVariant: BerthData['statusVariant'] = 'success';

	if (berth.status === 'MAINTENANCE') {
		status = 'Warning';
		statusVariant = 'warning';
	} else if (isHotspot && congestion) {
		if (congestion.riskLevel === 'CRITICAL') {
			status = 'Critical';
			statusVariant = 'critical';
		} else if (congestion.riskLevel === 'HIGH' || congestion.riskLevel === 'MEDIUM') {
			status = 'Warning';
			statusVariant = 'warning';
		}
	}

	let utilisationPercentage: number | null = null;
	if (isHotspot && congestion?.hotspot?.predictedUtilizationPct != null) {
		utilisationPercentage = Math.round(congestion.hotspot.predictedUtilizationPct);
	} else if (berth.status === 'OCCUPIED') {
		utilisationPercentage = 100;
	} else if (berth.status === 'AVAILABLE') {
		utilisationPercentage = 0;
	}

	return {
		id: berth.id,
		name: berth.name,
		code: berth.id,
		status,
		statusVariant,
		utilisationPercentage: utilisationPercentage ?? 0,
		assignedVessel: vesselName,
		cranesActive,
		maxDraftMeters: berth.maxDraftMeters,
		isHotspot,
		predictionText: isHotspot
			? `${congestion?.riskLevel ?? 'Forecast'} risk at hotspot`
			: undefined,
	};
}

function utilisationLabel(berth: BerthData, liveStatus: string): string {
	if (berth.isHotspot) {
		return `${berth.utilisationPercentage}% utilisation (forecast)`;
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
	const displayBerths = useMemo(() => {
		const vesselById = new Map(vessels.map((v) => [v.id, v]));
		return berths.map((berth) => {
			const vessel = berth.currentVesselId ? vesselById.get(berth.currentVesselId) : undefined;
			const cranesActive = cranes.filter(
				(c) => c.berthId === berth.id && (c.status === 'OPERATIONAL' || c.status === 'IDLE'),
			).length;
			return {
				liveStatus: berth.status,
				data: mapLiveBerthToDisplay(berth, congestion, vessel?.name, cranesActive),
			};
		});
	}, [berths, cranes, vessels, congestion]);

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
					{displayBerths.map(({ liveStatus, data: berth }) => {
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
									{utilisationLabel(berth, liveStatus)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

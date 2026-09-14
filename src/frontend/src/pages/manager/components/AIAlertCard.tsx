import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CongestionForecast, PortStatus } from '@/services';

export interface AIAlertCardProps {
	congestion: CongestionForecast | null;
	portStatus: PortStatus | null;
	onViewPrediction: () => void;
	onRunWhatIf: () => void;
}

function riskVariant(risk: CongestionForecast['riskLevel']): 'success' | 'warning' | 'critical' | 'cyan' {
	if (risk === 'CRITICAL') return 'critical';
	if (risk === 'HIGH' || risk === 'MEDIUM') return 'warning';
	if (risk === 'LOW') return 'success';
	return 'cyan';
}

export const AIAlertCard: React.FC<AIAlertCardProps> = ({
	congestion,
	portStatus,
	onViewPrediction,
	onRunWhatIf,
}) => {
	const riskLevel = congestion?.riskLevel ?? 'MEDIUM';
	const probabilityPct = congestion
		? Math.round(congestion.congestionProbability * 100)
		: null;
	const hotspot = congestion?.hotspot;
	const headline = hotspot
		? `${hotspot.berthId} flagged as congestion hotspot (${riskLevel} risk).`
		: congestion
			? `Port-wide ${riskLevel.toLowerCase()} congestion risk detected.`
			: 'Awaiting congestion forecast from API...';

	const detailItems: string[] = [];
	if (congestion?.predictedWaitTimeHours != null) {
		detailItems.push(
			`Predicted wait time: ${congestion.predictedWaitTimeHours.toFixed(1)} hours`,
		);
	}
	if (hotspot?.predictedUtilizationPct != null) {
		detailItems.push(
			`Hotspot ${hotspot.berthId} forecast utilisation: ${Math.round(hotspot.predictedUtilizationPct)}%`,
		);
	}
	if (portStatus) {
		detailItems.push(
			`${portStatus.waitingVessels} vessel(s) waiting · ${portStatus.availableBerths} berth(s) available`,
		);
	}
	if (portStatus?.availableCranes != null) {
		detailItems.push(`${portStatus.availableCranes} crane(s) currently available`);
	}

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
				justifyContent: 'space-between',
				height: '100%',
				boxSizing: 'border-box',
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: colors.primaryText }}>
						Congestion Risk Detected
					</h3>
					{probabilityPct != null && (
						<Badge variant={riskVariant(riskLevel)}>{riskLevel} · {probabilityPct}%</Badge>
					)}
				</div>

				<p
					style={{
						margin: 0,
						fontSize: '0.9375rem',
						fontWeight: 500,
						color: riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? colors.critical : colors.primaryText,
					}}
				>
					{headline}
				</p>

				{detailItems.length > 0 && (
					<ul
						style={{
							margin: `${spacing.xs} 0 0 0`,
							paddingLeft: '20px',
							fontSize: '0.8125rem',
							color: colors.secondaryText,
							display: 'flex',
							flexDirection: 'column',
							gap: '4px',
						}}
					>
						{detailItems.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				)}
			</div>

			<div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.sm }}>
				<Button variant="primary" size="md" onClick={onViewPrediction} style={{ flex: 1 }}>
					View Details
				</Button>
				<Button variant="secondary" size="md" onClick={onRunWhatIf} style={{ flex: 1 }}>
					Run What-If
				</Button>
			</div>
		</div>
	);
};

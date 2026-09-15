import React, { useEffect, useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { MOCK_VESSELS, VesselTimelineItem } from '@/features/vessels/mockVessels';
import { api, OperationsPlanEntry } from '@/services';

export interface VesselTimelineProps {
	onSelectVessel: (vessel: VesselTimelineItem) => void;
}

function formatEta(iso: string): string {
	return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function mapToTimelineItem(
	vessel: Awaited<ReturnType<typeof api.getVessels>>[number],
	planEntry?: OperationsPlanEntry,
): VesselTimelineItem {
	const isWaiting = vessel.status === 'WAITING';
	const isScheduled = vessel.status === 'SCHEDULED';

	return {
		id: vessel.id,
		name: vessel.name,
		imo: vessel.imo,
		eta: formatEta(vessel.eta),
		assignedBerth: planEntry?.berthId ?? 'TBD',
		status: isWaiting ? 'Delayed' : isScheduled ? 'Scheduled' : 'Arriving',
		statusVariant: isWaiting ? 'warning' : 'cyan',
		delayText: isWaiting ? 'Waiting' : 'On schedule',
		teuCapacity: 0,
		cargoType: vessel.type,
	};
}

export const VesselTimeline: React.FC<VesselTimelineProps> = ({ onSelectVessel }) => {
	const [vessels, setVessels] = useState<VesselTimelineItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				const [liveVessels, plan] = await Promise.all([api.getVessels(), api.get72hPlan()]);
				if (cancelled) return;

				const planByVessel = new Map(plan.map((entry) => [entry.vesselId, entry]));
				const upcoming = liveVessels
					.filter((v) => v.status === 'SCHEDULED' || v.status === 'WAITING')
					.sort((a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime())
					.slice(0, 3)
					.map((v) => mapToTimelineItem(v, planByVessel.get(v.id)));

				setVessels(upcoming);
			} catch {
				if (!cancelled) {
					setVessels(MOCK_VESSELS.filter((vessel) =>
						vessel.status === 'Arriving' || vessel.status === 'Delayed' || vessel.status === 'Scheduled'
					).slice(0, 3));
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void load();
		return () => {
			cancelled = true;
		};
	}, []);

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
			<h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: colors.primaryText }}>
				Upcoming Vessels
			</h3>

			{loading ? (
				<div style={{ fontSize: '0.8125rem', color: colors.secondaryText }}>Loading vessel schedule...</div>
			) : vessels.length === 0 ? (
				<div style={{ fontSize: '0.8125rem', color: colors.secondaryText }}>
					No scheduled or waiting vessels in the next window.
				</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
					{vessels.map((vessel) => (
						<div
							key={vessel.id}
							onClick={() => onSelectVessel(vessel)}
							style={{
								backgroundColor: colors.background,
								borderRadius: radius.md,
								border: `1px solid ${colors.surfaceBorder}`,
								padding: `${spacing.sm} ${spacing.md}`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								cursor: 'pointer',
								transition: 'border-color 0.15s ease',
							}}
							onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.novaCyan)}
							onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.surfaceBorder)}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
								<span style={{ fontWeight: 600, fontSize: '0.875rem', color: colors.primaryText }}>
									{vessel.name}
								</span>
								<span style={{ fontSize: '0.8125rem', color: colors.secondaryText }}>
									ETA {vessel.eta} — {vessel.delayText}
								</span>
							</div>

							<Badge variant="cyan">{vessel.assignedBerth}</Badge>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

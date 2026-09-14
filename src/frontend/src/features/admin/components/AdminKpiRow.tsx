import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Users, Activity, Target, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { AdminKpiData } from '../mockAdminData';

interface AdminKpiRowProps {
	kpis: AdminKpiData;
	healthStatusText?: string;
}

function useCountUp(target: number, duration: number = 1200): number {
	const [count, setCount] = useState<number>(0);

	useEffect(() => {
		let startTime: number | null = null;
		let animationFrameId: number;

		const step = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);
			const easeProgress = 1 - (1 - progress) * (1 - progress);
			setCount(Math.floor(easeProgress * target));

			if (progress < 1) {
				animationFrameId = requestAnimationFrame(step);
			} else {
				setCount(target);
			}
		};

		animationFrameId = requestAnimationFrame(step);
		return () => cancelAnimationFrame(animationFrameId);
	}, [target, duration]);

	return count;
}

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
		},
	},
};

const cardVariants: Variants = {
	hidden: { opacity: 0, y: 15 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export const AdminKpiRow: React.FC<AdminKpiRowProps> = ({ kpis, healthStatusText }) => {
	const animatedUsers = useCountUp(kpis.totalUsers);
	const animatedPredictions = useCountUp(kpis.activePredictions24h);

	const isOperational = kpis.systemHealth === 'Operational';

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
		>
			<motion.div
				variants={cardVariants}
				whileHover={{ y: -4 }}
				transition={{ duration: 0.2 }}
				className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle relative overflow-hidden group shadow-sm hover:shadow-glow-primary/20"
			>
				<div className="flex items-center justify-between text-xs text-text-muted mb-3">
					<span className="font-semibold uppercase tracking-wider text-[11px]">Total Platform Users</span>
					<div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
						<Users className="w-5 h-5" />
					</div>
				</div>
				<span className="inline-block mb-2 px-2 py-0.5 rounded text-[10px] font-mono bg-warning/15 text-warning border border-warning/30">
					Simulated / No live data
				</span>
				<div className="font-mono text-3xl font-bold text-text-primary tracking-tight">
					{animatedUsers.toLocaleString()}
				</div>
				<div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-text-muted">
					<TrendingUp className="w-3.5 h-3.5 shrink-0" />
					<span>{kpis.totalUsersGrowth}</span>
				</div>
			</motion.div>

			<motion.div
				variants={cardVariants}
				whileHover={{ y: -4 }}
				transition={{ duration: 0.2 }}
				className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle relative overflow-hidden group shadow-sm hover:shadow-glow-secondary/20"
			>
				<div className="flex items-center justify-between text-xs text-text-muted mb-3">
					<span className="font-semibold uppercase tracking-wider text-[11px]">Active Predictions (24h)</span>
					<div className="p-2.5 rounded-xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform">
						<Activity className="w-5 h-5" />
					</div>
				</div>
				<span className="inline-block mb-2 px-2 py-0.5 rounded text-[10px] font-mono bg-warning/15 text-warning border border-warning/30">
					Substituted: live vessel count
				</span>
				<div className="font-mono text-3xl font-bold text-text-primary tracking-tight">
					{animatedPredictions.toLocaleString()}
				</div>
				<div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-secondary">
					<span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
					<span>{kpis.activePredictionsTrend}</span>
				</div>
			</motion.div>

			<motion.div
				variants={cardVariants}
				whileHover={{ y: -4 }}
				transition={{ duration: 0.2 }}
				className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle relative overflow-hidden group shadow-sm hover:shadow-glow-accent/20"
			>
				<div className="flex items-center justify-between text-xs text-text-muted mb-3">
					<span className="font-semibold uppercase tracking-wider text-[11px]">Model Accuracy</span>
					<div className="p-2.5 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
						<Target className="w-5 h-5" />
					</div>
				</div>
				<div className="font-mono text-3xl font-bold text-text-primary tracking-tight">
					{kpis.modelAccuracy.toFixed(1)}%
				</div>
				<div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-success">
					<TrendingUp className="w-3.5 h-3.5 shrink-0" />
					<span>{kpis.modelAccuracyTrend}</span>
					<span className="text-text-muted font-normal ml-1">(threshold 85%)</span>
				</div>
			</motion.div>

			<motion.div
				variants={cardVariants}
				whileHover={{ y: -4 }}
				transition={{ duration: 0.2 }}
				className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle relative overflow-hidden group shadow-sm hover:shadow-glow-success/20"
			>
				<div className="flex items-center justify-between text-xs text-text-muted mb-3">
					<span className="font-semibold uppercase tracking-wider text-[11px]">System Health</span>
					<div
						className={`p-2.5 rounded-xl transition-transform ${
							isOperational ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
						}`}
					>
						{isOperational ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
					</div>
				</div>

				<div className="flex items-center gap-3">
					<span
						className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold font-mono tracking-wide border ${
							isOperational
								? 'bg-success/10 text-success border-success/30 shadow-glow-success/20'
								: 'bg-warning/10 text-warning border-warning/30'
						}`}
					>
						<span
							className={`w-2.5 h-2.5 rounded-full ${
								isOperational ? 'bg-success animate-ping' : 'bg-warning animate-pulse'
							}`}
						/>
						<span>{kpis.systemHealth}</span>
					</span>
				</div>

				<div className="flex items-center gap-1.5 mt-3 text-xs text-text-secondary font-mono">
					<span>GET /health:</span>
					<span className="text-text-primary font-bold">{healthStatusText ?? 'unknown'}</span>
				</div>
			</motion.div>
		</motion.div>
	);
};

import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Check,
  ArrowRight,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import { AlternatePortOption, RoutingVessel } from '../mockRouteData';

interface CostBenefitSummaryProps {
  vessel: RoutingVessel;
  selectedOption: AlternatePortOption;
  onConfirmReroute: () => void;
}

export const CostBenefitSummary: React.FC<CostBenefitSummaryProps> = ({
  vessel,
  selectedOption,
  onConfirmReroute,
}) => {
  const tableData = selectedOption.summaryTable;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Top Banner: Projected Grand Savings */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-surface-1 via-surface-2 to-surface-1 border border-primary/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-success/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success/15 border border-success/30 text-success text-[11px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Optimal Decision Advantage</span>
              </span>
              <span className="text-text-muted text-xs font-mono">
                {selectedOption.name} vs {vessel.originalDestination.port}
              </span>
            </div>

            {/* Big Gradient Text */}
            <div className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-success via-primary to-secondary bg-clip-text text-transparent">
              {selectedOption.netSavingsFormatted}
            </div>

            <p className="text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed">
              Bypasses the {vessel.originalDestination.congestionRisk}% primary queue. Avoids estimated demurrage fees and secures immediate quay crane allocation.
            </p>
          </div>

          {/* Large Confirm Button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={onConfirmReroute}
              className="px-8 py-4 rounded-xl font-heading font-bold text-sm text-base bg-gradient-to-r from-success to-primary hover:opacity-95 transition-all shadow-glow-success flex items-center gap-3 cursor-pointer hover:scale-[1.02]"
            >
              <Check className="w-5 h-5 text-base stroke-[2.5]" />
              <span>Confirm Reroute Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Cost-Benefit Comparison Table */}
      <div className="rounded-2xl bg-surface-1 border border-border shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-primary" />
            <h4 className="font-heading font-bold text-base text-text-primary">
              Full Spectrum Cost-Benefit Analysis
            </h4>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Audited against Port Tariff Rates & Fuel Indeces
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-2/70 text-text-muted font-mono uppercase text-[11px] tracking-wider border-b border-border/60">
                <th className="py-3 px-4 sm:px-6">Evaluation Category</th>
                <th className="py-3 px-4 text-danger">Original ({vessel.originalDestination.port})</th>
                <th className="py-3 px-4 text-success">Alternate ({selectedOption.name})</th>
                <th className="py-3 px-4 text-primary">Variance / Net Advantage</th>
                <th className="py-3 px-4 text-center">Optimal Choice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {tableData.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-surface-2/40 transition-colors"
                >
                  {/* Category */}
                  <td className="py-3.5 px-4 sm:px-6 font-sans font-medium text-text-primary text-xs">
                    {row.category}
                  </td>

                  {/* Original Port */}
                  <td className="py-3.5 px-4 text-text-secondary">
                    {row.original}
                  </td>

                  {/* Alternate Port */}
                  <td className="py-3.5 px-4 font-semibold text-text-primary">
                    {row.alternate}
                  </td>

                  {/* Variance */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        row.winner === 'alternate'
                          ? 'bg-success/10 text-success border border-success/20'
                          : row.winner === 'original'
                          ? 'bg-danger/10 text-danger border border-danger/20'
                          : 'bg-surface-2 text-text-muted'
                      }`}
                    >
                      {row.variance}
                    </span>
                  </td>

                  {/* Winner Trophy Column */}
                  <td className="py-3.5 px-4 text-center">
                    {row.winner === 'alternate' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-sans font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Alternate</span>
                      </span>
                    ) : row.winner === 'original' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-sans font-medium text-text-muted bg-surface-2 px-2.5 py-1 rounded-md">
                        <span>Original</span>
                      </span>
                    ) : (
                      <span className="text-text-muted font-sans text-xs">Parity</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

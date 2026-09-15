import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Navigation, Anchor } from 'lucide-react';

export const LiveOperationsBand: React.FC = () => {
  return (
    <section className="relative py-20 bg-[#0D1B2A] border-y border-[rgba(56,189,248,0.15)] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.2),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-xs font-mono text-[#38BDF8] mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#38BDF8]" />
              <span>DYNAMIC SEA-LANES CORRIDOR</span>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#E2E8F0] tracking-tight">
              Autonomous Berth & Traffic Corridor
            </h2>
            <p className="text-sm text-[#94A3B8] max-w-xl mt-1">
              Synchronized AIS telemetry stream mapping commercial vessel vectors to optimized quay slots in real-time.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#94A3B8] bg-[#111E2E] px-4 py-2.5 rounded-xl border border-[rgba(56,189,248,0.15)]">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-ping" />
              <span>CHANNEL 16 MONITORING</span>
            </span>
            <span>•</span>
            <span className="text-[#38BDF8]">SGSIN PORT AUTHORITY</span>
          </div>
        </div>

        {/* SVG Animated Sea-Lanes Diagram */}
        <div className="relative rounded-2xl bg-[#0A1420]/80 border border-[rgba(56,189,248,0.2)] p-6 md:p-8 backdrop-blur-md shadow-2xl overflow-hidden">
          <svg
            className="w-full h-48 md:h-64 overflow-visible"
            viewBox="0 0 1000 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Graticule Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />
              </pattern>
              <linearGradient id="laneGrad1" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="1" />
              </linearGradient>
            </defs>

            <rect width="1000" height="240" fill="url(#grid)" />

            {/* Port Terminal Docking Quay (Right) */}
            <g transform="translate(860, 40)">
              <rect x="0" y="0" width="110" height="160" rx="8" fill="#111E2E" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="55" y="30" fill="#E2E8F0" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                QUAY TERMINAL
              </text>
              <text x="55" y="48" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                BERTHS B1-B8
              </text>
              {/* Individual Quay Slots */}
              {[70, 95, 120, 145].map((y, idx) => (
                <g key={idx}>
                  <rect x="10" y={y - 10} width="90" height="18" rx="4" fill="#1A2A3E" stroke="rgba(56,189,248,0.3)" />
                  <circle cx="20" cy={y - 1} r="3" fill={idx === 1 ? '#F472B6' : '#34D399'} />
                  <text x="30" y={y + 3} fill="#94A3B8" fontSize="8" fontFamily="JetBrains Mono">
                    SLOT 0{idx + 1} {idx === 1 ? '[OCCUPIED]' : '[READY]'}
                  </text>
                </g>
              ))}
            </g>

            {/* Animated Dashed Bezier Route 1 */}
            <motion.path
              d="M 50 40 C 250 20, 450 140, 850 70"
              stroke="url(#laneGrad1)"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              initial={{ pathLength: 0, strokeDashoffset: 100 }}
              whileInView={{ pathLength: 1, strokeDashoffset: 0 }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              viewport={{ once: true }}
            />

            {/* Animated Dashed Bezier Route 2 */}
            <motion.path
              d="M 50 120 C 300 180, 600 60, 850 120"
              stroke="#60A5FA"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeOpacity="0.6"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 3, ease: 'easeInOut', delay: 0.3 }}
              viewport={{ once: true }}
            />

            {/* Animated Dashed Bezier Route 3 */}
            <motion.path
              d="M 50 200 C 350 220, 650 190, 850 170"
              stroke="#818CF8"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeOpacity="0.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
              viewport={{ once: true }}
            />

            {/* Moving Vessel Markers on Route 1 */}
            <motion.g
              initial={{ offsetDistance: '0%' }}
              animate={{ offsetDistance: '100%' }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              style={{
                offsetPath: 'path("M 50 40 C 250 20, 450 140, 850 70")',
              }}
            >
              <circle cx="0" cy="0" r="10" fill="rgba(56, 189, 248, 0.2)" />
              <circle cx="0" cy="0" r="5" fill="#38BDF8" />
              <text x="12" y="4" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                EVER-GIVEN (14.2 knots)
              </text>
            </motion.g>

            <motion.g
              initial={{ offsetDistance: '0%' }}
              animate={{ offsetDistance: '100%' }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear', delay: 5 }}
              style={{
                offsetPath: 'path("M 50 120 C 300 180, 600 60, 850 120")',
              }}
            >
              <circle cx="0" cy="0" r="8" fill="rgba(96, 165, 250, 0.2)" />
              <circle cx="0" cy="0" r="4" fill="#60A5FA" />
              <text x="12" y="4" fill="#60A5FA" fontSize="9" fontFamily="JetBrains Mono">
                MAERSK-MCKINNEY (12.8 kts)
              </text>
            </motion.g>

            {/* Waypoint Nodes */}
            <g transform="translate(300, 75)">
              <circle cx="0" cy="0" r="6" fill="#111E2E" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="0" y="-12" fill="#94A3B8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                WP-ALPHA
              </text>
            </g>

            <g transform="translate(620, 115)">
              <circle cx="0" cy="0" r="6" fill="#111E2E" stroke="#818CF8" strokeWidth="1.5" />
              <text x="0" y="-12" fill="#94A3B8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                WP-BRAVO
              </text>
            </g>
          </svg>

          {/* Bottom Live Operations Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 mt-4 border-t border-[rgba(56,189,248,0.15)] text-xs font-mono">
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <Navigation className="w-4 h-4 text-[#38BDF8]" />
              <span>Approach Corridor: <strong className="text-[#E2E8F0]">CLEAR</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <Anchor className="w-4 h-4 text-[#818CF8]" />
              <span>Turnaround Speed: <strong className="text-[#34D399]">+22.4%</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <span className="w-2 h-2 rounded-full bg-[#34D399]" />
              <span>AIS Telemetry: <strong className="text-[#E2E8F0]">1.2s Sync</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <span className="w-2 h-2 rounded-full bg-[#F472B6]" />
              <span>Congestion Risk: <strong className="text-[#34D399]">LOW (1.4h)</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveOperationsBand;

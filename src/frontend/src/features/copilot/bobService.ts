import { ChatMessage, ExplainableAIInfo, CopilotActionChip } from './types';

export interface BobServiceResult {
  text: string;
  explanation: ExplainableAIInfo;
  actions: CopilotActionChip[];
}

/**
 * Mock IBM Bob AI Service
 * Simulates watsonx.ai inference with 1500ms delay and contextual keyword reasoning
 */
export const queryIbmBob = async (prompt: string): Promise<BobServiceResult> => {
  // Simulate API delay of 1500ms
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lower = prompt.toLowerCase();

  // 1. Berth query (e.g., "When will MV Ocean Star berth?")
  if (lower.includes('berth') || lower.includes('ocean star')) {
    return {
      text: `**MV Ocean Star** is currently assigned to **Berth B4** at Tuas Mega Terminal with an expected arrival of **04:30 Today**.\n\nHowever, due to a **4.6-hour tidal queue delay** and crane maintenance, DockNova predicts heavy bunching. It may be reassigned to **Berth B5** to avoid peak congestion.\n\nOperational telemetry summary:\n\`\`\`text\nVessel: MV Ocean Star (IMO 9845214)\nCurrent ETA: 04:30 UTC (+4.6h deviation)\nAssigned Quay: Berth B4 -> Recommend Realloc to Berth B5\nHandling Crane: C7 (Ready, 92% operational)\nTurnaround Optimization: +3.4 hours faster turnaround\n\`\`\`\n\n- **Recommendation**: Confirm early shift to Berth B5 before 18:00 local time.\n- **Fuel penalty**: Zero deviation fuel required.\n- **Demurrage saved**: Estimated **₹14,800** in vessel wait time.`,
      explanation: {
        modelName: 'IBM watsonx.ai Granite-13B Maritime',
        confidenceScore: 97,
        latencyMs: 1420,
        dataSources: [
          'Tuas Port AIS Telemetry Stream',
          'VTS Fairway Vessel Tracking',
          'Tide & Current Gauge #3',
          'Crane Maintenance Log API',
        ],
        reasoningSummary:
          'Berth B4 is experiencing queue saturation from incoming feeder traffic. Berth B5 has a free 6-hour window and Crane C7 is certified for post-panamax containers.',
      },
      actions: [
        { id: 'view-vessel', label: 'View Vessel Passport', actionType: 'navigate', targetPath: '/user/vessel/vessel-01' },
        { id: 'apply-route', label: 'Apply to Route', actionType: 'navigate', targetPath: '/user/routes' },
        { id: 'copy', label: 'Copy Response', actionType: 'copy' },
        { id: 'regenerate', label: 'Regenerate', actionType: 'regenerate' },
      ],
    };
  }

  // 2. Congestion query (e.g., "Explain why B4 risk is 94%")
  if (lower.includes('congestion') || lower.includes('94%') || lower.includes('b4 risk')) {
    return {
      text: `**Berth B4** is currently operating at **94% critical congestion risk** due to a convergence of 3 high-impact factors:\n\n1. **Overlapping Arrival Windows**: 3 container vessels are scheduled within a tight 90-minute window.\n2. **Reduced Crane Throughput**: Quay crane C3 is undergoing hydraulic servicing, cutting gross moves per hour by **33%** (down to 67% capacity).\n3. **Yard Ingress Bottleneck**: Feeder container stacks at Block 4-E are 88% full, restricting discharge speed.\n\nKey impact metrics:\n\`\`\`text\nPredicted Wait Time: 6.8h dwell / 4.6h delay\nQueue Density: 7 vessels queued in Tuas Anchorage\nDemurrage Liability: ₹18,500/day across active carriers\nRisk Trend: Escalating to 98% by 22:00 if unmitigated\n\`\`\`\n\nRecommended mitigation:\n- Diversion of secondary carriers to **Port of Tanjung Pelepas (PTP)** or **Berth B5**.\n- Fast-track priority discharging for high-reefer manifests.`,
      explanation: {
        modelName: 'IBM watsonx.ai Prescriptive Planner v3',
        confidenceScore: 94,
        latencyMs: 1530,
        dataSources: [
          'Port Authority Berth Allocation Matrix',
          'Terminal Operating System (TOS) Stacking Yard Data',
          'Tuas Quay Crane Telemetry Sensors',
        ],
        reasoningSummary:
          'Monte Carlo simulation across 1,000 arrival permutations shows a 94.2% probability of berthing queue exceeding 4 hours without immediate diversion.',
      },
      actions: [
        { id: 'view-route', label: 'Suggest Alternate Port', actionType: 'navigate', targetPath: '/user/routes' },
        { id: 'view-notifications', label: 'View Alert Center', actionType: 'navigate', targetPath: '/user/notifications' },
        { id: 'copy', label: 'Copy Analysis', actionType: 'copy' },
        { id: 'regenerate', label: 'Regenerate', actionType: 'regenerate' },
      ],
    };
  }

  // 3. Alternate port query (e.g., "Suggest alternate port for B4 congestion")
  if (lower.includes('alternate') || lower.includes('reroute') || lower.includes('port')) {
    return {
      text: `Based on live Malacca Strait AIS density and fairway queuing data, **Port of Tanjung Pelepas (PTP), Malaysia** is your optimal alternate port recommendation.\n\nComparative benefits:\n- **Berth Availability**: 3 berths immediately free with priority pilotage.\n- **Turnaround Advantage**: **18.2 hours faster** vessel turnaround vs Tuas Mega Terminal.\n- **Distance**: Only **28 Nautical Miles** deviation.\n\nFinancial & voyage impact:\n\`\`\`text\nAlternate Destination: Port of Tanjung Pelepas (MYTPP)\nBunker Fuel Penalty: +₹3,200 (Low-sulfur MGO)\nPort Tariffs Differential: -₹1,800 savings\nNet Cost-Benefit: +₹14,600 net savings after demurrage offset\nCarbon Footprint: Net -14.2% CO2 due to zero idle anchor burning\n\`\`\`\n\nWould you like to execute the diversion order and notify maritime traffic control?`,
      explanation: {
        modelName: 'IBM Bob Maritime Route Optimizer v2.4',
        confidenceScore: 98,
        latencyMs: 1480,
        dataSources: [
          'Regional Port Congestion Registry (Singapore/Malaysia/Thailand)',
          'Bunker Fuel Index (Rotterdam/Singapore Spot Rates)',
          'Fairway Weather & Hydrodynamic Current Feeds',
        ],
        reasoningSummary:
          'PTP has certified berth space for 14,000 TEU vessels with zero anchorage delay today, offsetting the 28 NM deviation fuel cost within 2 hours of berthing.',
      },
      actions: [
        { id: 'apply-route', label: 'Apply to Route Advisor', actionType: 'navigate', targetPath: '/user/routes' },
        { id: 'copy', label: 'Copy Plan', actionType: 'copy' },
        { id: 'regenerate', label: 'Regenerate', actionType: 'regenerate' },
      ],
    };
  }

  // 4. Delay report / general fleet impact
  if (lower.includes('report') || lower.includes('delay') || lower.includes('impact')) {
    return {
      text: `**Fleet Delay & Impact Analysis Report** (Generated for active fleet):\n\n- **Total Monitored Fleet**: 12 vessels in regional waters.\n- **Vessels Facing Delays (>1h)**: 3 vessels (**MSC Marina Blue**, **MV Nova Horizon**, **Ever Given Alpha**).\n- **Fleet Average Delay**: **2.4 hours**.\n\nCritical observations:\n\`\`\`text\n1. MSC Marina Blue: +4.6h delay (Tuas congestion) -> Reroute Recommended\n2. MV Nova Horizon: +2.1h delay (Fairway fog speed reduction) -> Normal Recovery\n3. Ever Given Alpha: +1.8h delay (Pilotage backlog) -> ETA 14:00 Sep 15\n\`\`\`\n\n- **Weather Advisory**: Fairway visibility improving over the next 6 hours.\n- **Recommendation**: Coordinate bunkering operations during port stay to avoid double mooring.`,
      explanation: {
        modelName: 'IBM watsonx.ai Fleet Analytics Engine',
        confidenceScore: 95,
        latencyMs: 1390,
        dataSources: [
          'Fleet Telemetry AIS Transponders',
          'Port Meteorological Oceanography Radar',
          'Vessel Engine RPM & Fuel Consumption Sensors',
        ],
        reasoningSummary:
          'Aggregated telemetry from 12 carriers indicates that 75% of delays originate from port-side berth congestion rather than open-sea navigation.',
      },
      actions: [
        { id: 'view-routes', label: 'Open Alternate Routing', actionType: 'navigate', targetPath: '/user/routes' },
        { id: 'copy', label: 'Copy Report', actionType: 'copy' },
        { id: 'regenerate', label: 'Regenerate', actionType: 'regenerate' },
      ],
    };
  }

  // Fallback / General Query
  return {
    text: `I'm analyzing your port data and AIS fleet telemetry. Here is what I can assist you with right now:\n\n- **Berthing & Quayside Logistics**: Ask *"When will MV Ocean Star berth?"* to evaluate berth assignment and quay crane availability.\n- **Congestion Root Cause**: Ask *"Explain why B4 risk is 94%"* for AI diagnostic breakdown of terminal bottlenecks.\n- **Alternate Route Optimization**: Ask *"Suggest alternate port for B4 congestion"* to compare detour fuel, port fees, and turnaround savings.\n- **Fleet Impact**: Ask *"Generate delay impact report"* for fleet-wide delay summaries.\n\nCould you specify which vessel, port, or terminal metric you would like to inspect?`,
    explanation: {
      modelName: 'IBM watsonx.ai Conversational Orchestrator',
      confidenceScore: 92,
      latencyMs: 1450,
      dataSources: ['DockNova Core Fleet Database', 'IBM watsonx Knowledge Base'],
      reasoningSummary: 'Generic query detected. Generated contextual capability recommendations based on active fleet state.',
    },
    actions: [
      { id: 'copy', label: 'Copy Response', actionType: 'copy' },
      { id: 'regenerate', label: 'Regenerate', actionType: 'regenerate' },
    ],
  };
};

/**
 * Initial demo chat session pre-populated with realistic conversation
 */
export const INITIAL_DEMO_SESSIONS: Array<{
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  messages: ChatMessage[];
}> = [
  {
    id: 'session-berth-b4',
    title: 'Berth B4 Congestion Analysis',
    preview: 'Explain why B4 risk is 94%...',
    updatedAt: 'Just now',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        text: 'Explain why Berth B4 risk is at 94% right now and what is causing the bottleneck.',
        timestamp: '14:20',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        text: `**Berth B4** is currently operating at **94% critical congestion risk** due to a convergence of 3 high-impact factors:\n\n1. **Overlapping Arrival Windows**: 3 container vessels are scheduled within a tight 90-minute window.\n2. **Reduced Crane Throughput**: Quay crane C3 is undergoing hydraulic servicing, cutting gross moves per hour by **33%** (down to 67% capacity).\n3. **Yard Ingress Bottleneck**: Feeder container stacks at Block 4-E are 88% full, restricting discharge speed.\n\nKey impact metrics:\n\`\`\`text\nPredicted Wait Time: 6.8h dwell / 4.6h delay\nQueue Density: 7 vessels queued in Tuas Anchorage\nDemurrage Liability: ₹18,500/day across active carriers\nRisk Trend: Escalating to 98% by 22:00 if unmitigated\n\`\`\`\n\nRecommended mitigation:\n- Diversion of secondary carriers to **Port of Tanjung Pelepas (PTP)** or **Berth B5**.\n- Fast-track priority discharging for high-reefer manifests.`,
        timestamp: '14:21',
        explanation: {
          modelName: 'IBM watsonx.ai Prescriptive Planner v3',
          confidenceScore: 94,
          latencyMs: 1530,
          dataSources: [
            'Port Authority Berth Allocation Matrix',
            'Terminal Operating System (TOS) Stacking Yard Data',
            'Tuas Quay Crane Telemetry Sensors',
          ],
          reasoningSummary:
            'Monte Carlo simulation across 1,000 arrival permutations shows a 94.2% probability of berthing queue exceeding 4 hours without immediate diversion.',
        },
        actions: [
          { id: 'view-route', label: 'Suggest Alternate Port', actionType: 'navigate', targetPath: '/user/routes' },
          { id: 'copy', label: 'Copy Analysis', actionType: 'copy' },
          { id: 'regenerate', label: 'Regenerate', actionType: 'regenerate' },
        ],
      },
    ],
  },
  {
    id: 'session-ocean-star',
    title: 'MV Ocean Star Berthing Window',
    preview: 'When will MV Ocean Star berth?...',
    updatedAt: '2h ago',
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        text: 'When will MV Ocean Star berth?',
        timestamp: '12:15',
      },
      {
        id: 'msg-4',
        role: 'assistant',
        text: `**MV Ocean Star** is currently assigned to **Berth B4** at Tuas Mega Terminal with an expected arrival of **04:30 Today**.\n\nHowever, due to a **4.6-hour tidal queue delay** and crane maintenance, DockNova predicts heavy bunching. It may be reassigned to **Berth B5** to avoid peak congestion.\n\n\`\`\`text\nVessel: MV Ocean Star (IMO 9845214)\nCurrent ETA: 04:30 UTC (+4.6h deviation)\nAssigned Quay: Berth B4 -> Recommend Realloc to Berth B5\nHandling Crane: C7 (Ready, 92% operational)\n\`\`\`\n\n- **Recommendation**: Confirm early shift to Berth B5 before 18:00 local time.`,
        timestamp: '12:16',
        explanation: {
          modelName: 'IBM watsonx.ai Granite-13B Maritime',
          confidenceScore: 97,
          latencyMs: 1420,
          dataSources: ['Tuas Port AIS Stream', 'Crane Maintenance Log API'],
          reasoningSummary: 'Berth B5 has an open window with Crane C7 ready.',
        },
        actions: [
          { id: 'view-vessel', label: 'View Vessel Passport', actionType: 'navigate', targetPath: '/user/vessel/vessel-01' },
          { id: 'copy', label: 'Copy Response', actionType: 'copy' },
        ],
      },
    ],
  },
  {
    id: 'session-alternate-port',
    title: 'PTP Reroute Evaluation',
    preview: 'Suggest alternate port for B4 congestion...',
    updatedAt: 'Yesterday',
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        text: 'Suggest alternate port for B4 congestion',
        timestamp: 'Yesterday 17:40',
      },
      {
        id: 'msg-6',
        role: 'assistant',
        text: `Based on live Malacca Strait AIS density, **Port of Tanjung Pelepas (PTP), Malaysia** is your optimal alternate port recommendation.\n\n- **Berth Availability**: 3 berths immediately free.\n- **Turnaround Advantage**: **18.2 hours faster** vessel turnaround vs Tuas.\n- **Net Cost-Benefit**: **+₹14,600 net savings** after fuel and port fee reconciliation.`,
        timestamp: 'Yesterday 17:41',
        actions: [
          { id: 'apply-route', label: 'Apply to Route Advisor', actionType: 'navigate', targetPath: '/user/routes' },
          { id: 'copy', label: 'Copy Plan', actionType: 'copy' },
        ],
      },
    ],
  },
];

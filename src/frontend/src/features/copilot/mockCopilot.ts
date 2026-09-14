/**
 * DockNova - AI Port Copilot
 * Mock data + mock response engine (frontend-only)
 *
 * Design principle: OBSERVE -> EXPLAIN -> RECOMMEND -> SIMULATE -> ACT
 * Every response should reference concrete DockNova operational data,
 * never generic conversational filler.
 */

export interface CopilotContext {
  currentCongestion: string;
  criticalBerth: string;
  vesselsAtRisk: number;
  craneAvailability: string;
  planningHorizon: string;
}

export const MOCK_COPILOT_CONTEXT: CopilotContext = {
  currentCongestion: '68%',
  criticalBerth: 'B4',
  vesselsAtRisk: 4,
  craneAvailability: '67%',
  planningHorizon: '72 hours',
};

export type CopilotActionId =
  | 'view_berth_b4'
  | 'view_vessel_ocean_star'
  | 'run_what_if'
  | 'open_plan72h';

export interface CopilotAction {
  id: CopilotActionId;
  label: string;
}

export interface CopilotMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  actions?: CopilotAction[];
}

export const COPILOT_QUICK_PROMPTS: string[] = [
  'Why is B4 at risk?',
  'What should we do about MV Ocean Star?',
  'Show the biggest risk in the next 24 hours',
  'Summarise the 72-hour plan',
  'What happens if B4 reaches 100%?',
];

export const COPILOT_WELCOME_TITLE = "Good morning. I'm DockNova Copilot.";
export const COPILOT_WELCOME_BODY =
  'I can help you understand congestion risks, vessel delays, berth utilisation, crane availability, and the 72-hour operational plan.';

interface MockResponseEntry {
  match: (q: string) => boolean;
  response: string;
  actions?: CopilotAction[];
}

const MOCK_RESPONSES: MockResponseEntry[] = [
  {
    match: (q) => q.includes('why is b4') || q.includes('b4 at risk') || (q.includes('b4') && q.includes('risk')),
    response:
      'B4 is at high risk because utilisation is already at 94%, three vessel arrivals overlap within the next 18 hours, and crane availability may fall to 67%. Without intervention, predicted congestion risk could rise to 84%.',
    actions: [
      { id: 'view_berth_b4', label: 'View Berth B4' },
      { id: 'run_what_if', label: 'Run What-If' },
    ],
  },
  {
    match: (q) => q.includes('ocean star'),
    response:
      'DockNova recommends moving MV Ocean Star from B4 to B5 and assigning Crane C7. The simulated result reduces expected delay from 4.6 hours to 1.2 hours and congestion risk from 68% to 42%.',
    actions: [
      { id: 'view_vessel_ocean_star', label: 'View MV Ocean Star' },
      { id: 'run_what_if', label: 'Run What-If' },
    ],
  },
  {
    match: (q) => q.includes('biggest risk') || (q.includes('24 hour') && q.includes('risk')),
    response:
      'Berth B4 is the highest-risk location. Predicted peak utilisation is 94% within 18 hours, driven by overlapping vessel arrivals and limited crane availability.',
    actions: [
      { id: 'view_berth_b4', label: 'View Berth B4' },
      { id: 'open_plan72h', label: 'Open 72-Hour Plan' },
    ],
  },
  {
    match: (q) => q.includes('summarise') || q.includes('summarize') || q.includes('72-hour plan') || q.includes('72 hour plan'),
    response:
      'The next 72 hours focus on relieving B4, maintaining crane availability above safe levels, sequencing incoming vessels, and preventing the current delay from propagating into yard and gate operations.',
    actions: [
      { id: 'open_plan72h', label: 'Open 72-Hour Plan' },
    ],
  },
  {
    match: (q) => q.includes('100%') || (q.includes('b4') && q.includes('reaches')),
    response:
      'If B4 reaches 100% utilisation, incoming vessels would need to queue offshore, predicted delay would extend beyond 6 hours per vessel, and congestion risk would likely propagate to B3 and the adjacent yard blocks. DockNova recommends acting now while the reassignment window is still open.',
    actions: [
      { id: 'view_berth_b4', label: 'View Berth B4' },
      { id: 'run_what_if', label: 'Run What-If' },
    ],
  },
];

const DEFAULT_RESPONSE: MockResponseEntry = {
  match: () => true,
  response:
    "I can help with congestion, vessels, berths, cranes, delays, and the 72-hour plan. Try asking why B4 is at risk, what to do about MV Ocean Star, or to summarise the 72-hour plan.",
  actions: [
    { id: 'open_plan72h', label: 'Open 72-Hour Plan' },
  ],
};

export const getMockCopilotResponse = (question: string): { text: string; actions?: CopilotAction[] } => {
  const normalised = question.trim().toLowerCase();
  const entry = MOCK_RESPONSES.find((e) => e.match(normalised)) ?? DEFAULT_RESPONSE;
  return { text: entry.response, actions: entry.actions };
};

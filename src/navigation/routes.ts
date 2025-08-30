// ----------------------------------------------------------------------------
// Purpose: single source of truth for route names (tabs & nested stacks).
// ----------------------------------------------------------------------------
export const TABS = {
  HOME: 'Home',
  PRE_MATCH: 'PreMatch',
  LIVE_SCORE: 'LiveScore', // <-- the tab that contains the live scoring screen
  POST_MATCH: 'PostMatch',
  SCORE: 'Score',
} as const;

export const LIVE_SCORE_STACK = {
  LIVE_SCORING: 'LiveScoring', // <-- the actual screen component inside the LiveScore tab
} as const;

export type TabRoute = (typeof TABS)[keyof typeof TABS];
export type LiveScoreStackRoute = (typeof LIVE_SCORE_STACK)[keyof typeof LIVE_SCORE_STACK];

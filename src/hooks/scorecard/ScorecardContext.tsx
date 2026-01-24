import React from 'react'
import type { ScorecardState } from '../../services/scorecardStorage'

const DEFAULT_STATE: ScorecardState = {
	players: [],
	rounds: [1],
}
export type ScorecardContextValue = {
	state: ScorecardState
	setState: React.Dispatch<React.SetStateAction<ScorecardState>>
	resetState: () => void
}

export const defaultScorecardContextValue: ScorecardContextValue = {
	state: DEFAULT_STATE,
	setState: () => {},
	resetState: () => {},
}

export const ScorecardContext = React.createContext<ScorecardContextValue>(
	defaultScorecardContextValue
)

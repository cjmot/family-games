import { useContext } from 'react'
import { ScorecardContext } from './ScorecardContext'

export function useScorecardState() {
	const ctx = useContext(ScorecardContext)
	if (!ctx) {
		throw new Error('useScorecardState must be used within a ScorecardProvider')
	}
	return ctx
}

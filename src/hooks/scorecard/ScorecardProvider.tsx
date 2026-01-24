import { useEffect, useState, type ReactNode } from 'react'
import { ScorecardContext } from './ScorecardContext'
import { scorecardStorage, type ScorecardState } from '../../services/scorecardStorage'

const DEFAULT_STATE: ScorecardState = {
	players: [],
	rounds: [1],
}

export function ScorecardProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<ScorecardState>(() => scorecardStorage.load(DEFAULT_STATE))

	// Persist on any change
	useEffect(() => {
		scorecardStorage.save(state)
	}, [state])

	// Optional: sync across tabs/windows
	useEffect(() => {
		const onStorage = (e: StorageEvent) => {
			if (e.key !== scorecardStorage.key) return
			setState(scorecardStorage.load(DEFAULT_STATE))
		}

		window.addEventListener('storage', onStorage)
		return () => window.removeEventListener('storage', onStorage)
	}, [])

	const resetState = () => setState(DEFAULT_STATE)

	return (
		<ScorecardContext.Provider value={{ state, setState, resetState }}>
			{children}
		</ScorecardContext.Provider>
	)
}

import { useEffect, useMemo, useState } from 'react'
import { createScorecardStorage, type ScorecardState } from '../../services/scorecardStorage.ts'

const createDefaultState = (): ScorecardState => ({ players: [], rounds: [1] })

export function usePersistentScorecard(storageKey: string) {
	const storage = useMemo(() => createScorecardStorage(storageKey), [storageKey])
	const [state, setState] = useState<ScorecardState>(() => storage.load(createDefaultState()))

	useEffect(() => {
		storage.save(state)
	}, [state, storage])

	useEffect(() => {
		const handleStorage = (event: StorageEvent) => {
			if (event.key === storage.key) setState(storage.load(createDefaultState()))
		}
		window.addEventListener('storage', handleStorage)
		return () => window.removeEventListener('storage', handleStorage)
	}, [storage])

	return {
		state,
		setState,
		resetState: () => setState(createDefaultState()),
	}
}

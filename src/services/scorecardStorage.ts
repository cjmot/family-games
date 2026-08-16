import type { Player } from '../games/types'

export type ScorecardState = {
	players: Player[]
	rounds: number[] // e.g. [1,2,3]
}

export const GOLF_SCORECARD_KEY = 'golfScorecard.state.v1'
export const GENERIC_SCORECARD_KEY = 'familyGames.scorecard.generic.v1'

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}

function isNumberArray(value: unknown): value is number[] {
	return Array.isArray(value) && value.every((number) => typeof number === 'number')
}

function isScoreArray(value: unknown): value is Array<number | null> {
	return (
		Array.isArray(value) &&
		value.every(
			(score) => score === null || (typeof score === 'number' && Number.isFinite(score))
		)
	)
}

function isPlayer(value: unknown): value is Player {
	if (!isRecord(value)) return false
	return (
		typeof value.id === 'string' && typeof value.name === 'string' && isScoreArray(value.scores)
	)
}

function isScorecardState(value: unknown): value is ScorecardState {
	if (!isRecord(value)) return false
	return (
		isNumberArray(value.rounds) && Array.isArray(value.players) && value.players.every(isPlayer)
	)
}

/**
 * Normalize players so scores length matches rounds length.
 * This prevents mismatches if data changes over time.
 */
function normalize(state: ScorecardState): ScorecardState {
	const roundsLen = state.rounds.length

	const players = state.players.map((p) => {
		const id = p.id.length > 0 ? p.id : crypto.randomUUID()
		const scores = [...p.scores]

		if (scores.length < roundsLen) {
			while (scores.length < roundsLen) scores.push(null)
		} else if (scores.length > roundsLen) {
			scores.splice(roundsLen)
		}

		return { ...p, id, scores }
	})

	return { ...state, players }
}

export function createScorecardStorage(key: string) {
	return {
		key,

		load(fallback: ScorecardState): ScorecardState {
			try {
				const raw = localStorage.getItem(key)
				if (!raw) return fallback

				const parsed = JSON.parse(raw)
				if (!isScorecardState(parsed)) return fallback

				// Also sanity-check rounds (must be 1..n increasing)
				const rounds = parsed.rounds.length > 0 ? parsed.rounds.map((_, i) => i + 1) : [1]

				return normalize({ players: parsed.players, rounds })
			} catch {
				return fallback
			}
		},

		save(state: ScorecardState): void {
			try {
				localStorage.setItem(key, JSON.stringify(state))
			} catch {
				// Ignore quota and private-mode errors.
			}
		},

		clear(): void {
			try {
				localStorage.removeItem(key)
			} catch {
				// Ignore private-mode and storage access errors.
			}
		},
	}
}

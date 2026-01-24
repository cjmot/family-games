import type { Player } from '../games/types' // <-- adjust

export type ScorecardState = {
	players: Player[]
	rounds: number[] // e.g. [1,2,3]
}

const KEY = 'golfScorecard.state.v1'

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}

function isNumberArray(value: unknown): value is number[] {
	return Array.isArray(value) && value.every((n) => typeof n === 'number')
}

function isPlayer(value: unknown): value is Player {
	if (!isRecord(value)) return false
	return typeof value.name === 'string' && isNumberArray(value.scores)
}

function isScorecardState(value: unknown): value is ScorecardState {
	if (!isRecord(value)) return false
	return isNumberArray(value.rounds) && Array.isArray(value.players) && value.players.every(isPlayer)
}

/**
 * Normalize players so scores length matches rounds length.
 * This prevents mismatches if data changes over time.
 */
function normalize(state: ScorecardState): ScorecardState {
	const roundsLen = state.rounds.length

	const players = state.players.map((p) => {
		const scores = [...p.scores]

		if (scores.length < roundsLen) {
			while (scores.length < roundsLen) scores.push(0)
		} else if (scores.length > roundsLen) {
			scores.splice(roundsLen)
		}

		return { ...p, scores }
	})

	return { ...state, players }
}

export const scorecardStorage = {
	key: KEY,

	load(fallback: ScorecardState): ScorecardState {
		try {
			const raw = localStorage.getItem(KEY)
			if (!raw) return fallback

			const parsed = JSON.parse(raw)
			if (!isScorecardState(parsed)) return fallback

			// Also sanity-check rounds (must be 1..n increasing)
			const rounds = parsed.rounds.length > 0 ? parsed.rounds.map((_, i) => i + 1) : []

			return normalize({ players: parsed.players, rounds })
		} catch {
			return fallback
		}
	},

	save(state: ScorecardState): void {
		try {
			localStorage.setItem(KEY, JSON.stringify(state))
		} catch {
			// ignore quota/private-mode errors
		}
	},

	clear(): void {
		try {
			localStorage.removeItem(KEY)
		} catch {}
	},
}

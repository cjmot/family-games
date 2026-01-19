import type { GameDefinition } from '../types.ts'
import GolfScorecard from './GolfScorecard.tsx'
import { golfRules } from './storage.ts'

export const GOLF: GameDefinition = {
	id: 'golf',
	name: 'Golf',
	minPlayers: 3,
	maxPlayers: 6,
	description: 'Card game with a standard deck — lowest score wins',
	rules: golfRules,
	Scorecard: GolfScorecard,
}

import type { ComponentType } from 'react'

export interface GameDefinition {
	id: string
	name: string
	minPlayers: number
	maxPlayers: number
	description?: string
	rules: string
	Scorecard: ComponentType
}

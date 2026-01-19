// src/games/index.ts
import { GOLF } from './golf/meta'

export const games = [GOLF]

export const gamesById = Object.fromEntries(games.map((game) => [game.id, game]))
export const findGamesByName = (name: string) => {
	return games.find((game) => game.name === name)
}

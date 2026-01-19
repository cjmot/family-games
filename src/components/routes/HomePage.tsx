import { BlockTitle, List, ListItem } from 'konsta/react'
import { games } from '../../games'

export default function HomePage() {
	return (
		<>
			<BlockTitle>Choose a Game</BlockTitle>

			<List strong inset>
				{games.map((game) => (
					<ListItem
						key={game.id}
						link
						title={game.name}
						after={`${game.minPlayers}–${game.maxPlayers} players`}
						href={`/family-games/games/${game.id}`}
					/>
				))}
			</List>
		</>
	)
}

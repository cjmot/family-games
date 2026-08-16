import { Link } from 'react-router-dom'
import { games } from '../../games'

export default function HomePage() {
	return (
		<main className="home-page">
			<h1 className="page-title">Choose a Game</h1>

			<ul className="game-list">
				{games.map((game) => (
					<li key={game.id}>
						<Link className="game-list__link" to={`/family-games/games/${game.id}`}>
							<span className="game-list__name">{game.name}</span>
							<span className="game-list__meta">
								{game.minPlayers}–{game.maxPlayers} players
								<span aria-hidden="true" className="game-list__chevron">
									›
								</span>
							</span>
						</Link>
					</li>
				))}
			</ul>
		</main>
	)
}

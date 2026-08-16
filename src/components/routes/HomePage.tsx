import { Link } from 'react-router-dom'
import { games } from '../../games'
import { useState } from 'react'
import {
	createScorecardStorage,
	GENERIC_SCORECARD_KEY,
	GOLF_SCORECARD_KEY,
	type ScorecardState,
} from '../../services/scorecardStorage.ts'
import { loadGenericScorecardSettings } from '../../services/genericScorecardSettings.ts'

const EMPTY_SCORECARD: ScorecardState = { players: [], rounds: [1] }

export default function HomePage() {
	const [sessions] = useState(() => {
		const generic = createScorecardStorage(GENERIC_SCORECARD_KEY).load(EMPTY_SCORECARD)
		const golf = createScorecardStorage(GOLF_SCORECARD_KEY).load(EMPTY_SCORECARD)
		const genericSettings = loadGenericScorecardSettings()

		return [
			{
				id: 'generic',
				title: genericSettings.title,
				href: '/family-games/scorecard',
				state: generic,
			},
			{ id: 'golf', title: 'Golf', href: '/family-games/games/golf', state: golf },
		].filter((session) => session.state.players.length > 0)
	})

	return (
		<main className="home-page">
			<h1 className="page-title">Home</h1>

			<Link className="quick-scorecard-card" to="/family-games/scorecard">
				<span className="quick-scorecard-card__icon" aria-hidden="true">
					＋
				</span>
				<span>
					<strong>Quick Scorecard</strong>
					<small>Keep score for any game</small>
				</span>
				<b aria-hidden="true">›</b>
			</Link>

			{sessions.length > 0 && (
				<section className="home-section">
					<h2>Continue Playing</h2>
					<div className="session-list">
						{sessions.map((session) => (
							<Link key={session.id} to={session.href}>
								<span>
									<strong>{session.title}</strong>
									<small>
										{session.state.players.length}{' '}
										{session.state.players.length === 1 ? 'player' : 'players'}{' '}
										· Round {session.state.rounds.at(-1) ?? 1}
									</small>
								</span>
								<b aria-hidden="true">›</b>
							</Link>
						))}
					</div>
				</section>
			)}

			<section className="home-section">
				<h2>Choose a Game</h2>

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
			</section>
		</main>
	)
}

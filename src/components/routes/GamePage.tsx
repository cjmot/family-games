import type { GameDefinition } from '../../games/types.ts'
import { useState } from 'react'
import Rules from '../Rules.tsx'

interface Props {
	game: GameDefinition
}

export default function GamePage({ game }: Props) {
	const [segmentActive, setSegmentActive] = useState<'rules' | 'scorecard'>('rules')

	return (
		<div className="game-page">
			<header className="game-header flex flex-col px-4 pt-6 items-center w-full">
				<h1 className="page-title">{game.name.toUpperCase()}</h1>

				<div className="segmented-control" role="tablist" aria-label={`${game.name} view`}>
					<button
						className="segmented-control__button"
						aria-selected={segmentActive === 'rules'}
						role="tab"
						onClick={() => setSegmentActive('rules')}
					>
						Rules
					</button>
					<button
						className="segmented-control__button"
						aria-selected={segmentActive === 'scorecard'}
						role="tab"
						onClick={() => setSegmentActive('scorecard')}
					>
						Scorecard
					</button>
				</div>
			</header>

			<main className="game-content">
				{segmentActive === 'rules' && <Rules rules={game.rules} />}
				{segmentActive === 'scorecard' && <game.Scorecard />}
			</main>
		</div>
	)
}

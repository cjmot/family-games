import { useEffect, useState } from 'react'
import Scorecard from '../scorecard/Scorecard.tsx'
import { GENERIC_SCORECARD_KEY } from '../../services/scorecardStorage.ts'
import {
	loadGenericScorecardSettings,
	saveGenericScorecardSettings,
} from '../../services/genericScorecardSettings.ts'

export default function GenericScorecardPage() {
	const [settings, setSettings] = useState(loadGenericScorecardSettings)
	const roundLabel = settings.roundLabel.trim() || 'Round'

	useEffect(() => {
		saveGenericScorecardSettings(settings)
	}, [settings])

	return (
		<div className="game-page generic-scorecard-page">
			<header className="game-header flex flex-col px-4 pt-6 items-center w-full">
				<h1 className="page-title">{settings.title.trim() || 'Quick Scorecard'}</h1>
			</header>
			<main className="game-content">
				<details className="generic-scorecard-settings">
					<summary>Scorecard settings</summary>
					<div>
						<label>
							<span>Name</span>
							<input
								className="app-input"
								value={settings.title}
								onChange={(event) =>
									setSettings((previous) => ({
										...previous,
										title: event.target.value,
									}))
								}
							/>
						</label>
						<label>
							<span>Winner</span>
							<select
								value={settings.scoringDirection}
								onChange={(event) =>
									setSettings((previous) => ({
										...previous,
										scoringDirection:
											event.target.value === 'lowest' ? 'lowest' : 'highest',
									}))
								}
							>
								<option value="highest">Highest score wins</option>
								<option value="lowest">Lowest score wins</option>
							</select>
						</label>
						<label>
							<span>Round name</span>
							<input
								className="app-input"
								value={settings.roundLabel}
								onChange={(event) =>
									setSettings((previous) => ({
										...previous,
										roundLabel: event.target.value,
									}))
								}
							/>
						</label>
					</div>
				</details>

				<Scorecard
					storageKey={GENERIC_SCORECARD_KEY}
					scoringDirection={settings.scoringDirection}
					roundLabel={roundLabel}
					quickScores={[0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 100]}
				/>
			</main>
		</div>
	)
}

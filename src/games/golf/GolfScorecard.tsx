import Scorecard from '../../components/scorecard/Scorecard.tsx'
import { GOLF_SCORECARD_KEY } from '../../services/scorecardStorage.ts'

export default function GolfScorecard() {
	return (
		<Scorecard
			storageKey={GOLF_SCORECARD_KEY}
			scoringDirection="lowest"
			roundLabel="Round"
			quickScores={[-2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
		/>
	)
}

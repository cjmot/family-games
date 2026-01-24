import { Table, TableHead, TableRow, TableCell, TableBody, Block, Button, Card } from 'konsta/react'
import { useMemo, useState } from 'react'
import PlayersDialog from '../../components/PlayersDialog'
import ScoreDialog from '../../components/ScoreDialog.tsx'
import { useScorecardState } from '../../hooks/scorecard/useScorecardState'

export default function GolfScorecard() {
	const { state, setState } = useScorecardState()

	const [scoreToChange, setScoreToChange] = useState<{
		playerName: string
		round: number
		prevScore: number
	} | null>(null)

	const [playersModalOpen, setPlayersModalOpen] = useState(false)

	const sortedPlayers = useMemo(
		() => [...state.players].sort((a, b) => a.name.localeCompare(b.name)),
		[state.players]
	)

	const setPlayerScore = (name: string, round: number, score: number) => {
		setState((prev) => {
			const roundIndex = round - 1
			return {
				...prev,
				players: prev.players.map((p) => {
					if (p.name !== name) return p
					const scores = [...p.scores]
					if (roundIndex >= scores.length) {
						const targetLen = Math.max(roundIndex + 1, prev.rounds.length)
						while (scores.length < targetLen) scores.push(0)
					}
					scores[roundIndex] = score
					return { ...p, scores }
				}),
			}
		})
	}

	const addRound = () => {
		setState((prev) => {
			return {
				...prev,
				rounds: [...prev.rounds, prev.rounds.length + 1],
			}
		})
		setState((prev) => {
			return {
				...prev,
				players: prev.players.map((p) => ({
					...p,
					scores: [...p.scores, 0],
				})),
			}
		})
	}

	const removeRound = () => {
		setState((prev) => {
			return { ...prev, rounds: prev.rounds.slice(0, -1) }
		})
		setState((prev) => {
			return {
				...prev,
				players: prev.players.map((p) => ({ ...p, scores: p.scores.slice(0, -1) })),
			}
		})
	}

	return (
		<div className="h-full w-full">
			<Card className="overflow-x-auto">
				<Button roundedIos onClick={() => setPlayersModalOpen(true)}>
					Add Player
				</Button>
				<Table className="overflow-auto">
					<TableHead>
						<TableRow header>
							<TableCell header className="text-right"></TableCell>
							{sortedPlayers.map((player) => (
								<TableCell key={player.name} className="text-center">
									{player.name}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{state.rounds.map((round) => (
							<TableRow key={round}>
								<TableCell
									header
									key={`round-${round}`}
									className="text-left font-semibold"
								>
									{round}
								</TableCell>
								{sortedPlayers.map((player) => (
									<TableCell
										key={`${player.name}-round-${round}`}
										className="text-center"
									>
										<button
											onClick={() => {
												setScoreToChange({
													playerName: player.name,
													round: round,
													prevScore: player.scores[round - 1],
												})
												console.log('double pressed')
											}}
										>
											{player.scores[round - 1]}
										</button>
									</TableCell>
								))}
							</TableRow>
						))}
						<TableRow key="totals" hidden={state.rounds.length === 0}>
							<TableCell header key="totals-header">
								Totals
							</TableCell>
							{sortedPlayers.map((player) => (
								<TableCell
									key={player.name + '-total'}
									className="text-center font-bold"
								>
									{player.scores.reduce((a, b) => a + b, 0)}
								</TableCell>
							))}
						</TableRow>
					</TableBody>
				</Table>
			</Card>
			<Block className="w-full flex flex-col space-y-4">
				<Button roundedIos onClick={() => addRound()}>
					Add Round
				</Button>
				<Button
					roundedIos
					outline
					onClick={() => removeRound()}
					disabled={state.rounds.length === 0}
				>
					Remove Round
				</Button>
			</Block>
			<Block className="w-full flex space-x-4">
				<p>
					<i>Tap on a score to change it</i>
				</p>
			</Block>

			<PlayersDialog
				sheetOpened={playersModalOpen}
				onClose={(name) => {
					setPlayersModalOpen(false)
					if (name) {
						setState((prev) => {
							return {
								...prev,
								players: [
									...prev.players,
									{ name, scores: Array(state.rounds.length).fill(0) },
								],
							}
						})
					}
				}}
			/>
			{scoreToChange !== null && (
				<ScoreDialog
					key={`${scoreToChange.playerName}-${scoreToChange.round}-${scoreToChange.prevScore}`}
					sheetOpened={!!scoreToChange}
					prevScore={scoreToChange.prevScore}
					onClose={(newScore) => {
						const st = scoreToChange
						setScoreToChange(null)
						if (st && newScore !== undefined && newScore !== st.prevScore) {
							setPlayerScore(st.playerName, st.round, newScore)
						}
					}}
				/>
			)}
		</div>
	)
}

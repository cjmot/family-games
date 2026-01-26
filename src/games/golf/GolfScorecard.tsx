import { Table, TableHead, TableRow, TableCell, TableBody, Block, Button, Card } from 'konsta/react'
import { useMemo, useState } from 'react'
import AddPlayersDialog from '../../components/AddPlayersDialog.tsx'
import ChangePlayerDialog from '../../components/ChangePlayerDialog'
import ScoreDialog from '../../components/ScoreDialog.tsx'
import { useScorecardState } from '../../hooks/scorecard/useScorecardState'
import type { Player } from '../types.ts'

export default function GolfScorecard() {
	const { state, setState, resetState } = useScorecardState()

	const [scoreToChange, setScoreToChange] = useState<{
		playerId: string
		round: number
		prevScore: number
	} | null>(null)

	const [playerToChange, setPlayerToChange] = useState<Player | null>(null)

	const [playersModalOpen, setPlayersModalOpen] = useState(false)

	const sortedPlayers = useMemo(
		() => [...state.players].sort((a, b) => a.name.localeCompare(b.name)),
		[state.players]
	)

	const setPlayerScore = (id: string, round: number, score: number) => {
		setState((prev) => {
			const roundIndex = round - 1
			return {
				...prev,
				players: prev.players.map((p) => {
					if (p.id !== id) return p
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

	const addPlayer = (name: string) => {
		setState((prev) => {
			return {
				...prev,
				players: [
					...prev.players,
					{
						id: crypto.randomUUID(),
						name: name,
						scores: Array(state.rounds.length).fill(0),
					},
				],
			}
		})
	}

	const changePlayerName = (id: string, newName: string) => {
		setState((prev) => {
			return {
				...prev,
				players: prev.players.map((p) => {
					if (p.id !== id) return p
					return { ...p, name: newName }
				}),
			}
		})
	}

	const clearScores = () => {
		setState((prev) => {
			return {
				players: prev.players.map((p) => ({
					...p,
					scores: [0],
				})),
				rounds: [1],
			}
		})
	}

	const removePlayer = (id: string) => {
		setState((prev) => {
			return {
				...prev,
				players: prev.players.filter((p) => p.id !== id),
			}
		})
	}

	return (
		<div className="h-full w-full">
			<div className="flex space-x-2">
				<Button roundedIos onClick={() => setPlayersModalOpen(true)}>
					Add Player
				</Button>
				<Button roundedIos onClick={() => addRound()}>
					Add Round
				</Button>
			</div>
			<Card className="overflow-auto">
				<Table className="overflow-x-auto">
					<TableHead>
						<TableRow header>
							{sortedPlayers.map((player) => (
								<TableCell key={player.name} className="text-center">
									<button
										onClick={() => {
											setPlayerToChange(player)
										}}
									>
										{player.name}
									</button>
								</TableCell>
							))}
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{state.rounds.map((round) => (
							<TableRow key={round}>
								{sortedPlayers.map((player) => (
									<TableCell
										key={`${player.name}-round-${round}`}
										className="text-center"
									>
										<button
											onClick={() => {
												setScoreToChange({
													playerId: player.id,
													round: round,
													prevScore: player.scores[round - 1],
												})
											}}
										>
											{player.scores[round - 1]}
										</button>
									</TableCell>
								))}
								<TableCell
									header
									key={`round-${round}`}
									className="text-left font-semibold"
								>
									{round}
								</TableCell>
							</TableRow>
						))}
						<TableRow key="totals" hidden={state.rounds.length === 0}>
							{sortedPlayers.map((player) => (
								<TableCell
									key={player.name + '-total'}
									className="text-center font-bold"
								>
									{player.scores.reduce((a, b) => a + b, 0)}
								</TableCell>
							))}
							<TableCell header key="totals-header">
								Totals
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Card>
			<div className="w-full flex space-x-2 mb-4">
				<Button
					roundedIos
					outline
					onClick={() => removeRound()}
					disabled={state.rounds.length === 1}
				>
					Remove Round
				</Button>
				<Button
					roundedIos
					outline
					onClick={() => clearScores()}
					disabled={
						state.rounds.length === 1 &&
						state.players.every((p) => p.scores.every((s) => s === 0))
					}
				>
					Reset Scores
				</Button>
			</div>
			<div className="w-full flex justify-center">
				<Button
					className="w-fit self-center px-8"
					color={'#ff3b30'}
					roundedIos
					clear
					onClick={() => resetState()}
				>
					Reset Scorecard
				</Button>
			</div>
			<Block className="w-full flex space-x-4">
				<p>
					<i>Hint: Tap on a name or score to change it</i>
				</p>
			</Block>

			<AddPlayersDialog
				sheetOpened={playersModalOpen}
				onClose={(name) => {
					setPlayersModalOpen(false)
					if (name) {
						addPlayer(name)
					}
				}}
			/>
			{scoreToChange !== null && (
				<ScoreDialog
					key={`${scoreToChange.playerId}-${scoreToChange.round}-${scoreToChange.prevScore}`}
					sheetOpened={!!scoreToChange}
					prevScore={scoreToChange.prevScore}
					onClose={(newScore) => {
						const st = scoreToChange
						setScoreToChange(null)
						if (st && newScore !== undefined && newScore !== st.prevScore) {
							setPlayerScore(st.playerId, st.round, newScore)
						}
					}}
				/>
			)}
			{playerToChange !== null && (
				<ChangePlayerDialog
					key={`${playerToChange.id}-${playerToChange.name}-change`}
					sheetOpened={!!playerToChange}
					prevPlayerName={playerToChange.name ?? ''}
					onClose={(newName?) => {
						const st = playerToChange
						setPlayerToChange(null)
						if (st && newName !== undefined && newName !== st.name) {
							changePlayerName(st.id, newName)
						}
					}}
					onDelete={() => {
						const st = playerToChange
						setPlayerToChange(null)
						if (st) {
							removePlayer(st.id)
						}
					}}
				/>
			)}
		</div>
	)
}

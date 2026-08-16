import { useEffect, useMemo, useRef, useState } from 'react'
import AddPlayersDialog from '../../components/AddPlayersDialog.tsx'
import ChangePlayerDialog from '../../components/ChangePlayerDialog'
import ScoreDialog from '../../components/ScoreDialog.tsx'
import Button from '../../components/ui/Button.tsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.tsx'
import Dialog from '../../components/ui/Dialog.tsx'
import RepeatButton from '../../components/ui/RepeatButton.tsx'
import { useScorecardState } from '../../hooks/scorecard/useScorecardState'
import type { ScorecardState } from '../../services/scorecardStorage.ts'
import type { Player } from '../types.ts'

interface ScoreSelection {
	playerId: string
	round: number
	prevScore: number | null
}

interface Confirmation {
	title: string
	message: string
	confirmLabel: string
	onConfirm: () => void
}

const totalScore = (player: Player) =>
	player.scores.reduce<number>((total, score) => total + (score ?? 0), 0)

export default function GolfScorecard() {
	const { state, setState, resetState } = useScorecardState()
	const [scoreToChange, setScoreToChange] = useState<ScoreSelection | null>(null)
	const [playerToChange, setPlayerToChange] = useState<Player | null>(null)
	const [playersModalOpen, setPlayersModalOpen] = useState(false)
	const [activeRound, setActiveRound] = useState(() => state.rounds.at(-1) ?? 1)
	const [mobileView, setMobileView] = useState<'round' | 'scores'>('round')
	const [roundSummaryOpen, setRoundSummaryOpen] = useState(false)
	const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
	const [undoState, setUndoState] = useState<ScorecardState | null>(null)
	const [toast, setToast] = useState<string | null>(null)
	const toastTimer = useRef<number | null>(null)

	useEffect(
		() => () => {
			if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
		},
		[]
	)

	const showToast = (message: string, keepUndo = false) => {
		if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
		if (!keepUndo) setUndoState(null)
		setToast(message)
		toastTimer.current = window.setTimeout(() => {
			setToast(null)
			setUndoState(null)
		}, 3000)
	}

	const players = state.players
	const currentRound = state.rounds.includes(activeRound)
		? activeRound
		: (state.rounds.at(-1) ?? 1)
	const latestRound = state.rounds.at(-1) ?? 1
	const scoresRemaining = players.filter(
		(player) => player.scores[currentRound - 1] === null
	).length
	const currentRoundComplete = players.length > 0 && scoresRemaining === 0
	const latestRoundComplete =
		players.length > 0 && players.every((player) => player.scores[latestRound - 1] !== null)

	const totals = useMemo(
		() => new Map(players.map((player) => [player.id, totalScore(player)])),
		[players]
	)
	const playersWithScores = players.filter((player) =>
		player.scores.some((score) => score !== null)
	)
	const lowestTotal =
		playersWithScores.length > 0
			? Math.min(...playersWithScores.map((player) => totals.get(player.id) ?? 0))
			: null
	const rankedPlayers = [...players].sort(
		(a, b) => (totals.get(a.id) ?? 0) - (totals.get(b.id) ?? 0)
	)

	const setPlayerScore = (id: string, round: number, score: number) => {
		setState((previous) => ({
			...previous,
			players: previous.players.map((player) => {
				if (player.id !== id) return player
				const scores = [...player.scores]
				while (scores.length < previous.rounds.length) scores.push(null)
				scores[round - 1] = score
				return { ...player, scores }
			}),
		}))
	}

	const addRound = () => {
		const nextRound = state.rounds.length + 1
		setState((previous) => ({
			...previous,
			rounds: [...previous.rounds, previous.rounds.length + 1],
			players: previous.players.map((player) => ({
				...player,
				scores: [...player.scores, null],
			})),
		}))
		setActiveRound(nextRound)
		setMobileView('round')
		showToast(`Round ${nextRound} started`)
	}

	const removeRound = () => {
		if (state.rounds.length === 1) return
		setUndoState({
			rounds: [...state.rounds],
			players: state.players.map((player) => ({ ...player, scores: [...player.scores] })),
		})
		const removedRound = latestRound
		setState((previous) => ({
			...previous,
			rounds: previous.rounds.slice(0, -1),
			players: previous.players.map((player) => ({
				...player,
				scores: player.scores.slice(0, -1),
			})),
		}))
		setActiveRound(Math.max(1, latestRound - 1))
		showToast(`Round ${removedRound} removed`, true)
	}

	const undoRemoveRound = () => {
		if (!undoState) return
		setState(undoState)
		setActiveRound(undoState.rounds.at(-1) ?? 1)
		setUndoState(null)
		showToast('Round restored')
	}

	const addPlayer = (rawName: string) => {
		const name = rawName.trim()
		if (!name) return
		if (players.some((player) => player.name.toLowerCase() === name.toLowerCase())) {
			showToast('That player name is already in use')
			return
		}
		setState((previous) => ({
			...previous,
			players: [
				...previous.players,
				{
					id: crypto.randomUUID(),
					name,
					scores: Array<number | null>(previous.rounds.length).fill(null),
				},
			],
		}))
		showToast(`${name} added`)
	}

	const changePlayerName = (id: string, rawName: string) => {
		const name = rawName.trim()
		if (!name) return
		if (
			players.some(
				(player) => player.id !== id && player.name.toLowerCase() === name.toLowerCase()
			)
		) {
			showToast('That player name is already in use')
			return
		}
		setState((previous) => ({
			...previous,
			players: previous.players.map((player) =>
				player.id === id ? { ...player, name } : player
			),
		}))
		showToast('Player updated')
	}

	const movePlayer = (id: string, direction: -1 | 1) => {
		setState((previous) => {
			const index = previous.players.findIndex((player) => player.id === id)
			const target = index + direction
			if (index < 0 || target < 0 || target >= previous.players.length) return previous
			const reordered = [...previous.players]
			const [player] = reordered.splice(index, 1)
			if (!player) return previous
			reordered.splice(target, 0, player)
			return { ...previous, players: reordered }
		})
		showToast('Player order updated')
	}

	const removePlayer = (id: string) => {
		setState((previous) => ({
			...previous,
			players: previous.players.filter((player) => player.id !== id),
		}))
		showToast('Player deleted')
	}

	const clearScores = () => {
		setState((previous) => ({
			players: previous.players.map((player) => ({ ...player, scores: [null] })),
			rounds: [1],
		}))
		setActiveRound(1)
		setUndoState(null)
		showToast('Scores reset')
	}

	const resetScorecard = () => {
		resetState()
		setActiveRound(1)
		setUndoState(null)
		showToast('Scorecard reset')
	}

	const scoreSelectionPlayer = scoreToChange
		? players.find((player) => player.id === scoreToChange.playerId)
		: undefined
	const scoreSelectionIndex = scoreSelectionPlayer
		? players.findIndex((player) => player.id === scoreSelectionPlayer.id)
		: -1
	const nextScorePlayer =
		scoreSelectionIndex >= 0 && scoreSelectionIndex < players.length - 1
			? players[scoreSelectionIndex + 1]
			: undefined

	const askToResetScores = () =>
		setConfirmation({
			title: 'Reset all scores?',
			message: 'This clears every round but keeps your players.',
			confirmLabel: 'Reset Scores',
			onConfirm: clearScores,
		})

	const askToResetScorecard = () =>
		setConfirmation({
			title: 'Reset the scorecard?',
			message: 'This permanently removes every player and score.',
			confirmLabel: 'Reset Scorecard',
			onConfirm: resetScorecard,
		})

	return (
		<div className="h-full w-full">
			<div className="mobile-scorecard">
				<div className="scorecard-view-switch" role="tablist" aria-label="Scorecard view">
					<button
						role="tab"
						aria-selected={mobileView === 'round'}
						onClick={() => setMobileView('round')}
					>
						Current Round
					</button>
					<button
						role="tab"
						aria-selected={mobileView === 'scores'}
						onClick={() => setMobileView('scores')}
					>
						Scores
					</button>
				</div>

				<div className="save-status" role="status">
					<span aria-hidden="true">✓</span> Saved on this device
				</div>

				{mobileView === 'round' ? (
					<>
						<div className="round-picker" aria-label="Choose a round">
							<button
								type="button"
								aria-label="Previous round"
								disabled={currentRound === state.rounds[0]}
								onClick={() => setActiveRound(Math.max(1, currentRound - 1))}
							>
								‹
							</button>
							<div aria-live="polite">
								<span>Round</span>
								<strong>{currentRound}</strong>
								<small>of {state.rounds.length}</small>
							</div>
							<button
								type="button"
								aria-label="Next round"
								disabled={currentRound === latestRound}
								onClick={() =>
									setActiveRound(Math.min(state.rounds.length, currentRound + 1))
								}
							>
								›
							</button>
						</div>

						{players.length === 0 ? (
							<div className="scorecard-empty">
								<strong>No players yet</strong>
								<span>Add everyone who is playing to get started.</span>
							</div>
						) : (
							<div className="mobile-player-list">
								{players.map((player) => {
									const score = player.scores[currentRound - 1] ?? null
									const isLeader =
										lowestTotal !== null &&
										totals.get(player.id) === lowestTotal
									return (
										<div
											className={`mobile-player-row ${score === null ? 'mobile-player-row--missing' : ''}`}
											key={player.id}
										>
											<button
												type="button"
												className="mobile-player-info"
												aria-label={`Edit ${player.name}`}
												onClick={() => setPlayerToChange(player)}
											>
												<strong>
													{player.name}
													{isLeader && (
														<span className="leader-badge">Leader</span>
													)}
												</strong>
												<span
													className="mobile-player-total"
													key={totals.get(player.id) ?? 0}
												>
													Total {totals.get(player.id) ?? 0}
												</span>
											</button>
											<div className="mobile-score-control">
												<RepeatButton
													aria-label={`Decrease ${player.name}'s score`}
													onPress={() =>
														setPlayerScore(
															player.id,
															currentRound,
															(score ?? 0) - 1
														)
													}
												>
													−
												</RepeatButton>
												<button
													type="button"
													className={`mobile-score-value ${score === null ? 'mobile-score-value--missing' : ''}`}
													aria-label={`Edit ${player.name}, round ${currentRound}, ${score === null ? 'score not entered' : `score ${score}`}`}
													onClick={() =>
														setScoreToChange({
															playerId: player.id,
															round: currentRound,
															prevScore: score,
														})
													}
												>
													{score ?? '—'}
												</button>
												<RepeatButton
													aria-label={`Increase ${player.name}'s score`}
													onPress={() =>
														setPlayerScore(
															player.id,
															currentRound,
															(score ?? 0) + 1
														)
													}
												>
													+
												</RepeatButton>
											</div>
										</div>
									)
								})}
							</div>
						)}

						<Button
							className="mobile-add-player"
							variant="ghost"
							fullWidth
							onClick={() => setPlayersModalOpen(true)}
						>
							+ Add Player
						</Button>

						<details className="scorecard-options">
							<summary>Scorecard options</summary>
							<div>
								<Button
									variant="outline"
									fullWidth
									onClick={removeRound}
									disabled={state.rounds.length === 1}
								>
									Remove Last Round
								</Button>
								<Button
									variant="outline"
									fullWidth
									onClick={askToResetScores}
									disabled={
										!players.some((player) =>
											player.scores.some((score) => score !== null)
										)
									}
								>
									Reset Scores
								</Button>
								<Button variant="danger" fullWidth onClick={askToResetScorecard}>
									Reset Scorecard
								</Button>
							</div>
						</details>

						{currentRound < latestRound ? (
							<Button
								className="mobile-next-round"
								fullWidth
								onClick={() => setActiveRound(latestRound)}
							>
								Go to Current Round
							</Button>
						) : (
							<Button
								className="mobile-next-round"
								fullWidth
								disabled={!currentRoundComplete}
								onClick={() => setRoundSummaryOpen(true)}
							>
								{players.length === 0
									? 'Add players to begin'
									: scoresRemaining > 0
										? `${scoresRemaining} ${scoresRemaining === 1 ? 'score' : 'scores'} left`
										: 'Finish Round'}
							</Button>
						)}
					</>
				) : (
					<div className="mobile-scores-view">
						{players.length === 0 ? (
							<div className="scorecard-empty">
								<strong>No scores yet</strong>
								<span>Add players and complete a round to see standings.</span>
							</div>
						) : (
							<>
								{lowestTotal !== null && (
									<div className="leader-card">
										<span>
											Current{' '}
											{playersWithScores.filter(
												(player) => totals.get(player.id) === lowestTotal
											).length > 1
												? 'leaders'
												: 'leader'}
										</span>
										<strong>
											{playersWithScores
												.filter(
													(player) =>
														totals.get(player.id) === lowestTotal
												)
												.map((player) => player.name)
												.join(' & ')}
										</strong>
										<small>{lowestTotal} points</small>
									</div>
								)}
								<div className="standings-list">
									{rankedPlayers.map((player, index) => (
										<details key={player.id}>
											<summary>
												<span>{index + 1}</span>
												<strong>{player.name}</strong>
												<b>{totals.get(player.id) ?? 0}</b>
											</summary>
											<div className="round-history">
												{state.rounds.map((round) => (
													<button
														type="button"
														key={round}
														onClick={() => {
															setActiveRound(round)
															setMobileView('round')
														}}
													>
														<span>R{round}</span>
														<strong>
															{player.scores[round - 1] ?? '—'}
														</strong>
													</button>
												))}
											</div>
										</details>
									))}
								</div>
							</>
						)}
					</div>
				)}
			</div>

			<div className="desktop-scorecard">
				<div className="scorecard-actions scorecard-actions--primary">
					<Button onClick={() => setPlayersModalOpen(true)}>Add Player</Button>
					<Button onClick={addRound} disabled={!latestRoundComplete}>
						Add Round
					</Button>
				</div>
				{players.length === 0 && (
					<div className="scorecard-empty">
						<strong>No players yet</strong>
						<span>Add everyone who is playing to get started.</span>
					</div>
				)}
				<div className="scorecard-table-wrap">
					<table className="scorecard-table">
						<thead>
							<tr>
								<th scope="col" className="text-left">
									Player
								</th>
								{state.rounds.map((round) => (
									<th scope="col" key={round} className="text-center">
										{round}
									</th>
								))}
								<th scope="col" className="text-center">
									Total
								</th>
							</tr>
						</thead>
						<tbody>
							{players.map((player) => (
								<tr key={player.id}>
									<th
										scope="row"
										className="scorecard-player-cell text-left font-normal"
									>
										<button
											className="scorecard-table__edit"
											onClick={() => setPlayerToChange(player)}
										>
											{player.name}
										</button>
									</th>
									{state.rounds.map((round) => {
										const score = player.scores[round - 1] ?? null
										return (
											<td
												key={`${player.id}-${round}`}
												className="text-center"
											>
												<button
													className={`scorecard-table__edit ${score === null ? 'scorecard-table__edit--missing' : ''}`}
													onClick={() =>
														setScoreToChange({
															playerId: player.id,
															round,
															prevScore: score,
														})
													}
												>
													{score ?? '—'}
												</button>
											</td>
										)
									})}
									<td className="text-center font-bold">
										{totals.get(player.id) ?? 0}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="scorecard-actions scorecard-actions--secondary">
					<Button
						variant="outline"
						onClick={removeRound}
						disabled={state.rounds.length === 1}
					>
						Remove Round
					</Button>
					<Button
						variant="outline"
						onClick={askToResetScores}
						disabled={
							!players.some((player) => player.scores.some((score) => score !== null))
						}
					>
						Reset Scores
					</Button>
				</div>
				<div className="scorecard-reset">
					<Button className="px-8" variant="danger" onClick={askToResetScorecard}>
						Reset Scorecard
					</Button>
				</div>
			</div>

			<AddPlayersDialog
				sheetOpened={playersModalOpen}
				onClose={(name) => {
					setPlayersModalOpen(false)
					if (name) addPlayer(name)
				}}
			/>

			{scoreToChange && scoreSelectionPlayer && (
				<ScoreDialog
					key={`${scoreToChange.playerId}-${scoreToChange.round}-${scoreToChange.prevScore}`}
					sheetOpened
					prevScore={scoreToChange.prevScore}
					playerName={scoreSelectionPlayer.name}
					round={scoreToChange.round}
					onSaveAndNext={
						nextScorePlayer
							? (score) => {
									setPlayerScore(
										scoreToChange.playerId,
										scoreToChange.round,
										score
									)
									setScoreToChange({
										playerId: nextScorePlayer.id,
										round: scoreToChange.round,
										prevScore:
											nextScorePlayer.scores[scoreToChange.round - 1] ?? null,
									})
								}
							: undefined
					}
					onClose={(score) => {
						const selection = scoreToChange
						setScoreToChange(null)
						if (score !== undefined) {
							setPlayerScore(selection.playerId, selection.round, score)
							showToast('Score updated')
						}
					}}
				/>
			)}

			{playerToChange && (
				<ChangePlayerDialog
					key={`${playerToChange.id}-${playerToChange.name}`}
					sheetOpened
					prevPlayerName={playerToChange.name}
					canMoveEarlier={
						players.findIndex((player) => player.id === playerToChange.id) > 0
					}
					canMoveLater={
						players.findIndex((player) => player.id === playerToChange.id) <
						players.length - 1
					}
					onMoveEarlier={() => movePlayer(playerToChange.id, -1)}
					onMoveLater={() => movePlayer(playerToChange.id, 1)}
					onClose={(name) => {
						const player = playerToChange
						setPlayerToChange(null)
						if (name !== undefined && name !== player.name)
							changePlayerName(player.id, name)
					}}
					onDelete={() => {
						const player = playerToChange
						setPlayerToChange(null)
						setConfirmation({
							title: `Delete ${player.name}?`,
							message: 'Their scores will be permanently removed.',
							confirmLabel: 'Delete Player',
							onConfirm: () => removePlayer(player.id),
						})
					}}
				/>
			)}

			<Dialog
				opened={roundSummaryOpen}
				ariaLabel={`Round ${currentRound} complete`}
				onClose={() => setRoundSummaryOpen(false)}
			>
				<h2 className="dialog-title">Round {currentRound} Complete</h2>
				<div className="round-summary-list">
					{players.map((player) => (
						<div key={player.id}>
							<span>{player.name}</span>
							<strong>{player.scores[currentRound - 1]}</strong>
							<small>Total {totals.get(player.id) ?? 0}</small>
						</div>
					))}
				</div>
				<div className="dialog-actions">
					<Button
						fullWidth
						onClick={() => {
							setRoundSummaryOpen(false)
							addRound()
						}}
					>
						Start Round {state.rounds.length + 1}
					</Button>
					<Button variant="ghost" fullWidth onClick={() => setRoundSummaryOpen(false)}>
						Stay on This Round
					</Button>
				</div>
			</Dialog>

			<ConfirmDialog
				opened={confirmation !== null}
				title={confirmation?.title ?? ''}
				message={confirmation?.message ?? ''}
				confirmLabel={confirmation?.confirmLabel ?? 'Confirm'}
				onCancel={() => setConfirmation(null)}
				onConfirm={() => {
					const action = confirmation?.onConfirm
					setConfirmation(null)
					action?.()
				}}
			/>

			{toast && (
				<div className="app-toast" role="status">
					<span>{toast}</span>
					{undoState && (
						<button type="button" onClick={undoRemoveRound}>
							Undo
						</button>
					)}
				</div>
			)}
		</div>
	)
}

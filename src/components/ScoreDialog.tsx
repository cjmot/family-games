import { useEffect, useRef, useState } from 'react'
import Button from './ui/Button'
import Dialog from './ui/Dialog'
import RepeatButton from './ui/RepeatButton'

interface Props {
	sheetOpened: boolean
	onClose: (score?: number) => void
	onSaveAndNext?: (score: number) => void
	prevScore: number | null
	playerName: string
	round: number
}
export default function ScoreDialog({
	sheetOpened,
	onClose,
	onSaveAndNext,
	prevScore,
	playerName,
	round,
}: Props) {
	const [newScore, setNewScore] = useState({ value: prevScore?.toString() ?? '', changed: false })
	const inputRef = useRef<HTMLInputElement>(null)
	const parsedScore = Number.parseInt(newScore.value, 10)
	const scoreIsValid = newScore.value.trim() !== '' && Number.isFinite(parsedScore)

	const revertScore = () => {
		setNewScore({ value: prevScore?.toString() ?? '', changed: false })
	}
	const closeDialog = () => {
		onClose()
		revertScore()
	}
	const adjustScore = (amount: number) => {
		const currentScore = scoreIsValid ? parsedScore : 0
		setNewScore({ value: String(currentScore + amount), changed: true })
		inputRef.current?.focus()
	}

	useEffect(() => {
		if (!sheetOpened) return
		const timer = window.setTimeout(() => {
			inputRef.current?.focus()
			inputRef.current?.select()
		}, 0)
		return () => window.clearTimeout(timer)
	}, [sheetOpened])

	return (
		<Dialog opened={sheetOpened} ariaLabel="Change score" onClose={closeDialog}>
			<form
				onSubmit={(event) => {
					event.preventDefault()
					if (!scoreIsValid) return
					onClose(newScore.changed ? parsedScore : undefined)
				}}
			>
				<h2 className="dialog-title">Change Score</h2>
				<p className="dialog-context">
					{playerName} · Round {round}
				</p>
				<div className="score-stepper">
					<RepeatButton onPress={() => adjustScore(-1)} aria-label="Decrease score">
						−
					</RepeatButton>
					<input
						ref={inputRef}
						id="score-input"
						className="app-input score-input"
						type="number"
						required
						inputMode="numeric"
						step="1"
						placeholder={prevScore?.toString()}
						aria-label={`Score for ${playerName}, round ${round}`}
						value={newScore.value}
						onChange={(e) => setNewScore({ value: e.target.value, changed: true })}
					/>
					<RepeatButton onPress={() => adjustScore(1)} aria-label="Increase score">
						+
					</RepeatButton>
				</div>
				<div className="quick-scores" aria-label="Common scores">
					{[-2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
						<button
							type="button"
							key={score}
							aria-pressed={scoreIsValid && parsedScore === score}
							onClick={() => setNewScore({ value: String(score), changed: true })}
						>
							{score}
						</button>
					))}
				</div>
				<div className="dialog-actions">
					<Button type="submit" fullWidth disabled={!scoreIsValid}>
						Save Score
					</Button>
					{onSaveAndNext && (
						<Button
							type="button"
							variant="outline"
							fullWidth
							disabled={!scoreIsValid}
							onClick={() => onSaveAndNext(parsedScore)}
						>
							Save &amp; Next Player
						</Button>
					)}
					<Button variant="ghost" fullWidth onClick={closeDialog}>
						Cancel
					</Button>
				</div>
			</form>
		</Dialog>
	)
}

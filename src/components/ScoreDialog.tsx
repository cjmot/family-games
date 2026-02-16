import { Block, Button, Dialog } from 'konsta/react'
import { useEffect, useRef, useState } from 'react'

interface Props {
	sheetOpened: boolean
	onClose: (score?: number) => void
	prevScore: number
}
export default function ScoreDialog({ sheetOpened, onClose, prevScore }: Props) {
	const [newScore, setNewScore] = useState({ value: prevScore?.toString(), changed: false })
	const inputRef = useRef<HTMLInputElement>(null)

	const revertScore = () => {
		setNewScore({ value: prevScore?.toString(), changed: false })
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
		<Dialog
			className="pb-safe"
			opened={sheetOpened}
			onBackdropClick={() => {
				onClose()
				revertScore()
			}}
		>
			<Block className="ios:mt-4">
				<input
					ref={inputRef}
					id="new-player-input"
					className="outline-1 text-center rounded-2xl outline-black h-10 p-2 text-lg  "
					type="number"
					placeholder={prevScore?.toString()}
					value={newScore.value}
					onChange={(e) => setNewScore({ value: e.target.value, changed: true })}
				/>
				<div className="mt-8">
					<Button
						large
						rounded
						onClick={() => {
							onClose(newScore.changed ? parseInt(newScore.value) : undefined)
						}}
					>
						Change Score
					</Button>
				</div>
			</Block>
		</Dialog>
	)
}

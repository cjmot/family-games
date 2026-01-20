import { Block, Button, Dialog } from 'konsta/react'
import { useState } from 'react'

interface Props {
	sheetOpened: boolean
	onClose: (score?: number) => void
	prevScore: number
}
export default function ScoreDialog({ sheetOpened, onClose, prevScore }: Props) {
	const [newScore, setNewScore] = useState({ value: prevScore?.toString(), changed: false })

	const revertScore = () => {
		setNewScore({ value: prevScore?.toString(), changed: false })
	}

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
					id="new-player-input"
					className="outline-1 text-center rounded-2xl w-fit outline-black h-10 p-2 text-lg  "
					type="number"
					placeholder="Name"
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

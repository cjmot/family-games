import { Block, Button, Dialog } from 'konsta/react'
import { useState } from 'react'

interface Props {
	sheetOpened: boolean
	onClose: (name?: string) => void
	onDelete: () => void
	prevPlayerName: string
}
export default function ScoreDialog({ sheetOpened, onClose, onDelete, prevPlayerName }: Props) {
	const [newPlayer, setNewPlayer] = useState({ value: prevPlayerName, changed: false })

	const revertPlayerName = () => {
		setNewPlayer({ value: prevPlayerName, changed: false })
	}

	return (
		<Dialog
			className="pb-safe"
			opened={sheetOpened}
			onBackdropClick={() => {
				onClose()
				revertPlayerName()
			}}
		>
			<Block className="ios:mt-4">
				<input
					id="change-player-input"
					className="outline-1 text-center rounded-2xl outline-black h-10 p-2 text-lg"
					type="text"
					placeholder={prevPlayerName}
					value={newPlayer.value}
					onChange={(e) => setNewPlayer({ value: e.target.value, changed: true })}
				/>
				<div className="mt-8 flex flex-col space-y-4">
					<Button
						large
						rounded
						onClick={() => {
							onClose(newPlayer.changed ? newPlayer.value : undefined)
						}}
					>
						Change Player Name
					</Button>
					<Button large rounded outline onClick={() => onDelete()}>
						Delete Player
					</Button>
				</div>
			</Block>
		</Dialog>
	)
}

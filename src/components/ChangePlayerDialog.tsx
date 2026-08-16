import { useEffect, useRef, useState } from 'react'
import Button from './ui/Button'
import Dialog from './ui/Dialog'

interface Props {
	sheetOpened: boolean
	onClose: (name?: string) => void
	onDelete: () => void
	onMoveEarlier?: () => void
	onMoveLater?: () => void
	canMoveEarlier?: boolean
	canMoveLater?: boolean
	prevPlayerName: string
}
export default function ChangePlayerDialog({
	sheetOpened,
	onClose,
	onDelete,
	onMoveEarlier,
	onMoveLater,
	canMoveEarlier = false,
	canMoveLater = false,
	prevPlayerName,
}: Props) {
	const [newPlayer, setNewPlayer] = useState({ value: prevPlayerName, changed: false })
	const inputRef = useRef<HTMLInputElement>(null)

	const revertPlayerName = () => {
		setNewPlayer({ value: prevPlayerName, changed: false })
	}
	const closeDialog = () => {
		onClose()
		revertPlayerName()
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
		<Dialog opened={sheetOpened} ariaLabel="Change player" onClose={closeDialog}>
			<form
				onSubmit={(event) => {
					event.preventDefault()
					onClose(newPlayer.changed ? newPlayer.value : undefined)
				}}
			>
				<h2 className="dialog-title">Change Player</h2>
				<input
					ref={inputRef}
					id="change-player-input"
					className="app-input"
					type="text"
					required
					placeholder={prevPlayerName}
					aria-label="Player name"
					autoComplete="off"
					value={newPlayer.value}
					onChange={(e) => setNewPlayer({ value: e.target.value, changed: true })}
				/>
				<div className="dialog-actions">
					<Button type="submit" fullWidth disabled={!newPlayer.value.trim()}>
						Change Player Name
					</Button>
					<Button variant="ghost" fullWidth onClick={closeDialog}>
						Cancel
					</Button>
					<div className="player-order-actions">
						<Button
							variant="outline"
							disabled={!canMoveEarlier}
							onClick={onMoveEarlier}
						>
							Move Earlier
						</Button>
						<Button variant="outline" disabled={!canMoveLater} onClick={onMoveLater}>
							Move Later
						</Button>
					</div>
					<Button className="dialog-delete" variant="danger" fullWidth onClick={onDelete}>
						Delete Player
					</Button>
				</div>
			</form>
		</Dialog>
	)
}

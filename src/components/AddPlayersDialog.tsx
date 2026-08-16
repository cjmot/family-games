import { useEffect, useRef, useState } from 'react'
import Button from './ui/Button'
import Dialog from './ui/Dialog'

interface Props {
	sheetOpened: boolean
	onClose: (name?: string) => void
}

export default function AddPlayersDialog({ sheetOpened, onClose }: Props) {
	const [name, setName] = useState({ value: '', changed: false })
	const inputRef = useRef<HTMLInputElement>(null)
	const clearName = () => setName({ value: '', changed: false })
	const closeDialog = () => {
		onClose()
		clearName()
	}

	useEffect(() => {
		if (!sheetOpened) return
		const timer = window.setTimeout(() => {
			inputRef.current?.focus()
		}, 0)
		return () => window.clearTimeout(timer)
	}, [sheetOpened])

	return (
		<Dialog opened={sheetOpened} ariaLabel="Add a player" onClose={closeDialog}>
			<form
				onSubmit={(event) => {
					event.preventDefault()
					onClose(name.changed ? name.value : undefined)
					clearName()
				}}
			>
				<h2 className="dialog-title">Add Player</h2>
				<input
					ref={inputRef}
					id="new-player-input"
					className="app-input"
					type="text"
					required
					placeholder="Name"
					aria-label="Player name"
					autoComplete="off"
					value={name.value}
					onChange={(e) => setName({ value: e.target.value, changed: true })}
				/>
				<div className="dialog-actions">
					<Button type="submit" fullWidth disabled={!name.value.trim()}>
						Add Player
					</Button>
					<Button variant="ghost" fullWidth onClick={closeDialog}>
						Cancel
					</Button>
				</div>
			</form>
		</Dialog>
	)
}

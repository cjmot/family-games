import { Button, Block, Dialog } from 'konsta/react'
import { useEffect, useState } from 'react'

interface Props {
	sheetOpened: boolean
	onClose: (name?: string) => void
}

export default function PlayersDialog({ sheetOpened, onClose }: Props) {
	const [name, setName] = useState({ value: '', changed: false })
	const clearName = () => setName({ value: '', changed: false })

	useEffect(() => {
		if (!sheetOpened) return
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Enter' && sheetOpened && !(e.target instanceof HTMLTextAreaElement)) {
				onClose(name.changed ? name.value : undefined)
				clearName()
			}
		}

		document.addEventListener('keydown', handler)

		return () => {
			document.removeEventListener('keydown', handler)
		}
	}, [sheetOpened, name.changed, name.value, onClose])

	return (
		<Dialog
			className="pb-safe"
			opened={sheetOpened}
			onBackdropClick={() => {
				onClose()
				clearName()
			}}
		>
			<Block className="ios:mt-4">
				<input
					id="new-player-input"
					className="w-full outline-1 outline-black h-10 p-2 text-lg  "
					type="text"
					placeholder="Name"
					value={name.value}
					onChange={(e) => setName({ value: e.target.value, changed: true })}
				/>
				<div className="mt-8">
					<Button
						large
						rounded
						onClick={() => {
							onClose(name.changed ? name.value : undefined)
							clearName()
						}}
					>
						Add Player
					</Button>
				</div>
			</Block>
		</Dialog>
	)
}

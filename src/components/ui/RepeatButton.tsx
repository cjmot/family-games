import { useEffect, useRef, type ButtonHTMLAttributes, type PointerEvent } from 'react'

interface RepeatButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
	onPress: () => void
}

export default function RepeatButton({ onPress, ...props }: RepeatButtonProps) {
	const delayTimer = useRef<number | null>(null)
	const repeatTimer = useRef<number | null>(null)
	const pressHandler = useRef(onPress)

	useEffect(() => {
		pressHandler.current = onPress
	}, [onPress])

	const stopRepeating = () => {
		if (delayTimer.current !== null) window.clearTimeout(delayTimer.current)
		if (repeatTimer.current !== null) window.clearInterval(repeatTimer.current)
		delayTimer.current = null
		repeatTimer.current = null
	}

	useEffect(
		() => () => {
			if (delayTimer.current !== null) window.clearTimeout(delayTimer.current)
			if (repeatTimer.current !== null) window.clearInterval(repeatTimer.current)
		},
		[]
	)

	const startRepeating = (event: PointerEvent<HTMLButtonElement>) => {
		if (event.pointerType === 'mouse' && event.button !== 0) return
		pressHandler.current()
		delayTimer.current = window.setTimeout(() => {
			repeatTimer.current = window.setInterval(() => pressHandler.current(), 90)
		}, 400)
	}

	return (
		<button
			type="button"
			onPointerDown={startRepeating}
			onPointerUp={stopRepeating}
			onPointerCancel={stopRepeating}
			onPointerLeave={stopRepeating}
			onClick={(event) => {
				if (event.detail === 0) pressHandler.current()
			}}
			onContextMenu={(event) => event.preventDefault()}
			{...props}
		/>
	)
}

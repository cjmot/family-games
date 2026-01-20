import { useRef, type ReactNode } from 'react'

const LONG_PRESS_MS = 500
interface Props {
	onLongPress: () => void
	children: ReactNode
}
export default function LongPressButton({ onLongPress, children }: Props) {
	const timerRef = useRef<number | null>(null)
	const longPressTriggered = useRef(false)

	const startPress = () => {
		longPressTriggered.current = false

		timerRef.current = window.setTimeout(() => {
			longPressTriggered.current = true
			onLongPress()
		}, LONG_PRESS_MS)
	}

	const endPress = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current)
			timerRef.current = null
		}
	}

	return (
		<button
			onMouseDown={startPress}
			onMouseUp={endPress}
			onMouseLeave={endPress}
			onTouchStart={startPress}
			onTouchEnd={endPress}
			onTouchCancel={endPress}
		>
			{children}
		</button>
	)
}

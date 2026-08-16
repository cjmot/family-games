import { useEffect, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
	children: ReactNode
	opened: boolean
	onClose: () => void
	ariaLabel: string
}

export default function Dialog({ children, opened, onClose, ariaLabel }: DialogProps) {
	useEffect(() => {
		if (!opened) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.body.style.overflow = previousOverflow
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [opened, onClose])

	if (!opened) return null

	const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) onClose()
	}

	return createPortal(
		<div className="app-dialog-backdrop" onMouseDown={handleBackdropClick}>
			<div className="app-dialog" role="dialog" aria-modal="true" aria-label={ariaLabel}>
				{children}
			</div>
		</div>,
		document.body
	)
}

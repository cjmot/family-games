import Button from './Button'
import Dialog from './Dialog'

interface ConfirmDialogProps {
	opened: boolean
	title: string
	message: string
	confirmLabel: string
	onCancel: () => void
	onConfirm: () => void
}

export default function ConfirmDialog({
	opened,
	title,
	message,
	confirmLabel,
	onCancel,
	onConfirm,
}: ConfirmDialogProps) {
	return (
		<Dialog opened={opened} ariaLabel={title} onClose={onCancel}>
			<h2 className="dialog-title">{title}</h2>
			<p className="confirm-dialog-message">{message}</p>
			<div className="dialog-actions">
				<Button variant="danger" fullWidth onClick={onConfirm}>
					{confirmLabel}
				</Button>
				<Button variant="ghost" fullWidth onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</Dialog>
	)
}

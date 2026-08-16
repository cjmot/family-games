import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode
	variant?: 'primary' | 'outline' | 'danger' | 'ghost'
	fullWidth?: boolean
}

export default function Button({
	children,
	className = '',
	variant = 'primary',
	fullWidth = false,
	type = 'button',
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			className={`app-button app-button--${variant} ${fullWidth ? 'w-full' : ''} ${className}`}
			{...props}
		>
			{children}
		</button>
	)
}

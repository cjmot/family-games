import { Link, Outlet, useLocation } from 'react-router-dom'
import { useHideOnScroll } from '../../hooks/hideOnScroll.ts'
import { useRef } from 'react'

export default function Shell() {
	const pageRef = useRef<HTMLDivElement>(null)
	const hideToolbar = useHideOnScroll(pageRef)
	const location = useLocation()
	const isHome = location.pathname === '/'

	return (
		<div className="app-page" ref={pageRef}>
			{!isHome && (
				<Link className="mobile-home-link" to="/" aria-label="Back to games">
					<span aria-hidden="true">‹</span> Home
				</Link>
			)}
			<Outlet />
			<nav
				aria-label="Primary navigation"
				className={`bottom-toolbar ${hideToolbar ? 'bottom-toolbar--hidden' : ''}`}
			>
				<Link className="bottom-toolbar__link" to="/">
					Home
				</Link>
			</nav>
		</div>
	)
}

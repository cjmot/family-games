import { Outlet } from 'react-router-dom'
import { Page, Toolbar, Link, ToolbarPane } from 'konsta/react'
import { useHideOnScroll } from '../../hooks/hideOnScroll.ts'
import { useRef } from 'react'

export default function Shell() {
	const pageRef = useRef<HTMLDivElement>(null)
	const hideToolbar = useHideOnScroll(pageRef)

	return (
		<Page className="flex flex-col" ref={pageRef}>
			<Outlet />
			<Toolbar
				className={`left-0 fixed transition-all bottom-0 mt-auto ${hideToolbar ? 'translate-y-20' : 'translate-y-0'}`}
			>
				<ToolbarPane className="flex justify-center">
					<Link href="/family-games/">Home</Link>
				</ToolbarPane>
			</Toolbar>
		</Page>
	)
}

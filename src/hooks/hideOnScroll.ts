import { useEffect, useRef, useState, type RefObject } from 'react'

export function useHideOnScroll(scrollRef: RefObject<HTMLElement | null>, threshold = 8) {
	const lastScrollTop = useRef(0)
	const [hidden, setHidden] = useState(false)

	useEffect(() => {
		const el = scrollRef.current
		if (!el) return

		const onScroll = () => {
			const current = el.scrollTop
			const delta = current - lastScrollTop.current

			// ignore tiny scrolls
			if (Math.abs(delta) < threshold) return

			if (current < 32) {
				// near top → always show
				setHidden(false)
			} else if (delta > 0) {
				// scrolling down
				setHidden(true)
			} else {
				// scrolling up
				setHidden(false)
			}

			lastScrollTop.current = current
		}

		el.addEventListener('scroll', onScroll, { passive: true })

		return () => {
			el.removeEventListener('scroll', onScroll)
		}
	}, [scrollRef, threshold])

	return hidden
}

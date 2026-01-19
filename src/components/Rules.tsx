import React from 'react'
import { Block, BlockTitle } from 'konsta/react'

export interface Props {
	rules: string
}

function splitSections(text: string) {
	// Sections are lines like: "SETUP", "GOAL", "CARD VALUES", etc.
	// Everything until the next ALL-CAPS-ish header belongs to that section.
	const lines = text.replace(/\r\n/g, '\n').split('\n')

	const isHeader = (line: string) => {
		const t = line.trim()
		if (!t) return false
		// "ALL CAPS" (allow spaces, &, -, parentheses) and at least 3 letters
		const letters = (t.match(/[A-Z]/g) || []).length
		const nonCaps = (t.match(/[a-z]/g) || []).length
		return nonCaps === 0 && letters >= 3 && t.length <= 40
	}

	const sections: Array<{ heading: string; body: string }> = []
	let currentHeading = 'Rules'
	let currentBody: string[] = []

	for (const line of lines) {
		if (isHeader(line)) {
			// flush previous
			const body = currentBody.join('\n').trim()
			if (body) sections.push({ heading: currentHeading, body })
			currentHeading = line.trim()
			currentBody = []
		} else {
			currentBody.push(line)
		}
	}

	const tail = currentBody.join('\n').trim()
	if (tail) sections.push({ heading: currentHeading, body: tail })

	// If the first "Rules" section is empty, remove it
	return sections.filter((s) => s.body.length > 0)
}

export default function Rules({ rules }: Props) {
	const sections = React.useMemo(() => splitSections(rules), [rules])

	return (
		<div>
			{sections.map((s, idx) => (
				<div key={s.heading}>
					<BlockTitle>{s.heading}</BlockTitle>
					<Block key={`${s.heading}-${idx}`}>
						<p className="whitespace-pre-wrap font-sans m-0 mx-4">{s.body}</p>
					</Block>
				</div>
			))}
		</div>
	)
}

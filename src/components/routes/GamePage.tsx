import { Block, BlockTitle, Segmented, SegmentedButton } from 'konsta/react'
import type { GameDefinition } from '../../games/types.ts'
import { useState } from 'react'
import Rules from '../Rules.tsx'

interface Props {
	game: GameDefinition
}

export default function GamePage({ game }: Props) {
	const [segmentActive, setSegmentActive] = useState<'rules' | 'scorecard'>('rules')

	return (
		<div>
			<div className="flex flex-col top-0 px-4 pt-4 items-center w-full">
				<BlockTitle className="text-2xl font-semibold tracking-wide mb-1">
					{game.name.toUpperCase()}
				</BlockTitle>

				<Segmented strongIos roundedIos className="w-full mt-3 shadow shadow-gray-400">
					<SegmentedButton
						className="flex-1"
						active={segmentActive === 'rules'}
						onClick={() => setSegmentActive('rules')}
					>
						Rules
					</SegmentedButton>
					<SegmentedButton
						className="flex-1"
						active={segmentActive === 'scorecard'}
						onClick={() => setSegmentActive('scorecard')}
					>
						Scorecard
					</SegmentedButton>
				</Segmented>
			</div>

			<Block inset strong className="flex flex-col items-center relative">
				{segmentActive === 'rules' && <Rules rules={game.rules} />}
				{segmentActive === 'scorecard' && <game.Scorecard />}
			</Block>
		</div>
	)
}

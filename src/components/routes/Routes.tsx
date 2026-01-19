import { Route, Routes as RouterRoutes } from 'react-router-dom'
import Shell from '../layout/Shell'
import HomePage from './HomePage'
import { games } from '../../games'
import GamePage from './GamePage'
import NotFoundPage from './NotFoundPage'

export default function Routes() {
	return (
		<>
			<RouterRoutes>
				<Route element={<Shell />}>
					<Route index element={<HomePage />} />

					<Route path="games/*">
						{games.map((game) => (
							<Route
								path={`${game.name}/*`}
								element={<GamePage game={game} />}
								key={game.name}
							/>
						))}
					</Route>

					{/* 404 inside shell */}
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</RouterRoutes>
		</>
	)
}

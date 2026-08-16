import { BrowserRouter } from 'react-router-dom'
import Routes from './components/routes/Routes'

export default function App() {
	return (
		<BrowserRouter>
			<div className="app-root">
				<Routes />
			</div>
		</BrowserRouter>
	)
}

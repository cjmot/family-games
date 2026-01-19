import { BrowserRouter } from 'react-router-dom'
import { App as KonstaApp } from 'konsta/react'
import Routes from './components/routes/Routes'

export default function App() {
	return (
		<BrowserRouter>
			<KonstaApp theme="ios" safeAreas={true}>
				<Routes />
			</KonstaApp>
		</BrowserRouter>
	)
}

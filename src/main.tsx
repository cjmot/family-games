import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ScorecardProvider } from './hooks/scorecard/ScorecardProvider'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ScorecardProvider>
			<App />
		</ScorecardProvider>
	</StrictMode>
)

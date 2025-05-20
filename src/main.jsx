import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Removed code that resets numTasks to 1 on every popup open

createRoot(document.getElementById('root')).render(
	<StrictMode>
	<App />
	</StrictMode>,
)

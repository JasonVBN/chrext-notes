import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Notes from './Notes';

function Nav() {
	const [page, setPage] = useState('todo');
	return (
		<>
		<nav>
			<button
				className="navbtn"
				style={{ background: page === 'todo' ? '#0060d0' : 'none' }}
				onClick={() => setPage('todo')}
			>
				To-do list
			</button>
			<button
				className="navbtn"
				style={{ background: page === 'notes' ? '#0060d0' : 'none' }}
				onClick={() => setPage('notes')}
			>
				Notes
			</button>
		</nav>
		{page === 'todo' ? (
			<App />
		) : (
			<Notes />
		)}
		</>
	);
}

createRoot(document.getElementById('root')).render(
	<StrictMode>
		
	<Nav />

	</StrictMode>,
)

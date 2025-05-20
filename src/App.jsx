import { clear } from 'console';
import './App.css'
import { useState, useEffect } from 'react'
import Notes from './Notes';

function App() {
    const [numTasks, setNumTasks] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [checked, setChecked] = useState([]);
    const [page, setPage] = useState('todo');

    useEffect(() => {
        chrome.storage.local.get('numTasks', function (result) {
            setNumTasks(result.numTasks || 0);
        });
    }, []);

	useEffect(() => {
        chrome.storage.local.get('tasks', function (result) {
            setTasks(result.tasks || []);
        });
    }, []);

    useEffect(() => {
        chrome.storage.local.get('checked', function (result) {
            setChecked(result['checked'] || []);
        });
    }, []);

	function clearTasks() {
		console.log('Clearing tasks');

		chrome.storage.local.set({ 'numTasks': 0 }, function () {
			setNumTasks(0);
		});

		chrome.storage.local.set({ 'tasks': [] }, function () {
			setTasks([]);
		});

		chrome.storage.local.set({ 'checked': [] }, function () {
			setChecked([]);
		});
	}

	function removeTask(index) {
		console.log('Removing task:', index);
		chrome.storage.local.get('tasks', function (result) {
			const taskList = result['tasks'] || [];
			taskList.splice(index, 1);
			chrome.storage.local.set({ 'tasks': taskList }, function () {
				setTasks(taskList);
				console.log('Task removed:', index);
			});
		});
		chrome.storage.local.get('checked', function (result) {
			const checkedList = result['checked'] || [];
			checkedList.splice(index, 1);
			chrome.storage.local.set({ 'checked': checkedList }, function () {
				setChecked(checkedList);
			});
		});
	}

    function addTask() {
        var newTask = document.getElementById('task_ipt').value;
        if (!newTask) return;

        chrome.storage.local.get(['numTasks', 'tasks', 'checked'], function (result) {
            const current = result.numTasks || 0;
            const taskList = result.tasks || [];
            const checkedList = result.checked || [];

            taskList.push(newTask);
            checkedList.push(false);

            chrome.storage.local.set({
                'numTasks': current + 1,
                'tasks': taskList,
                'checked': checkedList
            }, function () {
                setNumTasks(current + 1);
                setTasks(taskList);
                setChecked(checkedList);
                console.log('Task and checked state added:', newTask);
            });
        });
        document.getElementById('task_ipt').value = '';
    }

    const items = [];
    for (let i = 0; i < tasks.length; i++) {
        items.push(
            <li key={`task_${i}`} style={{ listStyle: 'none', cursor: 'pointer' }}>
				<input
					type="checkbox"
					style={{ marginRight: '0.5em' }}
					checked={checked[i] || false}
					id={`box_${i}`}
					onChange={() => {
                        const updated = [...checked];
                        updated[i] = !updated[i];
                        chrome.storage.local.set({ 'checked': updated }, function () {
                            setChecked(updated);
                        });
                    }}
				/>
                <label htmlFor={`box_${i}`}>{tasks[i]}</label>
                <button className="remove-task" onClick={() => removeTask(i)}>×</button>
            </li>
        );
    }

    return (
        <div>
            <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2em', padding: '1em 0', borderBottom: '1px solid #444', marginBottom: '2em', background: '#222' }}>
                <button
                    style={{ background: page === 'todo' ? '#444' : 'none', color: 'orange', border: 'none', fontSize: '1.2em', padding: '0.5em 1.5em', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold' }}
                    onClick={() => setPage('todo')}
                >
                    To-do list
                </button>
                <button
                    style={{ background: page === 'notes' ? '#444' : 'none', color: 'orange', border: 'none', fontSize: '1.2em', padding: '0.5em 1.5em', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold' }}
                    onClick={() => setPage('notes')}
                >
                    Notes
                </button>
            </nav>
            {page === 'todo' ? (
                <>
                    <button onClick={clearTasks}>Clear All</button>
                    <br />
                    <input type="text" placeholder="new task" id='task_ipt' />
                    <button onClick={addTask}>Add Task</button>
                    <ul>
                        {items}
                    </ul>
                </>
            ) : (
                <Notes />
            )}
        </div>
    );
}

export default App;

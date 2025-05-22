import './App.css';
import { useState, useEffect } from 'react'

function Notes() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        chrome.storage.local.get('notes', function (result) {
            setNotes(result.notes || []);
        });
    }, []);

    function clear() {
        console.log('Clearing notes');
        chrome.storage.local.set({ 'notes': [] }, function () {
            setNotes([]);
        });
    }

    function remove(index) {
        console.log('Removing task:', index);
        chrome.storage.local.get('notes', function (result) {
            const noteList = result['notes'] || [];
            noteList.splice(index, 1);
            chrome.storage.local.set({ 'notes': noteList }, function () {
                setNotes(noteList);
                console.log('Note removed:', index);
            });
        });
    }

    function add() {
        var newNote = document.getElementById('note_ipt').value;
        if (!newNote) return;

        chrome.storage.local.get(['notes'], function (result) {
            const noteList = result.notes || [];

            noteList.push(newNote);

            chrome.storage.local.set({
                'notes': noteList
            }, function () {
                setNotes(noteList);
            });
        });
        document.getElementById('note_ipt').value = '';
    }

    const items = [];
    for (let i = 0; i < notes.length; i++) {
        items.push(
            <li key={`task_${i}`} style={{ listStyle: 'none', cursor: 'pointer' }}>
                {notes[i]}
                <button className="remove-task" onClick={() => remove(i)}>×</button>
            </li>
        );
    }

    const countMessage = 
        notes.length == 0 ? 
        <p>No notes :(</p> : 
        <p>{`${notes.length} note${notes.length > 1 ? 's' : ''}:`}</p>;

    return (
        <>
            <br />
            <input type="text" placeholder="new note" id='note_ipt' />
            <button onClick={add}>Add Note</button>
            {countMessage}
            <ul>
                {items}
            </ul>
            <button onClick={clear}>Clear All</button>
        </>
    );
}

export default Notes;

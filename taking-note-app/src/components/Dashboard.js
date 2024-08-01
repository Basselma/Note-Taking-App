// src/components/Dashboard.js
import React, { useRef, useState, useEffect } from 'react';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import NoteVersions from './NoteVersions';

const Dashboard = () => {
    const [noteToEdit, setNoteToEdit] = useState(null);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [filter, setFilter] = useState('All');
    const noteListRef = useRef();
    const historyRef = useRef();
    const noteFormRef = useRef();

    const handleNoteAdded = () => {
        if (noteListRef.current) {
            noteListRef.current.fetchNotes();
        }
        noteFormRef.current.scrollIntoView({ behavior: 'smooth' });
        setShowHistory(false); // Close note versions card
    };

    const handleEditNote = (note) => {
        setNoteToEdit(note);
        setSelectedNoteId(note.id);
        if (noteFormRef.current) {
            noteFormRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setShowHistory(false); // Close note versions card
    };

    const handleShowHistory = (noteId) => {
        setSelectedNoteId(noteId);
        setShowHistory(true);
        if (historyRef.current) {
            historyRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (showHistory && historyRef.current) {
            historyRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showHistory]);

    const handleCloseHistory = () => {
        setShowHistory(false);
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Dashboard</h2>
            <div className="note-form-container" ref={noteFormRef}>
                <NoteForm onNoteAdded={handleNoteAdded} noteToEdit={noteToEdit} setNoteToEdit={setNoteToEdit} />
            </div>
            <div className="note-filter-container">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="important">Important</option>
                </select>
            </div>
            <div className="note-list-container">
                <NoteList ref={noteListRef} onEditNote={handleEditNote} onShowHistory={handleShowHistory} filter={filter} />
            </div>
            {showHistory && (
                <div ref={historyRef}>
                    <NoteVersions noteId={selectedNoteId} onClose={handleCloseHistory} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;

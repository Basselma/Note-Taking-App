// src/components/NoteList.js
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc, orderBy, query, where } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';

const NoteList = forwardRef(({ onEditNote, onShowHistory, filter }, ref) => {
    const [notes, setNotes] = useState([]);
    const { currentUser } = useAuth();

    const fetchNotes = () => {
        if (!currentUser) return;

        let notesQuery = query(collection(db, 'notes'), where('uid', '==', currentUser.uid), orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
            let fetchedNotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (filter !== 'All') {
                fetchedNotes = fetchedNotes.filter(note => note.type === filter);
            }
            setNotes(fetchedNotes);
        });

        return unsubscribe;
    };

    useEffect(() => {
        const unsubscribe = fetchNotes();
        return unsubscribe;
    }, [currentUser, filter]);

    useImperativeHandle(ref, () => ({
        fetchNotes
    }));

    const handleDelete = async (id) => {
        if (!currentUser) {
            toast.error('You must be logged in to delete a note');
            return;
        }

        try {
            await deleteDoc(doc(db, 'notes', id));
            toast.success('Note deleted successfully!');
        } catch (error) {
            console.error('Error deleting document: ', error);
            toast.error('Failed to delete note');
        }
    };

    return (
        <div>
            <h2>Notes</h2>
            <ul>
                {notes.map(note => (
                    <li key={note.id}>
                        <span className="note-content">{note.content}</span>
                        <span className={`note-type ${note.type === 'important' ? 'important' : 'low-priority'}`}>
                            {note.type === 'important' ? 'Important' : 'Low Priority'}
                        </span>
                        <div className="btn-container">
                            <button className="edit-btn" onClick={() => onEditNote(note)}>Edit</button>
                            <button className="history-btn" onClick={() => onShowHistory(note.id)}>History</button>
                            <button className="delete-btn" onClick={() => handleDelete(note.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default NoteList;

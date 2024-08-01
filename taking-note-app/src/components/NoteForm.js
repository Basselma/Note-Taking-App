import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, serverTimestamp, doc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';

const NoteForm = ({ onNoteAdded, noteToEdit, setNoteToEdit }) => {
    const [content, setContent] = useState('');
    const [type, setType] = useState('low-priority');
    const { currentUser } = useAuth();
    const [originalNote, setOriginalNote] = useState(null);

    useEffect(() => {
        if (noteToEdit) {
            setContent(noteToEdit.content);
            setType(noteToEdit.type || 'low-priority');
            setOriginalNote(noteToEdit);
        }
    }, [noteToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert('You must be logged in to add a note');
            return;
        }

        if (originalNote && content === originalNote.content && type === originalNote.type) {
            alert('No changes detected');
            return;
        }

        const noteData = {
            content,
            type,
            uid: currentUser.uid,
            timestamp: serverTimestamp(),
        };

        try {
            if (noteToEdit) {
                const noteRef = doc(db, 'notes', noteToEdit.id);
                // Save the current version before updating
                await addDoc(collection(noteRef, 'versions'), {
                    content: noteToEdit.content,
                    type: noteToEdit.type,
                    timestamp: noteToEdit.timestamp || serverTimestamp(),
                });
                await updateDoc(noteRef, noteData);
                setNoteToEdit(null);
                toast.success('Note updated successfully!');
            } else {
                await addDoc(collection(db, 'notes'), noteData);
                toast.success('Note added successfully!');
            }

            setContent('');
            setType('low-priority');
            setOriginalNote(null);
            onNoteAdded();
        } catch (error) {
            console.error('Error adding/updating note: ', error);
            toast.error('Failed to add/update note');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="note-form">
            <textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="low-priority">Low Priority</option>
                <option value="important">Important</option>
            </select>
            <button type="submit">{noteToEdit ? 'Update Note' : 'Add Note'}</button>
        </form>
    );
};

export default NoteForm;

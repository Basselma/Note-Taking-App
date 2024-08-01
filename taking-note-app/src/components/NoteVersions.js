// src/components/NoteVersions.js
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, serverTimestamp, addDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const NoteVersions = ({ noteId, onClose }) => {
    const [versions, setVersions] = useState([]);
    const noteVersionsRef = useRef();

    useEffect(() => {
        const fetchVersions = async () => {
            const versionsQuery = query(collection(db, `notes/${noteId}/versions`), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(versionsQuery);
            setVersions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchVersions();
    }, [noteId]);

    const handleRestore = async (version) => {
        try {
            const noteRef = doc(db, 'notes', noteId);
            // Save the current version before restoring
            const currentNoteSnapshot = await getDoc(noteRef);
            await addDoc(collection(noteRef, 'versions'), {
                content: currentNoteSnapshot.data().content,
                type: currentNoteSnapshot.data().type,
                timestamp: currentNoteSnapshot.data().timestamp || serverTimestamp(),
            });

            await updateDoc(noteRef, {
                content: version.content,
                type: version.type,
                timestamp: serverTimestamp(),
            });
            toast.success('Note restored successfully!');
            noteVersionsRef.current.scrollIntoView({ behavior: 'smooth' });
            onClose(); // Close the history view
        } catch (error) {
            console.error('Error restoring note: ', error);
            toast.error('Failed to restore note');
        }
    };

    const handleDelete = async (versionId) => {
        try {
            const versionRef = doc(db, `notes/${noteId}/versions`, versionId);
            await deleteDoc(versionRef);
            setVersions(versions.filter(version => version.id !== versionId));
            toast.success('Version deleted successfully!');
        } catch (error) {
            console.error('Error deleting version: ', error);
            toast.error('Failed to delete version');
        }
    };

    return (
        <div className="note-versions-container" ref={noteVersionsRef}>
            <h2>Note Versions</h2>
            <button onClick={onClose}>Close</button>
            <ul>
                {versions.map(version => (
                    <li key={version.id}>
                        <div>{version.content}</div>
                        <div className={`note-type ${version.type === 'important' ? 'important' : 'low-priority'}`}>
                            {version.type === 'important' ? 'Important' : 'Low Priority'}
                        </div>
                        <div className="version-actions">
                            <button onClick={() => handleRestore(version)}>Restore</button>
                            <button onClick={() => handleDelete(version.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NoteVersions;

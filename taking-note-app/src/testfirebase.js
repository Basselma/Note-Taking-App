import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const TestFirebase = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            const querySnapshot = await getDocs(collection(db, "notes"));
            setNotes(querySnapshot.docs.map(doc => doc.data()));
        };

        fetchNotes();
    }, []);

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map((note, index) => (
                    <li key={index}>{note.content}<p>sacnkscnklsnksncknskscnkcs</p>  </li>



                ))}
            </ul>
        </div>
    );
};

export default TestFirebase;

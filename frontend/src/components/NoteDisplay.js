import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To access the note ID from the URL
import './NoteDisplay.css'; // Optional: For styling

const NoteDisplay = () => {
  const { noteId } = useParams(); // Extract the note ID from the URL
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the note from the backend
    const fetchNote = async () => {
      try {
        const response = await fetch(`https://localhost:5000/api/note/${noteId}`);
        const data = await response.json();
        if (response.ok) {
          setNote(data);
        } else {
          setError('Error fetching the note.');
        }
      } catch (err) {
        setError('Error connecting to the server.');
      }
    };

    fetchNote();
  }, [noteId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!note) {
    return <div>Loading...</div>;
  }

  return (
    <div className="note-display-container">
      <h2>Note Content</h2>
      <div className="note-content">{note.content}</div>
      <p>This note will self-destruct after being read.</p>
    </div>
  );
};

export default NoteDisplay;

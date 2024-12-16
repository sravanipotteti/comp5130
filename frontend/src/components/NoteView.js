import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header'; // Ensure Header is imported
import './NoteView.css';

const NoteView = () => {
  const { id } = useParams(); // Retrieve the note ID from the URL
  const [note, setNote] = useState(null); // State to hold the note data
  const [error, setError] = useState(''); // State to hold errors
  const navigate = useNavigate(); // Hook to handle navigation

  useEffect(() => {
    // Fetch the note from the backend
    const fetchNote = async () => {
      try {
        const response = await fetch(`https://localhost:5000/api/note/${id}`);
        const data = await response.json();

        if (response.ok) {
          setNote(data); // Set the note data if the response is OK
        } else {
          setError(data.message || 'Error fetching the note'); // Handle API errors
        }
      } catch (err) {
        setError('Error connecting to the server.'); // Handle connection errors
      }
    };

    fetchNote();
  }, [id]);

  // Handler for displaying and destroying the note
  const handleShowNote = async () => {
    if (note) {
      alert(`Note Content: ${note.message || 'No content'}`); // Display the note content
      try {
        // Destroy the note after reading
        const response = await fetch(`https://localhost:5000/api/note/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Error destroying the note');
        }

        // Navigate to the homepage after destroying the note
        navigate('/');
      } catch (err) {
        setError('Error destroying the note.');
      }
    }
  };

  if (error) {
    return (
      <div>
        <Header /> {/* Include the Header */}
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div>
        <Header /> {/* Include the Header */}
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Header /> {/* Ensure Header is included here */}
      <div className="note-view-container">
        <h2>Read and destroy?</h2>
        <p>You're about to read and destroy the note with id <strong>{id}</strong>.</p>
        <div className="actions">
          <button className="show-note-btn" onClick={handleShowNote}>
            Yes, show me the note
          </button>
          <button className="cancel-btn" onClick={() => navigate('/')}>
            No, not now
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default NoteView;

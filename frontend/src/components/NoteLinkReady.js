import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './NoteLinkReady.css';

const NoteLinkReady = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const noteLink = `https://localhost:5000/api/note/${noteId}`;

  console.log('Note ID:', noteId); // Debugging
  console.log('Note Link:', noteLink); // Debugging

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(noteLink);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Error copying link:', err);
      alert('Failed to copy the link.');
    }
  };

  const handleDestroyNote = async () => {
    try {
      const response = await fetch(noteLink, { method: 'DELETE' });

      if (response.ok) {
        const data = await response.json(); // Optional
        alert(data.message || 'Note destroyed successfully.');
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Unable to destroy the note.'}`);
      }
    } catch (error) {
      console.error('Error destroying the note:', error);
      alert('Error: Could not connect to the server.');
    }
  };

  const handleEmailLink = () => {
    window.open(`mailto:?subject=Note Link&body=${noteLink}`, '_blank');
  };

  return (
    <div className="note-link-ready-container">
      <div className="note-link-title">NOTELINK READY</div>
      <div className="note-link-box">
        <input type="text" value={noteLink} readOnly className="note-link-input" />
      </div>
      <div className="note-link-buttons">
        <button onClick={handleCopyLink}>Copy Link</button>
        <button className="email-link-btn" onClick={handleEmailLink}>
          Email Link
        </button>
        <button onClick={handleDestroyNote}>Destroy Link</button>
      </div>
    </div>
  );
};

export default NoteLinkReady;

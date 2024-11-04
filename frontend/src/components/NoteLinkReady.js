import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import './NoteLinkReady.css';

const NoteLinkReady = () => {
  const { noteId } = useParams(); // Fetch the noteId from the URL parameters
  const navigate = useNavigate();

  const noteLink = `https://localhost:5000/api/note/${noteId}`; // Dynamically create the link with the noteId

  const handleCopyLink = () => {
    navigator.clipboard.writeText(noteLink).then(() => {
      alert("Link copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy the link.");
    });
  };

  const handleDestroyNote = async () => {
    try {
      const response = await fetch(noteLink, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Note destroyed successfully.');
        navigate('/'); // Redirect to home or another page
      } else {
        alert('Error: Unable to destroy the note.');
      }
    } catch (error) {
      alert('Error: Could not connect to the server.');
    }
  };

  return (
    <div className="note-link-ready-container">
      <h2>Note link ready</h2>
      <p>The note link is ready. Copy the link below to share it. The note will self-destruct after it is read.</p> 
      <input type="text" value={noteLink} readOnly className="note-url"/>
      <button onClick={handleCopyLink}>Copy Link</button>
      <button onClick={handleDestroyNote}>Destroy note now</button>
      <p>Or, <a href={noteLink} target="_blank" rel="noopener noreferrer">click here</a> to open the note in a new tab.</p>
    </div>
  );
};

export default NoteLinkReady;

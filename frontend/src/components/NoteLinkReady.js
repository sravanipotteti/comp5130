import React from 'react';
import { useParams } from 'react-router-dom'; // Use this to grab the noteId from the URL
import './NoteLinkReady.css';

const NoteLinkReady = () => {
  const { noteId } = useParams(); // Fetch the noteId from the URL parameters

  const noteLink = `https://privnote.com/${noteId}`; // Dynamically create the link with the noteId

  // Function to handle copying the link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(noteLink).then(() => {
      alert("Link copied to clipboard!");
    }).catch((error) => {
      alert("Failed to copy the link.");
    });
  };

  return (
    <div className="note-link-ready-container">
      <h2>Note link ready</h2>
      <p>The note link is ready. Copy the link below to share it. The note will self-destruct after it is read.</p> 
      <input type="text" value={noteLink} readOnly className="note-url"/>
      <button onClick={() => navigator.clipboard.writeText(noteLink)}>Copy Link</button>
      <button onClick={() => alert("Note destroyed")}>Destroy note now</button>
    
    </div>
  );
};

export default NoteLinkReady;

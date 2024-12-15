import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './NoteForm.css';

const NoteForm = () => {
  const [noteContent, setNoteContent] = useState(''); // For the note content
  const [error, setError] = useState(''); // For handling errors
  const [showOptions, setShowOptions] = useState(false); // State for toggling options

  // State for options
  const [selfDestruct, setSelfDestruct] = useState('after reading it');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [skipConfirmation, setSkipConfirmation] = useState(false); // Checkbox for skipping confirmation

  const navigate = useNavigate(); // Hook to navigate to other routes

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError('');

    // Validate: if note content is empty, show an error
    if (!noteContent.trim()) {
      setError('Error: the note text is empty.');
      return;
    }

    // Validate password
    if (password && password !== confirmPassword) {
      setError('Error: passwords do not match.');
      return;
    }

    // API call to create the note
    try {
      const response = await fetch('https://localhost:5000/api/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: noteContent,
          selfDestruct,
          password,
          notificationEmail,
          skipConfirmation, // Send this option in the request body
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Redirect to the NoteLink page with the note ID as a parameter
        navigate(`/note/${data.url.split("/").pop()}`); // Navigate using note ID from URL
      } else {
        setError('Error: Something went wrong while creating the note.');
      }
    } catch (error) {
      setError('Error: Unable to connect to the server.');
    }
  };

  return (
    <div className="note-form-container">
      <h2>New note</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={noteContent} // Binds the value to noteContent
          onChange={(e) => setNoteContent(e.target.value)} // Updates noteContent when typing
          placeholder="Write your note here..."
          className="note-textarea"
        />
        {error && <div className="error-message">{error}</div>} {/* Display error message */}

        <div className="form-buttons">
          <button type="submit" className="create-btn">
            Create note
          </button>
          <button
            type="button"
            className="options-btn"
            onClick={() => setShowOptions(!showOptions)}
          >
            {showOptions ? 'Disable options' : 'Show options'}
          </button>
        </div>

        {showOptions && (
          <div className="options-section">
            {/* Self-destruct dropdown and checkbox in the same row */}
            <div className="destruct-options">
              <label>Note self-destructs</label>
              <select
                value={selfDestruct}
                onChange={(e) => setSelfDestruct(e.target.value)}
              >
                <option value="after reading it">after reading it</option>
                <option value="1 hour">1 hour</option>
                <option value="24 hours">24 hours</option>
                <option value="7 days">7 days</option>
                <option value="30 days">30 days</option>
              </select>

              {/* Checkbox aligned next to the dropdown */}
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={skipConfirmation}
                  onChange={(e) => setSkipConfirmation(e.target.checked)}
                />
                <label>Do not ask for confirmation before showing and destroying the note</label>
              </div>
            </div>

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />

            <label>Email for notification</label>
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default NoteForm;

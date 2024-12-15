import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import NoteForm from './components/NoteForm';
import NoteLinkReady from './components/NoteLinkReady';
import NoteDisplay from './components/NoteDisplay';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';// Import the ProtectedRoute component
import NoteView from './components/NoteView';


import './App.css';

const App = () => {
  return (
    <Router>
      <Header /> 
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Use ProtectedRoute for any protected paths */}
          
          <Route path="/" element={<ProtectedRoute element={NoteForm} />} /> 
          <Route path="/note/:noteId" element={<ProtectedRoute element={NoteLinkReady} />} />
          <Route path="/view-note/:id" element={<NoteView />} />
          <Route path="/view-note/:noteId" element={<ProtectedRoute element={NoteDisplay} />} />
          

        </Routes>  
      </main>
      
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import NoteForm from './components/NoteForm';
import NoteLinkReady from './components/NoteLinkReady';
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<NoteForm />} />
          <Route path="/note/:noteId" element={<NoteLinkReady />} />
        </Routes>
      </main>
    </Router>
    
  );
};

export default App;

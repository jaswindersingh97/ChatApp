import React from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Create a function to check if the token exists

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* Protect the chat page */}
        <Route path='/chatPage' element={<ProtectedRoute element={ChatPage} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

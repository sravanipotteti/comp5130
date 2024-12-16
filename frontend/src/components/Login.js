import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState(''); // Updated state to "username"
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://localhost:5000/api/auth/login', {
        username, // Send username to the backend instead of email
        password,
      });

      // Store JWT in localStorage
      localStorage.setItem('authToken', data.token);
      alert('Login successful');
      navigate('/'); // Redirect after successful login
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('User not found.');
      } else if (error.response && error.response.status === 400) {
        setError('Invalid credentials. Please try again.');
      } else {
        console.error('Login failed:', error);
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username} // Updated binding to "username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="error-message">{error}</div>}
          <div className="login-actions">
            

            <button type="submit">Login</button>
          </div>
        </form>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

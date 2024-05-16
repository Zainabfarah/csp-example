import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { mockLogin } from './Auth';
import config from './config'; 
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    const token = mockLogin(username, password);
    if (token) {
      const expiryTime = Date.now() + config.sessionTimeout;
      login(token, expiryTime);
    } else {
      alert('Felaktiga inloggningsuppgifter. Försök igen.');
    }
  };

  return (
    <div className="login-container">
      <h2>Logga In</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Användarnamn:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Lösenord:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Logga In</button>
      </form>
    </div>
  );
};

export default Login;

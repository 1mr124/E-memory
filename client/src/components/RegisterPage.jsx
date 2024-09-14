import React, { useState } from 'react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== repeatPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        // Handle successful registration (e.g., redirect to login page)
        window.location.href = '/login';
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('An error occurred');
    }
  };

  return (
    <div className="container">
      <header>
        <ul>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
        </ul>
      </header>

      <form onSubmit={handleSubmit} className="register-form">
        <h1>Register</h1>
        {error && <div className="error">{error}</div>}
        
        <input
          type="text"
          placeholder="User Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Repeat Password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          required
        />

        <button type="submit" className="registerbtn">Register</button>

        <p style={{ textAlign: 'center' }}>
          Already have an account? <a href="/login">Sign in</a>.
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;

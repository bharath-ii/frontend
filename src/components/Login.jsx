import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    if (validateForm()) {
      try {
        const response = await fetch('https://backend-qgqd.onrender.com/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // ✅ Save role based on credentials
          if (email === 'bharathkumar21cse@gmail.com' && password === 'Bharathkum123') {
            localStorage.setItem('role', 'admin');
          } else {
            localStorage.setItem('role', 'user');
          }

          alert('Login successful!');
          navigate('/products');
        } else {
          setServerError(data.message || 'Invalid email or password');
        }
      } catch (err) {
        setServerError('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Ganesh Malligai Grocery Shop</h1>
        <img
          src="/images/robot_logo.png.jpeg"
          alt="AI Bot"
          className="robot-icon"
          onClick={() => navigate('/ai')}
        />
      </header>

      <section>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

          <button type="submit">LOGIN</button>
          {serverError && <p style={{ color: 'red', marginTop: '10px' }}>{serverError}</p>}
        </form>

        <p style={{ marginTop: '15px' }}>
          Don't have an account?{' '}
          <span
            style={{ color: '#e65100', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/')}
          >
            Sign Up
          </span>
        </p>
      </section>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function SignUp() {
  const navigate = useNavigate();
  const [showBot, setShowBot] = useState(false);
  const [botResponse, setBotResponse] = useState('');
  const [query, setQuery] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleBotClick = () => setShowBot(!showBot);

  const handleAsk = () => {
    const q = query.toLowerCase();
    if (q.includes("timing") || q.includes("open")) {
      setBotResponse("We are open from 7:30 AM to 10:30 PM every day!");
    } else if (q.includes("special")) {
      setBotResponse("Try our signature honey-almond brioche – a customer favorite!");
    } else {
      setBotResponse("Sorry, I'm still learning. Please try another question.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!/^[a-zA-Z\s]{2,}$/.test(name)) {
      newErrors.name = "Name must be at least 2 characters long and contain only letters.";
    }
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      newErrors.password = "Password must be at least 8 characters, with 1 number and 1 uppercase letter.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      fetch('https://backend-qgqd.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      .then(res => {
        if (res.ok) {
          alert("Successfully signed up!");
          setName('');
          setEmail('');
          setPassword('');
          navigate('/login');
        } else if (res.status === 409) {
          alert("Email already exists.");
        } else {
          alert("Signup failed. Try again.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Server error. Please try later.");
      });
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1>Tharkuri Malig-[ai]</h1>
        <img
          src="/images/robot_logo.png.jpeg"
          alt="AI Bot"
          className="robot-icon"
          onClick={() => navigate('/ai')}
        />
      </header>

      {/* AI Assistant */}
      {showBot && (
        <section className="ai-window">
          <h3>Ask OvenBot 🤖</h3>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something..."
          />
          <button onClick={handleAsk}>Ask</button>
          <p>{botResponse}</p>
        </section>
      )}

      {/* About Us Section */}
      <section>
        <h2>About Us</h2>
        <p>
          At OvenBot Bakery, we blend tradition with tech! Enjoy warm, handmade pastries with a smart twist.
          Powered by love—and a tiny robot. 🧁🤖
        </p>
        <img className="bakery-preview centered" src="/images/bakery2.jpg" alt="Bakery View 1" />
        <img className="bakery-preview centered" src="/images/bakery1.jpg" alt="Bakery View 2" />
      </section>

      {/* Signup Form Section */}
      <section>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

          <button type="submit">SIGN UP</button>
        </form>

        {/* Already have account */}
        <p style={{ marginTop: '15px' }}>
          Already have an account?{' '}
          <span
            style={{ color: '#e65100', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </section>
    </div>
  );
}

export default SignUp;

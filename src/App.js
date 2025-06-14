// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Ai from './components/Ai';
import ProductPage from './components/ProductPage';
import AddProduct from './components/AddProduct'; // ✅ Added
import './index.css';
import Billing from './components/Billing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ai" element={<Ai />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/add-product" element={<AddProduct />} /> {/* ✅ Add Product Route */}
        <Route path='/billing' element={<Billing/>} />
      </Routes>
    </Router>
  );
}

export default App;

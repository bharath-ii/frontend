import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function AddProduct() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('role') === 'admin';

  const [formData, setFormData] = useState({
    id:'',
    Name: '',
    buying_price: '',
    selling_price: '',
    stock: ''
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');

  if (!isAdmin) {
    return (
      <div className="app-container">
        <h2>Unauthorized</h2>
        <p style={{ color: 'red' }}>Only admin can access this page.</p>
        <button onClick={() => navigate('/products')}>Go Back</button>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id || isNaN(formData.id)) newErrors.id = 'Valid ID is required.';
    if (!formData.Name) newErrors.Name = 'Product name is required.';
    if (!formData.buying_price || isNaN(formData.buying_price)) newErrors.buying_price = 'Valid buying price required.';
    if (!formData.selling_price || isNaN(formData.selling_price)) newErrors.selling_price = 'Valid selling price required.';
    if (!formData.stock || isNaN(formData.stock)) newErrors.stock = 'Valid stock value required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => { 
  e.preventDefault();
  setServerMessage('');

  if (validateForm()) {
    try {
      // Log the data being sent
      console.log('📦 Sending:', formData);

      const res = await fetch('https://backend-qgqd.onrender.com/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      // Log the raw server response
      console.log('🛠️ Server response:', data);

      if (res.ok) {
        alert('Product added successfully!');
        navigate('/products');
      } else {
        // Log and show specific server error
        console.error('❌ Error Response:', data.error || data.message || data);
        setServerMessage(data.error || data.message || 'Error adding product.');
      }
    } catch (err) {
      console.error('❌ Unexpected Error:', err);
      setServerMessage('Server error. Try again.');
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
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <input
  type="number"
  name="id"
  placeholder="Product ID"
  value={formData.id}
  onChange={handleChange}
/>
{errors.id && <p style={{ color: 'red' }}>{errors.id}</p>}

          <input
            type="text"
            name="Name"
            placeholder="Product Name"
            value={formData.Name}
            onChange={handleChange}
          />
          {errors.Name && <p style={{ color: 'red' }}>{errors.Name}</p>}

          <input
            type="number"
            name="buying_price"
            placeholder="Buying Price"
            step="0.01"
            value={formData.buying_price}
            onChange={handleChange}
          />
          {errors.buying_price && <p style={{ color: 'red' }}>{errors.buying_price}</p>}

          <input
            type="number"
            name="selling_price"
            placeholder="Selling Price"
            step="0.01"
            value={formData.selling_price}
            onChange={handleChange}
          />
          {errors.selling_price && <p style={{ color: 'red' }}>{errors.selling_price}</p>}

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
          />
          {errors.stock && <p style={{ color: 'red' }}>{errors.stock}</p>}

          <button type="submit">➕ Add Product</button>
          {serverMessage && <p style={{ color: 'red', marginTop: '10px' }}>{serverMessage}</p>}
          
        </form>

        <button
          style={{ marginTop: '20px', padding: '10px 20px' }}
          onClick={() => navigate('/products')}
        >
          Back to Products
        </button>
      </section>
    </div>
  );
}

export default AddProduct;

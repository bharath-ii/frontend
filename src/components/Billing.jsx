import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

export default function Billing() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [qty, setQty] = useState('');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [wantsEmail, setWantsEmail] = useState(false);
  const [email, setEmail] = useState('');


  useEffect(() => {
    fetch('https://backend-qgqd.onrender.com/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(err => {
        console.error(err);
        setError('Failed to fetch products');
      });
  }, []);

  const handleAdd = () => {
    const product = products.find(p => p.id === Number(selectedId));
    const quantity = Number(qty);

    if (!product) return setError('Select a valid product');
    if (!quantity || quantity < 1) return setError('Enter valid quantity');
    if (quantity > product.stock) return setError(`Only ${product.stock} kg available`);

    setError('');
    const subtotal = quantity * product.selling_price;

    setCart(prev => [...prev, {
      productId: product.id,
      name: product.Name,
      unitPrice: product.selling_price,
      qty: quantity,
      subtotal
    }]);

    setSelectedId('');
    setQty('');
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handlePay = async () => {
  try {
    const billingItems = cart.map(c => ({
      productId: c.productId,
      qty: c.qty
    }));

    const payload = {
      items: billingItems,
      ...(wantsEmail && email ? { email } : {})
    };

    const res = await axios.post('https://backend-qgqd.onrender.com/billing', payload);

    if (res.data.downloadUrl) {
      if (window.confirm('Do you want to download the bill?')) {
        window.open(`https://backend-qgqd.onrender.com${res.data.downloadUrl}`, '_blank');
      }
    }

    alert('✅ Payment successful!');
    setCart([]);
    setWantsEmail(false);
    setEmail('');
    navigate('/products');
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Billing failed');
  }
};


  return (
    <div className="app-container">
      <header className="header">
        <h1>Tharkuri Malig-[ai]</h1>
        <img
          src="/images/robot_logo.png.jpeg"
          alt="AI Bot"
          className="robot-icon"
          onClick={() => navigate('/ai')}
        />
      </header>

      <section><h2>Billing</h2></section>

      <section style={{ marginBottom: 20 }}>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          style={{ padding: 8, width: '50%' }}
        >
          <option value="">Select product...</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.Name} (₹{p.selling_price}, Stock: {p.stock})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Qty"
          value={qty}
          min="1"
          style={{ padding: 8, width: '30%', marginLeft: 10 }}
          onChange={e => setQty(e.target.value)}
        />
        <button
          onClick={handleAdd}
          style={{ padding: 8, marginLeft: 10 }}
          disabled={!selectedId || !qty}
        >Add</button>
      </section>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section>
        {cart.length === 0 ? (
          <p style={{ color: 'gray' }}>No items added</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
            <thead>
              <tr style={{ background: '#f2f2f2' }}>
                <th>Name</th><th>Qty</th><th>Unit ₹</th><th>Subtotal ₹</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((c, i) => (
                <tr key={i}>
                  <td>{c.name}</td>
                  <td>{c.qty}</td>
                  <td>{c.unitPrice}</td>
                  <td>{c.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
       <section style={{ marginBottom: 20 }}>
  <label>
    <input
      type="checkbox"
      checked={wantsEmail}
      onChange={() => setWantsEmail(!wantsEmail)}
      style={{ marginRight: 8 }}
    />
    Do you want to receive the billing details on your email?
  </label>

  {wantsEmail && (
    <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      style={{
        display: 'block',
        marginTop: 10,
        padding: 8,
        width: '60%',
        borderRadius: 4,
        border: '1px solid #ccc',
      }}
    />
  )}
</section>

      <section style={{ marginBottom: 20 }}>
        <h3>Total: ₹{total}</h3>
      </section>

      <button
        onClick={handlePay}
        disabled={cart.length === 0}
        style={{ padding: '10px 20px' }}
      >Mark Paid & Download PDF</button>
    </div>
  );
}

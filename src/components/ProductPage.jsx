import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function ProductPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
const [editForm, setEditForm] = useState({
  buying_price: '',
  selling_price: '',
  stock: ''
});



  // ✅ Admin check using localStorage
  const isAdmin = localStorage.getItem('role') === 'admin';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('https://backend-qgqd.onrender.com/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`https://backend-qgqd.onrender.com/products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) fetchProducts(); // Refresh after deletion
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };
  
  const handleUpdate = async () => {
  try {
    const res = await fetch(`https://backend-qgqd.onrender.com/products/${selectedProductId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    alert('✅ Product updated');
    // Refresh product list
    const refreshed = await fetch('https://backend-qgqd.onrender.com/products');
    const updatedProducts = await refreshed.json();
    setProducts(updatedProducts);
    setSelectedProductId('');
    setEditForm({ buying_price: '', selling_price: '', stock: '' });
  } catch (err) {
    alert('❌ Failed to update product');
    console.error(err);
  }
};


  // const handleLowStockEmail = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5000/products/low-stock/email');
  //     const result = await response.json();
  //     alert(result.message || 'Email sent successfully!');
  //   } catch (err) {
  //     alert('Failed to send email');
  //     console.error(err);
  //   }
  // };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
  <h1>Ganesh Malligai Grocery Shop</h1>

  {/* AI Bot Icon */}
  <img
    src="/images/robot_logo.png.jpeg"
    alt="AI Bot"
    className="robot-icon"
    onClick={() => navigate('/ai')}
  />
</header>

      {/* Welcome */}
      <section>
        <h2>Welcome to Our Product Shelf!</h2>
        <p>Explore our delicious lineup of treats made with love — and a touch of AI 🤖🍰</p>
      </section>

<section>
  <h2>Available Products</h2>

  <input
    type="text"
    placeholder="Search by product name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      padding: '8px',
      marginBottom: '10px',
      width: '50%',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    }}
  />

  {isAdmin && (
    <div style={{ marginBottom: 20 }}>
      <h3>🔧 Update Product Details</h3>
      <select
        value={selectedProductId}
        onChange={e => {
          const prod = products.find(p => p.id === Number(e.target.value));
          setSelectedProductId(prod?.id || '');
          setEditForm({
            buying_price: prod?.buying_price || '',
            selling_price: prod?.selling_price || '',
            stock: prod?.stock || ''
          });
        }}
        style={{ padding: 8, marginRight: 10 }}
      >
        <option value="">Select product to edit...</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.Name}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Buying Price"
        value={editForm.buying_price}
        onChange={e => setEditForm({ ...editForm, buying_price: e.target.value })}
        style={{ marginRight: 10 }}
      />
      <input
        type="number"
        placeholder="Selling Price"
        value={editForm.selling_price}
        onChange={e => setEditForm({ ...editForm, selling_price: e.target.value })}
        style={{ marginRight: 10 }}
      />
      <input
        type="number"
        placeholder="Stock"
        value={editForm.stock}
        onChange={e => setEditForm({ ...editForm, stock: e.target.value })}
        style={{ marginRight: 10 }}
      />
      <button onClick={handleUpdate}>Update</button>
    </div>
  )}

  {/* Table remains the same below */}

  {products.length > 0 ? (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={cellStyle}>ID</th>
          <th style={cellStyle}>Name</th>
          <th style={cellStyle}>Buying Price</th>
          <th style={cellStyle}>Selling Price</th>
          <th style={cellStyle}>Stock</th>
          {isAdmin && <th style={cellStyle}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {products
          .filter(item =>
            item.Name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item, index) => (
            <tr key={index} style={{ backgroundColor: item.stock < 3 ? '#ffdddd' : 'white' }}>
              <td style={cellStyle}>{item.id}</td>
              <td style={cellStyle}>{item.Name}</td>
              <td style={cellStyle}>{item.buying_price}</td>
              <td style={cellStyle}>{item.selling_price}</td>
              <td style={cellStyle}>{item.stock}</td>
              {isAdmin && (
                <td style={cellStyle}>
                  <button onClick={() => handleDelete(item.id)} style={deleteBtnStyle}>Delete</button>
                </td>
              )}
            </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p style={{ color: 'gray' }}>Loading products...</p>
  )}
</section>

      {/* ✅ Admin-only Options */}
      {isAdmin && (
        <section style={{ marginTop: '20px' }}>
          <button onClick={() => navigate('/add-product')} style={adminBtnStyle}>
            ➕ Add Product
          </button>
          <button onClick={() => navigate('/billing')} style={adminBtnStyle}>
            🧾 Billing
          </button>
        </section>
      )}

      {/* Back Button */}
      <section style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/signup')} style={{ padding: '10px 20px' }}>
          Go Back to Home
        </button>
      </section>
    </div>
  );
}

// Styles
const cellStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'left'
};

const deleteBtnStyle = {
  backgroundColor: '#e53935',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  cursor: 'pointer',
  borderRadius: '4px'
};

const adminBtnStyle = {
  backgroundColor: '#1565c0',
  color: 'white',
  padding: '10px 15px',
  marginRight: '10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default ProductPage;

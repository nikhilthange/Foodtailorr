import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/apiClient';

export default function MenuManager() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [activeTab, setActiveTab] = useState('dishes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catData, dishData] = await Promise.all([
        api.getAdminCategories(),
        api.getAdminDishes({ limit: 100 })
      ]);
      setCategories(catData || []);
      setDishes(dishData.dishes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDish = async (id, name) => {
    if (!window.confirm(`Delete dish ${name}?`)) return;
    try {
      await api.deleteAdminDish(id);
      setDishes(prev => prev.filter(d => d.id !== id));
    } catch { alert('Failed to delete dish'); }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category ${name}?`)) return;
    try {
      await api.deleteAdminCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch { alert('Failed to delete category (ensure it has no dishes)'); }
  };

  if (loading) return <div>Loading menu data...</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`admin-btn ${activeTab === 'dishes' ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
          onClick={() => setActiveTab('dishes')}
        >
          Dishes Management
        </button>
        <button 
          className={`admin-btn ${activeTab === 'categories' ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
          onClick={() => setActiveTab('categories')}
        >
          Category Management
        </button>
      </div>

      {activeTab === 'dishes' && (
        <div className="admin-glass-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">All Food Items</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Dish Name</th>
                  <th>Partner</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Price (Per Head)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map(d => (
                  <tr key={d.id}>
                    <td><strong>{d.name}</strong></td>
                    <td style={{ color: 'var(--admin-text-secondary)' }}>{d.partner?.businessName}</td>
                    <td>{d.category?.name}</td>
                    <td>
                      <span className={`admin-badge ${d.isVeg ? 'admin-badge--green' : 'admin-badge--red'}`}>
                        {d.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </td>
                    <td>₹{d.pricePerHead}</td>
                    <td>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDeleteDish(d.id, d.name)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="admin-glass-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Menu Categories</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Sort Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.sortOrder}</td>
                    <td>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDeleteCategory(c.id, c.name)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

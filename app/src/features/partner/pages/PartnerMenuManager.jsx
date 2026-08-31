import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/apiClient';

export default function PartnerMenuManager() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', pricePerHead: '', categoryId: '', isVeg: true, spiceLevel: 'MEDIUM', isAvailable: true });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dishesData, categoriesData] = await Promise.all([
        api.getPartnerDishes(),
        api.getCategories() // Global categories for selection
      ]);
      setDishes(dishesData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDish = async (id, name) => {
    if (!window.confirm(`Delete dish ${name}?`)) return;
    try {
      await api.deletePartnerDish(id);
      setDishes(prev => prev.filter(d => d.id !== id));
    } catch { alert('Failed to delete dish'); }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const updated = await api.updatePartnerDish(id, { isAvailable: !currentStatus });
      setDishes(prev => prev.map(d => d.id === id ? { ...d, isAvailable: updated.isAvailable } : d));
    } catch { alert('Failed to update availability'); }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDish = await api.createPartnerDish({
        ...formData,
        pricePerHead: parseInt(formData.pricePerHead, 10),
        isVeg: formData.isVeg === 'true' || formData.isVeg === true
      });
      setDishes([newDish, ...dishes]);
      setIsAdding(false);
      setFormData({ name: '', description: '', pricePerHead: '', categoryId: '', isVeg: true, spiceLevel: 'MEDIUM', isAvailable: true });
    } catch (err) {
      alert('Failed to add dish');
    }
  };

  if (loading) return <div>Loading menu data...</div>;

  return (
    <div>
      <div className="partner-card-header" style={{ marginBottom: '1.5rem' }}>
        <h2 className="partner-card-title">Menu Management</h2>
        <button className="partner-btn partner-btn--primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : '+ Add Food Item'}
        </button>
      </div>

      {isAdding && (
        <div className="partner-glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Add New Dish</h3>
          <form onSubmit={handleAddSubmit}>
            <div className="partner-grid partner-grid-cols-2">
              <div className="partner-form-group">
                <label className="partner-label">Dish Name</label>
                <input required className="partner-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="partner-form-group">
                <label className="partner-label">Category</label>
                <select required className="partner-select" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                  <option value="">Select Category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="partner-form-group">
                <label className="partner-label">Price (Per Head)</label>
                <input required type="number" min="0" className="partner-input" value={formData.pricePerHead} onChange={e => setFormData({...formData, pricePerHead: e.target.value})} />
              </div>
              <div className="partner-form-group">
                <label className="partner-label">Type</label>
                <select className="partner-select" value={formData.isVeg} onChange={e => setFormData({...formData, isVeg: e.target.value})}>
                  <option value={true}>Vegetarian</option>
                  <option value={false}>Non-Vegetarian</option>
                </select>
              </div>
              <div className="partner-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="partner-label">Description</label>
                <textarea className="partner-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
            </div>
            <button type="submit" className="partner-btn partner-btn--primary">Save Dish</button>
          </form>
        </div>
      )}

      <div className="partner-glass-card">
        <div className="partner-table-wrap">
          <table className="partner-table">
            <thead>
              <tr>
                <th>Dish Name</th>
                <th>Category</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map(d => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.name}</strong>
                    {d.isSignature && <span className="partner-badge partner-badge--yellow" style={{ marginLeft: '0.5rem' }}>Signature</span>}
                  </td>
                  <td>{d.category?.name}</td>
                  <td>
                    <span className={`partner-badge ${d.isVeg ? 'partner-badge--green' : 'partner-badge--red'}`}>
                      {d.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>
                  <td>₹{d.pricePerHead}</td>
                  <td>
                    <span className={`partner-badge ${d.isAvailable ? 'partner-badge--green' : 'partner-badge--gray'}`}>
                      {d.isAvailable ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="partner-btn partner-btn--ghost partner-btn--sm" onClick={() => handleToggleAvailability(d.id, d.isAvailable)}>
                      {d.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    <button className="partner-btn partner-btn--danger partner-btn--sm" onClick={() => handleDeleteDish(d.id, d.name)}>Delete</button>
                  </td>
                </tr>
              ))}
              {dishes.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--partner-text-secondary)' }}>
                    Start building your menu by adding your first dish.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

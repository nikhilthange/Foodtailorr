import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/apiClient';

export default function PartnerAnalytics() {
  const [analytics, setAnalytics] = useState({ orders: [] });
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getPartnerAnalytics(days);
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Simple aggregation for UI
  const totalRevenue = analytics.orders.reduce((acc, o) => o.status === 'COMPLETED' ? acc + o.totalAmount : acc, 0);
  const completedOrders = analytics.orders.filter(o => o.status === 'COMPLETED').length;
  
  // Aggregate top dishes
  const dishCounts = analytics.orders.reduce((acc, o) => {
    if (o.status !== 'CANCELLED' && o.status !== 'REJECTED') {
      acc[o.dishName] = (acc[o.dishName] || 0) + 1;
    }
    return acc;
  }, {});

  const topDishes = Object.entries(dishCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <div className="partner-card-header" style={{ marginBottom: '1.5rem' }}>
        <h2 className="partner-card-title">Business Analytics</h2>
        <select className="partner-select" style={{ width: 'auto' }} value={days} onChange={e => setDays(Number(e.target.value))}>
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      {loading ? (
        <div style={{ color: 'var(--partner-text-secondary)' }}>Loading analytics...</div>
      ) : (
        <>
          <div className="partner-grid partner-grid-cols-2" style={{ marginBottom: '2rem' }}>
            <div className="partner-glass-card">
              <div style={{ fontSize: '0.9rem', color: 'var(--partner-text-secondary)' }}>Revenue (Period)</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981', marginTop: '0.5rem' }}>
                ₹{totalRevenue.toLocaleString()}
              </div>
            </div>
            <div className="partner-glass-card">
              <div style={{ fontSize: '0.9rem', color: 'var(--partner-text-secondary)' }}>Completed Orders (Period)</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3B82F6', marginTop: '0.5rem' }}>
                {completedOrders}
              </div>
            </div>
          </div>

          <div className="partner-glass-card">
            <h3 className="partner-card-title" style={{ marginBottom: '1rem' }}>Top Performing Dishes</h3>
            <div className="partner-table-wrap">
              <table className="partner-table">
                <thead>
                  <tr>
                    <th>Dish Name</th>
                    <th>Times Ordered</th>
                  </tr>
                </thead>
                <tbody>
                  {topDishes.map(([name, count]) => (
                    <tr key={name}>
                      <td><strong>{name}</strong></td>
                      <td>{count}</td>
                    </tr>
                  ))}
                  {topDishes.length === 0 && (
                    <tr>
                      <td colSpan="2" style={{ textAlign: 'center', padding: '1rem', color: 'var(--partner-text-secondary)' }}>
                        Not enough data for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/apiClient';

export default function AILogsManager() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await api.getAdminAILogs({ limit: 50 });
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading AI Logs...</div>;

  return (
    <div className="admin-glass-card">
      <div className="admin-card-header">
        <h2 className="admin-card-title">AI Recommendation History</h2>
      </div>
      
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Provider</th>
              <th>Guests</th>
              <th>Budget</th>
              <th>Fallback</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--admin-text-secondary)' }}>{log.id.slice(0, 8)}</td>
                <td>{log.provider}</td>
                <td>{log.guestCount}</td>
                <td>₹{log.budgetPerHead}/head</td>
                <td>
                  <span className={`admin-badge ${log.isFallback ? 'admin-badge--red' : 'admin-badge--green'}`}>
                    {log.isFallback ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>{new Date(log.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-secondary)' }}>
                  No AI logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

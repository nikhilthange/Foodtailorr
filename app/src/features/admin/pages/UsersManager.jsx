import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/apiClient';
import { CheckCircle, XCircle } from 'lucide-react';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getAdminUsers({ limit: 100 });
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to deactivate user: ${name}?`)) return;
    try {
      await api.deleteAdminUser(userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: false } : u));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="admin-glass-card">
      <div className="admin-card-header">
        <h2 className="admin-card-title">User Management</h2>
      </div>
      
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.firstName} {u.lastName}</td>
                <td style={{ color: 'var(--admin-text-secondary)' }}>{u.email}</td>
                <td>
                  <span className={`admin-badge ${u.role === 'ADMIN' ? 'admin-badge--red' : u.role === 'PARTNER' ? 'admin-badge--purple' : 'admin-badge--blue'}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  {u.isActive ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10B981' }}><CheckCircle size={14} /> Active</span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#EF4444' }}><XCircle size={14} /> Inactive</span>
                  )}
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.isActive && u.role !== 'ADMIN' && (
                    <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDeleteUser(u.id, u.firstName)}>
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

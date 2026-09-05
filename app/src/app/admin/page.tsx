import AdminDashboardPage from '../../features/admin/AdminDashboardPage';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminDashboardPage />
    </ProtectedRoute>
  );
}

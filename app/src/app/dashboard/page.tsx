import DashboardPage from '../../features/customer/DashboardPage';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'PARTNER', 'ADMIN']}>
      <DashboardPage />
    </ProtectedRoute>
  );
}

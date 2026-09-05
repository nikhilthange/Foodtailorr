import PartnerDashboardPage from '../../features/partner/PartnerDashboardPage';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['PARTNER', 'ADMIN']}>
      <PartnerDashboardPage />
    </ProtectedRoute>
  );
}

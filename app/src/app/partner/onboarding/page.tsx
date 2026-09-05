import PartnerOnboardingPage from '../../../features/partner/PartnerOnboardingPage';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['PARTNER', 'ADMIN']}>
      <PartnerOnboardingPage />
    </ProtectedRoute>
  );
}

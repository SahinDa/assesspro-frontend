import { Route } from 'react-router-dom';
import { lazy } from 'react';

const RoleSelectionView = lazy(() => import('@/modules/users/views/RoleSelectionView'));
const OrganizationSetupView = lazy(() => import('@/modules/organizations/views/OrganizationSetupView'));

export const onboardingRoutes = (
  <>
    <Route path="/role-selection" element={<RoleSelectionView />} />
    <Route path="/organization/setup" element={<OrganizationSetupView />} />
  </>
);
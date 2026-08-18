import { UserRole, type UserRoleType } from '@/config/enums'
import { StudentDashboard } from '../components/StudentDashboard'
import { OrgAdminDashboard } from '../components/OrgAdminDashboard'
import { SuperAdminDashboard } from '../components/SuperAdminDashboard'

interface DashboardViewProps {
  role?: UserRoleType
  onNavigateToTest?: (testSetId: string) => void
  onNavigateToAnalysis?: (attemptId: string) => void
}

export default function DashboardView({
  role = UserRole.STUDENT,
  onNavigateToTest = () => {},
  onNavigateToAnalysis = () => {},
}: DashboardViewProps) {
  switch (role) {
    case UserRole.ADMIN:
      return <SuperAdminDashboard />
    case UserRole.ORGANIZATION:
      return <OrgAdminDashboard />
    case UserRole.STUDENT:
    default:
      return (
        <StudentDashboard 
          onStartTest={onNavigateToTest} 
          onViewAnalysis={onNavigateToAnalysis} 
        />
      )
  }
}
// src/modules/organization/views/OrganizationDashboardView.tsx
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { UserRole } from '@/config/enums'


export default function OrganizationDashboardView() {

  const currentRole =UserRole.ORGANIZATION
  
  const mockOrgData = {
    name: 'MadLife Academy',
    userName: 'Sahin Dafader',
    userEmail: 'sahin.dafader@assesspro.com',
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Navigation Bar driven by enum */}
      <Sidebar role={currentRole} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <TopBar 
          orgName={mockOrgData.name} 
          userName={mockOrgData.userName} 
          userEmail={mockOrgData.userEmail} 
        />

        {/* Dynamic Module Outlet / Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
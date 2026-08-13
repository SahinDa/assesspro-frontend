import { OrganizationSetupForm } from '../components/OrganizationSetupForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Building2 } from 'lucide-react'

export default function OrganizationSetupView() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <Card className="max-w-md w-full border-slate-200/80 shadow-sm bg-white rounded-2xl p-2">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <Building2 className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Onboarding • Step 1</span>
          <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Name your organization</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            This will appear across all your enterprise modules, batches, and candidate assessments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationSetupForm />
        </CardContent>
      </Card>
    </div>
  )
}
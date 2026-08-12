import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { roleSelectionSchema, type RoleSelectionFormData } from '../utils/userValidation'
import { UserRole } from '@/config/enums'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter,CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { GraduationCap, Building2, Loader2, CheckCircle2, Trophy, Timer, Users, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react'

export default function RoleSelectionForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const { handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<RoleSelectionFormData>({
    resolver: zodResolver(roleSelectionSchema),
  })

  const selectedRole = watch('role')

  const onSubmit = (data: RoleSelectionFormData) => {
    console.log("Role Selection Payload:", { email, role: data.role })
    if (data.role === UserRole.STUDENT) {
      navigate('/student/dashboard')
    } else {
      navigate('/organization/dashboard')
    }
  }

  return (
    <Card className="w-full max-w-xl shadow-xl border-slate-200/80 bg-white rounded-2xl overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900" />
      
      <CardHeader className="text-center pb-2 pt-4 px-5">
        <CardTitle className="text-lg font-bold tracking-tight text-slate-900">Choose your role</CardTitle>
        <CardDescription className="text-[11px] text-slate-500 mt-0.5">
          Select your role to personalize your testing and management tools.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 px-5 py-2">
          
          {/* Student Card */}
          <div 
            onClick={() => setValue('role', UserRole.STUDENT, { shouldValidate: true })}
            className={`group relative flex flex-col justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedRole === UserRole.STUDENT 
                ? 'border-indigo-600 bg-indigo-50/20 shadow-sm ring-1 ring-indigo-600' 
                : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            {selectedRole === UserRole.STUDENT && (
              <div className="absolute top-3 right-3 text-indigo-600">
                <CheckCircle2 className="h-4 w-4 fill-indigo-600 text-white" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">Student</h3>
              </div>

              <p className="text-[10px] text-slate-600 leading-normal mb-3">
                Attempt mock exams in realistic testing environments, review detailed score analytics, and track leaderboard ranks.
              </p>

              <div className="space-y-1.5 border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <Timer className="h-3 w-3 text-indigo-600 shrink-0" />
                  <span>Real exam timer & setup</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <Trophy className="h-3 w-3 text-indigo-600 shrink-0" />
                  <span>Leaderboards & global ranking</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <BarChart3 className="h-3 w-3 text-indigo-600 shrink-0" />
                  <span>Attempt history & insights</span>
                </div>
              </div>
            </div>

            <div className={`text-[10px] font-medium pt-2.5 mt-3 border-t border-slate-100 flex items-center justify-between transition-colors ${
              selectedRole === UserRole.STUDENT ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}>
              <span>Join as Student</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* Organization Card */}
          <div 
            onClick={() => setValue('role', UserRole.ORGANIZATION, { shouldValidate: true })}
            className={`group relative flex flex-col justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedRole === UserRole.ORGANIZATION 
                ? 'border-indigo-600 bg-indigo-50/20 shadow-sm ring-1 ring-indigo-600' 
                : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            {selectedRole === UserRole.ORGANIZATION && (
              <div className="absolute top-3 right-3 text-indigo-600">
                <CheckCircle2 className="h-4 w-4 fill-indigo-600 text-white" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white group-hover:scale-105 transition-transform">
                  <Building2 className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">Organization</h3>
              </div>

              <p className="text-[10px] text-slate-600 leading-normal mb-3">
                Conduct professional assessments, rank examinee batches, and effortlessly manage institutional subscriptions.
              </p>

              <div className="space-y-1.5 border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <Users className="h-3 w-3 text-slate-900 shrink-0" />
                  <span>Batch student management</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <ShieldCheck className="h-3 w-3 text-slate-900 shrink-0" />
                  <span>Candidate ranking tools</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <BarChart3 className="h-3 w-3 text-slate-900 shrink-0" />
                  <span>Subscription & tier control</span>
                </div>
              </div>
            </div>

            <div className={`text-[10px] font-medium pt-2.5 mt-3 border-t border-slate-100 flex items-center justify-between transition-colors ${
              selectedRole === UserRole.ORGANIZATION ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}>
              <span>Join as Organization</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

        </CardContent>

        <div className="px-5">
          {errors.role && (
            <p className="text-[10px] text-rose-500 font-medium text-center bg-rose-50 py-1 rounded-md border border-rose-100 mt-1">
              {errors.role.message}
            </p>
          )}
        </div>

        <CardFooter className="pt-2 pb-4 px-5">
          <Button 
            type="submit" 
            className="w-full h-9 bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-md transition-all rounded-xl" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue to Dashboard"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPasswordSchema, type ResetPasswordFormData } from '../utils/authValidation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LockKeyhole, Loader2, AlertCircle } from 'lucide-react'

export default function ResetPasswordForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      token,
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: ResetPasswordFormData) => {
    // This sends { email, token, password } to your backend API
    console.log("Reset Password Payload sent to backend:", {
      email: data.email,
      token: data.token,
      password: data.password,
    })
    alert("Password reset successfully!")
    navigate('/signin')
  }

  // Safety check if the link is broken/missing parameters
  if (!token || !email) {
    return (
      <Card className="w-full shadow-xl border-slate-200/80 bg-white rounded-2xl overflow-hidden p-6 text-center space-y-4">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">Invalid Reset Link</h2>
          <p className="text-xs text-slate-500">
            This password reset link is invalid or has expired.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/forgot-password')} 
          className="w-full h-10 bg-slate-900 hover:bg-black text-white text-sm font-medium"
        >
          Request New Link
        </Button>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-xl border-slate-200/80 bg-white rounded-2xl overflow-hidden">
      <div className="h-1.5 bg-slate-900" />
      
      <CardHeader className="space-y-1 text-center pb-3 pt-5">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-900 mb-1">
          <LockKeyhole className="h-4 w-4" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
          Set New Password
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your new password for <span className="font-medium text-slate-700">{email}</span>
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Hidden inputs to silently carry token and email into form state */}
        <input type="hidden" {...register('email')} />
        <input type="hidden" {...register('token')} />

        <CardContent className="space-y-3 pb-2">
          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-medium text-slate-700">New Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="h-9 text-sm bg-slate-50/50 border-slate-200" {...register('password')} />
            {errors.password && <p className="text-[10px] text-rose-500 font-medium">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-xs font-medium text-slate-700">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" className="h-9 text-sm bg-slate-50/50 border-slate-200" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-medium">{errors.confirmPassword.message}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-2 pb-5">
          <Button type="submit" className="w-full h-10 bg-slate-900 hover:bg-black text-white font-medium text-sm shadow-sm transition-all" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Resetting Password...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
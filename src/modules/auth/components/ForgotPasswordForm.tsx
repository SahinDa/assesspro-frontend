import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../utils/authValidation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordForm() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log("Forgot Password Form Data Submitted:", data)
    alert("Reset link request sent! Check console for payload.")
  }

  return (
    <Card className="w-full shadow-xl border-slate-200/80 bg-white rounded-2xl overflow-hidden">
      <div className="h-1.5 bg-slate-900" />
      
      <CardHeader className="space-y-1 text-center pb-3 pt-5">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-900 mb-1">
          <KeyRound className="h-4 w-4" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your email address and we'll send you a reset link
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-3 pb-2">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium text-slate-700">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" className="h-9 text-sm bg-slate-50/50 border-slate-200" {...register('email')} />
            {errors.email && <p className="text-[10px] text-rose-500 font-medium">{errors.email.message}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-2 pb-5">
          <Button type="submit" className="w-full h-10 bg-slate-900 hover:bg-black text-white font-medium text-sm shadow-sm transition-all" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Sending Reset Link...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </Button>
          
          <div className="text-xs text-center text-slate-500">
            <Button
              type="button"
              variant="link"
              onClick={() => navigate('/signin')}
              className="h-auto p-0 text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Sign In
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
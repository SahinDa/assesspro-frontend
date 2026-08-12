import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { signInSchema, type SignInFormData } from '../utils/authValidation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LogIn, Loader2 } from 'lucide-react'

export default function SignInForm() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = (data: SignInFormData) => {
    console.log("Sign In Form Data Submitted:", data)
    alert("Sign In validation passed! Check console for payload.")
  }

  return (
    <Card className="w-full shadow-xl border-slate-200/80 bg-white rounded-2xl overflow-hidden">
      <div className="h-1.5 bg-slate-900" />
      
      <CardHeader className="space-y-1 text-center pb-3 pt-5">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-900 mb-1">
          <LogIn className="h-4 w-4" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-3 pb-2">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium text-slate-700">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" className="h-9 text-sm bg-slate-50/50 border-slate-200" {...register('email')} />
            {errors.email && <p className="text-[10px] text-rose-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-medium text-slate-700">Password</Label>
              <Button 
                type="button" 
                variant="link"
                onClick={() => navigate('/forgot-password')}
                className="h-auto p-0 text-[11px] text-slate-500 hover:text-slate-900 font-medium"
              >
                Forgot Password?
              </Button>
            </div>
            <Input id="password" type="password" placeholder="••••••••" className="h-9 text-sm bg-slate-50/50 border-slate-200" {...register('password')} />
            {errors.password && <p className="text-[10px] text-rose-500 font-medium">{errors.password.message}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-2 pb-5">
          <Button type="submit" className="w-full h-10 bg-slate-900 hover:bg-black text-white font-medium text-sm shadow-sm transition-all" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
          
          <div className="text-xs text-center text-slate-500 flex items-center justify-center gap-1">
            Don't have an account?{" "}
            <Button
              type="button"
              variant="link"
              onClick={() => navigate('/signup')}
              className="h-auto p-0 text-slate-900 font-semibold hover:underline"
            >
              Sign Up
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
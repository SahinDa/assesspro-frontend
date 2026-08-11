import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, type SignUpFormData } from '../utils/authValidation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus, Loader2 } from 'lucide-react'

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = (data: SignUpFormData) => {
    console.log("Signup Form Data Submitted:", data)
    alert("Signup validation passed! Check console for data payload.")
  }

  return (
    <Card className="w-full shadow-xl border-slate-200/80 bg-white rounded-2xl overflow-hidden">
      <div className="h-1.5 bg-slate-900" />
      
      <CardHeader className="space-y-1 text-center pb-4 pt-6">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-900 mb-1">
          <UserPlus className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
          Create an Account
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your details below to get started
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-3 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="firstname" className="text-xs font-medium text-slate-700">First Name</Label>
              <Input id="firstname" placeholder="John" className="h-9 text-sm bg-slate-50/50 border-slate-200" {...register('firstname')} />
              {errors.firstname && <p className="text-[10px] text-rose-500 font-medium">{errors.firstname.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastname" className="text-xs font-medium text-slate-700">Last Name</Label>
              <Input id="lastname" placeholder="Doe" className="h-9 text-sm bg-slate-50/50 border-slate-200" {...register('lastname')} />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium text-slate-700">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" className="h-9 text-sm bg-slate-50/50 border-slate-200" {...register('email')} />
            {errors.email && <p className="text-[10px] text-rose-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-medium text-slate-700">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="h-9 text-sm bg-slate-50/50 border-slate-200" {...register('password')} />
            {errors.password && <p className="text-[10px] text-rose-500 font-medium">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-xs font-medium text-slate-700">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" className="h-9 text-sm bg-slate-50/50 border-slate-200" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-medium">{errors.confirmPassword.message}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-2 pb-6">
          <Button type="submit" className="w-full h-10 bg-slate-900 hover:bg-black text-white font-medium text-sm shadow-sm transition-all" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
          
          <div className="text-xs text-center text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => alert("Sign In component coming soon!")}
              className="text-slate-900 font-semibold hover:underline focus:outline-none"
            >
              Sign In
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
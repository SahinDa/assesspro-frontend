import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verifyOtpSchema, type VerifyOtpFormData } from '../utils/authValidation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, Loader2 } from 'lucide-react'

export default function VerifyOtpForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email, otp: '' },
  })

  const onSubmit = (data: VerifyOtpFormData) => {
    console.log("Verify OTP Payload:", data)
    navigate('/role-selection')
  }

  const handleResendOtp = () => {
    console.log("Resend OTP for:", email)
    alert("New OTP sent to your email!")
  }

  return (
    <Card className="w-full shadow-xl border-slate-200/80 bg-white rounded-2xl overflow-hidden">
      <div className="h-1.5 bg-slate-900" />
      <CardHeader className="text-center pb-3 pt-5">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 mb-1">
          <ShieldCheck className="h-4 w-4 text-slate-900" />
        </div>
        <CardTitle className="text-xl font-bold text-slate-900">Verify Email</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter the code sent to <span className="font-medium text-slate-700">{email}</span>
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register('email')} />

        <CardContent className="space-y-2 pb-2">
          <Label htmlFor="otp" className="text-xs font-medium text-slate-700">6-Digit OTP</Label>
          <Input 
            id="otp" 
            maxLength={6} 
            placeholder="123456" 
            className="h-10 text-center text-lg tracking-widest font-mono" 
            {...register('otp')} 
          />
          {errors.otp && <p className="text-[10px] text-rose-500 font-medium text-center">{errors.otp.message}</p>}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 pt-2 pb-5">
          <Button type="submit" className="w-full h-10 bg-slate-900 hover:bg-black text-white text-sm" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify OTP"}
          </Button>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-9 text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={handleResendOtp}
          >
            Resend OTP
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
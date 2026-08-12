import ForgotPasswordForm from '../components/ForgotPasswordForm'

export default function ForgotPasswordView() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
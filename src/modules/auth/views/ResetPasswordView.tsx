import ResetPasswordForm from '../components/ResetPasswordForm'

export default function ResetPasswordView() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
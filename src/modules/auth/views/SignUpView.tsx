import SignUpForm from '../components/SignUpForm'

export default function SignUpView() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}
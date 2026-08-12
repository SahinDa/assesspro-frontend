import SignInForm from '../components/SignInForm'

export default function SignInView() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <SignInForm onSwitchToSignUp={() => window.location.href = '/signup'} />
      </div>
    </div>
  )
}
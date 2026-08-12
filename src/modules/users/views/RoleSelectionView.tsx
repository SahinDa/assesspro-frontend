import RoleSelectionForm from '../components/RoleSelectionForm'

export default function RoleSelectionView() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <RoleSelectionForm />
      </div>
    </div>
  )
}
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { organizationInputSchema, type OrganizationInputDTO } from '../utils/organizationValidation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { organizationService } from '../services/organizationService'
import { UserRole } from '@/config/enums'
import { useAuthStore } from '@/stores/authStore'

export function OrganizationSetupForm() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid, touchedFields, isSubmitting },
  } = useForm<OrganizationInputDTO>({
    resolver: zodResolver(organizationInputSchema),
    mode: 'onChange',
  })

  const currentName = watch('name', '')
  const updateUser = useAuthStore((state) => state.updateUser)

  const onSubmit = async (data: OrganizationInputDTO) => {
    setServerError(null);
    try {
      const organization = await organizationService.create(data);
      if (organization) {
        updateUser({
          role: UserRole.ORGANIZATION,
          org_id: organization.id,
          org_name: organization.name,
          org_status: organization.status,
        })
      }
      navigate('/dashboard/organization')
    } catch (err) {
      const status = err.response?.status
      const backendMessage = err.response?.data?.message

      if (status === 409) {
        setError('name', {
          type: 'manual',
          message: backendMessage || 'An organization with this name already exists.',
        })
      } else {
        setServerError(backendMessage || 'Failed to create organization. Please try again.')
      }
    }

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}
      <div className="space-y-1.5">
        <label htmlFor="orgNameInput" className="block text-xs font-semibold text-slate-700">
          Organization Name <span className="text-rose-500">*</span>
        </label>

        <div className="relative">
          <Input
            id="orgNameInput"
            type="text"
            placeholder="e.g. Acme Tech Academy"
            {...register('name')}
            className={`w-full text-xs h-10 px-3.5 bg-slate-50/50 rounded-xl transition-all ${errors.name
                ? 'border-rose-300 focus-visible:ring-rose-100'
                : touchedFields.name && isValid
                  ? 'border-emerald-300 focus-visible:ring-emerald-100'
                  : 'border-slate-200 focus-visible:ring-indigo-100'
              }`}
          />
          <div className="absolute right-3 top-3 flex items-center">
            {touchedFields.name && isValid && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] px-0.5 pt-1">
          <div>
            {errors.name ? (
              <span className="text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="h-3 w-3" /> {errors.name.message}
              </span>
            ) : (
              <span className="text-slate-400">Between 3 and 32 characters.</span>
            )}
          </div>
          <span className={`font-mono ${currentName.length > 32 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
            {currentName.length}/32
          </span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full h-10 bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-xs font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Creating Organization...</span>
          </span>
        ) : (
          <>
            <span>Continue to Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </Button>
    </form>
  )
}
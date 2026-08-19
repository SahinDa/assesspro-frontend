import { useState, useEffect } from 'react'
import { Plus, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { baseTestSchema, type TestFormData } from '../utils/testValidation'
import type { TestItem } from '../views/OrgTestsView'

interface TestFormModalProps {
  isOpen: boolean
  test?: TestItem | null // If null/undefined -> Create Mode, else -> Edit Mode
  onClose: () => void
  onSubmit: (data: TestFormData, id?: string) => void
}

export default function TestFormModal({ isOpen, test, onClose, onSubmit }: TestFormModalProps) {
  const isEditing = Boolean(test)

  const [formData, setFormData] = useState<TestFormData>({
    name: '',
    description: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof TestFormData, string>>>({})

  // Sync form data on open/switch
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: test?.name || '',
        description: test?.description || '',
      })
      setErrors({})
    }
  }, [isOpen, test])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = baseTestSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TestFormData, string>> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof TestFormData] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    onSubmit(result.data, test?.id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[460px] rounded-2xl bg-white p-6 shadow-xl border-slate-200">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base font-bold text-slate-900">
            {isEditing ? 'Edit Test' : 'Create New Test'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {isEditing
              ? 'Update test details and description.'
              : 'Create a test to group and manage your test sets.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Test Name */}
          <div className="space-y-1.5">
            <Label htmlFor="test-name" className="text-xs font-semibold text-slate-700">
              Test Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="test-name"
              placeholder="e.g. Operating Systems Mock Series"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (errors.name) setErrors({ ...errors, name: undefined })
              }}
              className={`text-xs rounded-xl h-10 border-slate-200 focus-visible:ring-indigo-500 ${
                errors.name ? 'border-rose-400 focus-visible:ring-rose-400' : ''
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-rose-500 font-medium leading-tight">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="test-desc" className="text-xs font-semibold text-slate-700">
              Description <span className="text-slate-400 font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="test-desc"
              placeholder="Brief summary of topics or syllabus covered..."
              rows={3}
              value={formData.description || ''}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value })
                if (errors.description) setErrors({ ...errors, description: undefined })
              }}
              className="text-xs rounded-xl border-slate-200 resize-none focus-visible:ring-indigo-500"
            />
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs border-slate-200 h-9 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-xl text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-9 px-4 gap-1.5 shadow-xs cursor-pointer"
            >
              {isEditing ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Create Test
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
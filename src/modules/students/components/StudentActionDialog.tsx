import { CheckCircle2, XCircle, Trash2, Mail } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { StudentUserItem } from '../views/OrgStudentsView'

export type StudentActionType = 'approve' | 'reject' | 'remove'

interface StudentActionDialogProps {
  isOpen: boolean
  actionType: StudentActionType | null
  student: StudentUserItem | null
  onClose: () => void
  onConfirm: () => void
}

export default function StudentActionDialog({
  isOpen,
  actionType,
  student,
  onClose,
  onConfirm,
}: StudentActionDialogProps) {
  if (!actionType || !student) return null

  const config = {
    approve: {
      title: 'Approve Request',
      description: 'Grant this student access to organization tests and learning materials.',
      confirmText: 'Approve',
      icon: CheckCircle2,
      iconStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      avatarStyle: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    reject: {
      title: 'Reject Request',
      description: 'Decline this application and move it to the audit records.',
      confirmText: 'Reject',
      icon: XCircle,
      iconStyle: 'bg-rose-50 text-rose-600 border-rose-100',
      btnStyle: 'bg-rose-600 hover:bg-rose-700 text-white',
      avatarStyle: 'bg-rose-50 text-rose-700 border-rose-100',
    },
    remove: {
      title: 'Remove Student',
      description: 'Revoke organization access for this student account.',
      confirmText: 'Remove',
      icon: Trash2,
      iconStyle: 'bg-rose-50 text-rose-600 border-rose-100',
      btnStyle: 'bg-rose-600 hover:bg-rose-700 text-white',
      avatarStyle: 'bg-rose-50 text-rose-700 border-rose-100',
    },
  }[actionType]

  const IconComponent = config.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[380px] rounded-2xl bg-white p-5 shadow-xl border-slate-200 gap-4">
        {/* Header */}
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2.5">
            <div className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 ${config.iconStyle}`}>
              <IconComponent className="h-4 w-4" />
            </div>
            <DialogTitle className="text-sm font-bold text-slate-900">
              {config.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 pt-0.5">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {/* Minimal Student Meta */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
          <div className={`h-7 w-7 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${config.avatarStyle}`}>
            {student.name.charAt(0).toUpperCase() || 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {student.name}
            </p>
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 font-normal">
              <Mail className="h-3 w-3 text-slate-400 shrink-0" />
              {student.email}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="pt-1 gap-2 sm:gap-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs border-slate-200 h-8.5 px-3.5 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            className={`rounded-xl text-xs font-semibold h-8.5 px-4 cursor-pointer shadow-xs ${config.btnStyle}`}
          >
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
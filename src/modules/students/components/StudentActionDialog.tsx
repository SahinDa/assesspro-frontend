import { AlertTriangle, CheckCircle2, UserX } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export type StudentActionType = 'approve' | 'reject' | 'remove'

interface StudentActionDialogProps {
  isOpen: boolean
  actionType: StudentActionType | null
  studentName: string
  onClose: () => void
  onConfirm: () => void
}

export default function StudentActionDialog({
  isOpen,
  actionType,
  studentName,
  onClose,
  onConfirm,
}: StudentActionDialogProps) {
  if (!actionType) return null

  const config = {
    approve: {
      title: 'Approve Join Request',
      description: `Are you sure you want to approve "${studentName}"? They will gain access to all published tests in your organization.`,
      btnText: 'Approve Request',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-100',
    },
    reject: {
      title: 'Reject Join Request',
      description: `Are you sure you want to reject "${studentName}"'s request to join this organization?`,
      btnText: 'Reject Request',
      btnClass: 'bg-rose-600 hover:bg-rose-700 text-white',
      icon: <UserX className="h-5 w-5 text-rose-600" />,
      iconBg: 'bg-rose-50 border-rose-100',
    },
    remove: {
      title: 'Remove Student',
      description: `Are you sure you want to remove "${studentName}" from your organization? Their test records will be archived.`,
      btnText: 'Remove Student',
      btnClass: 'bg-rose-600 hover:bg-rose-700 text-white',
      icon: <AlertTriangle className="h-5 w-5 text-rose-600" />,
      iconBg: 'bg-rose-50 border-rose-100',
    },
  }[actionType]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl bg-white p-6 shadow-xl border-slate-200">
        <div className="flex items-start gap-3.5">
          <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${config.iconBg}`}>
            {config.icon}
          </div>

          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base font-bold text-slate-900">
              {config.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 leading-relaxed">
              {config.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="pt-4 gap-2 sm:gap-2">
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
            type="button"
            size="sm"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`rounded-xl text-xs font-semibold h-9 px-4 gap-1.5 shadow-xs cursor-pointer ${config.btnClass}`}
          >
            {config.btnText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
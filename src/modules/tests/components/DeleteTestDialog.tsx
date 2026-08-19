import { AlertTriangle, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { TestItem } from '../views/OrgTestsView'

interface DeleteTestDialogProps {
  isOpen: boolean
  test: TestItem | null
  isDeleting?: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

export default function DeleteTestDialog({
  isOpen,
  test,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteTestDialogProps) {
  if (!test) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl bg-white p-6 shadow-xl border-slate-200">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base font-bold text-slate-900">
              Delete Test
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-900">"{test.name}"</span>? All underlying test sets and question series will be permanently removed.
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="pt-4 gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isDeleting}
            onClick={onClose}
            className="rounded-xl text-xs border-slate-200 h-9 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isDeleting}
            onClick={() => onConfirm(test.id)}
            className="rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold h-9 px-4 gap-1.5 shadow-xs cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Test'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
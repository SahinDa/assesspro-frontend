import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export interface DeletableTestSet {
  id: string
  name: string
}

interface DeleteTestSetDialogProps {
  isOpen: boolean
  testSet: DeletableTestSet | null
  onClose: () => void
  onConfirm: (id: string) => void
}

export default function DeleteTestSetDialog({
  isOpen,
  testSet,
  onClose,
  onConfirm,
}: DeleteTestSetDialogProps) {
  if (!testSet) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl bg-white p-6 shadow-xl border-slate-200">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base font-bold text-slate-900">
              Delete Test Set
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-900">"{testSet.name}"</span>? All questions and configuration rules for this set will be removed.
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
            onClick={() => onConfirm(testSet.id)}
            className="rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold h-9 px-4 gap-1.5 shadow-xs cursor-pointer"
          >
            Delete Test Set
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
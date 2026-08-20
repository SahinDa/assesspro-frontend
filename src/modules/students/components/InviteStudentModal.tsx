import { useState, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react'
import { UserPlus, X, Send, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  inviteStudentsSchema,
  parseRawEmails,
  isValidEmail,
  type InviteStudentsFormData,
} from '../utils/studentValidation'

interface InviteStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (data: InviteStudentsFormData) => void
}

export default function InviteStudentModal({
  isOpen,
  onClose,
  onInvite,
}: InviteStudentModalProps) {
  const [emailList, setEmailList] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setEmailList([])
      setInputValue('')
      setError(null)
    }
  }, [isOpen])

  const addEmails = (raw: string) => {
    setError(null)
    const candidates = parseRawEmails(raw)
    if (candidates.length === 0) return

    const validNewEmails: string[] = []
    const invalidEmails: string[] = []

    candidates.forEach((email) => {
      if (!isValidEmail(email)) {
        invalidEmails.push(email)
      } else if (!emailList.includes(email) && !validNewEmails.includes(email)) {
        validNewEmails.push(email)
      }
    })

    if (invalidEmails.length > 0) {
      setError(`Invalid: ${invalidEmails.join(', ')}`)
    }

    if (validNewEmails.length > 0) {
      setEmailList((prev) => [...prev, ...validNewEmails])
      setInputValue('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ',', ' ', 'Tab'].includes(e.key)) {
      e.preventDefault()
      if (inputValue.trim()) {
        addEmails(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && emailList.length > 0) {
      setEmailList((prev) => prev.slice(0, -1))
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    addEmails(e.clipboardData.getData('text'))
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailList((prev) => prev.filter((e) => e !== emailToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let currentEmails = [...emailList]
    if (inputValue.trim()) {
      const candidates = parseRawEmails(inputValue)
      candidates.forEach((email) => {
        if (isValidEmail(email) && !currentEmails.includes(email)) {
          currentEmails.push(email)
        }
      })
    }

    const result = inviteStudentsSchema.safeParse({ emails: currentEmails })

    if (!result.success) {
      setError(result.error.errors[0]?.message || 'Enter at least one valid email.')
      return
    }

    onInvite(result.data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl bg-white p-4.5 shadow-xl border-slate-200">
        <DialogHeader className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <UserPlus className="h-3.5 w-3.5" />
            </div>
            <DialogTitle className="text-sm font-bold text-slate-900">
              Invite Students
            </DialogTitle>
          </div>
          <DialogDescription className="text-[11px] text-slate-500 pt-0.5">
            Type an email and press <kbd className="px-1 py-0.2 text-[9px] bg-slate-100 border border-slate-200 rounded font-mono text-slate-600">Enter</kbd> or paste comma-separated emails.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-semibold text-slate-700">
                Student Email <span className="text-rose-500">*</span>
              </Label>
              {emailList.length > 0 && (
                <span className="text-[10px] text-slate-400 font-medium">
                  {emailList.length} added
                </span>
              )}
            </div>

            {/* Standard Single-Height Input Box (36px min-height) */}
            <div
              className={`min-h-[36px] max-h-[72px] overflow-y-auto px-2 py-1 rounded-xl border bg-white flex flex-wrap gap-1 items-center focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all ${
                error ? 'border-rose-400' : 'border-slate-200'
              }`}
            >
              {emailList.map((email) => (
                <Badge
                  key={email}
                  variant="secondary"
                  className="h-6 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-medium pl-1.5 pr-0.5 py-0 gap-1 flex items-center shrink-0"
                >
                  <span className="truncate max-w-[150px]">{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="h-3.5 w-3.5 rounded flex items-center justify-center hover:bg-indigo-200/70 text-indigo-500 hover:text-indigo-800 cursor-pointer outline-none"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))}

              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  if (error) setError(null)
                }}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onBlur={() => {
                  if (inputValue.trim()) addEmails(inputValue)
                }}
                placeholder={emailList.length === 0 ? 'name@example.com...' : 'Add more...'}
                className="flex-1 min-w-[120px] h-6 border-0 bg-transparent px-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-1 text-rose-500 text-[10px] font-medium pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs border-slate-200 h-8 px-3 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-xl text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-8 px-3.5 gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="h-3 w-3" />
              <span>
                {emailList.length > 1 ? `Invite (${emailList.length})` : 'Send Invite'}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
import { useState } from 'react'
import { Megaphone, Pin, Link as LinkIcon, Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { UserRole, type UserRoleType } from '@/config/enums'

interface CreateAnnouncementModalProps {
  role: UserRoleType
  orgId?: string | null
  onSubmit: (payload: {
    orgId: string | null
    is_global: true
    subject: string
    message: string
    url?: string
    isPinned: boolean
  }) => Promise<void> | void
  isSubmitting?: boolean
}

export default function CreateAnnouncementModal({
  role,
  orgId = null,
  onSubmit,
  isSubmitting = false,
}: CreateAnnouncementModalProps) {
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [url, setUrl] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = role === UserRole.ADMIN

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (subject.trim().length < 3) {
      setError('Subject must be at least 3 characters.')
      return
    }
    if (message.trim().length < 5) {
      setError('Message must be at least 5 characters.')
      return
    }

    await onSubmit({
      orgId: isAdmin ? null : orgId,
      is_global: true,
      subject: subject.trim(),
      message: message.trim(),
      url: url.trim() || undefined,
      isPinned,
    })

    setSubject('')
    setMessage('')
    setUrl('')
    setIsPinned(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5 shadow-xs cursor-pointer"
        >
          <Megaphone className="h-4 w-4" />
          <span>{isAdmin ? 'New Platform Broadcast' : 'New Announcement'}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-lg font-black tracking-tight">
              {isAdmin ? 'Create Platform Broadcast' : 'Publish Organization Announcement'}
            </DialogTitle>
            <Badge variant="secondary" className="text-[10px] font-bold">
              {isAdmin ? 'Admin' : 'Organization'}
            </Badge>
          </div>
          <DialogDescription className="text-xs">
            {isAdmin
              ? 'Send an announcement visible across the entire platform.'
              : 'Broadcast an announcement to all students in your organization.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="ann-subject" className="text-xs font-bold">
              Subject
            </Label>
            <Input
              id="ann-subject"
              placeholder="e.g., Semester Mock Exam Schedule Released"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={150}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ann-message" className="text-xs font-bold">
              Message
            </Label>
            <Textarea
              id="ann-message"
              placeholder="Write the full announcement details..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="rounded-xl text-xs resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ann-url" className="text-xs font-bold flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Reference Link (Optional)</span>
            </Label>
            <Input
              id="ann-url"
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>

          {/* Pin Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border p-3 bg-amber-50/40">
            <div className="flex items-center gap-2.5">
              <Pin className="h-4 w-4 text-amber-700" />
              <div>
                <p className="text-xs font-bold text-foreground">Pin Announcement</p>
                <p className="text-[11px] text-muted-foreground">
                  Keep anchored at the top of the feed
                </p>
              </div>
            </div>
            <Switch checked={isPinned} onCheckedChange={setIsPinned} />
          </div>

          {error && <p className="text-xs font-semibold text-destructive">{error}</p>}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
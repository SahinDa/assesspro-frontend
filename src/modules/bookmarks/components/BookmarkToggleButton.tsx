import { useState, useEffect } from 'react'
import { Bookmark, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookmarkToggleButtonProps {
  itemId: string
  itemType?: number // 1: Test, 2: Test Set
  initialBookmarked?: boolean
  isLoading?: boolean
  onToggle?: (isBookmarked: boolean) => void
  size?: 'sm' | 'default' | 'icon'
  showLabel?: boolean
  className?: string
}

export default function BookmarkToggleButton({
  itemId,
  itemType = 1,
  initialBookmarked = false,
  isLoading = false,
  onToggle,
  size = 'icon',
  showLabel = false,
  className = '',
}: BookmarkToggleButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)

  // Sync internal state when parent changes (e.g. after async mutation / refetch)
  useEffect(() => {
    setIsBookmarked(initialBookmarked)
  }, [initialBookmarked])

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    const nextState = !isBookmarked
    setIsBookmarked(nextState)
    onToggle?.(nextState)
  }

  if (size === 'icon' && !showLabel) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isLoading}
        onClick={handleToggle}
        title={isBookmarked ? 'Remove from bookmarks' : 'Save bookmark'}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        className={`h-8 w-8 rounded-xl transition-all cursor-pointer ${
          isBookmarked
            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700'
            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
        } ${className}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
        ) : (
          <Bookmark
            className={`h-4 w-4 transition-transform active:scale-90 ${
              isBookmarked ? 'fill-amber-500 text-amber-500' : ''
            }`}
          />
        )}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isLoading}
      onClick={handleToggle}
      className={`h-8 px-2.5 rounded-xl text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
        isBookmarked
          ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300'
          : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      } ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
      ) : (
        <Bookmark
          className={`h-3.5 w-3.5 ${
            isBookmarked ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
          }`}
        />
      )}
      <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
    </Button>
  )
}
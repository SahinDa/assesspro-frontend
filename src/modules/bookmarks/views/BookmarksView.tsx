import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Bookmark,
  Search,
  FileText,
  Layers,
  LayoutGrid,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BookmarksTable from '../components/BookmarksTable'
import RemoveBookmarkDialog from '../components/RemoveBookmarkDialog'

export const BookmarkType = {
  TEST: 1,
  TEST_SET: 2,
} as const

const MOCK_BOOKMARKS = [
  {
    bookmark_id: 'bm-1',
    user_id: 'u-1',
    org_id: 'org-1',
    item_id: 'test-101',
    item_type: BookmarkType.TEST,
    title: 'Advanced Data Structures & Algorithms Assessment',
    subtitle: 'Computer Science • 60 Mins',
    created_at: '2026-08-10T14:30:00Z',
  },
  {
    bookmark_id: 'bm-2',
    user_id: 'u-1',
    org_id: 'org-1',
    item_id: 'set-201',
    item_type: BookmarkType.TEST_SET,
    title: 'Full Stack Engineering Preparation Bundle',
    subtitle: '5 Tests Included • Comprehensive Track',
    created_at: '2026-08-12T09:15:00Z',
  },
  {
    bookmark_id: 'bm-3',
    user_id: 'u-1',
    org_id: 'org-1',
    item_id: 'test-102',
    item_type: BookmarkType.TEST,
    title: 'Database Systems & SQL Optimization Quiz',
    subtitle: 'Backend Track • 45 Mins',
    created_at: '2026-08-15T11:20:00Z',
  },
  {
    bookmark_id: 'bm-4',
    user_id: 'u-1',
    org_id: 'org-1',
    item_id: 'set-202',
    item_type: BookmarkType.TEST_SET,
    title: 'System Design & Distributed Architectures Mock Set',
    subtitle: '3 Tests Included • Senior Track',
    created_at: '2026-08-18T16:45:00Z',
  },
]

export default function BookmarksView() {
  const [bookmarks, setBookmarks] = useState(MOCK_BOOKMARKS)
  const [searchQuery, setSearchQuery] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'all'

  const [selectedBookmark, setSelectedBookmark] = useState<any>(null)
  const [isRemoveOpen, setIsRemoveOpen] = useState(false)

  // Search filter
  function matchesSearch(bm: any, query: string) {
    if (!query.trim()) return true
    const q = query.toLowerCase().trim()
    return (
      bm.title.toLowerCase().includes(q) ||
      (bm.subtitle && bm.subtitle.toLowerCase().includes(q))
    )
  }

  // Filter by Tab and Search, automatically sorted by Newest First
  const displayedBookmarks = bookmarks
    .filter((bm) => {
      if (!matchesSearch(bm, searchQuery)) return false
      if (activeTab === 'tests') return bm.item_type === BookmarkType.TEST
      if (activeTab === 'test_sets') return bm.item_type === BookmarkType.TEST_SET
      return true
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const handleRemoveConfirm = () => {
    if (!selectedBookmark) return
    setBookmarks((prev) => prev.filter((b) => b.bookmark_id !== selectedBookmark.bookmark_id))
    setIsRemoveOpen(false)
    setSelectedBookmark(null)
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return 'N/A'
    }
  }

  const testCount = bookmarks.filter((b) => b.item_type === BookmarkType.TEST).length
  const testSetCount = bookmarks.filter((b) => b.item_type === BookmarkType.TEST_SET).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Bookmarks</h2>
            <Badge
              variant="secondary"
              className="text-[11px] font-semibold bg-slate-100 text-slate-600 rounded-lg px-2"
            >
              {bookmarks.length} Saved
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly access your pinned tests and practice test series collections.
          </p>
        </div>
      </div>

      {/* Global Empty State */}
      {bookmarks.length === 0 ? (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-sm w-full bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
              <Bookmark className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Bookmarks Saved</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bookmark tests or test sets from the catalog to keep them organized and accessible here.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Controls: Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Category Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(val) => setSearchParams({ tab: val })}
              className="w-auto"
            >
              <TabsList className="rounded-xl bg-slate-100 p-1 self-start">
                <TabsTrigger
                  value="all"
                  className="text-xs font-semibold rounded-lg px-3 gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs cursor-pointer"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  All ({bookmarks.length})
                </TabsTrigger>

                <TabsTrigger
                  value="tests"
                  className="text-xs font-semibold rounded-lg px-3 gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-indigo-600" />
                  Tests ({testCount})
                </TabsTrigger>

                <TabsTrigger
                  value="test_sets"
                  className="text-xs font-semibold rounded-lg px-3 gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs cursor-pointer"
                >
                  <Layers className="h-3.5 w-3.5 text-amber-500" />
                  Test Sets ({testSetCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Instant Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8.5 rounded-xl h-9 bg-white border-slate-200"
              />
            </div>
          </div>

          {/* Bookmarks Table */}
          <BookmarksTable
            bookmarks={displayedBookmarks}
            onRemove={(bm: any) => {
              setSelectedBookmark(bm)
              setIsRemoveOpen(true)
            }}
            formatDate={formatDate}
          />
        </div>
      )}

      {/* Confirmation Modal */}
      <RemoveBookmarkDialog
        isOpen={isRemoveOpen}
        bookmark={selectedBookmark}
        onClose={() => {
          setIsRemoveOpen(false)
          setSelectedBookmark(null)
        }}
        onConfirm={handleRemoveConfirm}
      />
    </div>
  )
}
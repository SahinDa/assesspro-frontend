import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Bookmark,
  Search,
  FileText,
  Layers,
  LayoutGrid,
  Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BookmarksTable from '../components/BookmarksTable'
import RemoveBookmarkDialog from '../components/RemoveBookmarkDialog'
import { BookmarkType } from '@/config/enums';
import { useBookmarkQueries, useBookmarkCountQueries } from "../api/useBookmarkQueries"
import { useToggleBookmarkMutation } from "../api/useToggleBookmarkMutation";

export default function BookmarksView() {

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'all'

  const itemTypeFilter =
    activeTab === 'tests'
      ? BookmarkType.TEST
      : activeTab === 'test_sets'
        ? BookmarkType.TEST_SET
        : undefined
  const { data: countsData } = useBookmarkCountQueries()
  const {
    data: bookmarksData,
    isLoading,
    isError,
  } = useBookmarkQueries({
    limit: 100,
    offset: 0,
    isOrgBookmark: false,
    itemType: itemTypeFilter,
  })



  const bookmarks = Array.isArray(bookmarksData)
  ? bookmarksData
  : bookmarksData?.data ?? []
  const allCount = countsData?.allCount ?? 0
  const testCount = countsData?.testCount ?? 0
  const testSetCount = countsData?.testSetCount ?? 0

  const { mutate: toggleBookmark, isPending: isRemoving } = useToggleBookmarkMutation()

  const handleRemoveConfirm = () => {
    if (!selectedBookmark) return

    toggleBookmark(
      {
        item_id: selectedBookmark.item_id,
        item_type: selectedBookmark.item_type,
      },
      {
        onSuccess: () => {
          setIsRemoveOpen(false)
          setSelectedBookmark(null)
        },
      }
    )
  }

  const [searchQuery, setSearchQuery] = useState('')


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
  .filter((bm) => matchesSearch(bm, searchQuery))
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // const handleRemoveConfirm = () => {
  //   if (!selectedBookmark) return
  //   setBookmarks((prev) => prev.filter((b) => b.bookmark_id !== selectedBookmark.bookmark_id))
  //   setIsRemoveOpen(false)
  //   setSelectedBookmark(null)
  // }

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


  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-500 font-medium">Loading bookmarks...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 text-center p-4">
        <p className="text-sm font-semibold text-rose-600">Failed to load bookmarks</p>
        <p className="text-xs text-slate-500">Please verify your connection and try refreshing.</p>
      </div>
    )
  }

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
              {allCount} Saved
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly access your pinned tests and practice test series collections.
          </p>
        </div>
      </div>

      {/* Global Empty State */}
      {allCount.length === 0 ? (
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
                  All ({allCount})
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
        isLoading={isRemoving}
        onClose={() => {
          setIsRemoveOpen(false)
          setSelectedBookmark(null)
        }}
        onConfirm={handleRemoveConfirm}
      />
    </div>
  )
}
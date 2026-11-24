import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  FileText,
  Layers,
  Trophy,
  BarChart3,
  Users,
  X,
  Sparkles,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { UserRole, type UserRoleType } from '@/config/enums'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import LeaderboardPodium from '../components/LeaderboardPodium'
import LeaderboardTable from '../components/LeaderboardTable'
import { type LeaderboardSection } from '../utils/leaderboardValidation'
import { type LeaderboardRow } from '../types/leaderboard.types'
import {
  useCurrentPositionsQueries,
  useLeaderboardOptions,
  useLeaderboardSearch,
} from '../api/useLeaderboardQueries'

const MOCK_CONTESTS = [
  { id: 'c-101', title: 'National Coding Grand Prix 2026 - Phase 1 Assessment' },
  { id: 'c-102', title: 'Full Stack Engineering Hackathon Championship Finals' },
]

const MOCK_CONTEST_DATA: Record<string, LeaderboardRow[]> = {
  'c-101': [
    { rank: 1, attempt_id: 'a-1', test_id: 'c-101', test_name: 'National Coding Grand Prix 2026 - Phase 1 Assessment', testset_id: 'cs-101-1', testset_name: 'Qualifier Round A', user_id: 'u-1', firstname: 'Aarav', lastname: 'Sharma', email: 'aarav.sharma@example.com', profile_pic: null, score: 495, violation_score: 0, duration_seconds: 3100 },
    { rank: 2, attempt_id: 'a-2', test_id: 'c-101', test_name: 'National Coding Grand Prix 2026 - Phase 1 Assessment', testset_id: 'cs-101-1', testset_name: 'Qualifier Round A', user_id: 'u-2', firstname: 'Priya', lastname: 'Mukherjee', email: 'priya.m@example.com', profile_pic: null, score: 480, violation_score: 0, duration_seconds: 3250 },
    { rank: 3, attempt_id: 'a-3', test_id: 'c-101', test_name: 'National Coding Grand Prix 2026 - Phase 1 Assessment', testset_id: 'cs-101-1', testset_name: 'Qualifier Round A', user_id: 'u-3', firstname: 'Rohan', lastname: 'Verma', email: 'rohan.v@example.com', profile_pic: null, score: 465, violation_score: 0, duration_seconds: 3400 },
    { rank: 4, attempt_id: 'a-4', test_id: 'c-101', test_name: 'National Coding Grand Prix 2026 - Phase 1 Assessment', testset_id: 'cs-101-1', testset_name: 'Qualifier Round A', user_id: 'u-4', firstname: 'Sneha', lastname: 'Roy', email: 'sneha.roy@example.com', profile_pic: null, score: 440, violation_score: 0, duration_seconds: 3620 },
    { rank: 5, attempt_id: 'a-5', test_id: 'c-101', test_name: 'National Coding Grand Prix 2026 - Phase 1 Assessment', testset_id: 'cs-101-1', testset_name: 'Qualifier Round A', user_id: 'u-5', firstname: 'Vikram', lastname: 'Das', email: 'vikram.das@example.com', profile_pic: null, score: 420, violation_score: 1, duration_seconds: 3750 },
  ],
  'c-102': [
    { rank: 1, attempt_id: 'a-8', test_id: 'c-102', test_name: 'Full Stack Engineering Hackathon Championship Finals', testset_id: 'cs-102-1', testset_name: 'Final Build Sprint', user_id: 'u-8', firstname: 'Dev', lastname: 'Gupta', email: 'dev.g@example.com', profile_pic: null, score: 290, violation_score: 0, duration_seconds: 1800 },
    { rank: 2, attempt_id: 'a-9', test_id: 'c-102', test_name: 'Full Stack Engineering Hackathon Championship Finals', testset_id: 'cs-102-1', testset_name: 'Final Build Sprint', user_id: 'u-9', firstname: 'Maya', lastname: 'Sen', email: 'maya.s@example.com', profile_pic: null, score: 275, violation_score: 0, duration_seconds: 1950 },
    { rank: 3, attempt_id: 'a-10', test_id: 'c-102', test_name: 'Full Stack Engineering Hackathon Championship Finals', testset_id: 'cs-102-1', testset_name: 'Final Build Sprint', user_id: 'u-10', firstname: 'Kabir', lastname: 'Nair', email: 'kabir.n@example.com', profile_pic: null, score: 260, violation_score: 0, duration_seconds: 2100 },
    { rank: 4, attempt_id: 'a-11', test_id: 'c-102', test_name: 'Full Stack Engineering Hackathon Championship Finals', testset_id: 'cs-102-1', testset_name: 'Final Build Sprint', user_id: 'u-11', firstname: 'Siddharth', lastname: 'Rao', email: 'sid.r@example.com', profile_pic: null, score: 245, violation_score: 0, duration_seconds: 2250 },
  ],
}

export interface LeaderboardViewProps {
  userRole?: UserRoleType
  orgId?: string
}

export default function LeaderboardView({
  userRole = UserRole.ORGANIZATION,
  orgId,
}: LeaderboardViewProps = {}) {
  const [section, setSection] = useState<LeaderboardSection>('contest')
  const [selectedContestId, setSelectedContestId] = useState<string>(MOCK_CONTESTS[0].id)

  const isAdmin = userRole === UserRole.ADMIN
  const isStudent = userRole === UserRole.STUDENT

  // Default for tests in standings is "all"
  const [selectedTestId, setSelectedTestId] = useState<string>('all')
  // Default for test sets is "all"
  const [selectedSetId, setSelectedSetId] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Commit search immediately (used by Enter key and debounce timer)
  const applySearch = (value: string) => {
    const trimmed = value.trim()
    setAppliedSearch((prev) => {
      if (prev !== trimmed) setCurrentPage(1)
      return trimmed
    })
  }

  // Auto-trigger 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      applySearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const clearSearch = () => {
    setSearchQuery('')
    setAppliedSearch('')
    setCurrentPage(1)
  }

  const isContestSection = section === 'contest'
  const isSearching = !isContestSection && appliedSearch.length > 0

  // 1. Default standings query for Current Position tab (paused while searching)
  const {
    data: currentPositionResponse,
    isLoading: isCurrentPositionLoading,
    isFetching: isCurrentPositionFetching,
    isError: isCurrentPositionError,
  } = useCurrentPositionsQueries(
    {
      test_id: selectedTestId !== 'all' ? selectedTestId : undefined,
      testset_id: selectedSetId !== 'all' ? selectedSetId : undefined,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    },
    orgId,
    { enabled: !isContestSection && !isSearching },
  )

  // 2. Backend keyword search query (only fires after 500ms pause or Enter key)
  const {
    data: searchResponse,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    isError: isSearchError,
  } = useLeaderboardSearch(
    {
      searchKeyword: isContestSection ? '' : appliedSearch,
      test_id: selectedTestId !== 'all' ? selectedTestId : undefined,
      testset_id: selectedSetId !== 'all' ? selectedSetId : undefined,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    },
    orgId,
  )

  // Fetch all Tests when on Current Position tab
  const {
    data: testOptionsResponse,
    isLoading: isTestsLoading,
  } = useLeaderboardOptions(
    { isTestset: false },
    orgId,
    { enabled: !isContestSection },
  )

  // Fetch Test Sets only after a specific Test is selected
  const {
    data: testSetOptionsResponse,
    isLoading: isTestSetsLoading,
  } = useLeaderboardOptions(
    {
      isTestset: true,
      test_id: selectedTestId,
    },
    orgId,
    { enabled: !isContestSection && selectedTestId !== 'all' },
  )

  // Determine available tests
  const availableTests = useMemo(() => {
    if (!testOptionsResponse) return []
    return testOptionsResponse.flatMap((item) =>
      'test_id' in item ? [{ id: item.test_id, title: item.test_name }] : [],
    )
  }, [testOptionsResponse])

  // Determine available child test sets
  const availableTestSets = useMemo(() => {
    if (selectedTestId === 'all' || !testSetOptionsResponse) return []
    return testSetOptionsResponse.flatMap((item) =>
      'testset_id' in item ? [{ id: item.testset_id, title: item.testset_name }] : [],
    )
  }, [selectedTestId, testSetOptionsResponse])

  // Active API response for Current Position tab (search vs standard standings)
  const activeStandingsResponse = isSearching
    ? searchResponse
    : currentPositionResponse

  // Resolve raw data list (mock for Contests, live API for Current Position)
  const rawList = useMemo(() => {
    if (isContestSection) {
      return MOCK_CONTEST_DATA[selectedContestId] || []
    }
    return activeStandingsResponse?.data ?? []
  }, [isContestSection, selectedContestId, activeStandingsResponse])

  const totalParticipants = isContestSection
    ? rawList.length
    : activeStandingsResponse?.meta.total_items ?? 0

  const topThree = rawList.slice(0, 3)

  // Title resolvers for custom select label rendering
  const selectedContestTitle =
    MOCK_CONTESTS.find((c) => c.id === selectedContestId)?.title || 'Select contest'

  const selectedTestTitle =
    selectedTestId === 'all'
      ? 'All Tests (Aggregated)'
      : availableTests.find((t) => t.id === selectedTestId)?.title || 'Select test'

  const selectedSetTitle =
    selectedSetId === 'all'
      ? 'All Test Sets'
      : availableTestSets.find((ts) => ts.id === selectedSetId)?.title || 'Select test set'

  // Table list: client-side filter only for mock Contests; server-side already filtered Current Position
  const displayedTableList = useMemo(() => {
    if (isContestSection) {
      if (!searchQuery.trim()) return rawList.slice(3)
      const q = searchQuery.toLowerCase().trim()
      return rawList.filter((entry) => {
        const fullName = `${entry.firstname ?? ''} ${entry.lastname ?? ''}`.toLowerCase()
        return (
          fullName.includes(q) ||
          entry.email.toLowerCase().includes(q) ||
          entry.test_name?.toLowerCase().includes(q) ||
          entry.testset_name?.toLowerCase().includes(q)
        )
      })
    }
    return rawList
  }, [isContestSection, rawList, searchQuery])

  const isTableLoading =
    !isContestSection &&
    (isSearching
      ? isSearchLoading || isSearchFetching
      : isCurrentPositionLoading || isCurrentPositionFetching)

  const isTableError =
    !isContestSection && (isSearching ? isSearchError : isCurrentPositionError)

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      {/* 1. Header & Section Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="text-2xl font-black tracking-tight text-slate-900">
              Leaderboard Portal
            </div>
            <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-2.5 py-0.5 shadow-none">
              {isContestSection ? 'Contest Standings' : 'Overall Standings'}
            </Badge>
            {isAdmin && (
              <Badge variant="outline" className="text-[10px] font-bold bg-amber-50 text-amber-800 border-amber-200">
                Audit View
              </Badge>
            )}
          </div>
          <div className="text-xs text-slate-500">
            {isAdmin
              ? 'Tenant-level candidate rankings, proctoring violation metrics, and assessment standings.'
              : isStudent
              ? 'Review your percentile, track top scores, and monitor event standings.'
              : isContestSection
              ? 'Final verified rankings, candidate scores, and proctoring metrics for competitive events.'
              : 'Cumulative student standings across practice test sets and single tests.'}
          </div>
        </div>

        {/* Section Tabs */}
        <Tabs
          value={section}
          onValueChange={(val) => {
            setSection(val as LeaderboardSection)
            clearSearch()
          }}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-2 h-10 rounded-xl bg-slate-100 p-1 w-full sm:w-72">
            <TabsTrigger
              value="contest"
              className="text-xs font-bold rounded-lg px-3 gap-1.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600 cursor-pointer shadow-2xs transition-all"
            >
              <Trophy className="h-3.5 w-3.5 text-indigo-600" />
              <div>Contests</div>
            </TabsTrigger>

            <TabsTrigger
              value="current"
              className="text-xs font-bold rounded-lg px-3 gap-1.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600 cursor-pointer shadow-2xs transition-all"
            >
              <BarChart3 className="h-3.5 w-3.5 text-slate-500" />
              <div>Current Position</div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 2. Control Toolbar */}
      <Card className="p-3.5 border-slate-200 bg-white shadow-xs rounded-2xl">
        <div className="flex flex-row items-center justify-between gap-4 w-full">
          {/* Target Assessment Selectors */}
          <div className="flex-1 min-w-0">
            {isContestSection ? (
              <div className="flex flex-row items-center gap-2.5 w-full min-w-0">
                <Badge variant="outline" className="text-xs font-bold text-slate-700 shrink-0 hidden sm:flex items-center gap-1.5 bg-slate-50 border-slate-200 py-1.5 px-2.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  Contest:
                </Badge>
                <div className="w-full min-w-0 flex-1">
                  <Select
                    value={selectedContestId}
                    onValueChange={(val) => {
                      if (val) {
                        setSelectedContestId(val)
                        clearSearch()
                      }
                    }}
                  >
                    <SelectTrigger className="h-10 w-full text-xs font-semibold rounded-xl border-slate-200 bg-slate-50/70 text-slate-900 hover:bg-slate-50 focus:ring-1 focus:ring-indigo-500 truncate">
                      <SelectValue placeholder="Select contest">
                        {selectedContestTitle}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-w-[90vw] md:max-w-2xl rounded-xl border-slate-200 bg-white shadow-lg">
                      {MOCK_CONTESTS.map((contest) => (
                        <SelectItem key={contest.id} value={contest.id} className="text-xs py-2.5 cursor-pointer font-medium">
                          {contest.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="flex flex-row items-center gap-2.5 w-full min-w-0">
                {/* 1. Test Selector */}
                <div className="flex-1 min-w-0">
                  <Select
                    value={selectedTestId}
                    disabled={isTestsLoading}
                    onValueChange={(val) => {
                      setSelectedTestId(val ?? 'all')
                      setSelectedSetId('all')
                      clearSearch()
                    }}
                  >
                    <SelectTrigger className="h-10 w-full text-xs font-semibold rounded-xl border-slate-200 bg-slate-50/70 text-slate-900 hover:bg-slate-50 focus:ring-1 focus:ring-indigo-500 truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        <SelectValue placeholder={isTestsLoading ? 'Loading tests...' : 'Select test...'}>
                          {isTestsLoading ? 'Loading tests...' : selectedTestTitle}
                        </SelectValue>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-w-[90vw] md:max-w-2xl rounded-xl border-slate-200 bg-white shadow-lg">
                      <SelectItem value="all" className="text-xs py-2.5 cursor-pointer font-bold text-indigo-900">
                        All Tests (Overview)
                      </SelectItem>
                      {availableTests.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="text-xs py-2.5 cursor-pointer font-medium">
                          {t.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Test Set Selector */}
                {selectedTestId !== 'all' && (
                  <div className="flex-1 min-w-0">
                    <Select
                      value={selectedSetId}
                      disabled={isTestSetsLoading}
                      onValueChange={(val) => {
                        setSelectedSetId(val ?? 'all')
                        clearSearch()
                      }}
                    >
                      <SelectTrigger className="h-10 w-full text-xs font-semibold rounded-xl border-slate-200 bg-slate-50/70 text-slate-900 hover:bg-slate-50 focus:ring-1 focus:ring-indigo-500 truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <Layers className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <SelectValue placeholder={isTestSetsLoading ? 'Loading test sets...' : 'Select test set...'}>
                            {isTestSetsLoading ? 'Loading test sets...' : selectedSetTitle}
                          </SelectValue>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="max-w-[90vw] md:max-w-2xl rounded-xl border-slate-200 bg-white shadow-lg">
                        <SelectItem value="all" className="text-xs py-2.5 cursor-pointer font-bold text-amber-900">
                          All Test Sets
                        </SelectItem>
                        {availableTestSets.map((ts) => (
                          <SelectItem key={ts.id} value={ts.id} className="text-xs py-2.5 cursor-pointer font-medium">
                            {ts.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Input Container */}
          <div className="flex items-center w-52 sm:w-72 md:w-80 lg:w-96 shrink-0 h-10 px-3.5 gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-indigo-500 transition-colors">
            <Search className="h-4 w-4 text-slate-400 shrink-0 select-none pointer-events-none" />
            <input
              type="text"
              placeholder="Search candidate name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  applySearch(searchQuery)
                }
              }}
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 shadow-none"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-6 w-6 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md shrink-0 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 3. Top 3 Podium (Contest Mode Only) */}
      {isContestSection && !searchQuery && topThree.length > 0 && (
        <LeaderboardPodium topThree={topThree} />
      )}

      {/* 4. Table Header Status */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
        <div className="flex items-center gap-2">
          <div className="font-extrabold uppercase tracking-wider text-slate-900">
            {appliedSearch
              ? 'Search Results'
              : isContestSection
              ? 'Other Standings (Rank #4+)'
              : selectedTestId === 'all'
              ? 'All Tests Cumulative Standings'
              : selectedSetId === 'all'
              ? `Standings for ${selectedTestTitle}`
              : `Standings for ${selectedSetTitle}`}
          </div>
          {!appliedSearch && (
            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-xs font-bold px-2 py-0">
              {displayedTableList.length} in table
            </Badge>
          )}
        </div>

        <Badge variant="outline" className="flex items-center gap-1.5 font-medium bg-slate-50 border-slate-200 text-slate-700 py-1 px-2.5">
          <Users className="h-3.5 w-3.5 text-slate-500" />
          <div>Total: <span className="text-slate-900 font-bold">{totalParticipants}</span> Participants</div>
        </Badge>
      </div>

      {/* 5. Paginated Rankings Table */}
      {isTableError ? (
        <Card className="py-12 px-4 border-rose-200 bg-rose-50/40 shadow-none rounded-2xl text-center space-y-1">
          <div className="text-sm font-bold text-rose-700">
            {isSearching ? 'Failed to search standings' : 'Failed to load standings'}
          </div>
          <div className="text-xs text-rose-600">
            Please try refreshing or adjusting your search filters.
          </div>
        </Card>
      ) : (
        <LeaderboardTable
          rankings={displayedTableList}
          isLoading={isTableLoading}
          showTestColumn={!isContestSection && selectedTestId === 'all'}
          showTestSetColumn={!isContestSection && selectedSetId === 'all'}
        />
      )}
    </div>
  )
}
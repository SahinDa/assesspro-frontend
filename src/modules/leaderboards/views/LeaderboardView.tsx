import { useState, useMemo } from 'react'
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
import { Input } from '@/components/ui/input'
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
import {
  type LeaderboardRow,
  type LeaderboardSection,
} from '../utils/leaderboardValidation'

const MOCK_CONTESTS = [
  { id: 'c-101', title: 'National Coding Grand Prix 2026 - Phase 1 Assessment' },
  { id: 'c-102', title: 'Full Stack Engineering Hackathon Championship Finals' },
]

// Tests list
const MOCK_TESTS = [
  { id: 't-101', title: 'Data Structures & Algorithms' },
  { id: 't-102', title: 'System Architecture & Database Design' },
]

// Test Sets mapped to their parent Test
const MOCK_TEST_SETS: Record<string, { id: string; title: string }[]> = {
  't-101': [
    { id: 'ts-101-1', title: 'Arrays & Dynamic Programming Track' },
    { id: 'ts-101-2', title: 'Trees & Graph Traversal Track' },
  ],
  't-102': [
    { id: 'ts-102-1', title: 'Distributed Systems & Microservices Track' },
    { id: 'ts-102-2', title: 'SQL & Query Optimization Track' },
  ],
}

const MOCK_DATA: Record<string, LeaderboardRow[]> = {
  // Contests
  'c-101': [
    { rank: 1, attempt_id: 'a-1', user_id: 'u-1', firstname: 'Aarav', lastname: 'Sharma', email: 'aarav.sharma@example.com', profile_pic: null, score: 495, violation_score: 0, duration_seconds: 3100 },
    { rank: 2, attempt_id: 'a-2', user_id: 'u-2', firstname: 'Priya', lastname: 'Mukherjee', email: 'priya.m@example.com', profile_pic: null, score: 480, violation_score: 0, duration_seconds: 3250 },
    { rank: 3, attempt_id: 'a-3', user_id: 'u-3', firstname: 'Rohan', lastname: 'Verma', email: 'rohan.v@example.com', profile_pic: null, score: 465, violation_score: 0, duration_seconds: 3400 },
    { rank: 4, attempt_id: 'a-4', user_id: 'u-4', firstname: 'Sneha', lastname: 'Roy', email: 'sneha.roy@example.com', profile_pic: null, score: 440, violation_score: 0, duration_seconds: 3620 },
    { rank: 5, attempt_id: 'a-5', user_id: 'u-5', firstname: 'Vikram', lastname: 'Das', email: 'vikram.das@example.com', profile_pic: null, score: 420, violation_score: 1, duration_seconds: 3750 },
  ],
  'c-102': [
    { rank: 1, attempt_id: 'a-8', user_id: 'u-8', firstname: 'Dev', lastname: 'Gupta', email: 'dev.g@example.com', profile_pic: null, score: 290, violation_score: 0, duration_seconds: 1800 },
    { rank: 2, attempt_id: 'a-9', user_id: 'u-9', firstname: 'Maya', lastname: 'Sen', email: 'maya.s@example.com', profile_pic: null, score: 275, violation_score: 0, duration_seconds: 1950 },
    { rank: 3, attempt_id: 'a-10', user_id: 'u-10', firstname: 'Kabir', lastname: 'Nair', email: 'kabir.n@example.com', profile_pic: null, score: 260, violation_score: 0, duration_seconds: 2100 },
    { rank: 4, attempt_id: 'a-11', user_id: 'u-11', firstname: 'Siddharth', lastname: 'Rao', email: 'sid.r@example.com', profile_pic: null, score: 245, violation_score: 0, duration_seconds: 2250 },
  ],

  // Standings: All Tests Aggregated Overview
  'test-all': [
    { rank: 1, attempt_id: 'a-all-1', user_id: 'u-1', firstname: 'Aarav', lastname: 'Sharma', email: 'aarav.sharma@example.com', profile_pic: null, score: 980, violation_score: 0, duration_seconds: 18200 },
    { rank: 2, attempt_id: 'a-all-2', user_id: 'u-2', firstname: 'Priya', lastname: 'Mukherjee', email: 'priya.m@example.com', profile_pic: null, score: 955, violation_score: 0, duration_seconds: 17400 },
    { rank: 3, attempt_id: 'a-all-3', user_id: 'u-4', firstname: 'Sneha', lastname: 'Roy', email: 'sneha.roy@example.com', profile_pic: null, score: 920, violation_score: 1, duration_seconds: 19100 },
    { rank: 4, attempt_id: 'a-all-4', user_id: 'u-5', firstname: 'Vikram', lastname: 'Das', email: 'vikram.das@example.com', profile_pic: null, score: 890, violation_score: 2, duration_seconds: 20400 },
  ],

  // Single Test: t-101 All Sets
  't-101': [
    { rank: 1, attempt_id: 'a-12', user_id: 'u-1', firstname: 'Aarav', lastname: 'Sharma', email: 'aarav.sharma@example.com', profile_pic: null, score: 195, violation_score: 0, duration_seconds: 4800 },
    { rank: 2, attempt_id: 'a-13', user_id: 'u-2', firstname: 'Priya', lastname: 'Mukherjee', email: 'priya.m@example.com', profile_pic: null, score: 188, violation_score: 0, duration_seconds: 4950 },
    { rank: 3, attempt_id: 'a-14', user_id: 'u-3', firstname: 'Rohan', lastname: 'Verma', email: 'rohan.v@example.com', profile_pic: null, score: 175, violation_score: 1, duration_seconds: 5300 },
  ],
  // Specific Test Sets under t-101
  'ts-101-1': [
    { rank: 1, attempt_id: 'a-15', user_id: 'u-1', firstname: 'Aarav', lastname: 'Sharma', email: 'aarav.sharma@example.com', profile_pic: null, score: 100, violation_score: 0, duration_seconds: 2300 },
    { rank: 2, attempt_id: 'a-16', user_id: 'u-2', firstname: 'Priya', lastname: 'Mukherjee', email: 'priya.m@example.com', profile_pic: null, score: 94, violation_score: 0, duration_seconds: 2450 },
  ],
  'ts-101-2': [
    { rank: 1, attempt_id: 'a-17', user_id: 'u-2', firstname: 'Priya', lastname: 'Mukherjee', email: 'priya.m@example.com', profile_pic: null, score: 94, violation_score: 0, duration_seconds: 2500 },
    { rank: 2, attempt_id: 'a-18', user_id: 'u-1', firstname: 'Aarav', lastname: 'Sharma', email: 'aarav.sharma@example.com', profile_pic: null, score: 95, violation_score: 0, duration_seconds: 2500 },
  ],

  // Single Test: t-102 All Sets
  't-102': [
    { rank: 1, attempt_id: 'a-19', user_id: 'u-4', firstname: 'Sneha', lastname: 'Roy', email: 'sneha.roy@example.com', profile_pic: null, score: 190, violation_score: 0, duration_seconds: 4500 },
    { rank: 2, attempt_id: 'a-20', user_id: 'u-5', firstname: 'Vikram', lastname: 'Das', email: 'vikram.das@example.com', profile_pic: null, score: 182, violation_score: 1, duration_seconds: 4800 },
  ],
  'ts-102-1': [
    { rank: 1, attempt_id: 'a-21', user_id: 'u-4', firstname: 'Sneha', lastname: 'Roy', email: 'sneha.roy@example.com', profile_pic: null, score: 98, violation_score: 0, duration_seconds: 2200 },
  ],
  'ts-102-2': [
    { rank: 1, attempt_id: 'a-22', user_id: 'u-5', firstname: 'Vikram', lastname: 'Das', email: 'vikram.das@example.com', profile_pic: null, score: 92, violation_score: 0, duration_seconds: 2600 },
  ],
}

export default function LeaderboardView() {
  const [section, setSection] = useState<LeaderboardSection>('contest')
  const [selectedContestId, setSelectedContestId] = useState<string>(MOCK_CONTESTS[0].id)
  
  // Default for tests in standings is "all"
  const [selectedTestId, setSelectedTestId] = useState<string>('all')
  // Default for test sets is "all"
  const [selectedSetId, setSelectedSetId] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const isContestSection = section === 'contest'

  // Determine available child test sets
  const availableTestSets = selectedTestId !== 'all' ? MOCK_TEST_SETS[selectedTestId] || [] : []

  // Resolve raw data key
  const rawList = useMemo(() => {
    if (isContestSection) {
      return MOCK_DATA[selectedContestId] || []
    }
    if (selectedTestId === 'all') {
      return MOCK_DATA['test-all'] || []
    }
    if (selectedSetId === 'all') {
      return MOCK_DATA[selectedTestId] || []
    }
    return MOCK_DATA[selectedSetId] || []
  }, [isContestSection, selectedContestId, selectedTestId, selectedSetId])

  const totalParticipants = rawList.length
  const topThree = rawList.slice(0, 3)

  // Title resolvers for custom select label rendering
  const selectedContestTitle =
    MOCK_CONTESTS.find((c) => c.id === selectedContestId)?.title || 'Select contest'

  const selectedTestTitle =
    selectedTestId === 'all'
      ? 'All Tests (Aggregated)'
      : MOCK_TESTS.find((t) => t.id === selectedTestId)?.title || 'Select test'

  const selectedSetTitle =
    selectedSetId === 'all'
      ? 'All Test Sets'
      : availableTestSets.find((ts) => ts.id === selectedSetId)?.title || 'Select test set'

  // Table filtering logic
  const displayedTableList = searchQuery
    ? rawList.filter((entry) => {
        const q = searchQuery.toLowerCase().trim()
        const fullName = `${entry.firstname} ${entry.lastname}`.toLowerCase()
        return fullName.includes(q) || entry.email.toLowerCase().includes(q)
      })
    : isContestSection
    ? rawList.slice(3)
    : rawList

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
          </div>
          <div className="text-xs text-slate-500">
            {isContestSection
              ? 'Final verified rankings, candidate scores, and proctoring metrics for competitive events.'
              : 'Cumulative student standings across practice test sets and single tests.'}
          </div>
        </div>

        {/* Section Tabs */}
        <Tabs
          value={section}
          onValueChange={(val) => {
            setSection(val as LeaderboardSection)
            setSearchQuery('')
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

      {/* 2. Control Toolbar (Expanded Search Field Width) */}
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
                      setSelectedContestId(val)
                      setSearchQuery('')
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
                    onValueChange={(val) => {
                      setSelectedTestId(val)
                      setSelectedSetId('all') // Reset test set to 'all' whenever test changes
                      setSearchQuery('')
                    }}
                  >
                    <SelectTrigger className="h-10 w-full text-xs font-semibold rounded-xl border-slate-200 bg-slate-50/70 text-slate-900 hover:bg-slate-50 focus:ring-1 focus:ring-indigo-500 truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        <SelectValue placeholder="Select test...">
                          {selectedTestTitle}
                        </SelectValue>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-w-[90vw] md:max-w-2xl rounded-xl border-slate-200 bg-white shadow-lg">
                      <SelectItem value="all" className="text-xs py-2.5 cursor-pointer font-bold text-indigo-900">
                        All Tests (Overview)
                      </SelectItem>
                      {MOCK_TESTS.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="text-xs py-2.5 cursor-pointer font-medium">
                          {t.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Test Set Selector (Rendered conditionally ONLY when a specific test is selected) */}
                {selectedTestId !== 'all' && (
                  <div className="flex-1 min-w-0">
                    <Select
                      value={selectedSetId}
                      onValueChange={(val) => {
                        setSelectedSetId(val)
                        setSearchQuery('')
                      }}
                    >
                      <SelectTrigger className="h-10 w-full text-xs font-semibold rounded-xl border-slate-200 bg-slate-50/70 text-slate-900 hover:bg-slate-50 focus:ring-1 focus:ring-indigo-500 truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <Layers className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <SelectValue placeholder="Select test set...">
                            {selectedSetTitle}
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
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 shadow-none"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="h-6 w-6 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md shrink-0"
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
            {searchQuery
              ? 'Search Results'
              : isContestSection
              ? 'Other Standings (Rank #4+)'
              : selectedTestId === 'all'
              ? 'All Tests Cumulative Standings'
              : selectedSetId === 'all'
              ? `Standings for ${selectedTestTitle}`
              : `Standings for ${selectedSetTitle}`}
          </div>
          {!searchQuery && (
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
      <LeaderboardTable rankings={displayedTableList} />
    </div>
  )
}
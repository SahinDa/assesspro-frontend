import { useState } from 'react'
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
  type CurrentPositionScope,
} from '../utils/leaderboardValidation'

const MOCK_CONTESTS = [
  { id: 'c-101', title: 'National Coding Grand Prix 2026' },
  { id: 'c-102', title: 'Full Stack Hackathon Finals' },
]

const MOCK_TESTS = [
  { id: 't-101', title: 'Data Structures & Algorithms - Mock 1' },
  { id: 't-102', title: 'System Architecture & Database Design' },
]

const MOCK_TEST_SETS = [
  { id: 'ts-201', title: 'Full Stack Engineering Bundle' },
  { id: 'ts-202', title: 'Senior Backend Assessment Track' },
]

const MOCK_DATA: Record<string, LeaderboardRow[]> = {
  'c-101': [
    { rank: 1, attempt_id: 'a-1', user_id: 'u-1', firstname: 'Aarav', lastname: 'Sharma', email: 'aarav.sharma@example.com', profile_pic: null, score: 495, violation_score: 0, duration_seconds: 3100 },
    { rank: 2, attempt_id: 'a-2', user_id: 'u-2', firstname: 'Priya', lastname: 'Mukherjee', email: 'priya.m@example.com', profile_pic: null, score: 480, violation_score: 0, duration_seconds: 3250 },
    { rank: 3, attempt_id: 'a-3', user_id: 'u-3', firstname: 'Rohan', lastname: 'Verma', email: 'rohan.v@example.com', profile_pic: null, score: 465, violation_score: 0, duration_seconds: 3400 },
    { rank: 4, attempt_id: 'a-4', user_id: 'u-4', firstname: 'Sneha', lastname: 'Roy', email: 'sneha.roy@example.com', profile_pic: null, score: 440, violation_score: 0, duration_seconds: 3620 },
    { rank: 5, attempt_id: 'a-5', user_id: 'u-5', firstname: 'Vikram', lastname: 'Das', email: 'vikram.das@example.com', profile_pic: null, score: 420, violation_score: 1, duration_seconds: 3750 },
    { rank: 6, attempt_id: 'a-6', user_id: 'u-6', firstname: 'Ananya', lastname: 'Iyer', email: 'ananya.i@example.com', profile_pic: null, score: 410, violation_score: 0, duration_seconds: 3900 },
    { rank: 7, attempt_id: 'a-7', user_id: 'u-7', firstname: 'Karan', lastname: 'Mehta', email: 'karan.m@example.com', profile_pic: null, score: 395, violation_score: 2, duration_seconds: 4050 },
  ],
  'c-102': [
    { rank: 1, attempt_id: 'a-8', user_id: 'u-8', firstname: 'Dev', lastname: 'Gupta', email: 'dev.g@example.com', profile_pic: null, score: 290, violation_score: 0, duration_seconds: 1800 },
    { rank: 2, attempt_id: 'a-9', user_id: 'u-9', firstname: 'Maya', lastname: 'Sen', email: 'maya.s@example.com', profile_pic: null, score: 275, violation_score: 0, duration_seconds: 1950 },
    { rank: 3, attempt_id: 'a-10', user_id: 'u-10', firstname: 'Kabir', lastname: 'Nair', email: 'kabir.n@example.com', profile_pic: null, score: 260, violation_score: 0, duration_seconds: 2100 },
    { rank: 4, attempt_id: 'a-11', user_id: 'u-11', firstname: 'Siddharth', lastname: 'Rao', email: 'sid.r@example.com', profile_pic: null, score: 245, violation_score: 0, duration_seconds: 2250 },
  ],
  't-101': [
    { rank: 1, attempt_id: 'a-12', user_id: 'u-1', firstname: 'Aarav', lastname: 'Sharma', email: 'aarav.sharma@example.com', profile_pic: null, score: 98, violation_score: 0, duration_seconds: 2300 },
    { rank: 2, attempt_id: 'a-13', user_id: 'u-2', firstname: 'Priya', lastname: 'Mukherjee', email: 'priya.m@example.com', profile_pic: null, score: 92, violation_score: 0, duration_seconds: 2475 },
    { rank: 3, attempt_id: 'a-14', user_id: 'u-3', firstname: 'Rohan', lastname: 'Verma', email: 'rohan.v@example.com', profile_pic: null, score: 89, violation_score: 1, duration_seconds: 2700 },
    { rank: 4, attempt_id: 'a-15', user_id: 'u-4', firstname: 'Sneha', lastname: 'Roy', email: 'sneha.roy@example.com', profile_pic: null, score: 84, violation_score: 0, duration_seconds: 3010 },
  ],
  'ts-201': [
    { rank: 1, attempt_id: 'a-16', user_id: 'u-2', firstname: 'Priya', lastname: 'Mukherjee', email: 'priya.m@example.com', profile_pic: null, score: 285, violation_score: 0, duration_seconds: 7800 },
    { rank: 2, attempt_id: 'a-17', user_id: 'u-1', firstname: 'Aarav', lastname: 'Sharma', email: 'aarav.sharma@example.com', profile_pic: null, score: 278, violation_score: 0, duration_seconds: 8700 },
    { rank: 3, attempt_id: 'a-18', user_id: 'u-4', firstname: 'Sneha', lastname: 'Roy', email: 'sneha.roy@example.com', profile_pic: null, score: 260, violation_score: 2, duration_seconds: 9600 },
  ],
}

export default function LeaderboardView() {
  const [section, setSection] = useState<LeaderboardSection>('contest')
  const [selectedContestId, setSelectedContestId] = useState<string>(MOCK_CONTESTS[0].id)
  const [currentScope, setCurrentScope] = useState<CurrentPositionScope>('test')
  const [selectedTestId, setSelectedTestId] = useState<string>(MOCK_TESTS[0].id)
  const [selectedSetId, setSelectedSetId] = useState<string>(MOCK_TEST_SETS[0].id)
  const [searchQuery, setSearchQuery] = useState('')

  const activeKey =
    section === 'contest'
      ? selectedContestId
      : currentScope === 'test'
      ? selectedTestId
      : selectedSetId

  const rawList = MOCK_DATA[activeKey] || []
  const totalParticipants = rawList.length
  const topThree = rawList.slice(0, 3)

  const isContestSection = section === 'contest'

  // If search is active -> filter list
  // If Contest -> skip top 3 (they are in the podium)
  // If Current Position (Tests / Sets) -> show entire list in table
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
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Leaderboard Portal</h1>
            <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-2.5 py-0.5">
              {isContestSection ? 'Contest Standings' : 'Overall Standings'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isContestSection
              ? 'Final verified rankings, candidate scores, and proctoring metrics for competitive events.'
              : 'Cumulative student standings across practice test sets and single tests.'}
          </p>
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
              <span>Contests</span>
            </TabsTrigger>

            <TabsTrigger
              value="current"
              className="text-xs font-bold rounded-lg px-3 gap-1.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600 cursor-pointer shadow-2xs transition-all"
            >
              <BarChart3 className="h-3.5 w-3.5 text-slate-500" />
              <span>Current Position</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 2. Control Toolbar */}
      <Card className="p-3.5 border-slate-200 bg-white shadow-xs rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          
          {/* Target Assessment Selectors */}
          <div className="flex-1 flex flex-wrap items-center gap-3">
            {isContestSection ? (
              <div className="flex items-center gap-2 w-full md:max-w-md">
                <span className="text-xs font-bold text-slate-700 shrink-0 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Contest:
                </span>
                <div className="w-full min-w-0">
                  <Select
                    value={selectedContestId}
                    onValueChange={(val) => {
                      setSelectedContestId(val)
                      setSearchQuery('')
                    }}
                  >
                    <SelectTrigger className="h-10 text-xs font-semibold rounded-xl border-slate-200 bg-slate-50/70 text-slate-900 hover:bg-slate-50 focus:ring-1 focus:ring-indigo-500">
                      <SelectValue placeholder="Select contest" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 bg-white">
                      {MOCK_CONTESTS.map((contest) => (
                        <SelectItem key={contest.id} value={contest.id} className="text-xs py-2 cursor-pointer font-medium">
                          {contest.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2.5 w-full">
                <Tabs
                  value={currentScope}
                  onValueChange={(val) => {
                    setCurrentScope(val as CurrentPositionScope)
                    setSearchQuery('')
                  }}
                  className="shrink-0"
                >
                  <TabsList className="grid grid-cols-2 h-10 rounded-xl bg-slate-100 p-1 w-44">
                    <TabsTrigger value="test" className="text-xs font-bold px-2 gap-1 data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600">
                      <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                      <span>Tests</span>
                    </TabsTrigger>
                    <TabsTrigger value="test_set" className="text-xs font-bold px-2 gap-1 data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600">
                      <Layers className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>Sets</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="w-full sm:w-64 min-w-0">
                  <Select
                    value={currentScope === 'test' ? selectedTestId : selectedSetId}
                    onValueChange={(val) => {
                      if (currentScope === 'test') setSelectedTestId(val)
                      else setSelectedSetId(val)
                      setSearchQuery('')
                    }}
                  >
                    <SelectTrigger className="h-10 text-xs font-semibold rounded-xl border-slate-200 bg-slate-50/70 text-slate-900 hover:bg-slate-50 focus:ring-1 focus:ring-indigo-500 truncate">
                      <SelectValue placeholder="Select target..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 bg-white">
                      {currentScope === 'test'
                        ? MOCK_TESTS.map((t) => (
                            <SelectItem key={t.id} value={t.id} className="text-xs py-2 cursor-pointer font-medium">
                              {t.title}
                            </SelectItem>
                          ))
                        : MOCK_TEST_SETS.map((ts) => (
                            <SelectItem key={ts.id} value={ts.id} className="text-xs py-2 cursor-pointer font-medium">
                              {ts.title}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Search Input with Clear Button */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search candidate name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 text-xs pl-9 pr-8 rounded-xl border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-1.5 top-1.5 h-7 w-7 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

        </div>
      </Card>

      {/* 3. Top 3 Podium (Rendered strictly for Contests when not searching) */}
      {isContestSection && !searchQuery && topThree.length > 0 && (
        <LeaderboardPodium topThree={topThree} />
      )}

      {/* 4. Table Header Status */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold uppercase tracking-wider text-slate-900">
            {searchQuery
              ? 'Search Results'
              : isContestSection
              ? 'Other Standings (Rank #4+)'
              : 'All Standings'}
          </h3>
          {!searchQuery && (
            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-xs font-bold px-2 py-0">
              {displayedTableList.length} in table
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <Users className="h-3.5 w-3.5 text-slate-500" />
          <span>Total: <strong className="text-slate-900 font-bold">{totalParticipants}</strong> Participants</span>
        </div>
      </div>

      {/* 5. Paginated Rankings Table */}
      <LeaderboardTable rankings={displayedTableList} />
    </div>
  )
}
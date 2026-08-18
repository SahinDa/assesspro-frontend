import { 
  PlayCircle, Clock, Trophy, Target, Timer, 
  Layers, AlertTriangle, ArrowRight, RotateCcw, type LucideIcon 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// 1. Data Contracts (Matches your backend response)
export interface DashboardMetric {
  id: string
  label: string
  value: string | number
  subValue: string
  icon: LucideIcon
  color: string
}

export interface EnrolledModule {
  id: string
  title: string
  completedSets: number
  totalSets: number
  isCompleted: boolean
  nextSetId?: string
  nextSetTitle?: string
  avgScore?: string
}

export interface WeakTopic {
  id: string
  name: string
  accuracy: number
}

export interface RecentAttempt {
  id: string
  testTitle: string
  isFirstAttempt: boolean
  attemptNumber: number
  maxReattempts: number
  score: number
  maxScore: number
  accuracy: number
  officialRank?: string
  date: string
}

export interface StudentDashboardData {
  liveTest?: {
    id: string
    title: string
    durationMinutes: number
    totalQuestions: number
    negativeMarking: number
    closesIn: string
  }
  quota: {
    uniqueSetsUsed: number
    maxUniqueSets: number
  }
  metrics: DashboardMetric[]
  modules: EnrolledModule[]
  weakTopics: WeakTopic[]
  recentAttempts: RecentAttempt[]
}

// 2. Default/Mock Data State
const DEFAULT_DATA: StudentDashboardData = {
  liveTest: {
    id: 'gate-mock-04',
    title: 'GATE CS 2026: Full Length Mock 04',
    durationMinutes: 180,
    totalQuestions: 65,
    negativeMarking: 0.33,
    closesIn: '04h : 22m',
  },
  quota: {
    uniqueSetsUsed: 4,
    maxUniqueSets: 10,
  },
  metrics: [
    { id: 'rank', label: 'Org Rank', value: '#14', subValue: 'Top 3.3% of 420 Students', icon: Trophy, color: 'text-amber-500 bg-amber-50' },
    { id: 'accuracy', label: 'Accuracy', value: '78.4%', subValue: '+4.1% this week', icon: Target, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'speed', label: 'Speed / Qs', value: '1m 12s', subValue: 'Target: 1m 30s', icon: Timer, color: 'text-blue-500 bg-blue-50' },
    { id: 'quota', label: 'Allowed Tests', value: '4 / 10', subValue: 'Institute Plan Quota', icon: Layers, color: 'text-indigo-600 bg-indigo-50' },
  ],
  modules: [
    {
      id: 'mod-1',
      title: 'Machine Learning Foundations',
      completedSets: 4,
      totalSets: 6,
      isCompleted: false,
      nextSetId: 'ml-set-05',
      nextSetTitle: 'Set 05: Backpropagation Deep-Dive',
    },
    {
      id: 'mod-2',
      title: 'Algorithms & Data Structures Mock Series',
      completedSets: 8,
      totalSets: 8,
      isCompleted: true,
      avgScore: '88.5%',
    },
  ],
  weakTopics: [
    { id: 't1', name: 'Dynamic Programming', accuracy: 42 },
    { id: 't2', name: 'Graph Traversals', accuracy: 54 },
    { id: 't3', name: 'Relational Algebra', accuracy: 89 },
  ],
  recentAttempts: [
    {
      id: 'att-1',
      testTitle: 'ML Set 04: Linear Models',
      isFirstAttempt: true,
      attemptNumber: 1,
      maxReattempts: 2,
      score: 42,
      maxScore: 50,
      accuracy: 84,
      officialRank: '#8 / 180',
      date: 'Yesterday',
    },
    {
      id: 'att-2',
      testTitle: 'Algorithms: Dynamic Programming Set 1',
      isFirstAttempt: false,
      attemptNumber: 2,
      maxReattempts: 2,
      score: 38,
      maxScore: 50,
      accuracy: 76,
      date: '14 Aug 2026',
    },
  ],
}

interface StudentDashboardProps {
  data?: StudentDashboardData
  onStartTest?: (testSetId: string) => void
  onViewAnalysis?: (attemptId: string) => void
}

export function StudentDashboard({
  data = DEFAULT_DATA,
  onStartTest = () => {},
  onViewAnalysis = () => {},
}: StudentDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 1. Live Scheduled Test (Conditional) */}
      {data.liveTest && (
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-500/10 via-white to-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                Live Mock Test
              </Badge>
              <span className="flex items-center text-xs font-semibold text-slate-500">
                <Clock className="mr-1 h-3.5 w-3.5 text-indigo-500" /> Closes in {data.liveTest.closesIn}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">{data.liveTest.title}</h2>
            <p className="text-xs text-slate-500">
              {data.liveTest.totalQuestions} Questions • {data.liveTest.durationMinutes} Minutes • Negative Marking (-{data.liveTest.negativeMarking})
            </p>
          </div>
          <Button 
            onClick={() => onStartTest(data.liveTest!.id)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 h-11 font-semibold text-xs cursor-pointer transition-all"
          >
            <PlayCircle className="h-4 w-4" /> Start Attempt Now
          </Button>
        </div>
      )}

      {/* 2. Top Metric Cards (Mapped) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.id} className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {metric.label}
                </CardTitle>
                <div className={`p-2 rounded-xl ${metric.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{metric.value}</div>
                <p className="mt-1 text-xs text-slate-500">{metric.subValue}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 3. Grid: Enrolled Modules & Weak Topics (Mapped) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Enrolled Modules List */}
        <Card className="lg:col-span-2 rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Enrolled Test Modules</CardTitle>
              <CardDescription className="text-xs text-slate-500">Curriculum assigned by your organization</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-indigo-600 font-semibold gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.modules.map((mod) => {
              const progress = Math.round((mod.completedSets / mod.totalSets) * 100)
              return (
                <div key={mod.id} className="rounded-xl border border-slate-100 p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{mod.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {mod.completedSets} of {mod.totalSets} TestSets Completed
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] font-bold ${mod.isCompleted ? 'border-emerald-200 text-emerald-600 bg-emerald-50/50' : 'border-slate-200 text-slate-600 bg-white'}`}
                    >
                      {mod.isCompleted ? 'Completed' : `${mod.totalSets} Sets Total`}
                    </Badge>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-slate-200" />
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-slate-500">
                      {mod.isCompleted 
                        ? <>Average Score: <strong className="text-slate-700">{mod.avgScore}</strong></>
                        : <>Next: <strong className="text-slate-700">{mod.nextSetTitle}</strong></>
                      }
                    </span>
                    <Button 
                      onClick={() => onStartTest(mod.nextSetId || mod.id)}
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 cursor-pointer gap-1"
                    >
                      {mod.isCompleted ? <><RotateCcw className="h-3 w-3" /> Retake</> : <>Start <ArrowRight className="h-3 w-3" /></>}
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Weak Topics List */}
        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Accuracy Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">Topics needing revision</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.weakTopics.map((topic) => {
              const accuracyColor = 
                topic.accuracy >= 75 ? 'text-emerald-600' :
                topic.accuracy >= 50 ? 'text-amber-500' : 'text-rose-500'

              return (
                <div key={topic.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{topic.name}</span>
                    <span className={`font-bold ${accuracyColor}`}>{topic.accuracy}%</span>
                  </div>
                  <Progress value={topic.accuracy} className="h-1.5 bg-slate-100" />
                </div>
              )
            })}
            <Button variant="outline" className="w-full text-xs font-semibold rounded-xl mt-2 border-slate-200">
              Practice Weak Areas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 4. Recent Test Attempts Table (Mapped) */}
      <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-900">Recent Test Attempts</CardTitle>
          <CardDescription className="text-xs text-slate-500">Official rank is computed on your 1st attempt only</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100">
                <TableHead className="text-xs">TestSet Name</TableHead>
                <TableHead className="text-xs">Attempt</TableHead>
                <TableHead className="text-xs">Score</TableHead>
                <TableHead className="text-xs">Accuracy</TableHead>
                <TableHead className="text-xs">Official Rank</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentAttempts.map((attempt) => (
                <TableRow key={attempt.id} className="border-slate-100">
                  <TableCell className="font-semibold text-xs text-slate-900">{attempt.testTitle}</TableCell>
                  <TableCell>
                    {attempt.isFirstAttempt ? (
                      <Badge className="bg-indigo-50 text-indigo-700 border-0 text-[10px] font-bold">1st Attempt</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Retake ({attempt.attemptNumber - 1}/{attempt.maxReattempts})
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-slate-900">
                    {attempt.score} / {attempt.maxScore}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{attempt.accuracy}%</TableCell>
                  <TableCell>
                    {attempt.officialRank ? (
                      <span className="text-xs font-bold text-slate-800">{attempt.officialRank}</span>
                    ) : (
                      <span className="text-xs text-slate-400">— (Practice)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">{attempt.date}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      onClick={() => onViewAnalysis(attempt.id)}
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Solutions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
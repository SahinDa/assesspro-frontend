import type { ElementType } from 'react'
import { 
  Users, FolderKanban, TrendingUp, CreditCard, 
  Plus, UserPlus, AlertTriangle, ArrowUpRight 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface OrgDashboardMetric {
  id: string
  label: string
  value: string | number
  subValue: string
  icon: ElementType
  color: string
  progress?: number
}

export interface ActiveModuleItem {
  id: string
  title: string
  testSetsCount: number
  submissionsCount: number
  avgScore: string
  avgScoreStatus: 'good' | 'average' | 'poor'
}

export interface AtRiskStudent {
  id: string
  name: string
  testTitle: string
  scorePercent: number
}

export interface LiveAttemptItem {
  id: string
  studentName: string
  testTitle: string
  isFirstAttempt: boolean
  attemptNumber: number
  score: number
  maxScore: number
  submittedAgo: string
}

export interface OrgDashboardData {
  metrics: OrgDashboardMetric[]
  activeModules: ActiveModuleItem[]
  atRiskStudents: AtRiskStudent[]
  liveAttempts: LiveAttemptItem[]
}

const DEFAULT_ORG_DATA: OrgDashboardData = {
  metrics: [
    { id: 'seats', label: 'Active Seats', value: '428 / 500 Used', subValue: '85.6% seat capacity reached', icon: Users, color: 'text-indigo-600 bg-indigo-50', progress: 85.6 },
    { id: 'sets', label: 'Published TestSets', value: '36 Sets', subValue: 'Across 8 Active Modules', icon: FolderKanban, color: 'text-blue-600 bg-blue-50' },
    { id: 'cohort', label: 'Cohort Avg. Score', value: '71.8%', subValue: '+4.2% from last mock cycle', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'plan', label: 'Plan Status', value: 'Pro Tier', subValue: 'Renews in 18 days', icon: CreditCard, color: 'text-purple-600 bg-purple-50' },
  ],
  activeModules: [
    { id: 'mod-1', title: 'GATE CS: Algorithms 2026', testSetsCount: 8, submissionsCount: 1240, avgScore: '74.2%', avgScoreStatus: 'good' },
    { id: 'mod-2', title: 'Machine Learning Foundations', testSetsCount: 6, submissionsCount: 890, avgScore: '62.8%', avgScoreStatus: 'average' },
  ],
  atRiskStudents: [
    { id: 'st-1', name: 'Rohan Sharma', testTitle: 'ML Set 04', scorePercent: 28 },
    { id: 'st-2', name: 'Ananya Roy', testTitle: 'Algorithms Set 02', scorePercent: 34 },
  ],
  liveAttempts: [
    { id: 'sub-1', studentName: 'Devika Menon', testTitle: 'ML Set 04: Linear Models', isFirstAttempt: true, attemptNumber: 1, score: 46, maxScore: 50, submittedAgo: '4 mins ago' },
    { id: 'sub-2', studentName: 'Kunal Verma', testTitle: 'GATE Full Mock 03', isFirstAttempt: false, attemptNumber: 2, score: 58, maxScore: 100, submittedAgo: '12 mins ago' },
  ],
}

interface OrgAdminDashboardProps {
  data?: OrgDashboardData
  onInviteStudents?: () => void
  onCreateTestSet?: () => void
  onViewModule?: (moduleId: string) => void
  onViewPaper?: (attemptId: string) => void
}

export function OrgAdminDashboard({
  data = DEFAULT_ORG_DATA,
  onInviteStudents = () => {},
  onCreateTestSet = () => {},
  onViewModule = () => {},
  onViewPaper = () => {},
}: OrgAdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 1. Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Organization Dashboard</h2>
          <p className="text-xs text-slate-500">Monitor candidate attempts, test completion rates, and seat utilization.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={onInviteStudents}
            variant="outline" 
            size="sm" 
            className="h-9 gap-1.5 rounded-xl border-slate-200 text-xs font-semibold"
          >
            <UserPlus className="h-3.5 w-3.5" /> Invite Students
          </Button>
          <Button 
            onClick={onCreateTestSet}
            size="sm" 
            className="h-9 gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" /> Create TestSet
          </Button>
        </div>
      </div>

      {/* 2. Top Metrics Grid (Mapped) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.id} className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{metric.label}</CardTitle>
                <div className={`p-2 rounded-xl ${metric.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                {metric.progress !== undefined && (
                  <Progress value={metric.progress} className="mt-2 h-1.5 bg-slate-100" />
                )}
                <p className="mt-1 text-xs text-slate-500">{metric.subValue}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 3. Split: Active Modules Table & At-Risk Outliers */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Modules Table */}
        <Card className="lg:col-span-2 rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Active Modules & Engagement</CardTitle>
              <CardDescription className="text-xs text-slate-500">Live student submission velocity</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs rounded-xl border-slate-200">
              Manage Content
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100">
                  <TableHead className="text-xs">Module Name</TableHead>
                  <TableHead className="text-xs">TestSets</TableHead>
                  <TableHead className="text-xs">Submissions</TableHead>
                  <TableHead className="text-xs">Avg. Score</TableHead>
                  <TableHead className="text-right text-xs">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.activeModules.map((mod) => (
                  <TableRow key={mod.id} className="border-slate-100">
                    <TableCell className="font-semibold text-xs text-slate-900">{mod.title}</TableCell>
                    <TableCell className="text-xs text-slate-600">{mod.testSetsCount} Sets</TableCell>
                    <TableCell className="text-xs text-slate-600">{mod.submissionsCount.toLocaleString()}</TableCell>
                    <TableCell className={`font-semibold text-xs ${
                      mod.avgScoreStatus === 'good' ? 'text-emerald-600' :
                      mod.avgScoreStatus === 'average' ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {mod.avgScore}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        onClick={() => onViewModule(mod.id)}
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs font-semibold text-slate-600"
                      >
                        View Sets
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* At-Risk Outliers */}
        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Outlier Alert
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">Students scoring &lt; 40% on recent tests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.atRiskStudents.map((st) => (
              <div key={st.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-2.5 bg-slate-50/50">
                <div>
                  <p className="text-xs font-semibold text-slate-900">{st.name}</p>
                  <p className="text-[11px] text-slate-500">{st.testTitle} • {st.scorePercent}% Score</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold text-indigo-600">Profile</Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-xs font-semibold rounded-xl border-slate-200 mt-1">
              View All At-Risk Students
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 4. Live Attempt Stream Table (Mapped) */}
      <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-900">Live Attempt Stream</CardTitle>
          <CardDescription className="text-xs text-slate-500">Real-time submissions across all organization tests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100">
                <TableHead className="text-xs">Student</TableHead>
                <TableHead className="text-xs">TestSet</TableHead>
                <TableHead className="text-xs">Attempt Type</TableHead>
                <TableHead className="text-xs">Score</TableHead>
                <TableHead className="text-xs">Time</TableHead>
                <TableHead className="text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.liveAttempts.map((attempt) => (
                <TableRow key={attempt.id} className="border-slate-100">
                  <TableCell className="font-semibold text-xs text-slate-900">{attempt.studentName}</TableCell>
                  <TableCell className="text-xs text-slate-600">{attempt.testTitle}</TableCell>
                  <TableCell>
                    {attempt.isFirstAttempt ? (
                      <Badge className="bg-indigo-50 text-indigo-700 border-0 text-[10px] font-bold">1st Attempt (Ranked)</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Retake #{attempt.attemptNumber}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-bold text-xs text-emerald-600">{attempt.score} / {attempt.maxScore}</TableCell>
                  <TableCell className="text-xs text-slate-400">{attempt.submittedAgo}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      onClick={() => onViewPaper(attempt.id)}
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs font-semibold text-slate-600"
                    >
                      View Paper
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
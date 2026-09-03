import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Users,
  UserPlus,
  Clock,
  XCircle,
  UserCheck,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ActiveStudentsList from '../components/ActiveStudentsList'
import PendingRequestsList from '../components/PendingRequestsList'
import RejectedStudentsList from '../components/RejectedStudentsList'
import InviteStudentModal from '../components/InviteStudentModal'
import StudentActionDialog, { type StudentActionType } from '../components/StudentActionDialog'
import {
  UserRole,
  JoinRequestStatus,
  type UserRoleType,
  type JoinRequestStatusType,
} from '@/config/enums'
import type { InviteStudentsFormData } from '../utils/studentValidation'

export interface StudentUserItem {
  id: string
  user_id: string
  org_id: string
  name: string
  email: string
  joined_date: string
  role: UserRoleType
  status: JoinRequestStatusType
}

const MOCK_STUDENTS: StudentUserItem[] = [
  {
    id: 'uo-1',
    user_id: 'u-101',
    org_id: 'org-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    joined_date: '2026-02-15T10:30:00Z',
    role: UserRole.STUDENT,
    status: JoinRequestStatus.APPROVED,
  },
  {
    id: 'uo-2',
    user_id: 'u-102',
    org_id: 'org-1',
    name: 'Priya Mukherjee',
    email: 'priya.m@example.com',
    joined_date: '2026-03-01T14:20:00Z',
    role: UserRole.STUDENT,
    status: JoinRequestStatus.APPROVED,
  },
  {
    id: 'uo-3',
    user_id: 'u-103',
    org_id: 'org-1',
    name: 'Rohan Verma',
    email: 'rohan.v@example.com',
    joined_date: '2026-08-18T09:15:00Z',
    role: UserRole.STUDENT,
    status: JoinRequestStatus.PENDING,
  },
  {
    id: 'uo-4',
    user_id: 'u-104',
    org_id: 'org-1',
    name: 'Sneha Roy',
    email: 'sneha.roy@example.com',
    joined_date: '2026-08-19T11:45:00Z',
    role: UserRole.STUDENT,
    status: JoinRequestStatus.PENDING,
  },
  {
    id: 'uo-5',
    user_id: 'u-105',
    org_id: 'org-1',
    name: 'Vikram Das',
    email: 'vikram.das@example.com',
    joined_date: '2026-01-10T08:00:00Z',
    role: UserRole.STUDENT,
    status: JoinRequestStatus.REJECTED,
  },
]

export interface OrgStudentsViewProps {
  userRole?: UserRoleType
  readOnly?: boolean
  orgId?: string
}

export default function OrgStudentsView({
  userRole = UserRole.ORGANIZATION,
  readOnly = false,
  orgId,
}: OrgStudentsViewProps) {
  const [students, setStudents] = useState<StudentUserItem[]>(MOCK_STUDENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const currentTab = ['active', 'pending', 'rejected'].includes(tabParam || '')
    ? (tabParam as string)
    : 'active'

  const isAdmin = userRole === UserRole.ADMIN || readOnly
  const isOrgAuthor = userRole === UserRole.ORGANIZATION && !readOnly

  const [actionState, setActionState] = useState<{
    isOpen: boolean
    actionType: StudentActionType | null
    student: StudentUserItem | null
  }>({
    isOpen: false,
    actionType: null,
    student: null,
  })

  function matchesSearch(s: StudentUserItem, query: string) {
    if (!query.trim()) return true
    const q = query.toLowerCase().trim()
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
  }

  const activeStudents = students.filter(
    (s) => s.status === JoinRequestStatus.APPROVED && matchesSearch(s, searchQuery)
  )
  const pendingRequests = students.filter(
    (s) => s.status === JoinRequestStatus.PENDING && matchesSearch(s, searchQuery)
  )
  const rejectedStudents = students.filter(
    (s) => s.status === JoinRequestStatus.REJECTED && matchesSearch(s, searchQuery)
  )

  const handleInviteSubmit = (data: InviteStudentsFormData) => {
    const newStudents: StudentUserItem[] = data.emails.map((email) => ({
      id: `uo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: `u-${Date.now()}`,
      org_id: orgId || 'org-1',
      name: email.split('@')[0],
      email: email,
      joined_date: new Date().toISOString(),
      role: UserRole.STUDENT,
      status: JoinRequestStatus.APPROVED,
    }))
    setStudents((prev) => [...newStudents, ...prev])
  }

  const handleActionConfirm = () => {
    if (!actionState.student || !actionState.actionType) return
    const targetId = actionState.student.id
    const action = actionState.actionType

    if (action === 'approve') {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === targetId ? { ...s, status: JoinRequestStatus.APPROVED } : s
        )
      )
    } else if (action === 'reject') {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === targetId ? { ...s, status: JoinRequestStatus.REJECTED } : s
        )
      )
    } else if (action === 'remove') {
      setStudents((prev) => prev.filter((s) => s.id !== targetId))
    }

    setActionState({ isOpen: false, actionType: null, student: null })
  }

  const handleBatchApprove = (ids: string[]) => {
    setStudents((prev) =>
      prev.map((s) =>
        ids.includes(s.id) ? { ...s, status: JoinRequestStatus.APPROVED } : s
      )
    )
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

  const totalActiveCount = students.filter(
    (s) => s.status === JoinRequestStatus.APPROVED
  ).length
  const totalPendingCount = students.filter(
    (s) => s.status === JoinRequestStatus.PENDING
  ).length
  const totalRejectedCount = students.filter(
    (s) => s.status === JoinRequestStatus.REJECTED
  ).length

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAdmin ? 'Enrolled Students (Audit)' : 'Students'}
            </h2>
            <Badge
              variant="secondary"
              className="text-[11px] font-semibold bg-slate-100 text-slate-600 rounded-lg px-2"
            >
              {totalActiveCount} Active
            </Badge>
            {isAdmin && (
              <Badge variant="outline" className="text-[10px] font-bold bg-amber-50 text-amber-800 border-amber-200">
                Read-Only Audit
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? 'Audit student rosters, pending verification queues, and enrollment records.'
              : 'Manage student rosters, review pending applications, and audit enrollment records.'}
          </p>
        </div>

        {/* Invite button: Organization Authors only */}
        {isOrgAuthor && students.length > 0 && (
          <Button
            onClick={() => setIsInviteOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <UserPlus className="h-4 w-4" /> Invite Student
          </Button>
        )}
      </div>

      {/* Global Zero-Data State */}
      {students.length === 0 ? (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-sm w-full bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
              <Users className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {isAdmin ? 'No Students in Organization' : 'No Students Enrolled'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAdmin
                  ? 'This organization does not currently have any student enrollments or membership requests.'
                  : 'Invite students to your organization to allow them to take assessments and access test sets.'}
              </p>
            </div>

            {isOrgAuthor && (
              <Button
                onClick={() => setIsInviteOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl h-10 px-5 gap-2 shadow-xs cursor-pointer"
              >
                <UserPlus className="h-4 w-4" /> Invite Student
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Tabs
          value={currentTab}
          defaultValue="active"
          onValueChange={(val) => setSearchParams({ tab: val })}
          className="space-y-5"
        >
          {/* Subheader: Tabs & Search Input */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <TabsList className="rounded-xl bg-slate-100 p-1 self-start">
              <TabsTrigger
                value="active"
                className="text-xs font-semibold rounded-lg px-3 gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5" />
                Active ({totalActiveCount})
              </TabsTrigger>

              <TabsTrigger
                value="pending"
                className="text-xs font-semibold rounded-lg px-3 gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                Join Requests
                {totalPendingCount > 0 && (
                  <span className="h-4 w-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {totalPendingCount}
                  </span>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="rejected"
                className="text-xs font-semibold rounded-lg px-3 gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5 text-slate-400" />
                Rejected ({totalRejectedCount})
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8.5 rounded-xl h-9 bg-white border-slate-200"
              />
            </div>
          </div>

          {/* TAB 1: ACTIVE */}
          <TabsContent value="active" className="m-0 space-y-4">
            <ActiveStudentsList
              students={activeStudents}
              onRemove={
                isOrgAuthor
                  ? (student) =>
                    setActionState({
                      isOpen: true,
                      actionType: 'remove',
                      student,
                    })
                  : undefined
              }
              formatDate={formatDate}
            />
          </TabsContent>

          {/* TAB 2: PENDING */}
          <TabsContent value="pending" className="m-0 space-y-4">
            <PendingRequestsList
              requests={pendingRequests}
              onApprove={
                isOrgAuthor
                  ? (student) =>
                    setActionState({
                      isOpen: true,
                      actionType: 'approve',
                      student,
                    })
                  : undefined
              }
              onReject={
                isOrgAuthor
                  ? (student) =>
                    setActionState({
                      isOpen: true,
                      actionType: 'reject',
                      student,
                    })
                  : undefined
              }
              onBatchApprove={isOrgAuthor ? handleBatchApprove : undefined}
              formatDate={formatDate}
            />
          </TabsContent>

          {/* TAB 3: REJECTED */}
          <TabsContent value="rejected" className="m-0 space-y-4">
            <RejectedStudentsList
              students={rejectedStudents}
              formatDate={formatDate}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Multi-Email Invite Modal */}
      {isOrgAuthor && (
        <>
          <InviteStudentModal
            isOpen={isInviteOpen}
            onClose={() => setIsInviteOpen(false)}
            onInvite={handleInviteSubmit}
          />

          <StudentActionDialog
            isOpen={actionState.isOpen}
            actionType={actionState.actionType}
            student={actionState.student}
            onClose={() => setActionState({ isOpen: false, actionType: null, student: null })}
            onConfirm={handleActionConfirm}
          />
        </>
      )}
    </div>
  )
}
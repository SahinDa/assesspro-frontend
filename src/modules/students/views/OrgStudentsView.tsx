import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Users,
  UserPlus,
  Clock,
  XCircle,
  UserCheck,
  Search,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ActiveStudentsList from '../components/ActiveStudentsList'
import PendingRequestsList from '../components/PendingRequestsList'
import RejectedStudentsList from '../components/RejectedStudentsList'
import InviteStudentModal from '../components/InviteStudentModal'
import StudentActionDialog, {
  type StudentActionType,
} from '../components/StudentActionDialog'
import {
  UserRole,
  JoinRequestStatus,
  StudentSearchType,
  type UserRoleType,
  type JoinRequestStatusType,
} from '@/config/enums'
import { useActiveOrgId } from '@/hooks/useActiveOrgId'
import {
  useActiveStudents,
  usePendingStudents,
  useRejectedStudents,
  useStudentsCount,
  useSearchStudents,
} from '../api/useStudentQueries'
import { useStudentMutations } from '../api/useStudentMutations'
import type {
  ActiveOrgUserResponse,
  JoinRequestUserResponse,
} from '../types/student.types'
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

export interface OrgStudentsViewProps {
  userRole?: UserRoleType
  readOnly?: boolean
  orgId?: string
}

const PAGE_LIMIT = 10

const TAB_TO_SEARCH_TYPE: Record<
  'active' | 'pending' | 'rejected',
  StudentSearchType
> = {
  active: StudentSearchType.ACTIVE,
  pending: StudentSearchType.PENDING,
  rejected: StudentSearchType.REJECTED,
}

function mapActiveToStudentItem(
  item: ActiveOrgUserResponse,
  orgId: string
): StudentUserItem {
  return {
    id: item.membershipId,
    user_id: item.userId,
    org_id: orgId,
    name: `${item.firstName} ${item.lastName ?? ''}`.trim(),
    email: item.email,
    joined_date: item.joinedDate,
    role: item.role as UserRoleType,
    status: JoinRequestStatus.APPROVED,
  }
}

function mapRequestToStudentItem(
  item: JoinRequestUserResponse,
  orgId: string,
  status: JoinRequestStatusType
): StudentUserItem {
  return {
    id: item.requestId,
    user_id: item.userId,
    org_id: orgId,
    name: `${item.firstName} ${item.lastName ?? ''}`.trim(),
    email: item.email,
    joined_date: item.requestedAt,
    role: UserRole.STUDENT,
    status,
  }
}

export default function OrgStudentsView({
  readOnly = false,
  orgId: propOrgId,
}: OrgStudentsViewProps) {
  const {
    orgId,
    isAdmin: isOrgContextAdmin,
    isOrganization,
  } = useActiveOrgId(propOrgId)
  const resolvedOrgId = orgId ?? ''

  const isAdmin = isOrgContextAdmin || readOnly
  const isOrgAuthor = isOrganization && !readOnly

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [offset, setOffset] = useState(0)

  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const currentTab = ['active', 'pending', 'rejected'].includes(tabParam || '')
    ? (tabParam as 'active' | 'pending' | 'rejected')
    : 'active'

  const [actionState, setActionState] = useState<{
    isOpen: boolean
    actionType: StudentActionType | null
    student: StudentUserItem | null
  }>({
    isOpen: false,
    actionType: null,
    student: null,
  })

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim())
      setOffset(0)
    }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const isSearching = debouncedQuery.length > 0
  const searchType = TAB_TO_SEARCH_TYPE[currentTab]

  // Queries
  const { data: countRes, isLoading: isCountLoading } =
    useStudentsCount(propOrgId)
  const counts = countRes?.data ?? {
    activeCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  }

  const totalActiveCount = counts.activeCount
  const totalPendingCount = counts.pendingCount
  const totalRejectedCount = counts.rejectedCount
  const totalAllCount =
    totalActiveCount + totalPendingCount + totalRejectedCount

  const { data: activeRes, isLoading: isActiveLoading } = useActiveStudents(
    { offset, limit: PAGE_LIMIT },
    propOrgId,
    currentTab === 'active' && !isSearching
  )

  const { data: pendingRes, isLoading: isPendingLoading } = usePendingStudents(
    { offset, limit: PAGE_LIMIT },
    propOrgId,
    currentTab === 'pending' && !isSearching
  )

  const { data: rejectedRes, isLoading: isRejectedLoading } =
    useRejectedStudents(
      { offset, limit: PAGE_LIMIT },
      propOrgId,
      currentTab === 'rejected' && !isSearching
    )

  const { data: searchRes, isLoading: isSearchLoading } = useSearchStudents(
    {
      query: debouncedQuery,
      type: searchType,
      offset,
      limit: PAGE_LIMIT,
    },
    propOrgId,
    isSearching
  )

  // Mutations
  const { handleStudentRequest, removeStudent } = useStudentMutations()

  // Mapped lists for UI components
  const activeStudents = useMemo(() => {
    const raw =
      isSearching && searchType === StudentSearchType.ACTIVE
        ? (searchRes?.data as ActiveOrgUserResponse[] | undefined)
        : activeRes?.data
    return (raw ?? []).map((item) =>
      mapActiveToStudentItem(item, resolvedOrgId)
    )
  }, [isSearching, searchType, searchRes?.data, activeRes?.data, resolvedOrgId])

  const pendingRequests = useMemo(() => {
    const raw =
      isSearching && searchType === StudentSearchType.PENDING
        ? (searchRes?.data as JoinRequestUserResponse[] | undefined)
        : pendingRes?.data
    return (raw ?? []).map((item) =>
      mapRequestToStudentItem(item, resolvedOrgId, JoinRequestStatus.PENDING)
    )
  }, [
    isSearching,
    searchType,
    searchRes?.data,
    pendingRes?.data,
    resolvedOrgId,
  ])

  const rejectedStudents = useMemo(() => {
    const raw =
      isSearching && searchType === StudentSearchType.REJECTED
        ? (searchRes?.data as JoinRequestUserResponse[] | undefined)
        : rejectedRes?.data
    return (raw ?? []).map((item) =>
      mapRequestToStudentItem(item, resolvedOrgId, JoinRequestStatus.REJECTED)
    )
  }, [
    isSearching,
    searchType,
    searchRes?.data,
    rejectedRes?.data,
    resolvedOrgId,
  ])

  const handleTabChange = (val: string) => {
    setOffset(0)
    setSearchParams({ tab: val })
  }

  const handleInviteSubmit = (_data: InviteStudentsFormData) => {
    setIsInviteOpen(false)
  }

  const closeActionDialog = () => {
    setActionState({ isOpen: false, actionType: null, student: null })
  }

  const handleActionConfirm = () => {
    if (!actionState.student || !actionState.actionType) return

    const { student, actionType } = actionState

    if (actionType === 'approve') {
      handleStudentRequest.mutate(
        {
          requestId: student.id,
          payload: { action: JoinRequestStatus.APPROVED },
        },
        { onSuccess: closeActionDialog }
      )
    } else if (actionType === 'reject') {
      handleStudentRequest.mutate(
        {
          requestId: student.id,
          payload: { action: JoinRequestStatus.REJECTED },
        },
        { onSuccess: closeActionDialog }
      )
    } else if (actionType === 'remove') {
      removeStudent.mutate(
        { userId: student.user_id },
        { onSuccess: closeActionDialog }
      )
    }
  }

  const handleBatchApprove = (requestIds: string[]) => {
    requestIds.forEach((requestId) => {
      handleStudentRequest.mutate({
        requestId,
        payload: { action: JoinRequestStatus.APPROVED },
      })
    })
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

  const isCurrentTabLoading = isSearching
    ? isSearchLoading
    : (currentTab === 'active' && isActiveLoading) ||
      (currentTab === 'pending' && isPendingLoading) ||
      (currentTab === 'rejected' && isRejectedLoading)

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
              <Badge
                variant="outline"
                className="text-[10px] font-bold bg-amber-50 text-amber-800 border-amber-200"
              >
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
        {isOrgAuthor && totalAllCount > 0 && (
          <Button
            onClick={() => setIsInviteOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <UserPlus className="h-4 w-4" /> Invite Student
          </Button>
        )}
      </div>

      {/* Global Zero-Data State */}
      {!isCountLoading && totalAllCount === 0 ? (
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
          onValueChange={handleTabChange}
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

          {isCurrentTabLoading ? (
            <div className="min-h-[30vh] flex items-center justify-center">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                Loading students...
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </Tabs>
      )}

      {/* Modals & Action Dialogs (Organization Authors only) */}
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
            onClose={closeActionDialog}
            onConfirm={handleActionConfirm}
          />
        </>
      )}
    </div>
  )
}
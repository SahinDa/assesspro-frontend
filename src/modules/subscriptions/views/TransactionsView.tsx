import { useState, useMemo } from 'react'
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import TransactionsTable from '../components/TransactionsTable'
import {
  UserRole,
  type UserRoleType,
  MOCK_STUDENT_TRANSACTIONS,
  MOCK_ORG_TRANSACTIONS,
  type StudentTransactionEntity,
  type OrganizationTransactionEntity,
} from '../utils/subscriptionValidation'

interface TransactionsViewProps {
  userRole?: UserRoleType
  currentUserId?: string
  currentOrgId?: string
}

export default function TransactionsView({
  userRole = UserRole.ORGANIZATION,
  currentUserId = 'std-user-1',
  currentOrgId = 'org-uuid-101',
}: TransactionsViewProps) {
  const [studentTxs] = useState<StudentTransactionEntity[]>(MOCK_STUDENT_TRANSACTIONS)
  const [orgTxs] = useState<OrganizationTransactionEntity[]>(MOCK_ORG_TRANSACTIONS)
  const [searchQuery, setSearchQuery] = useState('')

  const myStudentTransactions = useMemo(() => {
    return studentTxs.filter((tx) => tx.user_id === currentUserId)
  }, [studentTxs, currentUserId])

  const managedStudentTransactions = useMemo(() => {
    return studentTxs
      .filter((tx) => tx.organization_id === currentOrgId)
      .filter(
        (tx) =>
          tx.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tx.gateway_order_id && tx.gateway_order_id.toLowerCase().includes(searchQuery.toLowerCase()))
      )
  }, [studentTxs, currentOrgId, searchQuery])

  const myOrgPlatformTransactions = useMemo(() => {
    return orgTxs.filter((tx) => tx.organization_id === currentOrgId)
  }, [orgTxs, currentOrgId])

  return (
    <main className="w-full max-w-5xl mx-auto space-y-8 pb-24 px-2 sm:px-0">
      <header className="space-y-4">
        <CardHeader className="p-0 space-y-1">
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">
            Billing & Transaction History
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground whitespace-nowrap">
            Review ledger receipts, payment statuses, and Razorpay transaction IDs.
          </CardDescription>
        </CardHeader>
        <Separator />
      </header>

      {userRole === UserRole.STUDENT ? (
        <TransactionsTable transactions={myStudentTransactions} />
      ) : userRole === UserRole.ORGANIZATION ? (
        <Tabs defaultValue="student_payments" className="space-y-6">
          <TabsList className="bg-muted/60 p-1 rounded-xl">
            <TabsTrigger value="student_payments" className="text-xs font-bold rounded-lg">
              Student Payments ({managedStudentTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="org_billing" className="text-xs font-bold rounded-lg">
              Organization Platform Invoices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student_payments" className="space-y-4">
            <TransactionsTable
              transactions={managedStudentTransactions}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showSearch={true}
            />
          </TabsContent>

          <TabsContent value="org_billing" className="space-y-4">
            <TransactionsTable transactions={myOrgPlatformTransactions} />
          </TabsContent>
        </Tabs>
      ) : (
        /* Platform Superadmin View (B2B Platform Ledger Only) */
        <TransactionsTable
          transactions={orgTxs}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSearch={true}
        />
      )}
    </main>
  )
}
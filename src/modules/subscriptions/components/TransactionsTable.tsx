import { Search, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  OrgTransactionStatus,
  StudentTransactionStatus,
  type OrganizationTransactionEntity,
  type StudentTransactionEntity,
  getPaymentMethodLabel,
  getBillingCycleLabel,
} from '../utils/subscriptionValidation'

interface TransactionsTableProps {
  transactions: (OrganizationTransactionEntity | StudentTransactionEntity)[]
  searchQuery?: string
  onSearchChange?: (q: string) => void
  showSearch?: boolean
}

export default function TransactionsTable({
  transactions,
  searchQuery = '',
  onSearchChange,
  showSearch = false,
}: TransactionsTableProps) {
  const getStatusBadge = (status: number) => {
    if (status === OrgTransactionStatus.Success || status === StudentTransactionStatus.Success) {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Success
        </Badge>
      )
    }
    if (status === OrgTransactionStatus.Pending || status === StudentTransactionStatus.Pending) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      )
    }
    return (
      <Badge variant="destructive" className="text-[10px] font-bold gap-1">
        <XCircle className="h-3 w-3" />
        Failed
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {showSearch && onSearchChange && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, plan name, or gateway ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 rounded-xl text-xs bg-card"
          />
        </div>
      )}

      <Card className="rounded-2xl border-border shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-bold">Gateway Order ID</TableHead>
                <TableHead className="text-xs font-bold">Plan & Cycle</TableHead>
                <TableHead className="text-xs font-bold">Date</TableHead>
                <TableHead className="text-xs font-bold">Payment Method</TableHead>
                <TableHead className="text-xs font-bold">Amount</TableHead>
                <TableHead className="text-xs font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                    No transactions recorded.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.transaction_id} className="hover:bg-muted/20 text-xs">
                    <TableCell className="font-mono font-bold text-foreground">
                      {tx.gateway_order_id || tx.transaction_id.slice(0, 13)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block">{tx.plan_name}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {getBillingCycleLabel(tx.billing_cycle)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono uppercase bg-muted/30">
                        {getPaymentMethodLabel(tx.payment_method)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-black font-mono text-foreground">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
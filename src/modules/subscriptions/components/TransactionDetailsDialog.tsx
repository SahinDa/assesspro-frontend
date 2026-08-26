import { useState } from 'react'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Receipt,
  Calendar,
  CreditCard,
  Layers,
  ShieldCheck,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  type OrganizationTransactionEntity,
  type StudentTransactionEntity,
  OrgTransactionStatus,
  StudentTransactionStatus,
  getPaymentMethodLabel,
  getBillingCycleLabel,
} from '../utils/subscriptionValidation'

interface TransactionDetailsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  transaction: OrganizationTransactionEntity | StudentTransactionEntity | null
}

export default function TransactionDetailsDialog({
  isOpen,
  onOpenChange,
  transaction,
}: TransactionDetailsDialogProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  if (!transaction) return null

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const isSuccess =
    transaction.status === OrgTransactionStatus.Success ||
    transaction.status === StudentTransactionStatus.Success

  const isPending =
    transaction.status === OrgTransactionStatus.Pending ||
    transaction.status === StudentTransactionStatus.Pending

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Receipt className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-black tracking-tight text-foreground">
                  Transaction Details
                </DialogTitle>
                <DialogDescription className="text-[11px] text-muted-foreground">
                  Invoice & ledger verification record
                </DialogDescription>
              </div>
            </div>

            {isSuccess ? (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Success
              </Badge>
            ) : isPending ? (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold gap-1">
                <Clock className="h-3 w-3" />
                Pending
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-[10px] font-bold gap-1">
                <XCircle className="h-3 w-3" />
                Failed
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Amount Card */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground block">Amount Paid</span>
            <span className="text-2xl font-black font-mono text-foreground">
              ₹{transaction.amount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-muted-foreground block">Plan Tier</span>
            <span className="text-xs font-bold text-foreground block">{transaction.plan_name}</span>
            <span className="text-[10px] text-indigo-600 font-bold">
              {getBillingCycleLabel(transaction.billing_cycle)}
            </span>
          </div>
        </div>

        {/* Key Transaction Identifiers */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider block">
            Payment Identifiers
          </span>

          <div className="space-y-1.5 bg-card border border-border rounded-xl p-3">
            {/* Gateway Order ID */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px]">Gateway Order ID</span>
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-foreground">
                <span>{transaction.gateway_order_id || 'N/A'}</span>
                {transaction.gateway_order_id && (
                  <button
                    type="button"
                    onClick={() => handleCopy(transaction.gateway_order_id!, 'order_id')}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    {copiedKey === 'order_id' ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Gateway Transaction ID */}
            {transaction.gateway_transaction_id && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">Payment ID</span>
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-foreground">
                  <span>{transaction.gateway_transaction_id}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(transaction.gateway_transaction_id!, 'tx_id')}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    {copiedKey === 'tx_id' ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Internal System ID */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px]">Transaction UUID</span>
              <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[200px]">
                {transaction.transaction_id}
              </span>
            </div>
          </div>
        </div>

        {/* Metadata Breakdown */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl border border-border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <Calendar className="h-3.5 w-3.5" />
              <span>Timestamp</span>
            </div>
            <p className="font-bold text-foreground text-[11px]">
              {new Date(transaction.created_at).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>

          <div className="p-3 rounded-xl border border-border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <CreditCard className="h-3.5 w-3.5" />
              <span>Payment Mode</span>
            </div>
            <p className="font-bold text-foreground text-[11px]">
              {getPaymentMethodLabel(transaction.payment_method)} (Razorpay)
            </p>
          </div>
        </div>

        <Separator />

        {/* Snapshotted Features / Quotas from JSONB */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <Layers className="h-3.5 w-3.5" />
            <span>Snapshotted Tier Limits</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(transaction.features || {}).map(([key, val]) => (
              <div key={key} className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs">
                <span className="text-[10px] text-muted-foreground block capitalize">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="font-bold text-foreground font-mono">
                  {typeof val === 'boolean' ? (val ? 'Enabled' : 'Disabled') : val.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security / Close Footer */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Encrypted Ledger Record</span>
          </div>
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs font-semibold h-8 px-4"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
import { Building2, Users2, IndianRupee, Activity, Plus, MoreVertical, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Platform Super Admin</h2>
          <p className="text-xs text-slate-500">Cross-tenant infrastructure metrics, licensing, and platform revenue.</p>
        </div>
        <Button size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold h-9 px-4">
          <Plus className="h-3.5 w-3.5" /> Onboard Organization
        </Button>
      </div>

      {/* Global Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Organizations</CardTitle>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">48 Active</div>
            <p className="mt-1 text-xs text-slate-500">3 Pending Verification</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform Students</CardTitle>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">18,420</div>
            <p className="mt-1 text-xs text-emerald-600 font-medium">+1,240 this month</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly GMV</CardTitle>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <IndianRupee className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">₹ 8,42,000</div>
            <p className="mt-1 text-xs text-slate-500">Razorpay recurring volume</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Test Load</CardTitle>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,890</div>
            <p className="mt-1 text-xs text-slate-500">32ms API Latency</p>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Directory */}
      <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-900">Tenant Organizations</CardTitle>
          <CardDescription className="text-xs text-slate-500">Active coaching institutes and universities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100">
                <TableHead className="text-xs">Organization</TableHead>
                <TableHead className="text-xs">Admin Contact</TableHead>
                <TableHead className="text-xs">Seat Utilization</TableHead>
                <TableHead className="text-xs">Plan Tier</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-slate-100">
                <TableCell>
                  <div className="font-semibold text-xs text-slate-900">Apex Academy</div>
                  <div className="text-[11px] text-slate-400">/apex-academy</div>
                </TableCell>
                <TableCell className="text-xs text-slate-600">admin@apex.edu</TableCell>
                <TableCell className="text-xs text-slate-600">428 / 500 Seats</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-bold">Enterprise (₹45k/mo)</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-50 text-emerald-700 border-0 text-[10px] font-bold">Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem className="text-xs gap-2">
                        <ExternalLink className="h-3.5 w-3.5" /> Impersonate Org View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">Edit Seat Limits</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs text-rose-600">Suspend Organization</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
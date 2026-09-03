import { useState, useMemo } from 'react'
import { Search, Building2, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrganizationStatus, OrgSubscriptionStatus, type OrganizationStatusEnum } from '@/config/enums'
import type { OrgItem } from '../utils/adminOrgValidation'
import OrgDirectoryCard from '../components/OrgDirectoryCard'
import AdminOrgDetailView from './AdminOrgDetailView'

const MOCK_ORGS: OrgItem[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Acme Technical Academy',
    status: OrganizationStatus.ACTIVE,
    subscription_status: OrgSubscriptionStatus.Active,
    created_at: '2026-01-15T08:00:00.000Z',
    updated_at: '2026-08-01T12:00:00.000Z',
    owner_name: 'David Miller',
    owner_email: 'david@acmetech.edu',
    members_count: 12,
    tests_count: 14,
    attempts_count: 1240,
  },
  {
    id: 'b1ffcd88-8b1a-4fe7-aa5c-5aa8ac270b22',
    name: 'AlgoCamp Institute',
    status: OrganizationStatus.ACTIVE,
    subscription_status: OrgSubscriptionStatus.Active,
    created_at: '2026-03-20T10:30:00.000Z',
    owner_name: 'Ananya Roy',
    owner_email: 'ananya@algocamp.io',
    members_count: 4,
    tests_count: 8,
    attempts_count: 512,
  },
  {
    id: 'c2eedc77-7a2b-4cd6-994b-4bb7ab160c33',
    name: 'GatePrep Hub',
    status: OrganizationStatus.ON_HOLD,
    subscription_status: OrgSubscriptionStatus.OnHold,
    created_at: '2026-06-10T14:15:00.000Z',
    owner_name: 'Vikram Seth',
    owner_email: 'vikram@gateprep.org',
    members_count: 2,
    tests_count: 2,
    attempts_count: 45,
  },
]

type FilterStatus = 'ALL' | OrganizationStatusEnum

export default function AdminOrganizationsView() {
  const [selectedOrg, setSelectedOrg] = useState<OrgItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL')

  const filteredOrgs = useMemo(() => {
    return MOCK_ORGS.filter((org) => {
      // Status filter
      if (statusFilter !== 'ALL' && org.status !== statusFilter) {
        return false
      }
      // Text query filter
      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase()
      return (
        org.name.toLowerCase().includes(query) ||
        (org.owner_email && org.owner_email.toLowerCase().includes(query))
      )
    })
  }, [searchQuery, statusFilter])

  // Drill down view
  if (selectedOrg) {
    return <AdminOrgDetailView org={selectedOrg} onBack={() => setSelectedOrg(null)} />
  }

  const resetFilters = () => {
    setSearchQuery('')
    setStatusFilter('ALL')
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Tenant & Organization Directory
            </h1>
            <Badge variant="secondary" className="text-xs font-bold px-2 py-0.5 rounded-lg">
              {filteredOrgs.length}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-medium pt-0.5">
            Manage organization entities, membership limits, and operational states.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search org name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl bg-white border-slate-200"
          />
        </div>
      </div>

      {/* Filter Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Button
          variant={statusFilter === 'ALL' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('ALL')}
          className="rounded-xl text-xs h-8 px-3 font-semibold cursor-pointer"
        >
          All Tenants
        </Button>
        <Button
          variant={statusFilter === OrganizationStatus.ACTIVE ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(OrganizationStatus.ACTIVE)}
          className="rounded-xl text-xs h-8 px-3 font-semibold cursor-pointer"
        >
          Active
        </Button>
        <Button
          variant={statusFilter === OrganizationStatus.ON_HOLD ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(OrganizationStatus.ON_HOLD)}
          className="rounded-xl text-xs h-8 px-3 font-semibold cursor-pointer"
        >
          On Hold
        </Button>
      </div>

      {/* Organization List or Empty State */}
      {filteredOrgs.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filteredOrgs.map((org) => (
            <OrgDirectoryCard
              key={org.id}
              org={org}
              onInspect={(selected) => setSelectedOrg(selected)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">No organizations found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              No organization matching "{searchQuery}" under the selected status filter.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="rounded-xl text-xs h-8 px-3 gap-1.5 cursor-pointer font-semibold"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Filters</span>
          </Button>
        </div>
      )}
    </div>
  )
}
import { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Mail,
  Calendar,
  ShieldCheck,
  PauseCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  OrganizationStatus,
  type OrganizationStatusEnum,
} from '@/config/enums';
import type { OrgItem } from '../utils/adminOrgValidation';
import OrgStatusBadge from '../components/OrgStatusBadge';
import OrgOverviewMetrics from '../components/OrgOverviewMetrics';
import TestAttemptsView from '@/modules/attempts/views/TestAttemptsView';
import { TransactionsView } from '@/modules/subscriptions';
import { UserRole } from '@/config/enums';
import TestsView from '@/modules/tests/views/TestsView';
import OrgStudentsView from '@/modules/students/views/OrgStudentsView';
import LeaderboardView from '@/modules/leaderboards/views/LeaderboardView';


interface AdminOrgDetailViewProps {
  org: OrgItem;
  onBack: () => void;
}

export default function AdminOrgDetailView({ org, onBack }: AdminOrgDetailViewProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'tests' | 'attempts' | 'members' | 'leaderboard' | 'billing'
  >('overview')
  const [status, setStatus] = useState<OrganizationStatusEnum>(org.status);

  const toggleStatus = () => {
    setStatus((prev) =>
      prev === OrganizationStatus.ACTIVE
        ? OrganizationStatus.ON_HOLD
        : OrganizationStatus.ACTIVE
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-9 w-9 p-0 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900">{org.name}</h2>
              <OrgStatusBadge status={status} />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium pt-0.5">
              {org.owner_email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-slate-400" />
                  {org.owner_email}
                </span>
              )}
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                Created {new Date(org.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Status Toggle Action */}
        <div className="flex items-center gap-2">
          {status !== OrganizationStatus.DELETED && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleStatus}
              className={`rounded-xl text-xs h-8.5 px-3 gap-1.5 font-bold cursor-pointer ${status === OrganizationStatus.ACTIVE
                ? 'border-amber-200 text-amber-800 hover:bg-amber-50'
                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                }`}
            >
              {status === OrganizationStatus.ACTIVE ? (
                <>
                  <PauseCircle className="h-3.5 w-3.5" /> Put On Hold
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" /> Activate Tenant
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList className="bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
          <TabsTrigger value="overview" className="rounded-xl text-xs font-semibold">
            Overview
          </TabsTrigger>
          <TabsTrigger value="tests" className="rounded-xl text-xs font-semibold">
            Test Catalog ({org.tests_count})
          </TabsTrigger>
          <TabsTrigger value="attempts" className="rounded-xl text-xs font-semibold">
            Submissions ({org.attempts_count})
          </TabsTrigger>
          <TabsTrigger value="members" className="rounded-xl text-xs font-semibold">
            Members ({org.members_count})
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="rounded-xl text-xs font-semibold">
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-xl text-xs font-semibold">
            Subscription & Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OrgOverviewMetrics org={{ ...org, status }} />
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <div className="bg-slate-50/50 p-2 rounded-3xl">
            <TestsView
              userRole={UserRole.ADMIN}
              readOnly={true}
              orgId={org.id}
            />
          </div>
        </TabsContent>

        <TabsContent value="attempts">
          <div className="bg-slate-50/50 p-1 rounded-3xl">
            <TestAttemptsView userRole={UserRole.ORGANIZATION} />
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="bg-slate-50/50 p-2 rounded-3xl">
            <OrgStudentsView
              userRole={UserRole.ADMIN}
              readOnly={true}
              orgId={org.id}
            />
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <div className="bg-slate-50/50 p-2 sm:p-4 rounded-3xl">
            <LeaderboardView userRole={UserRole.ADMIN} orgId={org.id} />
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="bg-slate-50/50 p-1 rounded-3xl">
            <TransactionsView userRole={UserRole.ORGANIZATION} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
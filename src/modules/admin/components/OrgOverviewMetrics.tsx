import { Layers, FileCheck, Users, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { OrgSubscriptionStatusMeta, type OrgItem } from '../utils/adminOrgValidation';

interface OrgOverviewMetricsProps {
  org: OrgItem;
}

export default function OrgOverviewMetrics({ org }: OrgOverviewMetricsProps) {
  const subMeta = OrgSubscriptionStatusMeta[org.subscription_status];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <Card className="rounded-2xl border-slate-200/80 bg-white">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">{org.tests_count}</span>
            <span className="text-xs text-slate-500 font-medium">Published Tests</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200/80 bg-white">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">{org.attempts_count}</span>
            <span className="text-xs text-slate-500 font-medium">Candidate Submissions</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200/80 bg-white">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">{org.members_count}</span>
            <span className="text-xs text-slate-500 font-medium">Team Members</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200/80 bg-white">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 block">{subMeta.label}</span>
            <span className="text-xs text-slate-500 font-medium">Tenant Billing State</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
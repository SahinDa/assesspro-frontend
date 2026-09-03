import { Building2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OrgStatusBadge from './OrgStatusBadge';
import { OrgSubscriptionStatusMeta, type OrgItem } from '../utils/adminOrgValidation';

interface OrgDirectoryCardProps {
  org: OrgItem;
  onInspect: (org: OrgItem) => void;
}

export default function OrgDirectoryCard({ org, onInspect }: OrgDirectoryCardProps) {
  const subMeta = OrgSubscriptionStatusMeta[org.subscription_status];

  return (
    <Card className="rounded-2xl border-slate-200/80 bg-white hover:border-indigo-200 hover:shadow-xs transition-all">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
            <Building2 className="h-4 w-4" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900">{org.name}</h3>
              <OrgStatusBadge status={org.status} />
              <Badge variant="outline" className={`text-[10px] font-semibold py-0 ${subMeta.badgeClass}`}>
                {subMeta.label}
              </Badge>
            </div>
            {org.owner_email && (
              <p className="text-xs text-slate-400">{org.owner_email}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
          <div className="text-left sm:text-right">
            <span className="text-xs font-black text-slate-800 block">
              {org.tests_count} Tests • {org.attempts_count} Submissions
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {org.members_count} team members
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => onInspect(org)}
            className="rounded-xl text-xs h-8 px-3 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          >
            <span>Inspect Hub</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
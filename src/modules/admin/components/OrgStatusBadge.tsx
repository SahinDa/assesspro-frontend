import { Badge } from '@/components/ui/badge';
import {
  OrganizationStatus,
  OrganizationStatusMeta,
  type OrganizationStatusEnum,
} from '../utils/adminOrgValidation';

interface OrgStatusBadgeProps {
  status: OrganizationStatusEnum;
  className?: string;
}

export default function OrgStatusBadge({ status, className = '' }: OrgStatusBadgeProps) {
  const meta = OrganizationStatusMeta[status] ?? {
    label: 'Unknown',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
  };

  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-bold py-0.5 px-2 gap-1.5 inline-flex items-center ${meta.badgeClass} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      <span>{meta.label}</span>
    </Badge>
  );
}
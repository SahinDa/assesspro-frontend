// src/modules/organization/config/navbar.config.ts
import { 
  LayoutDashboard, 
  FileText, 
  Trophy, 
  Bookmark, 
  CreditCard, 
  Bell, 
  Settings, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  BarChart3,
  GraduationCap,
  Compass
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { UserRole,type UserRoleType } from './enums'

export interface NavItemConfig {
  title: string
  href: string
  icon: LucideIcon
  badge?: string | number
}

export const NAVIGATION_CONFIG: Record<UserRoleType, NavItemConfig[]> = {
  [UserRole.ADMIN]: [
    { title: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
    { title: 'Organizations', href: '/admin/organizations', icon: Users, badge: 'New' },
    { title: 'System Metrics', href: '/admin/metrics', icon: BarChart3 },
    { title: 'Security Audits', href: '/admin/security', icon: ShieldCheck },
    { title: 'Global Settings', href: '/admin/settings', icon: Settings },
  ],
  [UserRole.ORGANIZATION]: [
    { title: 'Dashboard', href: '/dashboard/organization', icon: LayoutDashboard },
    { title: 'Tests & Assessments', href: '/dashboard/tests', icon: FileText },
    { title: 'Leaderboards', href: '/dashboard/leaderboards', icon: Trophy },
    { title: 'Bookmarks', href: '/dashboard/bookmarks', icon: Bookmark },
    { title: 'Billing & Plans', href: '/dashboard/billing', icon: CreditCard },
    { title: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: 3 },
    { title: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  [UserRole.STUDENT]: [
    { title: 'My Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { title: 'Available Tests', href: '/student/tests', icon: BookOpen },
    { title: 'My Scores & Rank', href: '/student/scores', icon: Trophy },
    { title: 'Saved Bookmarks', href: '/student/bookmarks', icon: Bookmark },
    { title: 'Certificates', href: '/student/certificates', icon: GraduationCap },
    { title: 'Profile & Settings', href: '/student/settings', icon: Settings },
  ],
  [UserRole.OTHER]: [
    { title: 'Role Selection', href: '/role-selection', icon: Compass },
  ],
}
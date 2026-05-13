import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Users,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  UserSquare2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Role } from '@/types';

type View =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'staff'
  | 'reports'
  | 'project-detail'
  | 'approvals'
  | 'client-overview'
  | 'client-updates'
  | 'client-documents'
  | 'client-team';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  collapsed: boolean;
  onToggle: () => void;
  role: Role;
  pendingApprovalsCount?: number;
}

interface MenuItem {
  id: View;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

function GSILogo({ size = 'large' }: { size?: 'small' | 'large' }) {
  const px = size === 'large' ? 40 : 20;
  return (
    <img
      src="/logo.png"
      alt="GSI Logo"
      width={px}
      height={px}
      className="flex-shrink-0 object-contain"
    />
  );
}

function buildMenu(role: Role, pendingApprovalsCount: number): MenuItem[] {
  if (role === 'Client') {
    return [
      { id: 'client-overview', label: 'Project Overview', icon: LayoutDashboard },
      { id: 'client-updates', label: 'Project Updates', icon: ClipboardList },
      { id: 'client-documents', label: 'Documents', icon: FileText },
      { id: 'client-team', label: 'Project Team', icon: UserSquare2 },
    ];
  }

  if (role === 'Staff') {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'projects', label: 'My Projects', icon: FolderKanban },
      { id: 'tasks', label: 'My Tasks', icon: ClipboardList },
      { id: 'reports', label: 'Reports', icon: FileBarChart },
    ];
  }

  if (role === 'Supervisor') {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
      { id: 'staff', label: 'Staff Assignment', icon: Users },
      { id: 'reports', label: 'Reports', icon: FileBarChart },
    ];
  }

  if (role === 'Project Manager') {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
      { id: 'tasks', label: 'Tasks', icon: ClipboardList },
      { id: 'staff', label: 'Staff', icon: Users },
      { id: 'reports', label: 'Reports', icon: FileBarChart },
    ];
  }

  const base: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'staff', label: role === 'Admin' ? 'Accounts' : 'Staff', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
  ];

  if (role === 'Admin') {
    base.push({
      id: 'approvals',
      label: 'Approvals',
      icon: ShieldCheck,
      badge: pendingApprovalsCount,
    });
  }

  return base;
}

export function Sidebar({
  currentView,
  onNavigate,
  collapsed,
  onToggle,
  role,
  pendingApprovalsCount = 0,
}: SidebarProps) {
  const menuItems = buildMenu(role, pendingApprovalsCount);
  const isClient = role === 'Client';

  return (
    <aside
      className={`bg-[#0f172a] text-white transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <GSILogo size="large" />
            <div>
              <h1 className="font-bold text-lg leading-tight text-white">GSI Portal</h1>
              <p className="text-xs text-slate-400">
                {isClient ? 'Client Portal' : 'Geoinnovative Inc.'}
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <GSILogo size="small" />
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-4 pt-4 pb-1">
          <p className="text-[10px] font-bold tracking-[1.6px] text-slate-500 uppercase">
            {isClient ? 'Client Portal' : 'Workspace'}
          </p>
        </div>
      )}

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/30'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                  {!collapsed && (
                    <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  )}
                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <Badge className="bg-amber-500 text-white text-[10px] h-5 min-w-[20px] flex items-center justify-center px-1.5 rounded-full">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {isClient && !collapsed && (
        <div className="px-4 pb-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
              <Lock className="w-3 h-3" />
              Read-Only Access
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              You can view project info only. Contact your PM for any change requests.
            </p>
          </div>
        </div>
      )}

      <div className="p-3 border-t border-slate-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full text-slate-500 hover:text-white hover:bg-slate-800"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </aside>
  );
}

import { useState } from 'react';
import {
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Clock,
  AlertCircle,
  CheckCircle2,
  Info,
  Settings,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Notification, User } from '@/types';

interface HeaderProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  user: User;
  onLogout: () => void;
  isClient?: boolean;
  onOpenSettings?: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'deadline':
      return <Clock className="w-4 h-4 text-red-500" />;
    case 'task':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'project':
      return <AlertCircle className="w-4 h-4 text-blue-500" />;
    case 'approval':
      return <ShieldCheck className="w-4 h-4 text-amber-500" />;
    default:
      return <Info className="w-4 h-4 text-gray-500" />;
  }
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export function Header({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  user,
  onLogout,
  isClient,
  onOpenSettings,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        {!isClient ? (
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search projects, tasks, or staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Updates Active
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isClient && user.role === 'Admin' && (
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-600 hover:text-blue-600 hover:bg-blue-50"
            onClick={onOpenSettings}
          >
            <Settings className="w-5 h-5" />
          </Button>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span className="font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <span
                  className="text-xs text-blue-600 cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    onMarkAllRead();
                  }}
                >
                  Mark all read
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => onMarkRead(notification.id)}
                  >
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          !notification.read
                            ? 'font-medium text-slate-900'
                            : 'text-slate-700'
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{notification.message}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {isClient && (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-3 py-1 text-[10.5px] font-bold tracking-wide whitespace-nowrap">
            CLIENT ACCESS
          </span>
        )}

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-slate-100">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-medium shadow-md">
                {user.avatar}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="w-4 h-4 mr-2 text-slate-500" />
              Profile
            </DropdownMenuItem>
            {!isClient && (
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2 text-slate-500" />
                Settings
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="w-4 h-4 mr-2 text-slate-500" />
              Notifications
            </DropdownMenuItem>
            {isClient && (
              <DropdownMenuItem className="cursor-default text-slate-500" disabled>
                <Lock className="w-4 h-4 mr-2" />
                Read-Only Access
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

import { ScrollText, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ActivityLog } from '@/types';

interface ActivityLogsProps {
  logs: ActivityLog[];
}

const getRoleColor = (role: string) => {
  if (role.includes('Admin'))     return 'bg-red-100 text-red-700';
  if (role.includes('BD'))        return 'bg-orange-100 text-orange-700';
  if (role.includes('PM Supervisor')) return 'bg-blue-100 text-blue-700';
  if (role.includes('PM Staff'))  return 'bg-indigo-100 text-indigo-700';
  if (role.includes('TI'))        return 'bg-purple-100 text-purple-700';
  if (role.includes('Support'))   return 'bg-teal-100 text-teal-700';
  if (role.includes('Staff'))     return 'bg-green-100 text-green-700';
  if (role.includes('Client'))    return 'bg-gray-100 text-gray-700';
  return 'bg-slate-100 text-slate-700';
};

export function ActivityLogs({ logs }: ActivityLogsProps) {
  const sorted = [...logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Activity Logs</h1>
        <p className="text-slate-500">System-wide audit trail of all user actions.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {sorted.length === 0 && (
            <div className="text-center py-12">
              <ScrollText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No activity recorded yet.</p>
            </div>
          )}
          <div className="divide-y divide-slate-100">
            {sorted.map((log, i) => (
              <div key={log.id} className={`flex items-start gap-4 px-5 py-4 ${i === 0 ? 'rounded-t-lg' : ''}`}>
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-800 text-sm">{log.userName}</span>
                    <Badge className={`text-[10px] px-2 py-0 ${getRoleColor(log.userRole)}`}>
                      {log.userRole}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {log.action}: <span className="text-slate-700 font-medium">{log.target}</span>
                  </p>
                </div>
                <p className="text-xs text-slate-400 shrink-0 text-right">
                  {new Date(log.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                  <br />
                  {new Date(log.timestamp).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

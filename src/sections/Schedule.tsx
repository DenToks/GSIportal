import { CalendarDays, Clock, AlertCircle, CheckCircle2, FolderKanban } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Task, Project, User } from '@/types';

interface ScheduleProps {
  tasks: Task[];
  projects: Project[];
  currentUser: User;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':   return 'bg-green-100 text-green-700 border-green-200';
    case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Pending':     return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Overdue':     return 'bg-red-100 text-red-700 border-red-200';
    default:            return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':   return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case 'In Progress': return <Clock className="w-4 h-4 text-blue-600" />;
    case 'Overdue':     return <AlertCircle className="w-4 h-4 text-red-600" />;
    default:            return <div className="w-4 h-4 rounded-full border-2 border-amber-400" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':   return 'text-red-600 bg-red-50';
    case 'Medium': return 'text-amber-600 bg-amber-50';
    case 'Low':    return 'text-green-600 bg-green-50';
    default:       return 'text-gray-600 bg-gray-50';
  }
};

function groupByDate(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce((acc, task) => {
    const date = task.dueDate || 'No Due Date';
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
}

function formatDateHeader(dateStr: string) {
  if (dateStr === 'No Due Date') return 'No Due Date';
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  if (dateStr === todayStr) return 'Today';
  if (dateStr === tomorrowStr) return 'Tomorrow';
  return date.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function isOverdue(dateStr: string) {
  if (dateStr === 'No Due Date') return false;
  return new Date(dateStr) < new Date(new Date().toISOString().split('T')[0]);
}

export function Schedule({ tasks, projects, currentUser }: ScheduleProps) {
  // Show only tasks assigned to this user
  const myTasks = tasks.filter(t =>
    t.assignedTo.includes(currentUser.name) && t.status !== 'Completed'
  );

  const completedCount = tasks.filter(t =>
    t.assignedTo.includes(currentUser.name) && t.status === 'Completed'
  ).length;

  const sortedTasks = [...myTasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const grouped = groupByDate(sortedTasks);
  const dates = Object.keys(grouped).sort((a, b) => {
    if (a === 'No Due Date') return 1;
    if (b === 'No Due Date') return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const getProjectName = (projectId: string) =>
    projects.find(p => p.id === projectId)?.name || 'Unknown Project';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Schedule</h1>
        <p className="text-slate-500">Your upcoming tasks and deadlines.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-blue-600" />
          </div>
          <div><p className="text-2xl font-bold">{myTasks.length}</p><p className="text-xs text-slate-500">Active Tasks</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div><p className="text-2xl font-bold">{myTasks.filter(t => t.status === 'Overdue').length}</p><p className="text-xs text-slate-500">Overdue</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div><p className="text-2xl font-bold">{completedCount}</p><p className="text-xs text-slate-500">Completed</p></div>
        </CardContent></Card>
      </div>

      {myTasks.length === 0 && (
        <div className="text-center py-12">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No active tasks</p>
          <p className="text-slate-400 text-sm mt-1">You have no pending or in-progress tasks.</p>
        </div>
      )}

      {/* Timeline grouped by date */}
      <div className="space-y-6">
        {dates.map(date => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`h-2 w-2 rounded-full ${isOverdue(date) ? 'bg-red-500' : 'bg-blue-500'}`} />
              <h3 className={`text-sm font-semibold ${isOverdue(date) ? 'text-red-600' : 'text-slate-700'}`}>
                {formatDateHeader(date)}
                {isOverdue(date) && <span className="ml-2 text-xs font-normal text-red-400">(overdue)</span>}
              </h3>
            </div>
            <div className="space-y-2 pl-5 border-l-2 border-slate-100">
              {grouped[date].map(task => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">{getStatusIcon(task.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-medium text-slate-800 text-sm">{task.title}</p>
                          <Badge variant="outline" className={getStatusColor(task.status)}>{task.status}</Badge>
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        </div>
                        <p className="text-xs text-slate-500">{task.description}</p>
                        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                          <FolderKanban className="w-3 h-3" /> {getProjectName(task.projectId)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

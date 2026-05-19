import {
  FolderKanban,
  ClipboardList,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Project, Task, User, Staff as StaffType, ActivityLog } from '@/types';
import type { View } from '@/components/Sidebar';

interface DashboardProps {
  projects: Project[];
  tasks: Task[];
  onProjectClick: (projectId: string) => void;
  onNavigate: (view: View) => void;
  currentUser?: User;
  staffList?: StaffType[];
  activityLogs?: ActivityLog[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ongoing':   return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'Pending':   return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'On Hold':   return 'bg-gray-100 text-gray-700 border-gray-200';
    default:          return 'bg-gray-100 text-gray-700';
  }
};

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':   return 'bg-green-100 text-green-700';
    case 'In Progress': return 'bg-blue-100 text-blue-700';
    case 'Pending':     return 'bg-amber-100 text-amber-700';
    case 'Overdue':     return 'bg-red-100 text-red-700';
    default:            return 'bg-gray-100 text-gray-700';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':   return 'text-red-600';
    case 'Medium': return 'text-amber-600';
    case 'Low':    return 'text-green-600';
    default:       return 'text-gray-600';
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

interface StatCard {
  label: string;
  value: number | string;
  sub: string;
  subValue?: number | string;
  color: string;
  icon: React.ReactNode;
}

export function Dashboard({ projects, tasks, onProjectClick, onNavigate, currentUser, staffList = [], activityLogs = [] }: DashboardProps) {
  const role = currentUser?.role;
  const jobPosition = currentUser?.jobPosition;

  // Active (non-archived) projects
  const activeProjects = projects.filter(p => p.stage !== 'Archived');

  // Role-specific project/task filters
  const myProjects = activeProjects.filter(p =>
    p.manager === currentUser?.name ||
    (p.assignedPMId !== undefined && p.assignedPMId === currentUser?.id)
  );

  const myTasks = tasks.filter(t => t.assignedTo.includes(currentUser?.name ?? ''));

  const staffProjects = activeProjects.filter(p =>
    currentUser ? p.team.includes(currentUser.name) : false
  );

  // Staff pool counts (for supervisors)
  const assignedStaff  = staffList.filter(s => s.status === 'Assigned').length;
  const availableStaff = staffList.filter(s => s.status === 'Available').length;
  const onLeaveStaff   = staffList.filter(s => s.status === 'On Leave').length;

  // Build stat cards per role
  let statCards: StatCard[] = [];

  if (role === 'Staff') {
    statCards = [
      { label: 'My Tasks',    value: myTasks.length,                                          sub: 'total assigned',     color: 'blue',   icon: <ClipboardList className="w-6 h-6 text-blue-600" /> },
      { label: 'In Progress', value: myTasks.filter(t => t.status === 'In Progress').length,  sub: 'tasks active now',   color: 'amber',  icon: <Clock className="w-6 h-6 text-amber-600" /> },
      { label: 'Pending',     value: myTasks.filter(t => t.status === 'Pending').length,      sub: 'not started yet',    color: 'slate',  icon: <ClipboardList className="w-6 h-6 text-slate-600" /> },
      { label: 'Completed',   value: myTasks.filter(t => t.status === 'Completed').length,    sub: 'tasks done',         color: 'green',  icon: <CheckCircle2 className="w-6 h-6 text-green-600" /> },
    ];
  } else if (role === 'Project Manager' && jobPosition === 'PM Staff') {
    const pmTasks     = tasks.filter(t => myProjects.some(p => p.id === t.projectId));
    const pmPending   = pmTasks.filter(t => t.status !== 'Completed').length;
    const pmOverdue   = pmTasks.filter(t => t.status === 'Overdue').length;
    const pmCompleted = pmTasks.filter(t => t.status === 'Completed').length;
    statCards = [
      { label: 'My Projects',   value: myProjects.length,  sub: 'assigned to me',          color: 'blue',   icon: <FolderKanban className="w-6 h-6 text-blue-600" /> },
      { label: 'Pending Tasks', value: pmPending,          sub: 'across my projects',       color: 'amber',  icon: <ClipboardList className="w-6 h-6 text-amber-600" /> },
      { label: 'Overdue',       value: pmOverdue,          sub: 'need immediate attention', color: 'red',    icon: <AlertCircle className="w-6 h-6 text-red-600" /> },
      { label: 'Completed',     value: pmCompleted,        sub: 'tasks finished',           color: 'green',  icon: <CheckCircle2 className="w-6 h-6 text-green-600" /> },
    ];
  } else if (role === 'Supervisor') {
    statCards = [
      { label: 'Active Projects', value: activeProjects.length, sub: 'in the system',         color: 'blue',   icon: <FolderKanban className="w-6 h-6 text-blue-600" /> },
      { label: 'Assigned Staff',  value: assignedStaff,         sub: 'deployed on projects',  color: 'amber',  icon: <Users className="w-6 h-6 text-amber-600" /> },
      { label: 'Available',       value: availableStaff,        sub: 'ready for assignment',  color: 'green',  icon: <CheckCircle2 className="w-6 h-6 text-green-600" /> },
      { label: 'On Leave',        value: onLeaveStaff,          sub: 'staff on leave',        color: 'slate',  icon: <Clock className="w-6 h-6 text-slate-600" /> },
    ];
  } else if (role === 'Project Manager' && jobPosition === 'PM Supervisor') {
    const unassigned = activeProjects.filter(p => !p.assignedPMId).length;
    const ongoing    = activeProjects.filter(p => p.status === 'Ongoing').length;
    const completed  = projects.filter(p => p.status === 'Completed').length;
    statCards = [
      { label: 'Total Projects',  value: activeProjects.length, sub: 'active in system',      color: 'blue',   icon: <FolderKanban className="w-6 h-6 text-blue-600" /> },
      { label: 'Unassigned',      value: unassigned,            sub: 'need PM Staff',          color: 'amber',  icon: <AlertCircle className="w-6 h-6 text-amber-600" /> },
      { label: 'Ongoing',         value: ongoing,               sub: 'in progress',            color: 'green',  icon: <Clock className="w-6 h-6 text-green-600" /> },
      { label: 'Completed',       value: completed,             sub: 'projects done',          color: 'purple', icon: <CheckCircle2 className="w-6 h-6 text-purple-600" /> },
    ];
  } else if (role === 'Project Manager' && jobPosition === 'BD Supervisor') {
    const ongoing   = activeProjects.filter(p => p.status === 'Ongoing').length;
    const pending   = activeProjects.filter(p => p.status === 'Pending').length;
    const archived  = projects.filter(p => p.stage === 'Archived').length;
    statCards = [
      { label: 'Created Projects', value: activeProjects.length, sub: 'total in system',   color: 'blue',   icon: <FolderKanban className="w-6 h-6 text-blue-600" /> },
      { label: 'Ongoing',          value: ongoing,               sub: 'currently active',  color: 'green',  icon: <Clock className="w-6 h-6 text-green-600" /> },
      { label: 'Pending',          value: pending,               sub: 'not yet started',   color: 'amber',  icon: <AlertCircle className="w-6 h-6 text-amber-600" /> },
      { label: 'Archived',         value: archived,              sub: 'completed/archived', color: 'slate', icon: <TrendingUp className="w-6 h-6 text-slate-600" /> },
    ];
  } else {
    // Admin and fallback — full system view
    const pendingTaskCount = tasks.filter(t => t.status !== 'Completed').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const completionRate = activeProjects.length > 0
      ? Math.round((completedProjects / projects.length) * 100) : 0;
    statCards = [
      { label: 'Total Projects', value: activeProjects.length, sub: `${activeProjects.filter(p=>p.status==='Ongoing').length} ongoing`, color: 'blue',   icon: <FolderKanban className="w-6 h-6 text-blue-600" /> },
      { label: 'Pending Tasks',  value: pendingTaskCount,      sub: `${tasks.filter(t=>t.status==='Overdue').length} overdue`,        color: 'amber',  icon: <ClipboardList className="w-6 h-6 text-amber-600" /> },
      { label: 'Total Staff',    value: staffList.length,      sub: `${availableStaff} available`,                                   color: 'green',  icon: <Users className="w-6 h-6 text-green-600" /> },
      { label: 'Completion Rate',value: `${completionRate}%`,  sub: `${completedProjects} projects done`,                            color: 'purple', icon: <TrendingUp className="w-6 h-6 text-purple-600" /> },
    ];
  }

  const colorMap: Record<string, string> = {
    blue:   'from-blue-100 to-blue-200 border-l-blue-500',
    amber:  'from-amber-100 to-amber-200 border-l-amber-500',
    green:  'from-green-100 to-green-200 border-l-green-500',
    red:    'from-red-100 to-red-200 border-l-red-500',
    purple: 'from-purple-100 to-purple-200 border-l-purple-500',
    slate:  'from-slate-100 to-slate-200 border-l-slate-400',
    teal:   'from-teal-100 to-teal-200 border-l-teal-500',
  };

  // Content lists filtered per role
  const displayProjects = (() => {
    if (role === 'Project Manager' && jobPosition === 'PM Staff') return myProjects.filter(p => p.status === 'Ongoing').slice(0, 5);
    if (role === 'Staff') return staffProjects.filter(p => p.status === 'Ongoing').slice(0, 5);
    return activeProjects.filter(p => p.status === 'Ongoing').slice(0, 5);
  })();

  const displayTasks = (() => {
    if (role === 'Staff') return myTasks.filter(t => t.status !== 'Completed').slice(0, 5);
    if (role === 'Project Manager' && jobPosition === 'PM Staff') {
      return tasks.filter(t => myProjects.some(p => p.id === t.projectId) && t.status !== 'Completed').slice(0, 5);
    }
    return tasks.filter(t => t.status !== 'Completed').slice(0, 5);
  })();

  const taskNavTarget: View = role === 'Staff' || (role === 'Project Manager' && jobPosition === 'PM Staff') ? 'tasks' : 'tasks';

  // Recent activity feed — Admin sees all, Staff sees their own + their projects
  const recentActivity = (() => {
    const sorted = [...activityLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    if (role === 'Staff') {
      const myProjectNames = new Set(staffProjects.map(p => p.name));
      return sorted.filter(log =>
        log.userName === currentUser?.name || myProjectNames.has(log.target)
      ).slice(0, 10);
    }
    return sorted.slice(0, 10);
  })();

  const getInitials = (name: string) =>
    name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">
            Welcome back{currentUser ? `, ${currentUser.name.split(' ').slice(-1)[0]}` : ''}!
            {' '}Here's what's happening with your work.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200">
          <Calendar className="w-4 h-4 text-blue-500" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <Card key={i} className={`hover:shadow-lg transition-shadow border-l-4 ${colorMap[card.color]?.split(' ')[1] ?? 'border-l-blue-500'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-800">{card.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[card.color]?.split(' ')[0] ?? 'from-blue-100 to-blue-200'} rounded-xl flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-500">{card.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects list */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-blue-500" />
              {role === 'Project Manager' && jobPosition === 'PM Staff' ? 'My Ongoing Projects' :
               role === 'Staff' ? 'My Projects' : 'Ongoing Projects'}
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => onNavigate('projects')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {displayProjects.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No ongoing projects to show.</p>
            ) : (
              <div className="space-y-4">
                {displayProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-all hover:border-blue-200 hover:shadow-sm"
                    onClick={() => onProjectClick(project.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-800">{project.name}</h4>
                        <p className="text-sm text-slate-500">{project.client}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-semibold text-slate-700">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                        <Calendar className="w-3 h-3" />
                        Due {new Date(project.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                        <Users className="w-3 h-3" />
                        {project.team.length} members
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks / Staff list */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {role === 'Supervisor' ? (
                <><Users className="w-5 h-5 text-amber-500" />Staff Pool</>
              ) : (
                <><ClipboardList className="w-5 h-5 text-amber-500" />
                  {role === 'Staff' ? 'My Tasks' : 'Pending Tasks'}
                </>
              )}
            </CardTitle>
            {role !== 'Supervisor' && (
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => onNavigate(taskNavTarget)}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
            {role === 'Supervisor' && (
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => onNavigate('staff')}>
                Assign <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {role === 'Supervisor' ? (
              /* Staff pool summary for supervisors */
              <div className="space-y-3">
                {[
                  { label: 'Assigned', count: assignedStaff,  color: 'bg-blue-100 text-blue-700' },
                  { label: 'Available',count: availableStaff, color: 'bg-green-100 text-green-700' },
                  { label: 'On Leave', count: onLeaveStaff,   color: 'bg-amber-100 text-amber-700' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                    <span className="text-sm text-slate-700 font-medium">{row.label}</span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${row.color}`}>{row.count}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl mt-2">
                  <span className="text-sm text-slate-700 font-medium">Total Staff</span>
                  <span className="text-sm font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">{staffList.length}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {displayTasks.length === 0 ? (
                  <p className="text-sm text-slate-400 py-4 text-center">No pending tasks.</p>
                ) : (
                  displayTasks.map((task) => (
                    <div key={task.id} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${getTaskStatusColor(task.status)} p-1 rounded`}>
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                          <p className="text-xs text-slate-500">{task.assignedTo.join(', ')}</p>
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={`text-xs ${getTaskStatusColor(task.status)}`}>
                              {task.status}
                            </Badge>
                            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Recent Activity
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => onNavigate('activity-logs')}>
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No recent activity.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentActivity.map(log => (
                <div key={log.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-700">{getInitials(log.userName)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium text-slate-800">{log.userName}</span>
                      {' '}{log.action}{' '}
                      <span className="text-blue-600 font-medium">{log.target}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(log.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
                      {new Date(log.timestamp).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

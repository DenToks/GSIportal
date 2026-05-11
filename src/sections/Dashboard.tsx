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
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { dashboardStats, activities } from '@/data/sampleData';
import type { Project, Task } from '@/types';

interface DashboardProps {
  projects: Project[];
  tasks: Task[];
  onProjectClick: (projectId: string) => void;
  onNavigate: (view: 'projects' | 'tasks') => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ongoing': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'On Hold': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-700';
    case 'In Progress': return 'bg-blue-100 text-blue-700';
    case 'Pending': return 'bg-amber-100 text-amber-700';
    case 'Overdue': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'text-red-600';
    case 'Medium': return 'text-amber-600';
    case 'Low': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case 'In Progress':
      return <Clock className="w-4 h-4 text-blue-600" />;
    case 'Overdue':
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    default:
      return <div className="w-4 h-4 rounded-full border-2 border-amber-400" />;
  }
};

export function Dashboard({ projects, tasks, onProjectClick, onNavigate }: DashboardProps) {
  const ongoingProjects = projects.filter(p => p.status === 'Ongoing').slice(0, 5);
  const pendingTasks = tasks.filter(t => t.status !== 'Completed').slice(0, 5);
  const overdueTasks = tasks.filter(t => t.status === 'Overdue');

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">Welcome back to GSI Portal! Here's what's happening with your projects.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200">
          <Calendar className="w-4 h-4 text-blue-500" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Projects</p>
                <p className="text-3xl font-bold text-slate-800">{dashboardStats.totalProjects}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-semibold">{dashboardStats.ongoingProjects}</span>
              <span className="text-slate-500 ml-1">ongoing</span>
              <span className="mx-2 text-slate-300">|</span>
              <span className="text-green-600 font-semibold">{dashboardStats.completedProjects}</span>
              <span className="text-slate-500 ml-1">completed</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending Tasks</p>
                <p className="text-3xl font-bold text-slate-800">{dashboardStats.pendingTasks}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {overdueTasks.length > 0 ? (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-600 font-semibold">{overdueTasks.length}</span>
                  <span className="text-slate-500 ml-1">overdue</span>
                </>
              ) : (
                <span className="text-green-600 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  All on track
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Staff</p>
                <p className="text-3xl font-bold text-slate-800">{dashboardStats.totalStaff}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-semibold">{dashboardStats.availableStaff}</span>
              <span className="text-slate-500 ml-1">available for assignment</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Completion Rate</p>
                <p className="text-3xl font-bold text-slate-800">
                  {Math.round((dashboardStats.completedProjects / dashboardStats.totalProjects) * 100)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-purple-600 font-semibold">{dashboardStats.completedProjects}</span>
              <span className="text-slate-500 ml-1">projects completed this year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ongoing Projects */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-blue-500" />
              Ongoing Projects
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => onNavigate('projects')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ongoingProjects.map((project) => (
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
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-500" />
              Pending Tasks
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => onNavigate('tasks')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-700">
                    {activity.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800">
                    <span className="font-semibold">{activity.user}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-semibold text-blue-600">{activity.target}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

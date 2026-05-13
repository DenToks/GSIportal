import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  AlertCircle,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  ClipboardList
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StaffPicker } from '@/components/StaffPicker';
import type { Task, Project, Role, Staff as StaffType } from '@/types';

interface TasksProps {
  tasks: Task[];
  projects: Project[];
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
  onAddTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  role?: Role;
  staffList?: StaffType[];
  currentUser?: import('@/types').User;
}

const EMPTY_TASK_FORM = {
  title: '',
  description: '',
  projectId: '',
  assignedTo: [] as string[],
  status: 'Pending' as Task['status'],
  priority: 'Medium' as Task['priority'],
  dueDate: '',
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'text-red-600 bg-red-50';
    case 'Medium': return 'text-amber-600 bg-amber-50';
    case 'Low': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
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

export function Tasks({ tasks, projects, onUpdateStatus, onAddTask, onEditTask, role, staffList = [], currentUser }: TasksProps) {
  const isStaff = role === 'Staff';
  const isAdmin = role === 'Admin';
  // Only PM Staff (not BD/PM Supervisor) manages tasks
  const isPM = role === 'Project Manager' && currentUser?.jobPosition !== 'BD Supervisor';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState(EMPTY_TASK_FORM);

  const setField = <K extends keyof typeof EMPTY_TASK_FORM>(key: K, value: (typeof EMPTY_TASK_FORM)[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      assignedTo: task.assignedTo,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      onEditTask({ ...editingTask, ...form });
    } else {
      onAddTask({ id: `TSK-${Date.now()}`, ...form });
    }
    setEditingTask(null);
    setForm(EMPTY_TASK_FORM);
    setDialogOpen(false);
  };

  const filteredTasks = tasks.filter(task => {
    const project = projects.find(p => p.id === task.projectId);
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    overdue: tasks.filter(t => t.status === 'Overdue').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
          <p className="text-slate-500">Manage and track project tasks and assignments.</p>
        </div>
        {isPM && (
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setEditingTask(null); setForm(EMPTY_TASK_FORM); setDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
              <p className="text-xs text-slate-500">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.overdue}</p>
              <p className="text-xs text-slate-500">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search tasks by title, assignee, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {!isAdmin && (
                  <div className="pt-1">
                    <Checkbox
                      checked={task.status === 'Completed'}
                      onCheckedChange={(checked) => {
                        onUpdateStatus(task.id, checked ? 'Completed' : 'Pending');
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-medium ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                      <p className="text-xs text-blue-600 mt-1">{getProjectName(task.projectId)}</p>
                    </div>
                    {isAdmin ? null : isStaff ? (
                      <Select
                        value={task.status}
                        onValueChange={(v) => onUpdateStatus(task.id, v as Task['status'])}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTimeout(() => openEdit(task), 0)}>Edit Task</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(task.id, task.status === 'Completed' ? 'Pending' : 'Completed')}
                          >
                            {task.status === 'Completed' ? 'Mark as Pending' : 'Mark as Complete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        {task.status}
                      </span>
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority} Priority
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <User className="w-3 h-3" />
                      {task.assignedTo.join(', ')}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600">No tasks found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'New Task'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="task-title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="task-title"
                value={form.title}
                onChange={e => setField('title', e.target.value)}
                placeholder="e.g. Conduct soil boring test"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-desc">Description</Label>
              <Textarea
                id="task-desc"
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                placeholder="Optional task details..."
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select value={form.projectId} onValueChange={v => setField('projectId', v)}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={v => setField('priority', v as Task['priority'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setField('status', v as Task['status'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <StaffPicker
                staffList={staffList}
                selected={form.assignedTo}
                onChange={names => setField('assignedTo', names)}
                multiple
                dropLabel="Drag staff here to assign (multiple allowed)"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due Date</Label>
              <Input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={e => setField('dueDate', e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">{editingTask ? 'Save Changes' : 'Create Task'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  FileText,
  ClipboardList,
  CheckCircle2,
  MoreHorizontal,
  Download,
  Edit,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import type { Project, Task, Role, Staff as StaffType, User } from '@/types';

interface ActivityEntry {
  id: number;
  user: string;
  comment: string;
  timestamp: string;
}

interface ProjectDetailProps {
  project: Project;
  tasks: Task[];
  onBack: () => void;
  onEditProject: (updated: Project) => void;
  onAddTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  role?: Role;
  jobPosition?: string;
  staffList?: StaffType[];
  currentUser?: User;
  users?: User[];
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

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Geotechnical': return 'bg-purple-100 text-purple-700';
    case 'Geoscience': return 'bg-teal-100 text-teal-700';
    case 'Civil Infrastructure': return 'bg-orange-100 text-orange-700';
    case 'Environmental': return 'bg-green-100 text-green-700';
    case 'Geohazard': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getTaskStatusColor = (status: string) => {
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

const projectDocuments = [
  { id: 1, name: 'Project Proposal.pdf', size: '2.4 MB', uploadedBy: 'Engr. Patricia Lim', uploadedAt: '2024-01-10' },
  { id: 2, name: 'Technical Specifications.pdf', size: '5.1 MB', uploadedBy: 'Engr. Carlos Reyes', uploadedAt: '2024-01-15' },
  { id: 3, name: 'Site Investigation Report.pdf', size: '8.7 MB', uploadedBy: 'Engr. Maria Santos', uploadedAt: '2024-02-20' },
  { id: 4, name: 'Laboratory Test Results.xlsx', size: '1.2 MB', uploadedBy: 'Engr. John Cruz', uploadedAt: '2024-03-25' },
];

const initialComments: ActivityEntry[] = [
  { id: 1, user: 'Engr. Patricia Lim', comment: 'Initial site visit completed. Soil conditions are as expected.', timestamp: '2024-01-20T10:30:00' },
  { id: 2, user: 'Engr. Carlos Reyes', comment: 'Borehole drilling at Station 10+000 is progressing well.', timestamp: '2024-02-15T14:20:00' },
  { id: 3, user: 'Engr. Maria Santos', comment: 'Laboratory testing for Batch A samples is complete. Results look good.', timestamp: '2024-03-27T16:45:00' },
];

export function ProjectDetail({ project, tasks, onBack, onEditProject, onAddTask, onEditTask, role, jobPosition, staffList = [], currentUser, users = [] }: ProjectDetailProps) {
  const isStaff = role === 'Staff';
  const isSupervisor = role === 'Supervisor';
  const isPMSupervisor = role === 'Project Manager' && jobPosition === 'PM Supervisor';
  // BD Supervisor creates projects but doesn't manage them after — PM Supervisor/Staff do
  const isPM = role === 'Project Manager' && jobPosition !== 'BD Supervisor';

  // Supervisor only picks Staff-role users for manpower assignment
  const pickableStaff = isSupervisor
    ? staffList.filter(m => {
        const u = users.find(u => u.email.toLowerCase() === m.email.toLowerCase() || u.name === m.name);
        return !u || u.role === 'Staff';
      })
    : staffList;

  // PM Supervisor only picks PM Staff for assignment
  const pickablePMStaff = isPMSupervisor
    ? staffList.filter(m => {
        const u = users.find(u => u.email.toLowerCase() === m.email.toLowerCase() || u.name === m.name);
        return u && u.role === 'Project Manager' && u.jobPosition === 'PM Staff';
      })
    : staffList;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const [comments, setComments] = useState<ActivityEntry[]>(initialComments);
  const [newComment, setNewComment] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: project.name,
    client: project.client,
    type: project.type,
    status: project.status,
    progress: project.progress,
    startDate: project.startDate,
    endDate: project.endDate,
    manager: project.manager,
    location: project.location,
    description: project.description,
  });

  const openEdit = () => {
    setForm({
      name: project.name,
      client: project.client,
      type: project.type,
      status: project.status,
      progress: project.progress,
      startDate: project.startDate,
      endDate: project.endDate,
      manager: project.manager,
      location: project.location,
      description: project.description,
    });
    setEditOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditProject({ ...project, ...form });
    setEditOpen(false);
  };

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const [assignTeamOpen, setAssignTeamOpen] = useState(false);
  const [assignTeam, setAssignTeam] = useState<string[]>(project.team);
  const [assignPMStaffOpen, setAssignPMStaffOpen] = useState(false);
  const [assignPMStaff, setAssignPMStaff] = useState<string[]>(project.team);

  const EMPTY_TASK = { title: '', description: '', assignedTo: [] as string[], status: 'Pending' as Task['status'], priority: 'Medium' as Task['priority'], dueDate: '' };
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState(EMPTY_TASK);

  const setTaskField = <K extends keyof typeof EMPTY_TASK>(key: K, value: (typeof EMPTY_TASK)[K]) => {
    setTaskForm(prev => ({ ...prev, [key]: value }));
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({ title: task.title, description: task.description, assignedTo: task.assignedTo, status: task.status, priority: task.priority, dueDate: task.dueDate });
    setTaskDialogOpen(true);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      onEditTask({ ...editingTask, ...taskForm });
    } else {
      onAddTask({ id: `TSK-${Date.now()}`, projectId: project.id, ...taskForm });
    }
    setEditingTask(null);
    setTaskForm(EMPTY_TASK);
    setTaskDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
              <Badge variant="outline" className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </div>
            <p className="text-slate-500">{project.id} • {project.client}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Comment
          </Button>
          {isSupervisor && (
            <Button variant="outline" onClick={() => { setAssignTeam(project.team); setAssignTeamOpen(true); }}>
              <Users className="w-4 h-4 mr-2" />
              Assign Team
            </Button>
          )}
          {isPMSupervisor && (
            <Button variant="outline" onClick={() => { setAssignPMStaff(project.team); setAssignPMStaffOpen(true); }}>
              <Users className="w-4 h-4 mr-2" />
              Assign PM Staff
            </Button>
          )}
          {isPM && (
            <Button variant="outline" onClick={openEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Generate Report</DropdownMenuItem>
              {isPM && <DropdownMenuItem>Archive Project</DropdownMenuItem>}
              {isPM && <DropdownMenuItem className="text-red-600">Delete Project</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tasks.length}</p>
                <p className="text-xs text-slate-500">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedTasks}</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{project.team.length}</p>
                <p className="text-xs text-slate-500">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{new Date(project.endDate).toLocaleDateString()}</p>
                <p className="text-xs text-slate-500">Due Date</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Project Progress</span>
            <span className="text-sm font-medium text-slate-700">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-3" />
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
            <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Description</p>
                  <p className="text-sm text-slate-800">{project.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Project Type</p>
                    <Badge className={getTypeColor(project.type)}>{project.type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Location</p>
                    <p className="text-sm text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {project.location}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Project Manager</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {project.manager.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-800">{project.manager}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                          {member.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{member}</p>
                        <p className="text-xs text-slate-500">Team Member</p>
                      </div>
                    </div>
                  ))}
                  {project.team.length === 0 && (
                    <p className="text-sm text-slate-400">No team members assigned yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Project Tasks</h3>
            {isPM && (
              <Button size="sm" onClick={() => { setEditingTask(null); setTaskForm(EMPTY_TASK); setTaskDialogOpen(true); }}>
                <ClipboardList className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-800">{task.title}</h4>
                        <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {task.assignedTo.join(', ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        {isPM && (
                          <DropdownMenuItem onClick={() => setTimeout(() => openEditTask(task), 0)}>Edit Task</DropdownMenuItem>
                        )}
                        <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No tasks assigned to this project yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Project Documents</h3>
            {!isStaff && (
              <Button size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {projectDocuments.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{doc.name}</h4>
                        <p className="text-sm text-slate-500">
                          {doc.size} • Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <h3 className="text-lg font-semibold">Project Activity</h3>

          {/* Only team members, PM, and Admin can post */}
          {(() => {
            const canPost = currentUser && (
              ['Admin', 'Project Manager', 'Supervisor'].includes(currentUser.role) ||
              project.team.includes(currentUser.name)
            );
            if (!canPost) {
              return (
                <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <MessageSquare className="w-4 h-4" />
                  Only project team members can post activity updates.
                </div>
              );
            }
            return (
              <div className="flex gap-3 items-start">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                    {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newComment.trim()) {
                        setComments(prev => [...prev, {
                          id: Date.now(),
                          user: currentUser.name,
                          comment: newComment.trim(),
                          timestamp: new Date().toISOString(),
                        }]);
                        setNewComment('');
                      }
                    }}
                    placeholder="Write an activity update and press Enter..."
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 shrink-0"
                    disabled={!newComment.trim()}
                    onClick={() => {
                      setComments(prev => [...prev, {
                        id: Date.now(),
                        user: currentUser.name,
                        comment: newComment.trim(),
                        timestamp: new Date().toISOString(),
                      }]);
                      setNewComment('');
                    }}
                  >
                    Post
                  </Button>
                </div>
              </div>
            );
          })()}

          {/* Activity feed */}
          <div className="space-y-4">
            {comments.map((entry) => (
              <div key={entry.id} className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {entry.user.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-800">{entry.user}</span>
                      <span className="text-xs text-slate-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{entry.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTaskSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="ptask-title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="ptask-title"
                value={taskForm.title}
                onChange={e => setTaskField('title', e.target.value)}
                placeholder="e.g. Conduct soil boring test"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ptask-desc">Description</Label>
              <Textarea
                id="ptask-desc"
                value={taskForm.description}
                onChange={e => setTaskField('description', e.target.value)}
                placeholder="Optional task details..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={taskForm.priority} onValueChange={v => setTaskField('priority', v as Task['priority'])}>
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
                <Select value={taskForm.status} onValueChange={v => setTaskField('status', v as Task['status'])}>
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
                selected={taskForm.assignedTo}
                onChange={names => setTaskField('assignedTo', names)}
                multiple
                dropLabel="Drag staff here to assign (multiple allowed)"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ptask-due">Due Date</Label>
              <Input
                id="ptask-due"
                type="date"
                value={taskForm.dueDate}
                onChange={e => setTaskField('dueDate', e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">{editingTask ? 'Save Changes' : 'Create Task'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Supervisor — Assign Manpower Dialog */}
      <Dialog open={assignTeamOpen} onOpenChange={setAssignTeamOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Manpower</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-500">
              Drag staff members into the drop zone to assign them to this project.
            </p>
            <StaffPicker
              staffList={pickableStaff}
              selected={assignTeam}
              onChange={setAssignTeam}
              multiple
              dropLabel="Drag staff here to add to project"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setAssignTeamOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              onEditProject({ ...project, team: assignTeam });
              setAssignTeamOpen(false);
            }}>
              Save Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PM Supervisor — Assign PM Staff Dialog */}
      <Dialog open={assignPMStaffOpen} onOpenChange={setAssignPMStaffOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign PM Staff to Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-500">
              Drag PM Staff members into the drop zone to assign them to this project.
            </p>
            <StaffPicker
              staffList={pickablePMStaff}
              selected={assignPMStaff}
              onChange={setAssignPMStaff}
              multiple
              dropLabel="Drag PM Staff here to add to project"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setAssignPMStaffOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              onEditProject({ ...project, team: assignPMStaff });
              setAssignPMStaffOpen(false);
            }}>
              Save Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="pd-name">Project Name <span className="text-red-500">*</span></Label>
                <Input id="pd-name" value={form.name} onChange={e => setField('name', e.target.value)} required />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="pd-client">Client <span className="text-red-500">*</span></Label>
                <Input id="pd-client" value={form.client} onChange={e => setField('client', e.target.value)} required />
              </div>

              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setField('type', v as Project['type'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Geotechnical">Geotechnical</SelectItem>
                    <SelectItem value="Geoscience">Geoscience</SelectItem>
                    <SelectItem value="Civil Infrastructure">Civil Infrastructure</SelectItem>
                    <SelectItem value="Environmental">Environmental</SelectItem>
                    <SelectItem value="Geohazard">Geohazard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setField('status', v as Project['status'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pd-start">Start Date</Label>
                <Input id="pd-start" type="date" value={form.startDate} onChange={e => setField('startDate', e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pd-end">End Date</Label>
                <Input id="pd-end" type="date" value={form.endDate} onChange={e => setField('endDate', e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pd-progress">Progress (%)</Label>
                <Input id="pd-progress" type="number" min={0} max={100} value={form.progress} onChange={e => setField('progress', Number(e.target.value))} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pd-manager">Project Manager</Label>
                <Input id="pd-manager" value={form.manager} onChange={e => setField('manager', e.target.value)} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="pd-location">Location</Label>
                <Input id="pd-location" value={form.location} onChange={e => setField('location', e.target.value)} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="pd-desc">Description</Label>
                <Textarea id="pd-desc" value={form.description} onChange={e => setField('description', e.target.value)} rows={3} />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

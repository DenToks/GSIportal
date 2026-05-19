import { useState, useRef } from 'react';
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
  Clock,
  Truck,
  Wrench,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { Project, Task, Role, Staff as StaffType, User, ActivityLog, ProjectDocument, TaskAttachment, Vehicle, Equipment } from '@/types';

interface ProjectDetailProps {
  project: Project;
  tasks: Task[];
  onBack: () => void;
  onEditProject: (updated: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onRequestDeletion: (projectId: string, projectName: string, reason: string) => void;
  onAddTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onUpdateTaskStatus?: (taskId: string, status: Task['status']) => void;
  onAssignClientToProject?: (clientUserId: string, projectId: string) => void;
  role?: Role;
  jobPosition?: string;
  staffList?: StaffType[];
  currentUser?: User;
  users?: User[];
  activityLogs?: ActivityLog[];
  vehicles?: Vehicle[];
  equipment?: Equipment[];
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



export function ProjectDetail({ project, tasks, onBack, onEditProject, onDeleteProject, onRequestDeletion, onAddTask, onEditTask, onUpdateTaskStatus, onAssignClientToProject, role, jobPosition, staffList = [], currentUser: _currentUser, users = [], activityLogs = [], vehicles = [], equipment = [] }: ProjectDetailProps) { // _currentUser used in upload handlers
  const isStaff = role === 'Staff';
  const isSupervisor = role === 'Supervisor' && jobPosition === 'TI Supervisor';
  const isBDSupervisor  = role === 'Project Manager' && jobPosition === 'BD Supervisor';
  const isPMSupervisor  = role === 'Project Manager' && jobPosition === 'PM Supervisor';
  const isAdmin = role === 'Admin';
  const isPMStaff = role === 'Project Manager' && jobPosition === 'PM Staff';
  // BD Supervisor can delete directly; Admin and PM Supervisor must request deletion
  const canDirectDelete = isBDSupervisor;
  const canRequestDelete = (isPMSupervisor || isAdmin) && !isBDSupervisor;

  // Supervisor only picks Staff-role users for manpower assignment
  const pickableStaff = isSupervisor
    ? staffList.filter(m => {
        const u = users.find(u => u.email.toLowerCase() === m.email.toLowerCase() || u.name === m.name);
        return !u || u.role === 'Staff';
      })
    : staffList;

  // PM Supervisor only picks PM Staff for assignment
  const pickablePMStaff = isPMSupervisor
    ? users
        .filter(u => u.jobPosition === 'PM Staff')
        .map(u => {
          const staffRecord = staffList.find(m => m.email.toLowerCase() === u.email.toLowerCase() || m.name === u.name);
          return staffRecord ?? {
            id: u.id,
            name: u.name,
            role: 'Project Management Staff',
            systemRole: u.jobPosition,
            department: 'Project Management',
            email: u.email,
            phone: '',
            avatar: u.avatar,
            status: 'Available' as const,
            currentProjects: 0,
            workload: 0,
          } as StaffType;
        })
    : staffList;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadDocOpen, setUploadDocOpen] = useState(false);
  const [uploadDocFile, setUploadDocFile] = useState<File | null>(null);
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadDocCategory, setUploadDocCategory] = useState('');
  const [uploadDocDescription, setUploadDocDescription] = useState('');

  const handleUploadClick = () => {
    setUploadDocFile(null);
    setUploadDocName('');
    setUploadDocCategory('');
    setUploadDocDescription('');
    setUploadDocOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadDocFile(file);
    setUploadDocName(file.name.replace(/\.[^/.]+$/, ''));
    e.target.value = '';
  };

  const handleUploadSubmit = () => {
    if (!uploadDocFile || !uploadDocName.trim()) return;
    const reader = new FileReader();
    reader.onload = () => {
      const sizeKB = uploadDocFile.size / 1024;
      const sizeStr = sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`;
      const ext = uploadDocFile.name.split('.').pop() ?? '';
      const doc: ProjectDocument = {
        id: `DOC-${Date.now()}`,
        name: uploadDocName.trim() + (ext ? `.${ext}` : ''),
        size: sizeStr,
        uploadedBy: _currentUser?.name ?? 'Unknown',
        uploadedAt: new Date().toISOString().slice(0, 10),
        data: reader.result as string,
        mimeType: uploadDocFile.type,
        category: uploadDocCategory || undefined,
        description: uploadDocDescription.trim() || undefined,
      };
      onEditProject({ ...project, documents: [...(project.documents ?? []), doc] });
      setUploadDocOpen(false);
      setUploadDocFile(null);
      setUploadDocName('');
      setUploadDocCategory('');
      setUploadDocDescription('');
    };
    reader.readAsDataURL(uploadDocFile);
  };

  const handleDownload = (doc: ProjectDocument) => {
    const link = document.createElement('a');
    link.href = doc.data;
    link.download = doc.name;
    link.click();
  };

  const proofInputRef = useRef<HTMLInputElement>(null);
  const [proofTaskId, setProofTaskId] = useState<string | null>(null);

  const handleProofUploadClick = (taskId: string) => {
    setProofTaskId(taskId);
    setTimeout(() => proofInputRef.current?.click(), 0);
  };

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !proofTaskId) return;
    const task = tasks.find(t => t.id === proofTaskId);
    if (!task) return;
    const reader = new FileReader();
    reader.onload = () => {
      const sizeKB = file.size / 1024;
      const sizeStr = sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`;
      const attachment: TaskAttachment = {
        id: `ATT-${Date.now()}`,
        name: file.name,
        size: sizeStr,
        uploadedBy: _currentUser?.name ?? 'Unknown',
        uploadedAt: new Date().toISOString().slice(0, 10),
        data: reader.result as string,
        mimeType: file.type,
      };
      onEditTask({ ...task, attachments: [...(task.attachments ?? []), attachment] });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    setProofTaskId(null);
  };

  const handleDownloadAttachment = (att: TaskAttachment) => {
    const link = document.createElement('a');
    link.href = att.data;
    link.download = att.name;
    link.click();
  };

  const [editOpen, setEditOpen] = useState(false);
  const [selectedClientUserId, setSelectedClientUserId] = useState('');
  const clientUsers = users.filter(u => u.role === 'Client');
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
    const matched = clientUsers.find(u => u.name === project.client || u.clientProjectIds?.includes(project.id));
    setSelectedClientUserId(matched?.id ?? '');
    setEditOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditProject({ ...project, ...form });
    if (selectedClientUserId && onAssignClientToProject) {
      onAssignClientToProject(selectedClientUserId, project.id);
    }
    setEditOpen(false);
  };

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const [assignTeamOpen, setAssignTeamOpen] = useState(false);
  const [assignTeam, setAssignTeam] = useState<string[]>(project.team.filter(n => n !== project.manager));
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [requestDeleteOpen, setRequestDeleteOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [assignPMStaffOpen, setAssignPMStaffOpen] = useState(false);
  const [assignPMStaff, setAssignPMStaff] = useState<string[]>(project.manager ? [project.manager] : []);
  const [pmStaffConfirm, setPMStaffConfirm] = useState(false);
  const [teamConfirm, setTeamConfirm] = useState(false);
  const [archiveConfirm, setArchiveConfirm] = useState<'archive' | 'restore' | null>(null);

  const [completeDialogTask, setCompleteDialogTask] = useState<Task | null>(null);
  const [completionNote, setCompletionNote] = useState('');
  const [completionFile, setCompletionFile] = useState<File | null>(null);
  const completionFileRef = useRef<HTMLInputElement>(null);

  const handleCompleteSubmit = () => {
    if (!completeDialogTask || !completionNote.trim()) return;
    const submitCompletion = (attachment?: TaskAttachment) => {
      const updated: Task = {
        ...completeDialogTask,
        status: 'Completed',
        completedDate: new Date().toISOString().slice(0, 10),
        completionNote: completionNote.trim(),
        attachments: attachment
          ? [...(completeDialogTask.attachments ?? []), attachment]
          : completeDialogTask.attachments,
      };
      onEditTask(updated);
      setCompleteDialogTask(null);
      setCompletionNote('');
      setCompletionFile(null);
    };
    if (completionFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const sizeKB = completionFile.size / 1024;
        const sizeStr = sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`;
        submitCompletion({
          id: `ATT-${Date.now()}`,
          name: completionFile.name,
          size: sizeStr,
          uploadedBy: _currentUser?.name ?? 'Unknown',
          uploadedAt: new Date().toISOString().slice(0, 10),
          data: reader.result as string,
          mimeType: completionFile.type,
        });
      };
      reader.readAsDataURL(completionFile);
    } else {
      submitCompletion();
    }
  };

  const EMPTY_TASK = { title: '', description: '', assignedTo: [] as string[], status: 'Pending' as Task['status'], priority: 'Medium' as Task['priority'], startDate: '', dueDate: '' };
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState(EMPTY_TASK);

  const setTaskField = <K extends keyof typeof EMPTY_TASK>(key: K, value: (typeof EMPTY_TASK)[K]) => {
    setTaskForm(prev => ({ ...prev, [key]: value }));
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({ title: task.title, description: task.description, assignedTo: task.assignedTo, status: task.status, priority: task.priority, startDate: task.startDate ?? '', dueDate: task.dueDate });
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
      {/* Hidden file inputs — kept at top level so refs are always mounted */}
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
      <input ref={proofInputRef} type="file" className="hidden" onChange={handleProofFileChange} />
      <input ref={completionFileRef} type="file" className="hidden" onChange={e => { setCompletionFile(e.target.files?.[0] ?? null); e.target.value = ''; }} />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
              <Badge variant="outline" className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              {project.stage === 'Archived' && (
                <Badge className="bg-slate-600 text-white">Archived</Badge>
              )}
            </div>
            <p className="text-slate-500">{project.id} • {project.client}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSupervisor && (
            <Button variant="outline" onClick={() => { setAssignTeam(project.team.filter(n => n !== project.manager)); setTeamConfirm(false); setAssignTeamOpen(true); }}>
              <Users className="w-4 h-4 mr-2" />
              Assign Team
            </Button>
          )}
          {isPMSupervisor && (
            <Button variant="outline" onClick={() => { setAssignPMStaff(project.manager ? [project.manager] : []); setPMStaffConfirm(false); setAssignPMStaffOpen(true); }}>
              <Users className="w-4 h-4 mr-2" />
              Assign PM Staff
            </Button>
          )}
          {isBDSupervisor && (
            <Button variant="outline" onClick={openEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
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
              {(canDirectDelete || canRequestDelete) && project.stage !== 'Archived' && (
                <DropdownMenuItem onClick={() => setArchiveConfirm('archive')}>
                  Archive Project
                </DropdownMenuItem>
              )}
              {(canDirectDelete || canRequestDelete) && project.stage === 'Archived' && (
                <DropdownMenuItem onClick={() => setArchiveConfirm('restore')}>
                  Restore Project
                </DropdownMenuItem>
              )}
              {canDirectDelete && (
                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteConfirmOpen(true)}>
                  Delete Project
                </DropdownMenuItem>
              )}
              {canRequestDelete && (
                <DropdownMenuItem className="text-red-600" onClick={() => { setDeleteReason(''); setRequestDeleteOpen(true); }}>
                  Request Deletion
                </DropdownMenuItem>
              )}
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
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
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
                  {project.team.map((member, index) => {
                    const memberUser = users.find(u => u.name === member);
                    const memberRole = member === project.manager
                      ? 'PM Staff'
                      : (memberUser?.jobPosition ?? memberUser?.role ?? 'Field Staff');
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                            {member.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{member}</p>
                          <p className="text-xs text-slate-500">{memberRole}</p>
                        </div>
                      </div>
                    );
                  })}
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
            {isPMStaff && (
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-slate-800">{task.title}</h4>
                        <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {(task.attachments?.length ?? 0) > 0 && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {task.attachments!.length} proof file{task.attachments!.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {task.assignedTo.join(', ')}
                        </span>
                        {task.startDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Start {new Date(task.startDate).toLocaleDateString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {task.completionNote && (
                        <div className="mt-2 bg-green-50 border border-green-100 rounded px-3 py-2 text-sm text-green-800">
                          <span className="font-medium">Completion note: </span>{task.completionNote}
                        </div>
                      )}
                      {(task.attachments?.length ?? 0) > 0 && (
                        <div className="mt-2 space-y-1">
                          {task.attachments!.map(att => (
                            <div key={att.id} className="flex items-center gap-2 text-xs bg-slate-50 rounded px-2 py-1 w-fit">
                              <FileText className="w-3 h-3 text-blue-500" />
                              <span className="text-slate-700">{att.name}</span>
                              <span className="text-slate-400">{att.size}</span>
                              <button onClick={() => handleDownloadAttachment(att)} className="text-blue-500 hover:underline">Download</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isPMStaff && (
                          <DropdownMenuItem onClick={() => setTimeout(() => openEditTask(task), 0)}>Edit Task</DropdownMenuItem>
                        )}
                        {isStaff && (
                          <DropdownMenuItem onClick={() => handleProofUploadClick(task.id)}>Upload Proof</DropdownMenuItem>
                        )}
                        {task.status !== 'Completed' && isPMStaff && (
                          <DropdownMenuItem onClick={() => onUpdateTaskStatus?.(task.id, 'Completed')}>Mark as Complete</DropdownMenuItem>
                        )}
                        {task.status !== 'Completed' && isStaff && (
                          <DropdownMenuItem onClick={() => { setCompleteDialogTask(task); setCompletionNote(''); setCompletionFile(null); }}>Mark as Complete</DropdownMenuItem>
                        )}
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
              <Button size="sm" onClick={handleUploadClick}>
                <FileText className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {(project.documents ?? []).length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No documents uploaded yet.</p>
              </div>
            ) : (
              (project.documents ?? []).map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-slate-800 truncate">{doc.name}</h4>
                            {doc.category && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 shrink-0">{doc.category}</span>
                            )}
                          </div>
                          {doc.description && (
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{doc.description}</p>
                          )}
                          <p className="text-xs text-slate-400 mt-0.5">
                            {doc.size} • Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)} className="shrink-0">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Project Assets — vehicles and equipment deployed to this project */}
        <TabsContent value="assets" className="space-y-4">
          <h3 className="text-lg font-semibold">Deployed Assets</h3>
          {(() => {
            const deployedVehicles = vehicles.filter(v => v.assignedProjectId === project.id);
            const deployedEquip    = equipment.filter(e => e.assignedProjectId === project.id);
            if (deployedVehicles.length === 0 && deployedEquip.length === 0) {
              return (
                <div className="text-center py-12">
                  <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No vehicles or equipment deployed to this project yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Support Supervisor deploys assets from the Assets section.</p>
                </div>
              );
            }
            return (
              <div className="space-y-4">
                {deployedVehicles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Vehicles</p>
                    {deployedVehicles.map(v => (
                      <Card key={v.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                              <Truck className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-800">{v.name}</p>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Deployed</span>
                              </div>
                              <p className="text-sm text-slate-500">{v.type} • {v.plateNumber}</p>
                              {v.driver && <p className="text-sm text-slate-400 mt-0.5">Driver: {v.driver}</p>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {deployedEquip.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Equipment</p>
                    {deployedEquip.map(e => (
                      <Card key={e.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                              <Wrench className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-800">{e.name}</p>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Deployed</span>
                              </div>
                              <p className="text-sm text-slate-500">{e.type} • S/N: {e.serialNumber}</p>
                              {e.lastCalibration && (
                                <p className="text-xs text-slate-400 mt-0.5">Last calibration: {new Date(e.lastCalibration).toLocaleDateString()}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </TabsContent>

        {/* Project Activity — read-only log filtered to this project */}
        <TabsContent value="activity" className="space-y-4">
          <h3 className="text-lg font-semibold">Project Activity</h3>
          {(() => {
            const projectLogs = activityLogs.filter(log =>
              log.target.includes(project.name)
            );
            if (projectLogs.length === 0) {
              return (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No activity recorded yet for this project.</p>
                </div>
              );
            }
            return (
              <div className="space-y-3">
                {projectLogs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">
                        {log.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-800 text-sm">{log.userName}</span>
                        <span className="text-xs text-slate-400">{log.userRole}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">{log.action}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(log.timestamp).toLocaleString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </TabsContent>

      </Tabs>

      {/* Task Completion Dialog — Staff must submit note + optional proof */}
      <Dialog open={!!completeDialogTask} onOpenChange={() => { setCompleteDialogTask(null); setCompletionNote(''); setCompletionFile(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Task Completion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-medium text-slate-800 text-sm">{completeDialogTask?.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{completeDialogTask?.description}</p>
            </div>
            <div className="space-y-1.5">
              <Label>Completion Note <span className="text-red-500">*</span></Label>
              <Textarea
                value={completionNote}
                onChange={e => setCompletionNote(e.target.value)}
                placeholder="Describe what was completed, findings, or results..."
                rows={3}
              />
              <p className="text-xs text-slate-400">Required — describe what was done.</p>
            </div>
            <div className="space-y-1.5">
              <Label>Attach Proof <span className="text-slate-400 font-normal">(optional)</span></Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => completionFileRef.current?.click()}>
                  <FileText className="w-4 h-4 mr-2" />
                  {completionFile ? completionFile.name : 'Choose File'}
                </Button>
                {completionFile && (
                  <button onClick={() => setCompletionFile(null)} className="text-slate-400 hover:text-red-500">
                    <span className="text-xs">Remove</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400">Photo, field data sheet, report, etc.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCompleteDialogTask(null); setCompletionNote(''); setCompletionFile(null); }}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" disabled={!completionNote.trim()} onClick={handleCompleteSubmit}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit & Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ptask-start">Start Date</Label>
                <Input
                  id="ptask-start"
                  type="date"
                  value={taskForm.startDate}
                  onChange={e => setTaskField('startDate', e.target.value)}
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
            </div>

            {project.team.filter(n => n !== _currentUser?.name).length > 0 && (
              <div className="space-y-1.5">
                <Label>Assign Staff</Label>
                <div className="space-y-1 max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-2">
                  {project.team.filter(n => n !== _currentUser?.name).map(name => (
                    <label key={name} className="flex items-center gap-2 p-1 hover:bg-slate-50 cursor-pointer rounded">
                      <Checkbox
                        checked={taskForm.assignedTo.includes(name)}
                        onCheckedChange={checked =>
                          setTaskField('assignedTo', checked
                            ? [...taskForm.assignedTo, name]
                            : taskForm.assignedTo.filter(n => n !== name))
                        }
                      />
                      <span className="text-sm text-slate-800">{name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">{editingTask ? 'Save Changes' : 'Create Task'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-2">
            <p className="text-sm text-slate-700">
              Are you sure you want to delete <span className="font-semibold">{project.name}</span>?
            </p>
            <p className="text-xs text-slate-400">This action cannot be undone. All associated tasks will remain but will no longer be linked to this project.</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                onDeleteProject(project.id);
                setDeleteConfirmOpen(false);
                onBack();
              }}
            >
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Deletion Dialog (Admin / PM Supervisor) */}
      <Dialog open={requestDeleteOpen} onOpenChange={setRequestDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Request Project Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-600">
              A deletion request will be sent to the BD Supervisor who created this project.
              They must approve before it is deleted.
            </p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Reason for deletion <span className="text-red-500">*</span>
              </label>
              <textarea
                value={deleteReason}
                onChange={e => setDeleteReason(e.target.value)}
                placeholder="Briefly explain why this project should be deleted..."
                rows={3}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRequestDeleteOpen(false)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={!deleteReason.trim()}
              onClick={() => {
                onRequestDeletion(project.id, project.name, deleteReason.trim());
                setRequestDeleteOpen(false);
                setDeleteReason('');
              }}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Supervisor — Assign Manpower Dialog */}
      <Dialog open={assignTeamOpen} onOpenChange={open => { setAssignTeamOpen(open); if (!open) setTeamConfirm(false); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Manpower</DialogTitle>
          </DialogHeader>
          {!teamConfirm ? (
            <>
              <div className="space-y-4 py-2">
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-xs text-blue-700 flex items-start gap-2">
                  <span className="mt-0.5">💡</span>
                  <span>Suggested staff are automatically ranked by availability and qualifications. Select staff to assign to this project.</span>
                </div>
                {project.manager && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-slate-500">Project Manager (non-removable)</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm">
                      <span>{project.manager}</span>
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Field Staff</p>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {[...pickableStaff]
                      .sort((a, b) => {
                        const order = { 'Available': 0, 'Assigned': 1, 'On Leave': 2 };
                        return (order[a.status] ?? 1) - (order[b.status] ?? 1);
                      })
                      .map(staff => {
                        const isSelected = assignTeam.includes(staff.name);
                        const isOnLeave = staff.status === 'On Leave';
                        const isAssigned = staff.status === 'Assigned';
                        const isAvailable = staff.status === 'Available';
                        return (
                          <label
                            key={staff.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              isSelected ? 'border-blue-400 bg-blue-50' :
                              isOnLeave ? 'border-slate-200 bg-slate-50 opacity-60' :
                              'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="mt-1 accent-blue-600"
                              checked={isSelected}
                              disabled={isOnLeave}
                              onChange={e => {
                                if (e.target.checked) {
                                  setAssignTeam(prev => [...prev, staff.name]);
                                } else {
                                  setAssignTeam(prev => prev.filter(n => n !== staff.name));
                                }
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-slate-800">{staff.name}</span>
                                {isAvailable && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">SUGGESTED</span>
                                )}
                                {isAssigned && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">ALREADY ASSIGNED</span>
                                )}
                                {isOnLeave && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">ON LEAVE</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{staff.role} • {staff.workload}% workload</p>
                              {staff.certifications && staff.certifications.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {staff.certifications.map(cert => (
                                    <span key={cert} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{cert}</span>
                                  ))}
                                </div>
                              )}
                              {staff.maxWeeklyHours && (
                                <p className="text-[10px] text-slate-400 mt-0.5">Max {staff.maxWeeklyHours}h/week</p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setAssignTeamOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setTeamConfirm(true)}>
                  Review Assignment
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-4 py-2">
                <p className="text-sm text-slate-600 font-medium">Please confirm the following assignment:</p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Project</span>
                    <span className="font-medium text-slate-800">{project.name}</span>
                  </div>
                  {project.manager && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Project Manager</span>
                      <span className="font-medium text-slate-800">{project.manager}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Field Staff ({assignTeam.length})</span>
                    <span className="font-medium text-slate-800 text-right max-w-[60%]">
                      {assignTeam.length > 0 ? assignTeam.join(', ') : <span className="text-slate-400">None</span>}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">Click Confirm to apply this assignment.</p>
              </div>
              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setTeamConfirm(false)}>Go Back</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                  const finalTeam = project.manager
                    ? [project.manager, ...assignTeam.filter(n => n !== project.manager)]
                    : assignTeam;
                  onEditProject({ ...project, team: finalTeam });
                  setTeamConfirm(false);
                  setAssignTeamOpen(false);
                }}>
                  Confirm Assignment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* PM Supervisor — Assign PM Staff Dialog */}
      <Dialog open={assignPMStaffOpen} onOpenChange={open => { setAssignPMStaffOpen(open); if (!open) setPMStaffConfirm(false); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign PM Staff to Project</DialogTitle>
          </DialogHeader>
          {!pmStaffConfirm ? (
            <>
              <div className="space-y-4 py-2">
                <p className="text-sm text-slate-500">
                  Drag a PM Staff member into the drop zone to assign them to this project.
                </p>
                <StaffPicker
                  staffList={pickablePMStaff}
                  selected={assignPMStaff}
                  onChange={setAssignPMStaff}
                  multiple
                  dropLabel="Drag PM Staff here to assign"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setAssignPMStaffOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setPMStaffConfirm(true)}>
                  Review Assignment
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-4 py-2">
                <p className="text-sm text-slate-600 font-medium">Please confirm the following assignment:</p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Project</span>
                    <span className="font-medium text-slate-800">{project.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned PM Staff</span>
                    <span className="font-medium text-slate-800">
                      {assignPMStaff[0] ?? <span className="text-red-500">None (will unassign)</span>}
                    </span>
                  </div>
                  {project.manager && project.manager !== assignPMStaff[0] && (
                    <div className="flex justify-between text-amber-600">
                      <span>Previous PM Staff</span>
                      <span className="font-medium">{project.manager} (will be removed)</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400">Click Confirm to apply this assignment.</p>
              </div>
              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setPMStaffConfirm(false)}>Go Back</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                  const selectedPMName = assignPMStaff[0] ?? '';
                  const u = selectedPMName ? users.find(x => x.name === selectedPMName) : undefined;
                  const assignedPMId = u?.id ?? '';
                  const nonPMTeam = project.team.filter(n => n !== project.manager);
                  const newTeam = selectedPMName ? [selectedPMName, ...nonPMTeam] : nonPMTeam;
                  onEditProject({ ...project, team: newTeam, manager: selectedPMName, assignedPMId });
                  setPMStaffConfirm(false);
                  setAssignPMStaffOpen(false);
                }}>
                  Confirm Assignment
                </Button>
              </DialogFooter>
            </>
          )}
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
                <Label>Client <span className="text-red-500">*</span></Label>
                {isBDSupervisor && clientUsers.length > 0 ? (
                  <Select
                    value={selectedClientUserId}
                    onValueChange={v => {
                      setSelectedClientUserId(v);
                      const u = clientUsers.find(c => c.id === v);
                      if (u) setField('client', u.name);
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Select a client account" /></SelectTrigger>
                    <SelectContent>
                      {clientUsers.map(u => (
                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id="pd-client" value={form.client} onChange={e => setField('client', e.target.value)} required />
                )}
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

      {/* Upload Document Dialog */}
      <Dialog open={uploadDocOpen} onOpenChange={open => { setUploadDocOpen(open); if (!open) setUploadDocFile(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* File Picker */}
            <div className="space-y-1.5">
              <Label>File <span className="text-red-500">*</span></Label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${uploadDocFile ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadDocFile ? (
                  <div className="space-y-1">
                    <FileText className="w-8 h-8 text-green-600 mx-auto" />
                    <p className="text-sm font-medium text-green-700">{uploadDocFile.name}</p>
                    <p className="text-xs text-green-600">{(uploadDocFile.size / 1024) >= 1024 ? `${((uploadDocFile.size / 1024) / 1024).toFixed(1)} MB` : `${Math.round(uploadDocFile.size / 1024)} KB`}</p>
                    <p className="text-xs text-slate-400">Click to change file</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm text-slate-500">Click to choose a file</p>
                    <p className="text-xs text-slate-400">PDF, Word, Excel, Images accepted</p>
                  </div>
                )}
              </div>
            </div>

            {/* Document Name */}
            <div className="space-y-1.5">
              <Label htmlFor="doc-name">Document Name <span className="text-red-500">*</span></Label>
              <Input
                id="doc-name"
                value={uploadDocName}
                onChange={e => setUploadDocName(e.target.value)}
                placeholder="e.g. Site Investigation Report"
              />
              <p className="text-xs text-slate-400">You can rename the document before uploading.</p>
            </div>

            {/* Document Type */}
            <div className="space-y-1.5">
              <Label>Document Type <span className="text-slate-400 font-normal">(optional)</span></Label>
              <Select value={uploadDocCategory} onValueChange={setUploadDocCategory}>
                <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical Report">Technical Report</SelectItem>
                  <SelectItem value="Field Data Sheet">Field Data Sheet</SelectItem>
                  <SelectItem value="Engineering Plans">Engineering Plans</SelectItem>
                  <SelectItem value="Test Results">Test Results</SelectItem>
                  <SelectItem value="Contract / Agreement">Contract / Agreement</SelectItem>
                  <SelectItem value="Photos">Photos</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="doc-desc">Description <span className="text-slate-400 font-normal">(optional)</span></Label>
              <Textarea
                id="doc-desc"
                value={uploadDocDescription}
                onChange={e => setUploadDocDescription(e.target.value)}
                placeholder="Brief description of this document..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setUploadDocOpen(false)}>Cancel</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!uploadDocFile || !uploadDocName.trim()}
              onClick={handleUploadSubmit}
            >
              <FileText className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive / Restore Confirmation Dialog */}
      <Dialog open={!!archiveConfirm} onOpenChange={() => setArchiveConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{archiveConfirm === 'archive' ? 'Archive Project' : 'Restore Project'}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-slate-600">
              {archiveConfirm === 'archive'
                ? `Are you sure you want to archive "${project.name}"? It will be moved to the archived section and marked as inactive.`
                : `Are you sure you want to restore "${project.name}"? It will be returned to active projects.`}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveConfirm(null)}>Cancel</Button>
            <Button
              className={archiveConfirm === 'archive' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}
              onClick={() => {
                if (archiveConfirm === 'archive') {
                  onEditProject({ ...project, stage: 'Archived' });
                } else {
                  onEditProject({ ...project, stage: undefined });
                }
                setArchiveConfirm(null);
              }}
            >
              {archiveConfirm === 'archive' ? 'Yes, Archive' : 'Yes, Restore'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

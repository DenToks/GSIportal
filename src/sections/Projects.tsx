import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  MapPin,
  MoreHorizontal,
  FolderKanban
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import type { Project, Role, Staff as StaffType, User } from '@/types';

interface ProjectsProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
  onAddProject: (project: Project) => void;
  onEditProject: (updated: Project) => void;
  role?: Role;
  currentUser?: User;
  staffList?: StaffType[];
}

const EMPTY_FORM = {
  name: '',
  client: '',
  type: 'Geotechnical' as Project['type'],
  status: 'Pending' as Project['status'],
  progress: 0,
  startDate: '',
  endDate: '',
  manager: '',
  location: '',
  description: '',
  team: [] as string[],
};

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

export function Projects({ projects, onProjectClick, onAddProject, onEditProject, role, currentUser, staffList = [] }: ProjectsProps) {
  const isStaff = role === 'Staff';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesType = typeFilter === 'all' || project.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: projects.length,
    ongoing: projects.filter(p => p.status === 'Ongoing').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    pending: projects.filter(p => p.status === 'Pending').length,
  };

  const openNew = () => {
    setEditingProject(null);
    setForm({
      ...EMPTY_FORM,
      manager: currentUser?.role === 'Project Manager' ? (currentUser?.name ?? '') : '',
    });
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
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
      team: project.team,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      onEditProject({ ...editingProject, ...form });
    } else {
      onAddProject({ id: `PRJ-${Date.now()}`, ...form });
    }
    setDialogOpen(false);
  };

  const setField = <K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500">Manage and track all your projects in one place.</p>
        </div>
        {!isStaff && (
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Projects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.ongoing}</p>
              <p className="text-xs text-slate-500">Ongoing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search projects by name, client, or ID..."
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
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Geotechnical">Geotechnical</SelectItem>
              <SelectItem value="Geoscience">Geoscience</SelectItem>
              <SelectItem value="Civil Infrastructure">Civil Infrastructure</SelectItem>
              <SelectItem value="Environmental">Environmental</SelectItem>
              <SelectItem value="Geohazard">Geohazard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onProjectClick(project.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{project.id}</p>
                  <h3 className="font-semibold text-slate-800 line-clamp-1">{project.name}</h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onProjectClick(project.id)}>
                      View Details
                    </DropdownMenuItem>
                    {!isStaff && (
                      <DropdownMenuItem onClick={() => setTimeout(() => openEdit(project), 0)}>
                        Edit Project
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>Generate Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-slate-500 mb-3 line-clamp-1">{project.client}</p>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                <Badge className={getTypeColor(project.type)}>
                  {project.type}
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(project.endDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {project.team.length}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {project.location.split(',')[0]}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600">No projects found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'New Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="proj-name">Project Name <span className="text-red-500">*</span></Label>
                <Input
                  id="proj-name"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="e.g. Geohazard Assessment – Cebu"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="proj-client">Client <span className="text-red-500">*</span></Label>
                <Input
                  id="proj-client"
                  value={form.client}
                  onChange={e => setField('client', e.target.value)}
                  placeholder="e.g. DPWH Region 7"
                  required
                />
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
                <Label htmlFor="proj-start">Start Date</Label>
                <Input
                  id="proj-start"
                  type="date"
                  value={form.startDate}
                  onChange={e => setField('startDate', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-end">End Date</Label>
                <Input
                  id="proj-end"
                  type="date"
                  value={form.endDate}
                  onChange={e => setField('endDate', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-progress">Progress (%)</Label>
                <Input
                  id="proj-progress"
                  type="number"
                  min={0}
                  max={100}
                  value={form.progress}
                  onChange={e => setField('progress', Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-manager">Project Manager</Label>
                <Input
                  id="proj-manager"
                  value={form.manager}
                  onChange={e => setField('manager', e.target.value)}
                  placeholder="e.g. Engr. Patricia Lim"
                  readOnly={currentUser?.role === 'Project Manager'}
                  className={currentUser?.role === 'Project Manager' ? 'bg-slate-50 text-slate-600' : ''}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="proj-location">Location</Label>
                <Input
                  id="proj-location"
                  value={form.location}
                  onChange={e => setField('location', e.target.value)}
                  placeholder="e.g. Cebu City, Cebu"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="proj-desc">Description</Label>
                <Textarea
                  id="proj-desc"
                  value={form.description}
                  onChange={e => setField('description', e.target.value)}
                  placeholder="Brief project description..."
                  rows={3}
                />
              </div>

              {staffList.length > 0 && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Team Members</Label>
                  <StaffPicker
                    staffList={staffList}
                    selected={form.team}
                    onChange={team => setField('team', team)}
                    multiple
                    dropLabel="Drag staff here to add to the project team"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingProject ? 'Save Changes' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

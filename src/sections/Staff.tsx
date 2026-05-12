import { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Briefcase,
  MoreHorizontal,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserCog,
  FolderPlus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Project, Role, Staff as StaffType, User } from '@/types';

interface StaffProps {
  staffList: StaffType[];
  users: User[];
  currentUser: User;
  projects: Project[];
  onSubmitRoleRequest: (input: {
    targetUserId: string;
    requestedRole: Role;
    reason: string;
  }) => void;
  onAssignProject: (staffId: string, projectId: string) => void;
  onAddStaff: (member: StaffType) => void;
}

const EMPTY_STAFF_FORM = {
  name: '',
  systemRole: 'Staff',
  role: '',
  department: '',
  email: '',
  phone: '',
  status: 'Available' as StaffType['status'],
};

const ROLE_OPTIONS: Role[] = [
  'Admin',
  'Project Manager',
  'Supervisor',
  'Staff',
  'Client',
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Assigned':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'On Leave':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Available':
      return <CheckCircle2 className="w-3 h-3" />;
    case 'Assigned':
      return <Clock className="w-3 h-3" />;
    case 'On Leave':
      return <AlertCircle className="w-3 h-3" />;
    default:
      return null;
  }
};

export function Staff({
  staffList,
  users,
  currentUser,
  projects,
  onSubmitRoleRequest,
  onAssignProject,
  onAddStaff,
}: StaffProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleTargetUserId, setRoleTargetUserId] = useState<string>('');
  const [requestedRole, setRequestedRole] = useState<Role>('Staff');
  const [roleReason, setRoleReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignStaffId, setAssignStaffId] = useState<string>('');
  const [assignProjectId, setAssignProjectId] = useState<string>('');

  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [staffForm, setStaffForm] = useState(EMPTY_STAFF_FORM);

  const setStaffField = <K extends keyof typeof EMPTY_STAFF_FORM>(key: K, value: (typeof EMPTY_STAFF_FORM)[K]) => {
    setStaffForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = staffForm.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    onAddStaff({
      id: `STF-${Date.now()}`,
      ...staffForm,
      avatar: initials,
      currentProjects: 0,
      workload: 0,
    });
    setStaffForm(EMPTY_STAFF_FORM);
    setAddStaffOpen(false);
  };

  const filteredStaff = useMemo(
    () =>
      staffList.filter((member) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          member.name.toLowerCase().includes(q) ||
          member.role.toLowerCase().includes(q) ||
          member.email.toLowerCase().includes(q);
        const matchesDepartment =
          departmentFilter === 'all' || member.department === departmentFilter;
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
        return matchesSearch && matchesDepartment && matchesStatus;
      }),
    [staffList, searchQuery, departmentFilter, statusFilter],
  );

  const stats = {
    total: staffList.length,
    available: staffList.filter((s) => s.status === 'Available').length,
    assigned: staffList.filter((s) => s.status === 'Assigned').length,
    onLeave: staffList.filter((s) => s.status === 'On Leave').length,
  };

  const departments = [...new Set(staffList.map((s) => s.department))];

  const matchUser = (member: StaffType): User | undefined =>
    users.find(
      (u) => u.email.toLowerCase() === member.email.toLowerCase() || u.name === member.name,
    );

  const openRoleDialog = (member: StaffType) => {
    const u = matchUser(member);
    if (u) {
      setRoleTargetUserId(u.id);
      setRequestedRole(u.role === 'Staff' ? 'Supervisor' : 'Staff');
    } else {
      setRoleTargetUserId('');
      setRequestedRole('Staff');
    }
    setRoleReason('');
    setReasonError('');
    setRoleDialogOpen(true);
  };

  const submitRoleRequest = () => {
    if (!roleTargetUserId) {
      setReasonError('Please select a target user.');
      return;
    }
    if (!roleReason.trim()) {
      setReasonError('Please provide a reason for the request.');
      return;
    }
    onSubmitRoleRequest({
      targetUserId: roleTargetUserId,
      requestedRole,
      reason: roleReason.trim(),
    });
    setRoleDialogOpen(false);
  };

  const openAssignDialog = (member: StaffType) => {
    setAssignStaffId(member.id);
    setAssignProjectId(projects[0]?.id ?? '');
    setAssignDialogOpen(true);
  };

  const submitAssign = () => {
    if (!assignStaffId || !assignProjectId) return;
    onAssignProject(assignStaffId, assignProjectId);
    setAssignDialogOpen(false);
  };

  const projectsForStaff = (member: StaffType) => {
    if (member.assignedProjectIds && member.assignedProjectIds.length > 0) {
      return member.assignedProjectIds.length;
    }
    return member.currentProjects;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Staff &amp; Team</h1>
          <p className="text-slate-500">Manage staff assignments and workload distribution.</p>
        </div>
        {currentUser.role === 'Admin' && (
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setStaffForm(EMPTY_STAFF_FORM); setAddStaffOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Account
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Staff</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.available}</p>
              <p className="text-xs text-slate-500">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.assigned}</p>
              <p className="text-xs text-slate-500">Assigned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.onLeave}</p>
              <p className="text-xs text-slate-500">On Leave</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search staff by name, role, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-44">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Staff Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Assigned Projects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-medium text-sm">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-slate-800">{member.name}</div>
                        <div className="text-xs text-slate-500">{member.department}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-700">{member.role}</TableCell>
                  <TableCell className="text-sm text-slate-600">{member.email}</TableCell>
                  <TableCell className="text-center font-medium text-slate-700">
                    {projectsForStaff(member)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(member.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(member.status)}
                        {member.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {currentUser.role === 'Admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRoleDialog(member)}
                        >
                          <UserCog className="w-4 h-4 mr-1" />
                          Manage Role
                        </Button>
                      )}
                      {(currentUser.role === 'Supervisor' || currentUser.role === 'Project Manager') && (
                        <Button
                          variant={currentUser.role === 'Supervisor' ? 'default' : 'outline'}
                          size="sm"
                          className={currentUser.role === 'Supervisor' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                          onClick={() => openAssignDialog(member)}
                        >
                          <FolderPlus className="w-4 h-4 mr-1" />
                          Assign to Project
                        </Button>
                      )}
                      {currentUser.role === 'Project Manager' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRoleDialog(member)}
                        >
                          <UserCog className="w-4 h-4 mr-1" />
                          Request Role Change
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>View Assignments</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600">No staff found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Change Request Modal */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Request Role Change</DialogTitle>
            <DialogDescription>
              Submit a role change request for an Admin to review.
              {currentUser.role === 'Admin' && (
                <span className="block mt-1 text-amber-600">
                  Note: As an Admin, you cannot approve a request you submit yourself.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Target User</Label>
              <Select value={roleTargetUserId} onValueChange={setRoleTargetUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user account" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter((u) => u.role !== 'Client')
                    .map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} — {u.role}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Requested Role</Label>
              <Select value={requestedRole} onValueChange={(v) => setRequestedRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                rows={4}
                placeholder="Explain why this role change should be approved..."
                value={roleReason}
                onChange={(e) => setRoleReason(e.target.value)}
              />
              {reasonError && <p className="text-xs text-red-600">{reasonError}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={submitRoleRequest}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Staff Dialog */}
      <Dialog open={addStaffOpen} onOpenChange={setAddStaffOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>Create a new staff account and add them to the roster.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStaffSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="sf-name">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="sf-name"
                value={staffForm.name}
                onChange={e => setStaffField('name', e.target.value)}
                placeholder="e.g. Engr. Juan dela Cruz"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>System Role <span className="text-red-500">*</span></Label>
              <Select value={staffForm.systemRole} onValueChange={v => setStaffField('systemRole', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sf-role">Role / Position <span className="text-red-500">*</span></Label>
                <Input
                  id="sf-role"
                  value={staffForm.role}
                  onChange={e => setStaffField('role', e.target.value)}
                  placeholder="e.g. Geotechnical Engineer"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sf-dept">Department <span className="text-red-500">*</span></Label>
                <Input
                  id="sf-dept"
                  value={staffForm.department}
                  onChange={e => setStaffField('department', e.target.value)}
                  placeholder="e.g. Engineering"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sf-email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="sf-email"
                type="email"
                value={staffForm.email}
                onChange={e => setStaffField('email', e.target.value)}
                placeholder="e.g. juan@geoinnovative.ph"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sf-phone">Phone</Label>
                <Input
                  id="sf-phone"
                  value={staffForm.phone}
                  onChange={e => setStaffField('phone', e.target.value)}
                  placeholder="+63 9XX XXX XXXX"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={staffForm.status} onValueChange={v => setStaffField('status', v as StaffType['status'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Assigned">Assigned</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setAddStaffOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Staff</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Project Modal */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Assign to Project</DialogTitle>
            <DialogDescription>Add this staff member to a project.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label>Project</Label>
            <Select value={assignProjectId} onValueChange={setAssignProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={submitAssign}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

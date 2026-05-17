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
  onDirectRoleChange: (userId: string, newRole: Role) => void;
  onUpdateUserJobPosition: (userId: string, jobPosition: string) => void;
  onUpdateStaffSystemRole: (staffId: string, systemRole: string) => void;
  onAssignProject: (staffId: string, projectId: string) => void;
  onAddStaff: (member: StaffType) => void;
  onAddUser: (user: User) => void;
}

const EMPTY_STAFF_FORM = {
  name: '',
  systemRole: 'Staff',
  jobPosition: '',
  role: '',
  department: '',
  email: '',
  phone: '',
  status: 'Available' as StaffType['status'],
  assignedProjectId: '',
};

const JOB_POSITIONS: Record<string, string[]> = {
  'Project Manager': ['BD Supervisor', 'PM Supervisor', 'PM Staff'],
  'Supervisor':      ['TI Supervisor', 'Support Supervisor'],
};

const getRoleFamilyFromLabel = (label: string): Role => {
  switch (label) {
    case 'Administrator':
      return 'Admin';
    case 'BD Supervisor':
    case 'PM Supervisor':
    case 'PM Staff':
      return 'Project Manager';
    case 'TI Supervisor':
    case 'Support Supervisor':
      return 'Supervisor';
    case 'Client':
      return 'Client';
    default:
      return 'Staff';
  }
};

const ROLE_OPTIONS: Role[] = [
  'Admin',
  'Project Manager',
  'Supervisor',
  'Staff',
  'Client',
];

const getSystemRoleColor = (role: string) => {
  switch (role) {
    case 'Admin': return 'bg-red-100 text-red-700 border-red-200';
    case 'Supervisor': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Project Manager': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Staff': return 'bg-green-100 text-green-700 border-green-200';
    case 'Client': return 'bg-gray-100 text-gray-600 border-gray-200';
    default: return 'bg-slate-100 text-slate-500 border-slate-200';
  }
};

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
  onDirectRoleChange,
  onUpdateUserJobPosition,
  onUpdateStaffSystemRole,
  onAssignProject,
  onAddStaff,
  onAddUser,
}: StaffProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleDialogMode, setRoleDialogMode] = useState<'manage' | 'request'>('request');
  const [roleTargetUserId, setRoleTargetUserId] = useState<string>('');
  const [roleTargetStaffId, setRoleTargetStaffId] = useState<string>('');
  const [roleTargetName, setRoleTargetName] = useState<string>('');
  const [requestedRole, setRequestedRole] = useState<Role>('Staff');
  const [selectedSystemRole, setSelectedSystemRole] = useState<string>('Staff');
  const [selectedJobPosition, setSelectedJobPosition] = useState<string>('');
  const [roleReason, setRoleReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignStaffId, setAssignStaffId] = useState<string>('');
  const [assignProjectId, setAssignProjectId] = useState<string>('');
  const [assignConfirm, setAssignConfirm] = useState(false);

  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [staffForm, setStaffForm] = useState(EMPTY_STAFF_FORM);
  const [createConfirm, setCreateConfirm] = useState(false);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailStaffId, setDetailStaffId] = useState<string>('');
  const [detailStaffName, setDetailStaffName] = useState<string>('');

  const isAdminAccount = (member: StaffType) => {
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === member.email.toLowerCase() || u.name === member.name,
    );
    return matchedUser?.role === 'Admin' || member.role === 'Administrator';
  };

  const setStaffField = <K extends keyof typeof EMPTY_STAFF_FORM>(key: K, value: (typeof EMPTY_STAFF_FORM)[K]) => {
    setStaffForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateConfirm(true);
  };

  const handleConfirmCreate = () => {
    const initials = staffForm.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const { assignedProjectId, ...staffData } = staffForm;
    onAddStaff({
      id: `STF-${Date.now()}`,
      ...staffData,
      avatar: initials,
      currentProjects: 0,
      workload: 0,
    });
    const resolvedJobPosition =
      staffForm.systemRole === 'Admin'
        ? 'Administrator'
        : staffForm.jobPosition || undefined;

    onAddUser({
      id: `USR-${Date.now()}`,
      name: staffForm.name,
      email: staffForm.email,
      role: staffForm.systemRole as Role,
      avatar: initials,
      jobPosition: resolvedJobPosition,
      ...(staffForm.systemRole === 'Client' && assignedProjectId
        ? { clientProjectIds: [assignedProjectId] }
        : {}),
    });
    setStaffForm(EMPTY_STAFF_FORM);
    setCreateConfirm(false);
    setAddStaffOpen(false);
  };

  const filteredStaff = useMemo(
    () => {
      const visible = staffList.filter((member) => {
        const matchedUser = users.find(
          (u) => u.email.toLowerCase() === member.email.toLowerCase() || u.name === member.name,
        );

        if (currentUser.role === 'Project Manager' && currentUser.jobPosition === 'PM Supervisor') {
          if (!matchedUser || matchedUser.role !== 'Project Manager' || matchedUser.jobPosition !== 'PM Staff') return false;
        }

        if (currentUser.role === 'Supervisor') {
          // Exclude users whose account role is NOT Staff (PM Staff, PM Supervisor, etc.)
          // Staff with no account are included (assumed to be field workers)
          if (matchedUser && matchedUser.role !== 'Staff') return false;
        }

        if (matchedUser?.role === 'Admin' || member.role === 'Administrator') {
          return false;
        }

        if (currentUser.role !== 'Admin' && currentUser.role !== 'Project Manager' && currentUser.role !== 'Supervisor') {
          return false;
        }

        const q = searchQuery.toLowerCase();
        const matchesSearch =
          member.name.toLowerCase().includes(q) ||
          member.role.toLowerCase().includes(q) ||
          member.email.toLowerCase().includes(q);
        const matchesDepartment =
          departmentFilter === 'all' || member.department === departmentFilter;
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
        return matchesSearch && matchesDepartment && matchesStatus;
      });

      const seen = new Set<string>();
      return visible.filter((member) => {
        const key = member.email.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    },
    [staffList, searchQuery, departmentFilter, statusFilter, currentUser.role, currentUser.jobPosition, users],
  );

  const stats = {
    total: filteredStaff.length,
    available: filteredStaff.filter((s) => s.status === 'Available').length,
    assigned: filteredStaff.filter((s) => s.status === 'Assigned').length,
    onLeave: filteredStaff.filter((s) => s.status === 'On Leave').length,
  };

  const departments = [...new Set(filteredStaff.map((s) => s.department))];

  const matchUser = (member: StaffType): User | undefined =>
    users.find(
      (u) => u.email.toLowerCase() === member.email.toLowerCase() || u.name === member.name,
    );

  const openRoleDialog = (member: StaffType, mode: 'manage' | 'request' = 'request') => {
    const u = matchUser(member);
    setRoleTargetStaffId(member.id);
    setRoleTargetName(member.name);
    if (u) {
      setRoleTargetUserId(u.id);
      setRequestedRole(u.role);
      setSelectedSystemRole(getRoleFamilyFromLabel(u.jobPosition ?? u.role));
      setSelectedJobPosition(u.jobPosition ?? '');
    } else {
      setRoleTargetUserId('');
      const fallbackLabel = member.systemRole ?? member.role;
      setRequestedRole(getRoleFamilyFromLabel(fallbackLabel));
      setSelectedSystemRole(getRoleFamilyFromLabel(fallbackLabel));
      setSelectedJobPosition(JOB_POSITIONS[getRoleFamilyFromLabel(fallbackLabel)]?.includes(fallbackLabel) ? fallbackLabel : '');
    }
    setRoleDialogMode(mode);
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

  const submitDirectRoleChange = () => {
    const nextSystemLabel = selectedJobPosition || (selectedSystemRole === 'Admin' ? 'Administrator' : selectedSystemRole);
    if (roleTargetUserId) {
      const nextRole = selectedSystemRole as Role;
      onDirectRoleChange(roleTargetUserId, nextRole);
      onUpdateUserJobPosition(roleTargetUserId, nextSystemLabel);
    }
    onUpdateStaffSystemRole(roleTargetStaffId, nextSystemLabel);
    setRoleDialogOpen(false);
  };

  const openAssignDialog = (member: StaffType) => {
    setAssignStaffId(member.id);
    setAssignProjectId(projects[0]?.id ?? '');
    setAssignConfirm(false);
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

  const getAssignedProjectsForStaff = (member: StaffType): Project[] => {
    const matchedUser = matchUser(member);
    if (!matchedUser) return [];
    // Find projects where this user is assigned as PM Staff
    return projects.filter(p => p.assignedPMId === matchedUser.id);
  };

  const openDetailDialog = (member: StaffType) => {
    setDetailStaffId(member.id);
    setDetailStaffName(member.name);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {currentUser.role === 'Admin' ? 'Accounts' : 'Staff & Team'}
          </h1>
          <p className="text-slate-500">
            {currentUser.role === 'Admin'
              ? 'Create and manage system accounts.'
              : 'Manage staff assignments and workload distribution.'}
          </p>
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
                <TableHead>System Role</TableHead>
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
                  <TableCell>
                    {(() => {
                      const u = matchUser(member);
                      const displayLabel = u?.jobPosition ?? member.systemRole ?? u?.role ?? member.role;
                      if (!displayLabel) return <span className="text-xs text-slate-400">—</span>;
                      return (
                        <Badge variant="outline" className={getSystemRoleColor(getRoleFamilyFromLabel(displayLabel))}>
                          {displayLabel}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{member.email}</TableCell>
                  <TableCell className="text-center font-medium text-slate-700">
                    {(() => {
                      const matchedUser = matchUser(member);
                      if (matchedUser) {
                        const assignedProjects = projects.filter(p => p.assignedPMId === matchedUser.id);
                        if (assignedProjects.length > 0) {
                          return (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {assignedProjects.map(p => (
                                <Badge key={p.id} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                  {p.name}
                                </Badge>
                              ))}
                            </div>
                          );
                        }
                      }
                      return projectsForStaff(member) > 0 ? projectsForStaff(member) : '—';
                    })()}
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
                      {currentUser.role === 'Admin' && !isAdminAccount(member) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRoleDialog(member, 'manage')}
                        >
                          <UserCog className="w-4 h-4 mr-1" />
                          Manage Role
                        </Button>
                      )}
                      {((currentUser.role === 'Supervisor' && currentUser.jobPosition === 'TI Supervisor') || (currentUser.role === 'Project Manager' && currentUser.jobPosition === 'PM Supervisor')) && (
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
                          onClick={() => openRoleDialog(member, 'request')}
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
                          <DropdownMenuItem onClick={() => openDetailDialog(member)}>View Assignments</DropdownMenuItem>
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

      {/* Role Dialog — Manage (Admin) or Request (PM/Supervisor) */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {roleDialogMode === 'manage' ? 'Manage User Role' : 'Request Role Change'}
            </DialogTitle>
            <DialogDescription>
              {roleDialogMode === 'manage'
                ? 'Directly update the system role for this user.'
                : 'Submit a role change request for an Admin to review.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {roleDialogMode === 'manage' ? (
              <p className="text-sm text-slate-600">
                Changing role for: <span className="font-semibold text-slate-800">{roleTargetName}</span>
              </p>
            ) : (
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
            )}

            {roleDialogMode === 'manage' ? (
              <>
                <div className="space-y-2">
                  <Label>System Role</Label>
                  <Select
                    value={selectedSystemRole}
                    onValueChange={(v) => {
                      setSelectedSystemRole(v as Role);
                      setSelectedJobPosition('');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {JOB_POSITIONS[selectedSystemRole] && (
                  <div className="space-y-2">
                    <Label>Job Position</Label>
                    <Select value={selectedJobPosition} onValueChange={setSelectedJobPosition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_POSITIONS[selectedSystemRole].map((pos) => (
                          <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <Label>Requested Role</Label>
                <Select value={requestedRole} onValueChange={(v) => setRequestedRole(v as Role)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {roleDialogMode === 'request' && (
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
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={roleDialogMode === 'manage' ? submitDirectRoleChange : submitRoleRequest}
            >
              {roleDialogMode === 'manage' ? 'Save Changes' : 'Submit Request'}
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
              <Select
                value={staffForm.systemRole}
                onValueChange={v => setStaffForm(prev => ({
                  ...prev,
                  systemRole: v,
                  jobPosition: JOB_POSITIONS[v]?.[0] ?? '',
                }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Position — dropdown for PM and Supervisor sub-roles */}
            {JOB_POSITIONS[staffForm.systemRole] && (
              <div className="space-y-1.5">
                <Label>Job Position <span className="text-red-500">*</span></Label>
                <Select
                  value={staffForm.jobPosition}
                  onValueChange={v => setStaffForm(prev => ({ ...prev, jobPosition: v, role: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                  <SelectContent>
                    {JOB_POSITIONS[staffForm.systemRole].map(pos => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400">
                  {staffForm.systemRole === 'Project Manager'
                    ? 'BD Supervisor creates projects • PM Supervisor assigns them • PM Staff manages tasks'
                    : 'TI Supervisor assigns manpower • Support Supervisor handles vehicles & equipment'}
                </p>
              </div>
            )}

            {staffForm.systemRole === 'Client' && (
              <div className="space-y-1.5">
                <Label>Assigned Project <span className="text-red-500">*</span></Label>
                <Select
                  value={staffForm.assignedProjectId}
                  onValueChange={v => setStaffField('assignedProjectId', v)}
                >
                  <SelectTrigger><SelectValue placeholder="Select a project" /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className={`grid gap-4 ${staffForm.systemRole === 'Client' ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <div className="space-y-1.5">
                <Label htmlFor="sf-role">
                  {staffForm.systemRole === 'Client' ? 'Organization / Name' : 'Role / Position'}
                  <span className="text-red-500"> *</span>
                </Label>
                <Input
                  id="sf-role"
                  value={staffForm.role}
                  onChange={e => setStaffField('role', e.target.value)}
                  placeholder={staffForm.systemRole === 'Client' ? 'e.g. DPWH Region 7' : 'e.g. Geotechnical Engineer'}
                  required
                />
              </div>

              {staffForm.systemRole !== 'Client' && (
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
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sf-email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="sf-email"
                type="email"
                value={staffForm.email}
                onChange={e => setStaffField('email', e.target.value)}
                placeholder="e.g. juan@geoinnovative.com"
                required
              />
            </div>

            <div className={`grid gap-4 ${staffForm.systemRole === 'Client' ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <div className="space-y-1.5">
                <Label htmlFor="sf-phone">Phone</Label>
                <Input
                  id="sf-phone"
                  value={staffForm.phone}
                  onChange={e => setStaffField('phone', e.target.value)}
                  placeholder="+63 9XX XXX XXXX"
                />
              </div>

              {staffForm.systemRole !== 'Client' && (
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
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setAddStaffOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Review & Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Account Confirmation */}
      <Dialog open={createConfirm} onOpenChange={open => { if (!open) setCreateConfirm(false); }}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Confirm New Account</DialogTitle>
            <DialogDescription>Please review the details before creating this account.</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium text-slate-800">{staffForm.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="font-medium text-slate-800">{staffForm.jobPosition || staffForm.systemRole}</span></div>
            {staffForm.department && <div className="flex justify-between"><span className="text-slate-500">Department</span><span className="font-medium text-slate-800">{staffForm.department}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium text-slate-800">{staffForm.email}</span></div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setCreateConfirm(false)}>Go Back</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirmCreate}>Confirm & Create Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Project Modal */}
      <Dialog open={assignDialogOpen} onOpenChange={open => { setAssignDialogOpen(open); if (!open) setAssignConfirm(false); }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Assign to Project</DialogTitle>
            <DialogDescription>Add this staff member to a project.</DialogDescription>
          </DialogHeader>

          {!assignConfirm ? (
            <>
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
                <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" disabled={!assignProjectId} onClick={() => setAssignConfirm(true)}>
                  Review Assignment
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-4 py-2">
                <p className="text-sm font-medium text-slate-600">Please confirm the following assignment:</p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Staff Member</span>
                    <span className="font-medium text-slate-800">
                      {staffList.find((m: StaffType) => m.id === assignStaffId)?.name ?? assignStaffId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Project</span>
                    <span className="font-medium text-slate-800 text-right max-w-[60%]">
                      {projects.find(p => p.id === assignProjectId)?.name ?? assignProjectId}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">Click Confirm to apply this assignment.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAssignConfirm(false)}>Go Back</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { submitAssign(); setAssignConfirm(false); }}>
                  Confirm Assignment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Staff Detail / Assignments Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Assignments for {detailStaffName}</DialogTitle>
            <DialogDescription>
              Projects currently assigned to this team member.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {(() => {
              const staffMember = filteredStaff.find(m => m.id === detailStaffId);
              if (!staffMember) return <p className="text-sm text-slate-500">Staff member not found.</p>;

              const assignedProjects = getAssignedProjectsForStaff(staffMember);

              if (assignedProjects.length === 0) {
                return (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-600">No projects assigned yet</p>
                  </div>
                );
              }

              return (
                <div className="space-y-2">
                  {assignedProjects.map(project => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{project.name}</div>
                        <div className="text-xs text-slate-500">{project.client}</div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

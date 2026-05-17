import React, { useMemo, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import type { View } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DemoVisualizer } from '@/components/DemoVisualizer';
import { Dashboard } from '@/sections/Dashboard';
import { Projects } from '@/sections/Projects';
import { Tasks } from '@/sections/Tasks';
import { Staff } from '@/sections/Staff';
import { Reports } from '@/sections/Reports';
import { Login } from '@/sections/Login';
import { ProjectDetail } from '@/sections/ProjectDetail';
import { Approvals } from '@/sections/Approvals';
import { LandingPage } from '@/sections/LandingPage';
import { LeaveRequests } from '@/sections/LeaveRequests';
import { MyLeave } from '@/sections/MyLeave';
import { DeletionRequests } from '@/sections/DeletionRequests';
import { Assets } from '@/sections/Assets';
import { ActivityLogs } from '@/sections/ActivityLogs';
import { Schedule } from '@/sections/Schedule';
import { SystemSettings } from '@/sections/SystemSettings';
import { ClientOverview } from '@/sections/client/ClientOverview';
import { ClientUpdates } from '@/sections/client/ClientUpdates';
import { ClientDocumentsPage } from '@/sections/client/ClientDocuments';
import { ClientTeam } from '@/sections/client/ClientTeam';
import {
  projects as initialProjects,
  tasks as initialTasks,
  notifications as initialNotifications,
  staff as initialStaff,
  roleRequests as initialRoleRequests,
  dailyReports as initialDailyReports,
  users as initialUsers,
  leaveRequests as initialLeaveRequests,
  deletionRequests as initialDeletionRequests,
  vehicles as initialVehicles,
  equipment as initialEquipment,
  activityLogs as initialActivityLogs,
} from '@/data/sampleData';
import type {
  Project,
  Task,
  Notification,
  Staff as StaffType,
  RoleRequest,
  DailyReport,
  User,
  Role,
  LeaveRequest,
  Vehicle,
  Equipment,
  ActivityLog,
  DeletionRequest,
} from '@/types';

// Re-export View so other files can still import it from App if needed
export type { View };

const STORAGE_VERSION = 'v3';
const storageKey = (name: string) => `gsi_${STORAGE_VERSION}_${name}`;

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey('projects'));
      return stored ? JSON.parse(stored) : initialProjects;
    } catch {
      return initialProjects;
    }
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey('tasks'));
      return stored ? JSON.parse(stored) : initialTasks;
    } catch {
      return initialTasks;
    }
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey('notifications'));
      return stored ? JSON.parse(stored) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });
  const [staffList, setStaffList] = useState<StaffType[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey('staff'));
      return stored ? JSON.parse(stored) : initialStaff;
    } catch {
      return initialStaff;
    }
  });
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey('users'));
      return stored ? JSON.parse(stored) : initialUsers;
    } catch {
      return initialUsers;
    }
  });
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey('roleRequests'));
      return stored ? JSON.parse(stored) : initialRoleRequests;
    } catch {
      return initialRoleRequests;
    }
  });
  const [dailyReports, setDailyReports] = useState<DailyReport[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey('dailyReports'));
      return stored ? JSON.parse(stored) : initialDailyReports;
    } catch {
      return initialDailyReports;
    }
  });
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey('leaveRequests'));
      return stored ? JSON.parse(stored) : initialLeaveRequests;
    } catch {
      return initialLeaveRequests;
    }
  });
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>(initialDeletionRequests);

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey('vehicles'));
      return stored ? JSON.parse(stored) : initialVehicles;
    } catch {
      return initialVehicles;
    }
  });
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey('equipment'));
      return stored ? JSON.parse(stored) : initialEquipment;
    } catch {
      return initialEquipment;
    }
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey('activityLogs'));
      return stored ? JSON.parse(stored) : initialActivityLogs;
    } catch {
      return initialActivityLogs;
    }
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);

  // Clear only on demo reset, not on app load, so data persists across sessions
  const clearStorageForDemo = () => {
    [
      'projects',
      'tasks',
      'notifications',
      'staff',
      'users',
      'roleRequests',
      'dailyReports',
      'leaveRequests',
      'vehicles',
      'equipment',
      'activityLogs',
    ].forEach(key => localStorage.removeItem(storageKey(key)));
  };

  // Persist core pieces to localStorage on change
  React.useEffect(() => { localStorage.setItem(storageKey('projects'), JSON.stringify(projects)); }, [projects]);
  React.useEffect(() => { localStorage.setItem(storageKey('tasks'), JSON.stringify(tasks)); }, [tasks]);
  React.useEffect(() => { localStorage.setItem(storageKey('notifications'), JSON.stringify(notifications)); }, [notifications]);
  React.useEffect(() => { localStorage.setItem(storageKey('staff'), JSON.stringify(staffList)); }, [staffList]);
  React.useEffect(() => { localStorage.setItem(storageKey('users'), JSON.stringify(users)); }, [users]);
  React.useEffect(() => { localStorage.setItem(storageKey('roleRequests'), JSON.stringify(roleRequests)); }, [roleRequests]);
  React.useEffect(() => { localStorage.setItem(storageKey('dailyReports'), JSON.stringify(dailyReports)); }, [dailyReports]);
  React.useEffect(() => { localStorage.setItem(storageKey('leaveRequests'), JSON.stringify(leaveRequests)); }, [leaveRequests]);
  React.useEffect(() => { localStorage.setItem(storageKey('vehicles'), JSON.stringify(vehicles)); }, [vehicles]);
  React.useEffect(() => { localStorage.setItem(storageKey('equipment'), JSON.stringify(equipment)); }, [equipment]);
  React.useEffect(() => { localStorage.setItem(storageKey('activityLogs'), JSON.stringify(activityLogs)); }, [activityLogs]);

  const isClient = currentUser?.role === 'Client';
  const jobPosition = currentUser?.jobPosition;

  const pushLog = (action: string, target: string) => {
    if (!currentUser) return;
    setActivityLogs(prev => [{
      id: `LOG-${Date.now()}`,
      userName: currentUser.name,
      userRole: currentUser.jobPosition ?? currentUser.role,
      action,
      target,
      timestamp: new Date().toISOString(),
    }, ...prev]);
  };

  // Export entire demo state as JSON
  const exportState = () => {
    const state = { projects, tasks, notifications, staffList, users, roleRequests, dailyReports, leaveRequests, vehicles, equipment, activityLogs };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gsi-portal-state.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import state object (overwrites in-memory state)
  const importState = (obj: any) => {
    if (!obj) return;
    if (obj.projects) setProjects(obj.projects);
    if (obj.tasks) setTasks(obj.tasks);
    if (obj.notifications) setNotifications(obj.notifications);
    if (obj.staffList) setStaffList(obj.staffList);
    if (obj.users) setUsers(obj.users);
    if (obj.roleRequests) setRoleRequests(obj.roleRequests);
    if (obj.dailyReports) setDailyReports(obj.dailyReports);
    if (obj.leaveRequests) setLeaveRequests(obj.leaveRequests);
    if (obj.vehicles) setVehicles(obj.vehicles);
    if (obj.equipment) setEquipment(obj.equipment);
    if (obj.activityLogs) setActivityLogs(obj.activityLogs);
  };

  // Demo playback: BD creates project → PM Supervisor assigns PM Staff → PM Staff creates task → TI assigns manpower
  const runDemoPlayback = () => {
    setDemoRunning(true);
    // Ensure roles exist (create if missing)
    const ensure = (role: string, jobPosition?: string, nameHint?: string) => {
      const found = users.find(u => u.role === role && (jobPosition ? u.jobPosition === jobPosition : true));
      if (found) return found;
      const id = `USR-${Date.now()}-${Math.floor(Math.random()*1000)}`;
      const name = nameHint ?? `${role} Demo`;
      const u = { id, name, email: `${id.toLowerCase()}@example.com`, role: role as any, avatar: name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(), jobPosition } as User;
      setUsers(prev => [u, ...prev]);
      return u;
    };

    ensure('Project Manager', 'BD Supervisor', 'BD Demo');
    ensure('Project Manager', 'PM Supervisor', 'PMS Demo');
    const pmstaff = ensure('Project Manager', 'PM Staff', 'PMStaff Demo');
    ensure('Supervisor', 'TI Supervisor', 'TI Demo');
    const staff = ensure('Staff', undefined, 'Field Staff');

    // BD creates project
    const proj: Project = { id: `PRJ-DEMO-${Date.now()}`, name: 'Demo Project – BD to PM flow', client: 'Demo Client', type: 'Geotechnical', status: 'Pending', progress: 0, startDate: new Date().toISOString().slice(0,10), endDate: new Date(Date.now()+1000*60*60*24*30).toISOString().slice(0,10), manager: '', assignedPMId: undefined, team: [], description: 'Automated demo project', location: 'Demo Site' };
    setProjects(prev => [proj, ...prev]);
    pushLog('Created demo project', proj.name);

    // PM Supervisor assigns PM Staff (add to project.team and set manager)
    setTimeout(() => {
      const updated = { ...proj, team: [pmstaff.name], manager: pmstaff.name, assignedPMId: pmstaff.id };
      setProjects(prev => prev.map(p => p.id === proj.id ? updated : p));
      pushLog('Assigned PM Staff to project', `${pmstaff.name} → ${proj.name}`);

      // PM Staff creates a task
      const tsk: Task = { id: `TSK-DEMO-${Date.now()}`, projectId: proj.id, title: 'Demo Task – Site Recon', description: 'Perform site reconnaissance', assignedTo: [], status: 'Pending', priority: 'Medium', dueDate: new Date(Date.now()+1000*60*60*24*7).toISOString().slice(0,10) };
      setTasks(prev => [tsk, ...prev]);
      pushLog('Created demo task', tsk.title);

      // TI Supervisor assigns manpower (add staff to task.assignedTo)
      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === tsk.id ? { ...t, assignedTo: [staff.name] } : t));
        setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, team: Array.from(new Set([...(p.team||[]), staff.name])) } : p));
        pushLog('TI assigned manpower', `${staff.name} → ${tsk.title}`);
        // finish demo after short pause so UI updates
        setTimeout(() => setDemoRunning(false), 300);
      }, 600);
    }, 600);

  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'Client') setCurrentView('client-overview');
    else if (user.role === 'Supervisor') setCurrentView('staff');
    else if (user.jobPosition === 'BD Supervisor') setCurrentView('projects');
    else setCurrentView('dashboard');
    setSelectedProjectId(null);
  };

  // Expose functions to window for the admin UI file controls (simple demo wiring)
  React.useEffect(() => {
    (window as any).exportState = exportState;
    (window as any).importState = importState;
    (window as any).runDemoPlayback = runDemoPlayback;
    (window as any).clearStorageForDemo = clearStorageForDemo;
    return () => {
      try { delete (window as any).exportState; delete (window as any).importState; delete (window as any).runDemoPlayback; delete (window as any).clearStorageForDemo; } catch {}
    };
  }, [exportState, importState, runDemoPlayback, clearStorageForDemo]);

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
    setSelectedProjectId(null);
    setShowLanding(true);
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    if (view !== 'project-detail') setSelectedProjectId(null);
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('project-detail');
  };

  const handleAddProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
    pushLog('Created project', project.name);
  };

  const handleDeleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    if (project) pushLog('Deleted project', project.name);
  };

  const handleEditProject = (updated: Project) => {
    const old = projects.find(p => p.id === updated.id);
    if (old) {
      // Smart activity log based on what changed
      if (updated.assignedPMId !== old.assignedPMId && updated.assignedPMId) {
        pushLog('Assigned PM Staff to project', `${updated.manager} → ${updated.name}`);
      } else if (updated.assignedPMId !== old.assignedPMId && !updated.assignedPMId) {
        pushLog('Unassigned PM Staff from project', updated.name);
      } else if (JSON.stringify(updated.team) !== JSON.stringify(old.team)) {
        pushLog('Updated project team', updated.name);
      } else if (updated.stage !== old.stage) {
        pushLog(`${updated.stage === 'Archived' ? 'Archived' : 'Restored'} project`, updated.name);
      } else if ((updated.documents?.length ?? 0) > (old.documents?.length ?? 0)) {
        const newDoc = updated.documents?.[updated.documents.length - 1];
        pushLog('Uploaded document', `${newDoc?.name ?? 'File'} – ${updated.name}`);
      } else {
        pushLog('Updated project details', updated.name);
      }

      // Sync staff statuses when team membership changes (TI Supervisor assign/remove)
      const added   = updated.team.filter(name => !old.team.includes(name));
      const removed = old.team.filter(name => !updated.team.includes(name));
      if (added.length > 0 || removed.length > 0) {
        setStaffList(prev => prev.map(s => {
          if (added.includes(s.name)) {
            return { ...s, currentProjects: (s.currentProjects ?? 0) + 1, status: s.status === 'On Leave' ? s.status : 'Assigned' as const };
          }
          if (removed.includes(s.name)) {
            const remaining = projects.filter(p => p.id !== updated.id && p.team.includes(s.name)).length;
            return { ...s, currentProjects: Math.max(0, remaining), status: s.status === 'On Leave' ? s.status : remaining > 0 ? 'Assigned' as const : 'Available' as const };
          }
          return s;
        }));
      }
    }
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
    if (task.assignedTo.length > 0) {
      setProjects(prev => prev.map(p => {
        if (p.id !== task.projectId) return p;
        const newMembers = task.assignedTo.filter(n => !p.team.includes(n));
        return newMembers.length > 0 ? { ...p, team: [...p.team, ...newMembers] } : p;
      }));
    }
    const taskProjectName = projects.find(p => p.id === task.projectId)?.name ?? task.projectId;
    pushLog('Created task', `${task.title} (${taskProjectName})`);
  };

  const handleEditTask = (updated: Task) => {
    const old = tasks.find(t => t.id === updated.id);
    const updatedTasks = tasks.map(t => t.id === updated.id ? updated : t);
    setTasks(updatedTasks);
    if (updated.assignedTo.length > 0) {
      setProjects(prev => prev.map(p => {
        if (p.id !== updated.projectId) return p;
        const newMembers = updated.assignedTo.filter(n => !p.team.includes(n));
        return newMembers.length > 0 ? { ...p, team: [...p.team, ...newMembers] } : p;
      }));
    }
    // Auto-recalculate project progress when task status changes
    if (old?.status !== updated.status) {
      const projectTasks = updatedTasks.filter(t => t.projectId === updated.projectId);
      const completed = projectTasks.filter(t => t.status === 'Completed').length;
      const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;
      setProjects(prev => prev.map(p => p.id === updated.projectId ? { ...p, progress } : p));
    }
    if (updated.status === 'Completed' && updated.completionNote) {
      pushLog('Completed task', `${updated.title} – ${updated.completionNote.slice(0, 60)}`);
    } else if ((updated.attachments?.length ?? 0) > (old?.attachments?.length ?? 0)) {
      const newFile = updated.attachments?.[updated.attachments.length - 1];
      pushLog('Uploaded task proof', `${newFile?.name ?? 'File'} – ${updated.title}`);
    } else {
      pushLog('Updated task', updated.title);
    }
  };

  const handleAddStaff = (member: StaffType) => {
    setStaffList(prev => [member, ...prev]);
  };

  const handleAddUser = (user: User) => {
    setUsers(prev => [user, ...prev]);
    pushLog('Created user account', `${user.name} (${user.role})`);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    const taskTitle = task?.title ?? taskId;
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);
    pushLog('Updated task status', `${taskTitle} → ${newStatus}`);
    // Auto-recalculate project progress from completed tasks
    if (task?.projectId) {
      const projectTasks = updatedTasks.filter(t => t.projectId === task.projectId);
      const completed = projectTasks.filter(t => t.status === 'Completed').length;
      const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;
      setProjects(prev => prev.map(p => p.id === task.projectId ? { ...p, progress } : p));
    }
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === notificationId ? { ...notif, read: true } : notif),
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const pushNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [{
      ...n,
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    }, ...prev]);
  };

  const handleSubmitRoleRequest = (input: { targetUserId: string; requestedRole: Role; reason: string }) => {
    if (!currentUser) return;
    const target = users.find(u => u.id === input.targetUserId);
    if (!target) return;
    const newReq: RoleRequest = {
      id: `REQ-${Date.now()}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      targetUserId: target.id,
      targetUserName: target.name,
      currentRole: target.role,
      requestedRole: input.requestedRole,
      reason: input.reason,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setRoleRequests(prev => [newReq, ...prev]);
    pushNotification({ type: 'approval', title: 'Role Change Requested', message: `${currentUser.name} requested ${target.name} be moved from ${target.role} to ${input.requestedRole}.`, audience: 'internal' });
  };

  const handleDirectRoleChange = (userId: string, newRole: Role) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleUpdateUserJobPosition = (userId: string, jobPosition: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, jobPosition } : u));
  };

  const handleUpdateStaffSystemRole = (staffId: string, systemRole: string) => {
    setStaffList(prev => prev.map(s => s.id === staffId ? { ...s, systemRole } : s));
  };

  const handleResolveRoleRequest = (requestId: string, decision: 'Approved' | 'Denied') => {
    if (!currentUser) return;
    const req = roleRequests.find(r => r.id === requestId);
    if (!req) return;
    if (decision === 'Approved' && req.requesterId === currentUser.id) return;
    setRoleRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, status: decision, resolvedBy: currentUser.name, resolvedAt: new Date().toISOString() } : r,
    ));
    if (decision === 'Approved') {
      setUsers(prev => prev.map(u => u.id === req.targetUserId ? { ...u, role: req.requestedRole } : u));
    }
    pushNotification({ type: 'approval', title: `Role Change ${decision}`, message: `${req.targetUserName}'s request to become ${req.requestedRole} was ${decision.toLowerCase()} by ${currentUser.name}.`, audience: 'internal' });
    pushLog(`${decision} role change request`, `${req.targetUserName} → ${req.requestedRole}`);
  };

  const handleSubmitDailyReport = (input: {
    projectId?: string; reportType?: DailyReport['reportType']; weatherCondition?: DailyReport['weatherCondition'];
    manpowerCount?: number; content: string; issues?: string; nextDayPlan?: string; attachmentNames?: string[];
  }) => {
    if (!currentUser) return;
    setDailyReports(prev => [{
      id: `DRP-${Date.now()}`,
      ...input,
      author: currentUser.name,
      submittedAt: new Date().toISOString(),
    }, ...prev]);
  };

  // --- Leave request handlers -----------------------------------------------
  const handleAddLeaveRequest = (req: LeaveRequest) => {
    setLeaveRequests(prev => [req, ...prev]);
    pushLog('Submitted leave request', `${req.type} – ${req.startDate}`);
  };

  const handleResolveLeaveRequest = (id: string, decision: 'Approved' | 'Denied') => {
    if (!currentUser) return;
    const req = leaveRequests.find(r => r.id === id);
    setLeaveRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: decision, reviewedBy: currentUser.name, reviewedAt: new Date().toISOString() } : r,
    ));
    if (req) {
      // Approved → staff member status becomes On Leave
      if (decision === 'Approved') {
        setStaffList(prev => prev.map(s =>
          s.name === req.staffName ? { ...s, status: 'On Leave' as const } : s,
        ));
      }
      pushLog(`${decision} leave request`, `${req.staffName} – ${req.type}`);
    }
  };

  const handleMarkLeaveReturned = (staffName: string) => {
    // When staff returns from leave, restore to Available (or Assigned if they have active projects)
    setStaffList(prev => prev.map(s => {
      if (s.name !== staffName) return s;
      const hasProjects = (s.assignedProjectIds?.length ?? 0) > 0 || s.currentProjects > 0;
      return { ...s, status: hasProjects ? 'Assigned' as const : 'Available' as const };
    }));
    pushLog('Staff returned from leave', staffName);
  };

  // --- Deletion request handlers --------------------------------------------
  const handleRequestDeletion = (projectId: string, projectName: string, reason: string) => {
    if (!currentUser) return;
    const newReq: DeletionRequest = {
      id: `DEL-${Date.now()}`,
      projectId,
      projectName,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRole: currentUser.jobPosition ?? currentUser.role,
      reason,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setDeletionRequests(prev => [newReq, ...prev]);
    pushLog('Requested project deletion', projectName);
    pushNotification({ type: 'approval', title: 'Deletion Request', message: `${currentUser.name} requested deletion of "${projectName}".`, audience: 'internal' });
  };

  const handleResolveDeletionRequest = (requestId: string, decision: 'Approved' | 'Denied') => {
    const req = deletionRequests.find(r => r.id === requestId);
    if (!req) return;
    setDeletionRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, status: decision, reviewedAt: new Date().toISOString() } : r,
    ));
    if (decision === 'Approved') {
      handleDeleteProject(req.projectId);
    }
    pushLog(`${decision} deletion request`, req.projectName);
  };

  // --- Asset handlers -------------------------------------------------------
  const handleDeployVehicle = (vehicleId: string, projectId: string, projectName: string) => {
    setVehicles(prev => prev.map(v =>
      v.id === vehicleId ? { ...v, status: 'Deployed', assignedProjectId: projectId, assignedProjectName: projectName } : v,
    ));
    pushLog('Deployed vehicle to project', projectName);
  };

  const handleReturnVehicle = (vehicleId: string) => {
    const v = vehicles.find(v => v.id === vehicleId);
    setVehicles(prev => prev.map(v =>
      v.id === vehicleId ? { ...v, status: 'Available', assignedProjectId: undefined, assignedProjectName: undefined, driver: undefined } : v,
    ));
    if (v?.assignedProjectName) pushLog('Returned vehicle from project', v.assignedProjectName);
  };

  const handleDeployEquipment = (equipId: string, projectId: string, projectName: string) => {
    setEquipment(prev => prev.map(e =>
      e.id === equipId ? { ...e, status: 'Deployed', assignedProjectId: projectId, assignedProjectName: projectName } : e,
    ));
    pushLog('Deployed equipment to project', projectName);
  };

  const handleReturnEquipment = (equipId: string) => {
    const e = equipment.find(e => e.id === equipId);
    setEquipment(prev => prev.map(e =>
      e.id === equipId ? { ...e, status: 'Available', assignedProjectId: undefined, assignedProjectName: undefined } : e,
    ));
    if (e?.assignedProjectName) pushLog('Returned equipment from project', e.assignedProjectName);
  };

  const handleAddVehicle = (vehicle: Vehicle) => {
    setVehicles(prev => [vehicle, ...prev]);
    pushLog('Added vehicle to inventory', vehicle.name);
  };

  const handleEditVehicle = (updated: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === updated.id ? updated : v));
    pushLog('Updated vehicle details', updated.name);
  };

  const handleAddEquipment = (equip: Equipment) => {
    setEquipment(prev => [equip, ...prev]);
    pushLog('Added equipment to inventory', equip.name);
  };

  const handleEditEquipment = (updated: Equipment) => {
    setEquipment(prev => prev.map(e => e.id === updated.id ? updated : e));
    pushLog('Updated equipment details', updated.name);
  };

  const handleSetVehicleMaintenance = (vehicleId: string) => {
    const v = vehicles.find(v => v.id === vehicleId);
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, status: 'Maintenance' } : v));
    if (v) pushLog('Set vehicle for maintenance', v.name);
  };

  const handleSetEquipmentMaintenance = (equipId: string) => {
    const e = equipment.find(e => e.id === equipId);
    setEquipment(prev => prev.map(e => e.id === equipId ? { ...e, status: 'Under Maintenance' } : e));
    if (e) pushLog('Set equipment for maintenance', e.name);
  };

  const handleMarkVehicleAvailable = (vehicleId: string) => {
    const v = vehicles.find(v => v.id === vehicleId);
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, status: 'Available' } : v));
    if (v) pushLog('Marked vehicle as available', v.name);
  };

  const handleMarkEquipmentAvailable = (equipId: string) => {
    const e = equipment.find(e => e.id === equipId);
    setEquipment(prev => prev.map(e => e.id === equipId ? { ...e, status: 'Available' } : e));
    if (e) pushLog('Marked equipment as available', e.name);
  };

  // --- Derived counts -------------------------------------------------------
  const visibleNotifications = useMemo(() => {
    if (!currentUser) return [];
    const audience = isClient ? 'client' : 'internal';
    return notifications.filter(n => (n.audience ?? 'internal') === audience);
  }, [notifications, currentUser, isClient]);

  const unreadCount = visibleNotifications.filter(n => !n.read).length;
  const pendingLeaveCount    = leaveRequests.filter(r => r.status === 'Pending').length;
  const pendingDeletionCount = deletionRequests.filter(r => r.status === 'Pending').length;

  // Derive staff currentProjects and status from live project data so Accounts page is always accurate
  const computedStaffList = useMemo(() => {
    const activeProjects = projects.filter(p => p.stage !== 'Archived');
    return staffList.map(member => {
      const count = activeProjects.filter(p => p.team.includes(member.name)).length;
      const derivedStatus: StaffType['status'] =
        member.status === 'On Leave' ? 'On Leave' :
        count > 0 ? 'Assigned' : 'Available';
      return { ...member, currentProjects: count, status: derivedStatus };
    });
  }, [staffList, projects]);

  // Filter out orphaned tasks (project was deleted before cascade delete was in place)
  const projectIds = useMemo(() => new Set(projects.map(p => p.id)), [projects]);
  const activeTasks = useMemo(() => tasks.filter(t => projectIds.has(t.projectId)), [tasks, projectIds]);

  if (!currentUser) {
    if (showLanding) return <LandingPage onEnterPortal={() => setShowLanding(false)} />;
    return <Login onLogin={handleLogin} />;
  }

  const clientProject = isClient && currentUser.clientProjectIds?.length
    ? projects.find(p => p.id === currentUser.clientProjectIds![0])
    : undefined;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        role={currentUser.role}
        jobPosition={jobPosition}
        pendingApprovalsCount={roleRequests.filter(r => r.status === 'Pending').length}
        pendingLeaveCount={pendingLeaveCount}
        pendingDeletionCount={pendingDeletionCount}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          notifications={visibleNotifications}
          unreadCount={unreadCount}
          onMarkRead={handleMarkNotificationRead}
          onMarkAllRead={handleMarkAllNotificationsRead}
          user={currentUser}
          onLogout={handleLogout}
          isClient={isClient}
          onOpenSettings={() => setCurrentView('system-settings')}
        />
        <main className="flex-1 overflow-auto p-6">

          {/* ── Internal portal ── */}
          {!isClient && currentView === 'dashboard' && (
            <Dashboard projects={projects} tasks={activeTasks} onProjectClick={handleProjectClick} onNavigate={handleNavigate} currentUser={currentUser} staffList={computedStaffList} />
          )}
          {!isClient && currentView === 'projects' && (
            <Projects
              projects={projects}
              onProjectClick={handleProjectClick}
              onAddProject={handleAddProject}
              onEditProject={handleEditProject}
              role={currentUser.role}
              jobPosition={jobPosition}
              currentUser={currentUser}
              users={users}
            />
          )}
          {!isClient && currentView === 'tasks' && (
            <Tasks tasks={activeTasks} projects={projects} onUpdateStatus={handleUpdateTaskStatus} onAddTask={handleAddTask} onEditTask={handleEditTask} onProjectClick={handleProjectClick} role={currentUser.role} staffList={computedStaffList} currentUser={currentUser} />
          )}
          {!isClient && currentView === 'staff' && (
            <Staff
              staffList={computedStaffList}
              users={users}
              currentUser={currentUser}
              onSubmitRoleRequest={handleSubmitRoleRequest}
              onDirectRoleChange={handleDirectRoleChange}
              onUpdateUserJobPosition={handleUpdateUserJobPosition}
              onUpdateStaffSystemRole={handleUpdateStaffSystemRole}
              onAssignProject={(staffId, projectId) => {
                const member = staffList.find(s => s.id === staffId);
                setStaffList(prev => prev.map(s =>
                  s.id === staffId ? { ...s, assignedProjectIds: Array.from(new Set([...(s.assignedProjectIds ?? []), projectId])), currentProjects: (s.currentProjects ?? 0) + 1, status: s.status === 'On Leave' ? s.status : 'Assigned' } : s,
                ));
                if (member) {
                  setProjects(prev => prev.map(p =>
                    p.id === projectId && !p.team.includes(member.name) ? { ...p, team: [...p.team, member.name] } : p,
                  ));
                }
              }}
              projects={projects}
              onAddStaff={handleAddStaff}
              onAddUser={handleAddUser}
            />
          )}
          {!isClient && currentView === 'reports' && (
            <Reports projects={projects} tasks={activeTasks} dailyReports={dailyReports} onSubmitDailyReport={handleSubmitDailyReport} />
          )}
          {!isClient && currentView === 'project-detail' && selectedProjectId && (
            <ProjectDetail
              project={projects.find(p => p.id === selectedProjectId)!}
              tasks={activeTasks.filter(t => t.projectId === selectedProjectId)}
              onBack={() => handleNavigate('projects')}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
              onRequestDeletion={handleRequestDeletion}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              role={currentUser.role}
              jobPosition={jobPosition}
              staffList={computedStaffList}
              currentUser={currentUser}
              users={users}
              activityLogs={activityLogs}
              vehicles={vehicles}
              equipment={equipment}
            />
          )}
          {!isClient && currentView === 'approvals' && currentUser.role === 'Admin' && (
            <Approvals requests={roleRequests} currentUser={currentUser} onResolve={handleResolveRoleRequest} />
          )}
          {!isClient && currentView === 'activity-logs' && currentUser.role === 'Admin' && (
            <ActivityLogs logs={activityLogs} />
          )}
          {!isClient && currentView === 'system-settings' && currentUser.role === 'Admin' && (
            <SystemSettings currentUser={currentUser} />
          )}
          {!isClient && currentView === 'leave-requests' && currentUser.role === 'Supervisor' && (
            <LeaveRequests leaveRequests={leaveRequests} currentUser={currentUser} onResolve={handleResolveLeaveRequest} onMarkReturned={handleMarkLeaveReturned} />
          )}
          {!isClient && currentView === 'deletion-requests' && currentUser.jobPosition === 'BD Supervisor' && (
            <DeletionRequests requests={deletionRequests} currentUser={currentUser} onApprove={id => handleResolveDeletionRequest(id, 'Approved')} onDeny={id => handleResolveDeletionRequest(id, 'Denied')} />
          )}
          {!isClient && currentView === 'my-leave' && currentUser.role === 'Staff' && (
            <MyLeave leaveRequests={leaveRequests} currentUser={currentUser} onSubmit={handleAddLeaveRequest} />
          )}
          {!isClient && currentView === 'assets' && currentUser.role === 'Supervisor' && currentUser.jobPosition === 'Support Supervisor' && (
            <Assets
              vehicles={vehicles}
              equipment={equipment}
              projects={projects}
              currentUser={currentUser}
              onDeployVehicle={handleDeployVehicle}
              onReturnVehicle={handleReturnVehicle}
              onDeployEquipment={handleDeployEquipment}
              onReturnEquipment={handleReturnEquipment}
              onAddVehicle={handleAddVehicle}
              onEditVehicle={handleEditVehicle}
              onAddEquipment={handleAddEquipment}
              onEditEquipment={handleEditEquipment}
              onSetVehicleMaintenance={handleSetVehicleMaintenance}
              onSetEquipmentMaintenance={handleSetEquipmentMaintenance}
              onMarkVehicleAvailable={handleMarkVehicleAvailable}
              onMarkEquipmentAvailable={handleMarkEquipmentAvailable}
            />
          )}
          {!isClient && currentView === 'schedule' && currentUser.role === 'Staff' && (
            <Schedule tasks={activeTasks} projects={projects} currentUser={currentUser} />
          )}

          {/* ── Client portal ── */}
          {isClient && clientProject && currentView === 'client-overview' && (
            <ClientOverview project={clientProject} />
          )}
          {isClient && clientProject && currentView === 'client-updates' && (
            <ClientUpdates project={clientProject} />
          )}
          {isClient && clientProject && currentView === 'client-documents' && (
            <ClientDocumentsPage project={clientProject} />
          )}
          {isClient && clientProject && currentView === 'client-team' && (
            <ClientTeam project={clientProject} />
          )}
          {isClient && !clientProject && (
            <div className="text-center py-12 text-slate-500">
              No project has been assigned to your client account yet.
            </div>
          )}
        </main>
        {demoRunning && (
          <DemoVisualizer logs={activityLogs} onClose={() => setDemoRunning(false)} />
        )}
      </div>
    </div>
  );
}

export default App;

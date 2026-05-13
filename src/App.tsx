import { useMemo, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import type { View } from '@/components/Sidebar';
import { Header } from '@/components/Header';
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
import { Assets } from '@/sections/Assets';
import { ActivityLogs } from '@/sections/ActivityLogs';
import { Schedule } from '@/sections/Schedule';
import { SystemSettings } from '@/sections/SystemSettings';
import { ClientOverview } from '@/sections/client/ClientOverview';
import { ClientUpdates } from '@/sections/client/ClientUpdates';
import { ClientDocumentsPage } from '@/sections/client/ClientDocuments';
import { ClientTeam } from '@/sections/client/ClientTeam';
import { ClientInvoicesPage } from '@/sections/client/ClientInvoices';
import {
  projects as initialProjects,
  tasks as initialTasks,
  notifications as initialNotifications,
  staff as initialStaff,
  roleRequests as initialRoleRequests,
  dailyReports as initialDailyReports,
  users as initialUsers,
  leaveRequests as initialLeaveRequests,
  vehicles as initialVehicles,
  equipment as initialEquipment,
  activityLogs as initialActivityLogs,
  clientInvoices as initialClientInvoices,
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
  ClientInvoice,
} from '@/types';

// Re-export View so other files can still import it from App if needed
export type { View };

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [staffList, setStaffList] = useState<StaffType[]>(initialStaff);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>(initialRoleRequests);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>(initialDailyReports);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [clientInvoices] = useState<ClientInvoice[]>(initialClientInvoices);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'Client') setCurrentView('client-overview');
    else if (user.role === 'Supervisor') setCurrentView('staff');
    else if (user.jobPosition === 'BD Supervisor') setCurrentView('projects');
    else setCurrentView('dashboard');
    setSelectedProjectId(null);
  };

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

  const handleEditProject = (updated: Project) => {
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
    pushLog('Created task', task.title);
  };

  const handleEditTask = (updated: Task) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    if (updated.assignedTo.length > 0) {
      setProjects(prev => prev.map(p => {
        if (p.id !== updated.projectId) return p;
        const newMembers = updated.assignedTo.filter(n => !p.team.includes(n));
        return newMembers.length > 0 ? { ...p, team: [...p.team, ...newMembers] } : p;
      }));
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
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
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
    setLeaveRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: decision, reviewedBy: currentUser.name, reviewedAt: new Date().toISOString() } : r,
    ));
    const req = leaveRequests.find(r => r.id === id);
    if (req) pushLog(`${decision} leave request`, `${req.staffName} – ${req.type}`);
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

  // --- Derived counts -------------------------------------------------------
  const visibleNotifications = useMemo(() => {
    if (!currentUser) return [];
    const audience = isClient ? 'client' : 'internal';
    return notifications.filter(n => (n.audience ?? 'internal') === audience);
  }, [notifications, currentUser, isClient]);

  const unreadCount = visibleNotifications.filter(n => !n.read).length;
  const pendingLeaveCount = leaveRequests.filter(r => r.status === 'Pending').length;

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
            <Dashboard projects={projects} tasks={tasks} onProjectClick={handleProjectClick} onNavigate={handleNavigate} />
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
              staffList={staffList}
              users={users}
            />
          )}
          {!isClient && currentView === 'tasks' && (
            <Tasks tasks={tasks} projects={projects} onUpdateStatus={handleUpdateTaskStatus} onAddTask={handleAddTask} onEditTask={handleEditTask} role={currentUser.role} staffList={staffList} currentUser={currentUser} />
          )}
          {!isClient && currentView === 'staff' && (
            <Staff
              staffList={staffList}
              users={users}
              currentUser={currentUser}
              onSubmitRoleRequest={handleSubmitRoleRequest}
              onDirectRoleChange={handleDirectRoleChange}
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
            <Reports projects={projects} tasks={tasks} dailyReports={dailyReports} onSubmitDailyReport={handleSubmitDailyReport} />
          )}
          {!isClient && currentView === 'project-detail' && selectedProjectId && (
            <ProjectDetail
              project={projects.find(p => p.id === selectedProjectId)!}
              tasks={tasks.filter(t => t.projectId === selectedProjectId)}
              onBack={() => handleNavigate('projects')}
              onEditProject={handleEditProject}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              role={currentUser.role}
              jobPosition={jobPosition}
              staffList={staffList}
              currentUser={currentUser}
              users={users}
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
            <LeaveRequests leaveRequests={leaveRequests} currentUser={currentUser} onResolve={handleResolveLeaveRequest} />
          )}
          {!isClient && currentView === 'my-leave' && currentUser.role === 'Staff' && (
            <MyLeave leaveRequests={leaveRequests} currentUser={currentUser} onSubmit={handleAddLeaveRequest} />
          )}
          {!isClient && currentView === 'assets' && currentUser.role === 'Supervisor' && (
            <Assets
              vehicles={vehicles}
              equipment={equipment}
              projects={projects}
              currentUser={currentUser}
              onDeployVehicle={handleDeployVehicle}
              onReturnVehicle={handleReturnVehicle}
              onDeployEquipment={handleDeployEquipment}
              onReturnEquipment={handleReturnEquipment}
            />
          )}
          {!isClient && currentView === 'schedule' && currentUser.role === 'Staff' && (
            <Schedule tasks={tasks} projects={projects} currentUser={currentUser} />
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
          {isClient && clientProject && currentView === 'client-invoices' && (
            <ClientInvoicesPage project={clientProject} invoices={clientInvoices} />
          )}
          {isClient && !clientProject && (
            <div className="text-center py-12 text-slate-500">
              No project has been assigned to your client account yet.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

import { useMemo, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
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
} from '@/types';

export type View =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'staff'
  | 'reports'
  | 'project-detail'
  | 'approvals'
  | 'client-overview'
  | 'client-updates'
  | 'client-documents'
  | 'client-team';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isClient = currentUser?.role === 'Client';

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'Client') setCurrentView('client-overview');
    else if (user.role === 'Supervisor') setCurrentView('projects');
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
    if (view !== 'project-detail') {
      setSelectedProjectId(null);
    }
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('project-detail');
  };

  const handleAddProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const handleEditProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
    if (task.assignedTo.length > 0) {
      setProjects(prev =>
        prev.map(p => {
          if (p.id !== task.projectId) return p;
          const newMembers = task.assignedTo.filter(n => !p.team.includes(n));
          return newMembers.length > 0 ? { ...p, team: [...p.team, ...newMembers] } : p;
        }),
      );
    }
  };

  const handleEditTask = (updated: Task) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    if (updated.assignedTo.length > 0) {
      setProjects(prev =>
        prev.map(p => {
          if (p.id !== updated.projectId) return p;
          const newMembers = updated.assignedTo.filter(n => !p.team.includes(n));
          return newMembers.length > 0 ? { ...p, team: [...p.team, ...newMembers] } : p;
        }),
      );
    }
  };

  const handleAddStaff = (member: StaffType) => {
    setStaffList(prev => [member, ...prev]);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, status: newStatus } : task)),
    );
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === notificationId ? { ...notif, read: true } : notif)),
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const pushNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [
      {
        ...n,
        id: `NOTIF-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);
  };

  const handleSubmitRoleRequest = (input: {
    targetUserId: string;
    requestedRole: Role;
    reason: string;
  }) => {
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
    pushNotification({
      type: 'approval',
      title: 'Role Change Requested',
      message: `${currentUser.name} requested ${target.name} be moved from ${target.role} to ${input.requestedRole}.`,
      audience: 'internal',
    });
  };

  const handleResolveRoleRequest = (requestId: string, decision: 'Approved' | 'Denied') => {
    if (!currentUser) return;
    const req = roleRequests.find(r => r.id === requestId);
    if (!req) return;
    // Admin cannot approve their own request
    if (decision === 'Approved' && req.requesterId === currentUser.id) return;

    setRoleRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? { ...r, status: decision, resolvedBy: currentUser.name, resolvedAt: new Date().toISOString() }
          : r,
      ),
    );

    if (decision === 'Approved') {
      setUsers(prev =>
        prev.map(u => (u.id === req.targetUserId ? { ...u, role: req.requestedRole } : u)),
      );
    }

    pushNotification({
      type: 'approval',
      title: `Role Change ${decision}`,
      message: `${req.targetUserName}'s request to become ${req.requestedRole} was ${decision.toLowerCase()} by ${currentUser.name}.`,
      audience: 'internal',
    });
  };

  const handleSubmitDailyReport = (input: {
    projectId?: string;
    reportType?: DailyReport['reportType'];
    weatherCondition?: DailyReport['weatherCondition'];
    manpowerCount?: number;
    content: string;
    issues?: string;
    nextDayPlan?: string;
    attachmentNames?: string[];
  }) => {
    if (!currentUser) return;
    const newReport: DailyReport = {
      id: `DRP-${Date.now()}`,
      projectId: input.projectId,
      author: currentUser.name,
      reportType: input.reportType,
      weatherCondition: input.weatherCondition,
      manpowerCount: input.manpowerCount,
      content: input.content,
      issues: input.issues,
      nextDayPlan: input.nextDayPlan,
      attachmentNames: input.attachmentNames,
      submittedAt: new Date().toISOString(),
    };
    setDailyReports(prev => [newReport, ...prev]);
  };

  // Notifications visible to the current role
  const visibleNotifications = useMemo(() => {
    if (!currentUser) return [];
    const audience = isClient ? 'client' : 'internal';
    return notifications.filter(n => (n.audience ?? 'internal') === audience);
  }, [notifications, currentUser, isClient]);

  const unreadCount = visibleNotifications.filter(n => !n.read).length;

  if (!currentUser) {
    if (showLanding) {
      return <LandingPage onEnterPortal={() => setShowLanding(false)} />;
    }
    return <Login onLogin={handleLogin} />;
  }

  // Resolve client's primary project (read-only portal is single-project)
  const clientProject =
    isClient && currentUser.clientProjectIds?.length
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
        pendingApprovalsCount={roleRequests.filter(r => r.status === 'Pending').length}
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
        />
        <main className="flex-1 overflow-auto p-6">
          {/* Internal portal */}
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
              currentUser={currentUser}
              staffList={staffList}
              users={users}
            />
          )}
          {!isClient && currentView === 'tasks' && (
            <Tasks tasks={tasks} projects={projects} onUpdateStatus={handleUpdateTaskStatus} onAddTask={handleAddTask} onEditTask={handleEditTask} role={currentUser.role} staffList={staffList} />
          )}
          {!isClient && currentView === 'staff' && (
            <Staff
              staffList={staffList}
              users={users}
              currentUser={currentUser}
              onSubmitRoleRequest={handleSubmitRoleRequest}
              onAssignProject={(staffId, projectId) => {
                const member = staffList.find(s => s.id === staffId);
                setStaffList(prev =>
                  prev.map(s =>
                    s.id === staffId
                      ? {
                          ...s,
                          assignedProjectIds: Array.from(
                            new Set([...(s.assignedProjectIds ?? []), projectId]),
                          ),
                          currentProjects: (s.currentProjects ?? 0) + 1,
                          status: s.status === 'On Leave' ? s.status : 'Assigned',
                        }
                      : s,
                  ),
                );
                if (member) {
                  setProjects(prev =>
                    prev.map(p =>
                      p.id === projectId && !p.team.includes(member.name)
                        ? { ...p, team: [...p.team, member.name] }
                        : p,
                    ),
                  );
                }
              }}
              projects={projects}
              onAddStaff={handleAddStaff}
            />
          )}
          {!isClient && currentView === 'reports' && (
            <Reports
              projects={projects}
              tasks={tasks}
              dailyReports={dailyReports}
              onSubmitDailyReport={handleSubmitDailyReport}
            />
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
              staffList={staffList}
              currentUser={currentUser}
            />
          )}
          {!isClient && currentView === 'approvals' && currentUser.role === 'Admin' && (
            <Approvals
              requests={roleRequests}
              currentUser={currentUser}
              onResolve={handleResolveRoleRequest}
            />
          )}

          {/* Client portal (read-only) */}
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
      </div>
    </div>
  );
}

export default App;

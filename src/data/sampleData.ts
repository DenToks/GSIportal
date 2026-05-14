import type {
  Project,
  Task,
  Staff,
  Notification,
  Activity,
  DashboardStats,
  User,
  RoleRequest,
  DailyReport,
  ClientUpdate,
  ClientDocument,
  ClientMilestone,
  LeaveRequest,
  Vehicle,
  Equipment,
  ActivityLog,
  DeletionRequest,
} from '@/types';

export const deletionRequests: DeletionRequest[] = [];

export const dashboardStats: DashboardStats = {
  totalProjects: 0,
  ongoingProjects: 0,
  completedProjects: 0,
  pendingTasks: 0,
  totalStaff: 0,
  availableStaff: 0,
};

export const projects: Project[] = [];

export const tasks: Task[] = [];

export const staff: Staff[] = [
  {
    id: 'STF-001',
    name: 'Engr. Carlos Reyes',
    role: 'Senior Geotechnical Engineer',
    department: 'Engineering',
    email: 'carlos.reyes@geoinnovative.ph',
    phone: '+63 917 123 4567',
    avatar: 'CR',
    status: 'Assigned',
    currentProjects: 3,
    workload: 85
  },
  {
    id: 'STF-002',
    name: 'Engr. Patricia Lim',
    role: 'Project Manager',
    department: 'Project Management',
    email: 'patricia.lim@geoinnovative.ph',
    phone: '+63 918 234 5678',
    avatar: 'PL',
    status: 'Assigned',
    currentProjects: 3,
    workload: 90
  },
  {
    id: 'STF-003',
    name: 'Engr. Roberto Tan',
    role: 'Geohazard Specialist',
    department: 'Geoscience',
    email: 'roberto.tan@geoinnovative.ph',
    phone: '+63 919 345 6789',
    avatar: 'RT',
    status: 'Assigned',
    currentProjects: 2,
    workload: 75
  },
  {
    id: 'STF-004',
    name: 'Engr. Maria Santos',
    role: 'Geotechnical Engineer',
    department: 'Engineering',
    email: 'maria.santos@geoinnovative.ph',
    phone: '+63 920 456 7890',
    avatar: 'MS',
    status: 'Assigned',
    currentProjects: 2,
    workload: 80
  },
  {
    id: 'STF-005',
    name: 'Engr. Lisa Garcia',
    role: 'Environmental Engineer',
    department: 'Environmental',
    email: 'lisa.garcia@geoinnovative.ph',
    phone: '+63 921 567 8901',
    avatar: 'LG',
    status: 'Assigned',
    currentProjects: 2,
    workload: 70
  },
  {
    id: 'STF-006',
    name: 'Geo. Ana Lim',
    role: ' Engineering Geologist',
    department: 'Geoscience',
    email: 'ana.lim@geoinnovative.ph',
    phone: '+63 922 678 9012',
    avatar: 'AL',
    status: 'Assigned',
    currentProjects: 3,
    workload: 95
  },
  {
    id: 'STF-007',
    name: 'Engr. David Lee',
    role: 'Hydraulic Engineer',
    department: 'Engineering',
    email: 'david.lee@geoinnovative.ph',
    phone: '+63 923 789 0123',
    avatar: 'DL',
    status: 'Assigned',
    currentProjects: 2,
    workload: 65
  },
  {
    id: 'STF-008',
    name: 'Engr. John Cruz',
    role: 'Field Engineer',
    department: 'Engineering',
    email: 'john.cruz@geoinnovative.ph',
    phone: '+63 924 890 1234',
    avatar: 'JC',
    status: 'Available',
    currentProjects: 1,
    workload: 50
  },
  {
    id: 'STF-009',
    name: 'Engr. Sarah Cruz',
    role: 'Civil Engineer',
    department: 'Engineering',
    email: 'sarah.cruz@geoinnovative.ph',
    phone: '+63 925 901 2345',
    avatar: 'SC',
    status: 'Available',
    currentProjects: 1,
    workload: 45
  },
  {
    id: 'STF-010',
    name: 'Geo. Mark Reyes',
    role: 'Geologist',
    department: 'Geoscience',
    email: 'mark.reyes@geoinnovative.ph',
    phone: '+63 926 012 3456',
    avatar: 'MR',
    status: 'Assigned',
    currentProjects: 2,
    workload: 70
  },
  {
    id: 'STF-011',
    name: 'Engr. Mike Torres',
    role: 'Structural Engineer',
    department: 'Engineering',
    email: 'mike.torres@geoinnovative.ph',
    phone: '+63 927 123 4567',
    avatar: 'MT',
    status: 'Available',
    currentProjects: 1,
    workload: 40
  },
  {
    id: 'STF-012',
    name: 'Engr. Jenny Wu',
    role: 'Geotechnical Engineer',
    department: 'Engineering',
    email: 'jenny.wu@geoinnovative.ph',
    phone: '+63 928 234 5678',
    avatar: 'JW',
    status: 'On Leave',
    currentProjects: 0,
    workload: 0
  }
  ,
  {
    id: 'STF-013',
    name: 'Engr. Kevin Dela Cruz',
    role: 'Project Manager',
    department: 'Project Management',
    email: 'kevin.delacruz@geoinnovative.ph',
    phone: '+63 929 345 6789',
    avatar: 'KD',
    status: 'Available',
    currentProjects: 1,
    workload: 45
  },
  {
    id: 'STF-014',
    name: 'Engr. Angel Bautista',
    role: 'Project Manager',
    department: 'Project Management',
    email: 'angel.bautista@geoinnovative.ph',
    phone: '+63 930 456 7890',
    avatar: 'AB',
    status: 'Available',
    currentProjects: 1,
    workload: 35
  },
  {
    id: 'STF-015',
    name: 'Engr. Paul Rivera',
    role: 'Field Engineer',
    department: 'Engineering',
    email: 'paul.rivera@geoinnovative.ph',
    phone: '+63 931 567 8901',
    avatar: 'PR',
    status: 'Available',
    currentProjects: 1,
    workload: 40
  },
  {
    id: 'STF-016',
    name: 'Engr. Leah Torres',
    role: 'Field Engineer',
    department: 'Engineering',
    email: 'leah.torres@geoinnovative.ph',
    phone: '+63 932 678 9012',
    avatar: 'LT',
    status: 'Available',
    currentProjects: 0,
    workload: 30
  },
  {
    id: 'STF-017',
    name: 'Engr. Paolo Mendoza',
    role: 'Geotechnical Engineer',
    department: 'Geoscience',
    email: 'paolo.mendoza@geoinnovative.ph',
    phone: '+63 933 789 0123',
    avatar: 'PM',
    status: 'Assigned',
    currentProjects: 1,
    workload: 55
  },
  {
    id: 'STF-018',
    name: 'Engr. Maria Cordero',
    role: 'Administrator',
    department: 'Administration',
    email: 'admin@geoinnovative.ph',
    phone: '+63 934 890 1234',
    avatar: 'MC',
    status: 'Available',
    currentProjects: 0,
    workload: 0
  },
  {
    id: 'STF-019',
    name: 'Engr. Carlos Reyes',
    role: 'Business Development Supervisor',
    department: 'Project Management',
    email: 'carlos.reyes@geoinnovative.ph',
    phone: '+63 935 901 2345',
    avatar: 'CR',
    status: 'Assigned',
    currentProjects: 2,
    workload: 60
  },
  {
    id: 'STF-020',
    name: 'Engr. Patricia Lim',
    role: 'Project Management Supervisor',
    department: 'Project Management',
    email: 'patricia.lim@geoinnovative.ph',
    phone: '+63 936 012 3456',
    avatar: 'PL',
    status: 'Assigned',
    currentProjects: 3,
    workload: 90
  },
  {
    id: 'STF-021',
    name: 'Geo. Ana Lim',
    role: 'PM Staff',
    department: 'Project Management',
    email: 'ana.lim@geoinnovative.ph',
    phone: '+63 937 123 4567',
    avatar: 'AL',
    status: 'Assigned',
    currentProjects: 1,
    workload: 50
  },
  {
    id: 'STF-022',
    name: 'Engr. Roberto Tan',
    role: 'TI Supervisor',
    department: 'Technical Instrumentation',
    email: 'roberto.tan@geoinnovative.ph',
    phone: '+63 938 234 5678',
    avatar: 'RT',
    status: 'Assigned',
    currentProjects: 2,
    workload: 75
  },
  {
    id: 'STF-023',
    name: 'Engr. Jenny Wu',
    role: 'Support Supervisor',
    department: 'Support Services',
    email: 'jenny.wu@geoinnovative.ph',
    phone: '+63 939 345 6789',
    avatar: 'JW',
    status: 'Available',
    currentProjects: 0,
    workload: 20
  },
  {
    id: 'STF-024',
    name: 'DPWH Region 7',
    role: 'Client',
    department: 'Client Relations',
    email: 'client@dpwh-r7.gov.ph',
    phone: '+63 940 456 7890',
    avatar: 'D7',
    status: 'Available',
    currentProjects: 0,
    workload: 0
  }
];

export const notifications: Notification[] = [];

export const activities: Activity[] = [];

// --- Users (login accounts) -------------------------------------------------
export const users: User[] = [
  {
    id: 'USR-ADMIN',
    name: 'Engr. Maria Cordero',
    email: 'admin@geoinnovative.ph',
    role: 'Admin',
    avatar: 'MC',
    jobPosition: 'Administrator',
  },
  {
    id: 'USR-BD-1',
    name: 'Engr. Carlos Reyes',
    email: 'carlos.reyes@geoinnovative.ph',
    role: 'Project Manager',
    avatar: 'CR',
    jobPosition: 'BD Supervisor',
  },
  {
    id: 'USR-PMS-1',
    name: 'Engr. Patricia Lim',
    email: 'patricia.lim@geoinnovative.ph',
    role: 'Project Manager',
    avatar: 'PL',
    jobPosition: 'PM Supervisor',
  },
  {
    id: 'USR-PMSTAFF-1',
    name: 'Geo. Ana Lim',
    email: 'ana.lim@geoinnovative.ph',
    role: 'Project Manager',
    avatar: 'AL',
    jobPosition: 'PM Staff',
  },
  {
    id: 'USR-PMSTAFF-2',
    name: 'Engr. Kevin Dela Cruz',
    email: 'kevin.delacruz@geoinnovative.ph',
    role: 'Project Manager',
    avatar: 'KD',
    jobPosition: 'PM Staff',
  },
  {
    id: 'USR-PMSTAFF-3',
    name: 'Engr. Angel Bautista',
    email: 'angel.bautista@geoinnovative.ph',
    role: 'Project Manager',
    avatar: 'AB',
    jobPosition: 'PM Staff',
  },
  {
    id: 'USR-TI-1',
    name: 'Engr. Roberto Tan',
    email: 'roberto.tan@geoinnovative.ph',
    role: 'Supervisor',
    avatar: 'RT',
    jobPosition: 'TI Supervisor',
  },
  {
    id: 'USR-TI-2',
    name: 'Engr. Paolo Mendoza',
    email: 'paolo.mendoza@geoinnovative.ph',
    role: 'Supervisor',
    avatar: 'PM',
    jobPosition: 'TI Supervisor',
  },
  {
    id: 'USR-SS-1',
    name: 'Engr. Jenny Wu',
    email: 'jenny.wu@geoinnovative.ph',
    role: 'Supervisor',
    avatar: 'JW',
    jobPosition: 'Support Supervisor',
  },
  {
    id: 'USR-SS-2',
    name: 'Engr. Nina Alvarez',
    email: 'nina.alvarez@geoinnovative.ph',
    role: 'Supervisor',
    avatar: 'NA',
    jobPosition: 'Support Supervisor',
  },
  {
    id: 'USR-TECH-1',
    name: 'Engr. Maria Santos',
    email: 'maria.santos@geoinnovative.ph',
    role: 'Staff',
    avatar: 'MS',
    jobPosition: 'Geotechnical Engineer',
  },
  {
    id: 'USR-TECH-2',
    name: 'Engr. Paul Rivera',
    email: 'paul.rivera@geoinnovative.ph',
    role: 'Staff',
    avatar: 'PR',
    jobPosition: 'Field Engineer',
  },
  {
    id: 'USR-STF-1',
    name: 'Engr. John Cruz',
    email: 'john.cruz@geoinnovative.ph',
    role: 'Staff',
    avatar: 'JC',
    jobPosition: 'Field Engineer',
  },
  {
    id: 'USR-STF-2',
    name: 'Engr. Sarah Cruz',
    email: 'sarah.cruz@geoinnovative.ph',
    role: 'Staff',
    avatar: 'SC',
    jobPosition: 'Civil Engineer',
  },
  {
    id: 'USR-CLI-1',
    name: 'DPWH Region 7',
    email: 'client@dpwh-r7.gov.ph',
    role: 'Client',
    avatar: 'D7',
    clientProjectIds: ['PRJ-2024-002'],
  },
];

// --- Role change requests ---------------------------------------------------
export const roleRequests: RoleRequest[] = [];

// --- Daily reports ----------------------------------------------------------
export const dailyReports: DailyReport[] = [];

// --- Client portal mock data ------------------------------------------------
export const clientMilestones: ClientMilestone[] = [];

export const clientUpdates: ClientUpdate[] = [];

export const clientDocuments: ClientDocument[] = [];

// --- Leave requests ---------------------------------------------------------
export const leaveRequests: LeaveRequest[] = [];

// --- Vehicles ---------------------------------------------------------------
export const vehicles: Vehicle[] = [];

// --- Equipment --------------------------------------------------------------
export const equipment: Equipment[] = [];

// --- Activity logs ----------------------------------------------------------
export const activityLogs: ActivityLog[] = [];

// No seeded client notifications in the blank-slate demo.


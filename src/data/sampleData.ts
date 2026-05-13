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
} from '@/types';

export const dashboardStats: DashboardStats = {
  totalProjects: 18,
  ongoingProjects: 12,
  completedProjects: 4,
  pendingTasks: 23,
  totalStaff: 47,
  availableStaff: 15,
};

export const projects: Project[] = [
  {
    id: 'PRJ-2024-001',
    name: 'MRT-7 Geotechnical Investigation',
    client: 'Department of Transportation',
    type: 'Geotechnical',
    status: 'Ongoing',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    manager: 'Engr. Carlos Reyes',
    team: ['Engr. Maria Santos', 'Engr. John Cruz', 'Geo. Ana Lim'],
    description: 'Comprehensive geotechnical investigation for MRT-7 extension project including borehole drilling, soil sampling, and laboratory testing.',
    location: 'Quezon City, Metro Manila'
  },
  {
    id: 'PRJ-2024-002',
    name: 'Cebu South Road Slope Stability Assessment',
    client: 'DPWH Region 7',
    type: 'Geohazard',
    status: 'Ongoing',
    progress: 40,
    startDate: '2024-02-01',
    endDate: '2024-05-15',
    manager: 'Engr. Roberto Tan',
    team: ['Engr. Lisa Garcia', 'Geo. Mark Reyes'],
    description: 'Slope stability analysis and landslide risk assessment for Cebu South Road improvement project.',
    location: 'Cebu City, Cebu'
  },
  {
    id: 'PRJ-2024-003',
    name: 'Manila Bay Flood Assessment Study',
    client: 'MMDA',
    type: 'Civil Infrastructure',
    status: 'Ongoing',
    progress: 80,
    startDate: '2024-01-05',
    endDate: '2024-04-30',
    manager: 'Engr. Patricia Lim',
    team: ['Engr. David Lee', 'Engr. Sarah Cruz', 'Engr. Mike Torres'],
    description: 'Hydrologic and hydraulic analysis for Manila Bay flood mitigation program.',
    location: 'Manila Bay Area, Metro Manila'
  },
  {
    id: 'PRJ-2024-004',
    name: 'Antipolo Subdivision Foundation Design',
    client: 'Suntrust Properties Inc.',
    type: 'Geotechnical',
    status: 'Pending',
    progress: 0,
    startDate: '2024-04-10',
    endDate: '2024-07-20',
    manager: 'Engr. Carlos Reyes',
    team: ['Engr. Maria Santos'],
    description: 'Foundation design recommendations for 500-unit residential subdivision.',
    location: 'Antipolo, Rizal'
  },
  {
    id: 'PRJ-2024-005',
    name: 'Bataan Power Plant Environmental Assessment',
    client: 'GNPower Ltd.',
    type: 'Environmental',
    status: 'Ongoing',
    progress: 55,
    startDate: '2024-02-15',
    endDate: '2024-07-15',
    manager: 'Engr. Patricia Lim',
    team: ['Engr. Lisa Garcia', 'Engr. John Cruz', 'Geo. Ana Lim'],
    description: 'Comprehensive environmental impact assessment for power plant expansion project.',
    location: 'Mariveles, Bataan'
  },
  {
    id: 'PRJ-2024-006',
    name: 'Davao City Ground-Penetrating Radar Survey',
    client: 'Davao City Government',
    type: 'Geoscience',
    status: 'Completed',
    progress: 100,
    startDate: '2024-01-20',
    endDate: '2024-03-15',
    manager: 'Engr. Roberto Tan',
    team: ['Geo. Mark Reyes'],
    description: 'GPR survey for underground utility mapping and subsurface investigation.',
    location: 'Davao City, Davao del Sur'
  },
  {
    id: 'PRJ-2024-007',
    name: 'Tagaytay Highlands Geohazard Mapping',
    client: 'Megaworld Corporation',
    type: 'Geohazard',
    status: 'Ongoing',
    progress: 30,
    startDate: '2024-03-01',
    endDate: '2024-08-30',
    manager: 'Engr. Carlos Reyes',
    team: ['Geo. Ana Lim', 'Engr. Mike Torres'],
    description: 'Detailed geohazard mapping and risk assessment for highland development.',
    location: 'Tagaytay, Cavite'
  },
  {
    id: 'PRJ-2024-008',
    name: 'Clark International Airport Expansion Study',
    client: 'Clark Development Corporation',
    type: 'Geotechnical',
    status: 'Pending',
    progress: 0,
    startDate: '2024-04-20',
    endDate: '2024-09-30',
    manager: 'Engr. Patricia Lim',
    team: ['Engr. David Lee', 'Engr. Sarah Cruz'],
    description: 'Geotechnical feasibility study for airport terminal expansion.',
    location: 'Clark Freeport Zone, Pampanga'
  }
];

export const tasks: Task[] = [
  {
    id: 'TSK-001',
    projectId: 'PRJ-2024-001',
    title: 'Complete borehole drilling at Station 15+000',
    description: 'Drill 3 boreholes to 30m depth for soil sampling',
    assignedTo: ['Engr. Maria Santos'],
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-04-05'
  },
  {
    id: 'TSK-002',
    projectId: 'PRJ-2024-001',
    title: 'Laboratory testing - Soil samples Batch A',
    description: 'Conduct sieve analysis, Atterberg limits, and consolidation tests',
    assignedTo: ['Engr. John Cruz'],
    status: 'Completed',
    priority: 'High',
    dueDate: '2024-03-28',
    completedDate: '2024-03-27'
  },
  {
    id: 'TSK-003',
    projectId: 'PRJ-2024-002',
    title: 'Slope stability analysis - Section KM 45-50',
    description: 'Perform limit equilibrium analysis using Slide software',
    assignedTo: ['Engr. Lisa Garcia'],
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-04-10'
  },
  {
    id: 'TSK-004',
    projectId: 'PRJ-2024-003',
    title: 'Hydraulic model calibration',
    description: 'Calibrate HEC-RAS model using historical flood data',
    assignedTo: ['Engr. David Lee'],
    status: 'Overdue',
    priority: 'High',
    dueDate: '2024-03-25'
  },
  {
    id: 'TSK-005',
    projectId: 'PRJ-2024-003',
    title: 'Draft interim report',
    description: 'Prepare interim report for Phase 1 findings',
    assignedTo: ['Engr. Sarah Cruz'],
    status: 'Pending',
    priority: 'Medium',
    dueDate: '2024-04-15'
  },
  {
    id: 'TSK-006',
    projectId: 'PRJ-2024-005',
    title: 'Water quality sampling',
    description: 'Collect water samples from monitoring wells',
    assignedTo: ['Geo. Ana Lim'],
    status: 'In Progress',
    priority: 'Medium',
    dueDate: '2024-04-08'
  },
  {
    id: 'TSK-007',
    projectId: 'PRJ-2024-007',
    title: 'Field reconnaissance survey',
    description: 'Conduct site walk for geohazard identification',
    assignedTo: ['Geo. Ana Lim'],
    status: 'Pending',
    priority: 'Medium',
    dueDate: '2024-04-12'
  },
  {
    id: 'TSK-008',
    projectId: 'PRJ-2024-001',
    title: 'Submit weekly progress report',
    description: 'Compile and submit weekly progress report to client',
    assignedTo: ['Engr. Carlos Reyes'],
    status: 'Pending',
    priority: 'Low',
    dueDate: '2024-04-05'
  },
  {
    id: 'TSK-009',
    projectId: 'PRJ-2024-002',
    title: 'Rock slope mapping',
    description: 'Detailed discontinuity mapping of rock slopes',
    assignedTo: ['Geo. Mark Reyes'],
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-04-07'
  },
  {
    id: 'TSK-010',
    projectId: 'PRJ-2024-005',
    title: 'Air quality monitoring setup',
    description: 'Install air quality monitoring stations',
    assignedTo: ['Engr. John Cruz'],
    status: 'Completed',
    priority: 'Medium',
    dueDate: '2024-03-20',
    completedDate: '2024-03-18'
  }
];

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
];

export const notifications: Notification[] = [
  {
    id: 'NOTIF-001',
    type: 'deadline',
    title: 'Task Overdue',
    message: 'Hydraulic model calibration for Manila Bay Flood Assessment is overdue',
    timestamp: '2024-03-26T09:00:00',
    read: false
  },
  {
    id: 'NOTIF-002',
    type: 'task',
    title: 'Task Completed',
    message: 'Engr. John Cruz completed laboratory testing for MRT-7 project',
    timestamp: '2024-03-27T14:30:00',
    read: false
  },
  {
    id: 'NOTIF-003',
    type: 'project',
    title: 'New Project Assigned',
    message: 'You have been assigned as manager for Clark International Airport Expansion Study',
    timestamp: '2024-03-28T10:15:00',
    read: true
  },
  {
    id: 'NOTIF-004',
    type: 'deadline',
    title: 'Upcoming Deadline',
    message: 'Borehole drilling task due in 2 days for MRT-7 project',
    timestamp: '2024-04-03T08:00:00',
    read: false
  },
  {
    id: 'NOTIF-005',
    type: 'system',
    title: 'System Update',
    message: 'ProjectSync has been updated with new reporting features',
    timestamp: '2024-03-25T16:00:00',
    read: true
  }
];

export const activities: Activity[] = [
  {
    id: 'ACT-001',
    user: 'Engr. Carlos Reyes',
    action: 'updated task status to',
    target: 'Completed - Laboratory testing',
    timestamp: '2024-03-27T14:30:00'
  },
  {
    id: 'ACT-002',
    user: 'Engr. Patricia Lim',
    action: 'created new project',
    target: 'Clark International Airport Expansion Study',
    timestamp: '2024-03-28T10:15:00'
  },
  {
    id: 'ACT-003',
    user: 'Engr. Maria Santos',
    action: 'uploaded document to',
    target: 'MRT-7 Geotechnical Investigation',
    timestamp: '2024-03-28T11:45:00'
  },
  {
    id: 'ACT-004',
    user: 'Geo. Ana Lim',
    action: 'started task',
    target: 'Water quality sampling',
    timestamp: '2024-03-29T08:00:00'
  },
  {
    id: 'ACT-005',
    user: 'Engr. Roberto Tan',
    action: 'submitted report for',
    target: 'Davao City GPR Survey',
    timestamp: '2024-03-26T16:30:00'
  }
];

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
    id: 'USR-TI-1',
    name: 'Engr. Roberto Tan',
    email: 'roberto.tan@geoinnovative.ph',
    role: 'Supervisor',
    avatar: 'RT',
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
    id: 'USR-TECH-1',
    name: 'Engr. Maria Santos',
    email: 'maria.santos@geoinnovative.ph',
    role: 'Staff',
    avatar: 'MS',
    jobPosition: 'Geotechnical Engineer',
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
    id: 'USR-CLI-1',
    name: 'DPWH Region 7',
    email: 'client@dpwh-r7.gov.ph',
    role: 'Client',
    avatar: 'D7',
    clientProjectIds: ['PRJ-2024-002'],
  },
];

// --- Role change requests ---------------------------------------------------
export const roleRequests: RoleRequest[] = [
  {
    id: 'REQ-001',
    requesterId: 'USR-PM-1',
    requesterName: 'Engr. Patricia Lim',
    targetUserId: 'USR-STF-1',
    targetUserName: 'Engr. John Cruz',
    currentRole: 'Staff',
    requestedRole: 'Supervisor',
    reason:
      'John has consistently delivered laboratory results above expectation and is ready for technical responsibility.',
    status: 'Pending',
    createdAt: '2024-04-02T10:30:00',
  },
];

// --- Daily reports ----------------------------------------------------------
export const dailyReports: DailyReport[] = [
  {
    id: 'DRP-001',
    projectId: 'PRJ-2024-001',
    author: 'Engr. Maria Santos',
    content:
      'Drilled 2 of 3 boreholes at Station 15+000 today. Soil samples were collected and properly labeled. No equipment issues.',
    submittedAt: '2024-04-03T17:10:00',
  },
  {
    id: 'DRP-002',
    projectId: 'PRJ-2024-003',
    author: 'Engr. David Lee',
    content:
      'HEC-RAS model calibration in progress. Identified discrepancy in the historical flood dataset, follow-up tomorrow.',
    submittedAt: '2024-04-02T18:45:00',
  },
];

// --- Client portal mock data ------------------------------------------------
export const clientMilestones: ClientMilestone[] = [
  { id: 'MS-1', projectId: 'PRJ-2024-002', name: 'Site Reconnaissance', date: '2024-04-30', status: 'Done' },
  { id: 'MS-2', projectId: 'PRJ-2024-002', name: 'Initial Slope Mapping – Segment A', date: '2024-05-05', status: 'Done' },
  { id: 'MS-3', projectId: 'PRJ-2024-002', name: 'Borehole Drilling & Sampling', date: '2024-05-20', status: 'In Progress' },
  { id: 'MS-4', projectId: 'PRJ-2024-002', name: 'Laboratory Analysis & Risk Zoning', date: '2024-05-30', status: 'Pending' },
  { id: 'MS-5', projectId: 'PRJ-2024-002', name: 'Preliminary Report Submission', date: '2024-06-05', status: 'Pending' },
  { id: 'MS-6', projectId: 'PRJ-2024-002', name: 'Final Report & Endorsement', date: '2024-06-15', status: 'Pending' },
];

export const clientUpdates: ClientUpdate[] = [
  {
    id: 'CU-1',
    projectId: 'PRJ-2024-002',
    authorRole: 'Project Manager',
    kind: 'Report Update',
    date: '2024-05-05',
    body: 'Slope mapping for Segment A has been finalized. Preliminary findings indicate moderate risk zones near km 3. The team is now proceeding with borehole planning for Phase 2 operations scheduled for next week.',
  },
  {
    id: 'CU-2',
    projectId: 'PRJ-2024-002',
    authorRole: 'Field Team',
    kind: 'Field Update',
    date: '2024-04-30',
    body: 'Mobilization completed. Initial site reconnaissance conducted at all three monitoring stations. Equipment has been staged at Site B for upcoming drilling. Weather conditions were favorable throughout the full survey period.',
  },
  {
    id: 'CU-3',
    projectId: 'PRJ-2024-002',
    authorRole: 'Project Manager',
    kind: 'Report Update',
    date: '2024-04-22',
    body: 'Project kick-off meeting was conducted with DPWH Region 7 representatives. Work plan and schedule have been approved by all parties. Site access permits have been secured for all monitoring locations along the Cebu South Road corridor.',
  },
];

export const clientDocuments: ClientDocument[] = [
  { id: 'CD-1', projectId: 'PRJ-2024-002', name: 'Inception Report', type: 'PDF', size: '2.4 MB', sharedAt: '2024-04-15' },
  { id: 'CD-2', projectId: 'PRJ-2024-002', name: 'Site Reconnaissance Photos', type: 'ZIP', size: '18.1 MB', sharedAt: '2024-04-30' },
  { id: 'CD-3', projectId: 'PRJ-2024-002', name: 'Preliminary Slope Assessment – Segment A', type: 'PDF', size: '5.7 MB', sharedAt: '2024-05-05' },
];

// --- Leave requests ---------------------------------------------------------
export const leaveRequests: LeaveRequest[] = [
  {
    id: 'LR-001',
    staffId: 'USR-STF-1',
    staffName: 'Engr. John Cruz',
    type: 'Sick Leave',
    startDate: '2026-05-20',
    endDate: '2026-05-21',
    reason: 'Fever and flu symptoms. Doctor advised 2 days rest.',
    status: 'Pending',
    createdAt: '2026-05-14T08:30:00',
  },
  {
    id: 'LR-002',
    staffId: 'USR-TECH-1',
    staffName: 'Engr. Maria Santos',
    type: 'Vacation Leave',
    startDate: '2026-05-28',
    endDate: '2026-05-30',
    reason: 'Family vacation. All assigned tasks will be completed before leave.',
    status: 'Approved',
    reviewedBy: 'Engr. Roberto Tan',
    reviewedAt: '2026-05-13T14:00:00',
    createdAt: '2026-05-12T09:00:00',
  },
  {
    id: 'LR-003',
    staffId: 'USR-STF-1',
    staffName: 'Engr. John Cruz',
    type: 'Emergency Leave',
    startDate: '2026-04-10',
    endDate: '2026-04-11',
    reason: 'Family emergency — hospital admission.',
    status: 'Approved',
    reviewedBy: 'Engr. Roberto Tan',
    reviewedAt: '2026-04-10T07:30:00',
    createdAt: '2026-04-10T07:00:00',
  },
  {
    id: 'LR-004',
    staffId: 'USR-TECH-1',
    staffName: 'Engr. Maria Santos',
    type: 'Vacation Leave',
    startDate: '2026-03-15',
    endDate: '2026-03-16',
    reason: 'Personal matters.',
    status: 'Denied',
    reviewedBy: 'Engr. Roberto Tan',
    reviewedAt: '2026-03-14T16:00:00',
    createdAt: '2026-03-14T10:00:00',
  },
];

// --- Vehicles ---------------------------------------------------------------
export const vehicles: Vehicle[] = [
  {
    id: 'VEH-001',
    name: 'Field Truck Alpha',
    type: 'Truck',
    plateNumber: 'GSI-1234',
    status: 'Deployed',
    assignedProjectId: 'PRJ-2024-001',
    assignedProjectName: 'MRT-7 Geotechnical Investigation',
    driver: 'Engr. John Cruz',
    lastService: '2026-04-01',
  },
  {
    id: 'VEH-002',
    name: 'Survey Van Beta',
    type: 'Van',
    plateNumber: 'GSI-5678',
    status: 'Available',
    lastService: '2026-03-15',
  },
  {
    id: 'VEH-003',
    name: 'Command SUV Gamma',
    type: 'SUV',
    plateNumber: 'GSI-9012',
    status: 'Deployed',
    assignedProjectId: 'PRJ-2024-002',
    assignedProjectName: 'Cebu South Road Slope Stability Assessment',
    driver: 'Engr. Maria Santos',
    lastService: '2026-02-20',
  },
  {
    id: 'VEH-004',
    name: 'Pickup Delta',
    type: 'Pickup',
    plateNumber: 'GSI-3456',
    status: 'Maintenance',
    lastService: '2026-05-10',
  },
  {
    id: 'VEH-005',
    name: 'Drill Rig Carrier',
    type: 'Heavy Equipment',
    plateNumber: 'GSI-7890',
    status: 'Deployed',
    assignedProjectId: 'PRJ-2024-001',
    assignedProjectName: 'MRT-7 Geotechnical Investigation',
    driver: 'Geo. Mark Reyes',
    lastService: '2026-04-05',
  },
];

// --- Equipment --------------------------------------------------------------
export const equipment: Equipment[] = [
  {
    id: 'EQP-001',
    name: 'Borehole Drill Rig BR-200',
    type: 'Drilling Equipment',
    serialNumber: 'BR200-2023-001',
    status: 'Deployed',
    assignedProjectId: 'PRJ-2024-001',
    assignedProjectName: 'MRT-7 Geotechnical Investigation',
    lastCalibration: '2026-01-10',
  },
  {
    id: 'EQP-002',
    name: 'GPS Unit Trimble R12',
    type: 'Surveying Equipment',
    serialNumber: 'TR12-2022-045',
    status: 'Available',
    lastCalibration: '2026-03-01',
  },
  {
    id: 'EQP-003',
    name: 'Ground Penetrating Radar GSSI',
    type: 'Geophysical Equipment',
    serialNumber: 'GSSI-2021-012',
    status: 'Available',
    lastCalibration: '2026-02-15',
  },
  {
    id: 'EQP-004',
    name: 'Inclinometer Set',
    type: 'Monitoring Equipment',
    serialNumber: 'INC-2020-008',
    status: 'Deployed',
    assignedProjectId: 'PRJ-2024-002',
    assignedProjectName: 'Cebu South Road Slope Stability Assessment',
    lastCalibration: '2025-12-20',
  },
  {
    id: 'EQP-005',
    name: 'Portable Lab Kit A',
    type: 'Laboratory Equipment',
    serialNumber: 'PLK-2023-003',
    status: 'Under Maintenance',
    lastCalibration: '2026-04-01',
  },
  {
    id: 'EQP-006',
    name: 'Total Station Leica TS16',
    type: 'Surveying Equipment',
    serialNumber: 'LTS16-2022-019',
    status: 'Deployed',
    assignedProjectId: 'PRJ-2024-007',
    assignedProjectName: 'Tagaytay Highlands Geohazard Mapping',
    lastCalibration: '2026-03-20',
  },
];

// --- Activity logs ----------------------------------------------------------
export const activityLogs: ActivityLog[] = [
  { id: 'LOG-001', userName: 'Engr. Patricia Lim', userRole: 'PM Supervisor', action: 'Created project', target: 'Clark International Airport Expansion Study', timestamp: '2024-03-28T10:15:00' },
  { id: 'LOG-002', userName: 'Engr. Maria Santos', userRole: 'Staff', action: 'Updated task status to Completed', target: 'Laboratory testing – Soil samples Batch A', timestamp: '2024-03-27T14:30:00' },
  { id: 'LOG-003', userName: 'Engr. Roberto Tan', userRole: 'TI Supervisor', action: 'Assigned staff to project', target: 'Cebu South Road Slope Stability Assessment', timestamp: '2024-03-26T09:00:00' },
  { id: 'LOG-004', userName: 'Engr. Maria Cordero', userRole: 'Administrator', action: 'Created user account', target: 'Engr. John Cruz (Staff)', timestamp: '2024-03-25T11:00:00' },
  { id: 'LOG-005', userName: 'Engr. Jenny Wu', userRole: 'Support Supervisor', action: 'Deployed vehicle to project', target: 'Field Truck Alpha → MRT-7 Investigation', timestamp: '2024-03-25T08:30:00' },
  { id: 'LOG-006', userName: 'Engr. John Cruz', userRole: 'Staff', action: 'Submitted leave request', target: 'Emergency Leave – Apr 10–11', timestamp: '2026-04-10T07:00:00' },
  { id: 'LOG-007', userName: 'Engr. Roberto Tan', userRole: 'TI Supervisor', action: 'Approved leave request', target: 'Engr. John Cruz – Emergency Leave', timestamp: '2026-04-10T07:30:00' },
  { id: 'LOG-008', userName: 'Engr. Carlos Reyes', userRole: 'BD Supervisor', action: 'Created project', target: 'Tagaytay Highlands Geohazard Mapping', timestamp: '2024-03-01T09:00:00' },
  { id: 'LOG-009', userName: 'Geo. Ana Lim', userRole: 'PM Staff', action: 'Created task', target: 'Water quality sampling – Bataan Power Plant', timestamp: '2024-03-20T10:00:00' },
  { id: 'LOG-010', userName: 'Engr. Maria Cordero', userRole: 'Administrator', action: 'Approved role change', target: 'Engr. John Cruz → Supervisor', timestamp: '2026-05-01T15:00:00' },
];

// Add a few client-audience notifications
notifications.push(
  {
    id: 'NOTIF-CLI-1',
    type: 'project',
    title: 'New Report Update Posted',
    message: 'Slope mapping for Segment A finalized. Moderate risk zones near km 3.',
    timestamp: '2024-05-05T15:45:00',
    read: false,
    audience: 'client',
  },
  {
    id: 'NOTIF-CLI-2',
    type: 'task',
    title: 'Document Ready for Download',
    message: 'Preliminary Slope Assessment – Segment A (5.7 MB) is now available.',
    timestamp: '2024-05-05T14:10:00',
    read: false,
    audience: 'client',
  },
  {
    id: 'NOTIF-CLI-3',
    type: 'deadline',
    title: 'Upcoming Milestone – Borehole Drilling',
    message: 'Borehole Drilling & Sampling is scheduled for May 20, 2024.',
    timestamp: '2024-05-08T09:00:00',
    read: false,
    audience: 'client',
  },
);


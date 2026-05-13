export type Role =
  | 'Admin'
  | 'Project Manager'
  | 'Supervisor'
  | 'Staff'
  | 'Client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  jobPosition?: string;
  clientProjectIds?: string[];
}

export interface Project {
  id: string;
  name: string;
  client: string;
  type: 'Geotechnical' | 'Geoscience' | 'Civil Infrastructure' | 'Environmental' | 'Geohazard';
  status: 'Pending' | 'Ongoing' | 'Completed' | 'On Hold';
  progress: number;
  startDate: string;
  endDate: string;
  manager: string;
  assignedPMId?: string;
  team: string[];
  description: string;
  location: string;
  // Optional stage aligned with company business process flow
  stage?:
    | 'Marketing'
    | 'Business Development'
    | 'Project Management'
    | 'Technical Instrumentation'
    | 'Technical Analysis'
    | 'Billing & Collection'
    | 'Archived';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string[];
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  completedDate?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  systemRole?: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'Available' | 'Assigned' | 'On Leave';
  currentProjects: number;
  workload: number;
  assignedProjectIds?: string[];
}

export interface Notification {
  id: string;
  type: 'deadline' | 'task' | 'project' | 'system' | 'approval';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  // 'internal' = for staff/PM/admin/etc, 'client' = for client portal
  audience?: 'internal' | 'client';
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface DashboardStats {
  totalProjects: number;
  ongoingProjects: number;
  completedProjects: number;
  pendingTasks: number;
  totalStaff: number;
  availableStaff: number;
}

export interface RoleRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  targetUserId: string;
  targetUserName: string;
  currentRole: Role;
  requestedRole: Role;
  reason: string;
  status: 'Pending' | 'Approved' | 'Denied';
  createdAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface DailyReport {
  id: string;
  projectId?: string;
  author: string;
  reportType?: 'Daily Field Report' | 'Progress Update' | 'Incident Report' | 'Test Results Summary';
  weatherCondition?: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' | 'N/A';
  manpowerCount?: number;
  content: string;
  issues?: string;
  nextDayPlan?: string;
  attachmentNames?: string[];
  submittedAt: string;
}

export interface ClientUpdate {
  id: string;
  projectId: string;
  authorRole: 'Project Manager' | 'Field Team';
  kind: 'Report Update' | 'Field Update';
  date: string;
  body: string;
}

export interface ClientDocument {
  id: string;
  projectId: string;
  name: string;
  type: 'PDF' | 'ZIP' | 'XLSX';
  size: string;
  sharedAt: string;
}

export interface ClientMilestone {
  id: string;
  projectId: string;
  name: string;
  date: string;
  status: 'Done' | 'In Progress' | 'Pending';
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  type: 'Sick Leave' | 'Vacation Leave' | 'Emergency Leave' | 'Other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Denied';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'Truck' | 'Van' | 'SUV' | 'Pickup' | 'Heavy Equipment' | 'Motorcycle';
  plateNumber: string;
  status: 'Available' | 'Deployed' | 'Maintenance';
  assignedProjectId?: string;
  assignedProjectName?: string;
  driver?: string;
  lastService?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  status: 'Available' | 'Deployed' | 'Under Maintenance';
  assignedProjectId?: string;
  assignedProjectName?: string;
  lastCalibration?: string;
}

export interface ActivityLog {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface ClientInvoice {
  id: string;
  projectId: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  issuedDate: string;
}

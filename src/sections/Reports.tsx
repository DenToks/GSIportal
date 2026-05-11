import { useRef, useState } from 'react';
import {
  Download,
  FileText,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  FolderKanban,
  ClipboardList,
  Plus,
  Paperclip,
  X,
  FileSpreadsheet,
  Cloud,
  Sun,
  CloudRain,
  Wind,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import type { DailyReport, Project, Task } from '@/types';

interface ReportsProps {
  projects: Project[];
  tasks: Task[];
  dailyReports: DailyReport[];
  onSubmitDailyReport: (input: {
    projectId?: string;
    reportType?: DailyReport['reportType'];
    weatherCondition?: DailyReport['weatherCondition'];
    manpowerCount?: number;
    content: string;
    issues?: string;
    nextDayPlan?: string;
    attachmentNames?: string[];
  }) => void;
}

interface GeneratedReport {
  id: string;
  name: string;
  template: string;
  generatedBy: string;
  generatedAt: string;
  format: 'PDF' | 'Excel';
  projectName?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'project' | 'task' | 'staff';
  icon: React.ElementType;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'project-status',
    name: 'Project Status Report',
    description: 'Overview of all projects with their current status and progress',
    type: 'project',
    icon: FolderKanban,
  },
  {
    id: 'task-summary',
    name: 'Task Summary Report',
    description: 'Summary of tasks by status, priority, and assignee',
    type: 'task',
    icon: ClipboardList,
  },
  {
    id: 'staff-workload',
    name: 'Staff Workload Report',
    description: 'Analysis of staff assignments and workload distribution',
    type: 'staff',
    icon: Users,
  },
  {
    id: 'project-timeline',
    name: 'Project Timeline Report',
    description: 'Timeline view of project milestones and deadlines',
    type: 'project',
    icon: Calendar,
  },
  {
    id: 'progress-analysis',
    name: 'Progress Analysis Report',
    description: 'Detailed analysis of project progress and performance metrics',
    type: 'project',
    icon: TrendingUp,
  },
  {
    id: 'task-completion',
    name: 'Task Completion Report',
    description: 'Report on task completion rates and overdue tasks',
    type: 'task',
    icon: BarChart3,
  },
];

const INITIAL_GENERATED: GeneratedReport[] = [
  {
    id: 'RPT-001',
    name: 'Weekly Project Status – March 2024',
    template: 'Project Status Report',
    generatedBy: 'Engr. Patricia Lim',
    generatedAt: '2024-03-28T10:30:00',
    format: 'PDF',
  },
  {
    id: 'RPT-002',
    name: 'Q1 2024 Task Summary',
    template: 'Task Summary Report',
    generatedBy: 'Engr. Carlos Reyes',
    generatedAt: '2024-03-25T14:15:00',
    format: 'Excel',
  },
  {
    id: 'RPT-003',
    name: 'Staff Workload Analysis – March',
    template: 'Staff Workload Report',
    generatedBy: 'Engr. Patricia Lim',
    generatedAt: '2024-03-20T09:00:00',
    format: 'PDF',
  },
];

const WEATHER_ICONS: Record<string, React.ElementType> = {
  Sunny: Sun,
  Cloudy: Cloud,
  Rainy: CloudRain,
  Stormy: Wind,
  'N/A': FileText,
};

const REPORT_TYPE_COLORS: Record<string, string> = {
  'Daily Field Report': 'bg-blue-100 text-blue-700',
  'Progress Update': 'bg-green-100 text-green-700',
  'Incident Report': 'bg-red-100 text-red-700',
  'Test Results Summary': 'bg-purple-100 text-purple-700',
};

const EMPTY_REPORT_FORM = {
  projectId: 'none',
  reportType: 'Daily Field Report' as DailyReport['reportType'],
  weatherCondition: 'Sunny' as DailyReport['weatherCondition'],
  manpowerCount: '' as string | number,
  content: '',
  issues: '',
  nextDayPlan: '',
  attachmentNames: [] as string[],
};

export function Reports({ projects, tasks, dailyReports, onSubmitDailyReport }: ReportsProps) {
  const [dateRange, setDateRange] = useState('this-month');
  const [projectFilter, setProjectFilter] = useState('all');

  // Daily report dialog
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_REPORT_FORM);
  const [reportError, setReportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof typeof EMPTY_REPORT_FORM>(
    key: K,
    value: (typeof EMPTY_REPORT_FORM)[K],
  ) => setForm(prev => ({ ...prev, [key]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(e.target.files ?? []).map(f => f.name);
    setField('attachmentNames', [...form.attachmentNames, ...names]);
    e.target.value = '';
  };

  const removeAttachment = (name: string) => {
    setField('attachmentNames', form.attachmentNames.filter(n => n !== name));
  };

  const submitDailyReport = () => {
    if (!form.content.trim()) {
      setReportError('Work accomplished field is required.');
      return;
    }
    onSubmitDailyReport({
      projectId: form.projectId === 'none' ? undefined : form.projectId,
      reportType: form.reportType,
      weatherCondition: form.weatherCondition,
      manpowerCount: form.manpowerCount === '' ? undefined : Number(form.manpowerCount),
      content: form.content.trim(),
      issues: form.issues.trim() || undefined,
      nextDayPlan: form.nextDayPlan.trim() || undefined,
      attachmentNames: form.attachmentNames.length ? form.attachmentNames : undefined,
    });
    setForm(EMPTY_REPORT_FORM);
    setReportError('');
    setReportDialogOpen(false);
  };

  // Generated reports — dynamic state
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(INITIAL_GENERATED);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [genFormat, setGenFormat] = useState<'PDF' | 'Excel'>('PDF');
  const [genProjectId, setGenProjectId] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const openGenerateDialog = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setGenFormat('PDF');
    setGenProjectId('all');
    setGenerateDialogOpen(true);
  };

  const confirmGenerate = async () => {
    if (!selectedTemplate) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    setGenerating(false);
    const proj = genProjectId !== 'all' ? projects.find(p => p.id === genProjectId) : null;
    const dateLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const newReport: GeneratedReport = {
      id: `RPT-${Date.now()}`,
      name: `${selectedTemplate.name}${proj ? ` – ${proj.name}` : ''} (${dateLabel})`,
      template: selectedTemplate.name,
      generatedBy: 'Current User',
      generatedAt: new Date().toISOString(),
      format: genFormat,
      projectName: proj?.name,
    };
    setGeneratedReports(prev => [newReport, ...prev]);
    setGenerateDialogOpen(false);
  };

  const simulateDownload = (id: string) => {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 2000);
  };

  const projectName = (id?: string) =>
    id ? projects.find(p => p.id === id)?.name ?? id : 'General';

  const projectStats = {
    byStatus: {
      ongoing: projects.filter(p => p.status === 'Ongoing').length,
      completed: projects.filter(p => p.status === 'Completed').length,
      pending: projects.filter(p => p.status === 'Pending').length,
      onHold: projects.filter(p => p.status === 'On Hold').length,
    },
  };

  const taskStats = {
    byStatus: {
      completed: tasks.filter(t => t.status === 'Completed').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      overdue: tasks.filter(t => t.status === 'Overdue').length,
    },
    byPriority: {
      high: tasks.filter(t => t.priority === 'High').length,
      medium: tasks.filter(t => t.priority === 'Medium').length,
      low: tasks.filter(t => t.priority === 'Low').length,
    },
  };

  const avgProgress = projects.length
    ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)
    : 0;

  const filteredDailyReports = projectFilter === 'all'
    ? dailyReports
    : dailyReports.filter(r => r.projectId === projectFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
          <p className="text-slate-500">Generate, submit, and download project reports.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setForm(EMPTY_REPORT_FORM); setReportError(''); setReportDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Submit Daily Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-xs text-slate-500">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-green-600" />
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
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgProgress}%</p>
                <p className="text-xs text-slate-500">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{taskStats.byStatus.overdue}</p>
                <p className="text-xs text-slate-500">Overdue Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="this-quarter">This Quarter</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <div key={template.id} className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800">{template.name}</h4>
                      <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                      <Badge variant="outline" className="text-xs mt-2">{template.type}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => openGenerateDialog(template)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recently Generated Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recently Generated Reports</CardTitle>
            <Badge variant="outline" className="text-xs">{generatedReports.length} reports</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {generatedReports.map((report) => {
              const isDownloaded = downloadedId === report.id;
              const FormatIcon = report.format === 'Excel' ? FileSpreadsheet : FileText;
              const iconBg = report.format === 'Excel' ? 'bg-green-100' : 'bg-red-100';
              const iconColor = report.format === 'Excel' ? 'text-green-600' : 'text-red-600';
              return (
                <div key={report.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <FormatIcon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{report.name}</h4>
                      <p className="text-sm text-slate-500">{report.template} • {report.generatedBy}</p>
                      <p className="text-xs text-slate-400">{new Date(report.generatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={report.format === 'Excel' ? 'text-green-700 border-green-300' : 'text-red-700 border-red-300'}>
                      {report.format}
                    </Badge>
                    <Button
                      variant={isDownloaded ? 'default' : 'ghost'}
                      size="sm"
                      className={isDownloaded ? 'bg-green-600 hover:bg-green-600 text-white' : ''}
                      onClick={() => simulateDownload(report.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isDownloaded ? 'Downloaded!' : 'Download'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Daily Reports Submitted</CardTitle>
            <Badge variant="outline" className="text-xs">{filteredDailyReports.length} total</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDailyReports.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              No daily reports submitted yet.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDailyReports.map((r) => {
                const WeatherIcon = r.weatherCondition ? (WEATHER_ICONS[r.weatherCondition] ?? FileText) : null;
                return (
                  <div key={r.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-700">
                            {r.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{r.author}</p>
                          <p className="text-xs text-blue-600">{projectName(r.projectId)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {r.reportType && (
                          <Badge className={`text-xs ${REPORT_TYPE_COLORS[r.reportType] ?? 'bg-gray-100 text-gray-700'}`}>
                            {r.reportType}
                          </Badge>
                        )}
                        <span className="text-xs text-slate-400">{new Date(r.submittedAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Meta row */}
                    {(r.weatherCondition || r.manpowerCount !== undefined) && (
                      <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
                        {r.weatherCondition && WeatherIcon && (
                          <span className="flex items-center gap-1">
                            <WeatherIcon className="w-3.5 h-3.5" />
                            {r.weatherCondition}
                          </span>
                        )}
                        {r.manpowerCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {r.manpowerCount} personnel
                          </span>
                        )}
                      </div>
                    )}

                    {/* Work accomplished */}
                    <div className="mb-2">
                      <p className="text-xs font-medium text-slate-500 mb-1">Work Accomplished</p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{r.content}</p>
                    </div>

                    {/* Issues */}
                    {r.issues && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-red-500 mb-1">Issues / Blockers</p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{r.issues}</p>
                      </div>
                    )}

                    {/* Next day plan */}
                    {r.nextDayPlan && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-green-600 mb-1">Next Day Plan</p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{r.nextDayPlan}</p>
                      </div>
                    )}

                    {/* Attachments */}
                    {r.attachmentNames && r.attachmentNames.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {r.attachmentNames.map(name => (
                          <span key={name} className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            <Paperclip className="w-3 h-3" />
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Projects by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Ongoing', count: projectStats.byStatus.ongoing, color: 'bg-blue-500' },
                { label: 'Completed', count: projectStats.byStatus.completed, color: 'bg-green-500' },
                { label: 'Pending', count: projectStats.byStatus.pending, color: 'bg-amber-500' },
                { label: 'On Hold', count: projectStats.byStatus.onHold, color: 'bg-gray-400' },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 w-24">{label}</span>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full`}
                        style={{ width: projects.length ? `${(count / projects.length) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'High', count: taskStats.byPriority.high, color: 'bg-red-500' },
                { label: 'Medium', count: taskStats.byPriority.medium, color: 'bg-amber-500' },
                { label: 'Low', count: taskStats.byPriority.low, color: 'bg-green-500' },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 w-24">{label} Priority</span>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full`}
                        style={{ width: tasks.length ? `${(count / tasks.length) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Daily Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Daily Report</DialogTitle>
            <DialogDescription>
              Document the work performed today. Visible to your team and project manager.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Row 1: Project + Report Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Project</Label>
                <Select value={form.projectId} onValueChange={v => setField('projectId', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">General (no specific project)</SelectItem>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Report Type</Label>
                <Select value={form.reportType} onValueChange={v => setField('reportType', v as DailyReport['reportType'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily Field Report">Daily Field Report</SelectItem>
                    <SelectItem value="Progress Update">Progress Update</SelectItem>
                    <SelectItem value="Incident Report">Incident Report</SelectItem>
                    <SelectItem value="Test Results Summary">Test Results Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Weather + Manpower */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Weather Condition</Label>
                <Select value={form.weatherCondition} onValueChange={v => setField('weatherCondition', v as DailyReport['weatherCondition'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sunny">☀️ Sunny</SelectItem>
                    <SelectItem value="Cloudy">☁️ Cloudy</SelectItem>
                    <SelectItem value="Rainy">🌧️ Rainy</SelectItem>
                    <SelectItem value="Stormy">⛈️ Stormy</SelectItem>
                    <SelectItem value="N/A">N/A (Office Work)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="manpower">Manpower Count</Label>
                <Input
                  id="manpower"
                  type="number"
                  min={0}
                  value={form.manpowerCount}
                  onChange={e => setField('manpowerCount', e.target.value)}
                  placeholder="e.g. 8"
                />
              </div>
            </div>

            {/* Work accomplished */}
            <div className="space-y-1.5">
              <Label htmlFor="report-content">
                Work Accomplished <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="report-content"
                rows={4}
                placeholder="Describe today's accomplishments, activities, and tasks completed..."
                value={form.content}
                onChange={e => setField('content', e.target.value)}
              />
              {reportError && <p className="text-xs text-red-600">{reportError}</p>}
            </div>

            {/* Issues */}
            <div className="space-y-1.5">
              <Label htmlFor="issues">Issues / Blockers</Label>
              <Textarea
                id="issues"
                rows={2}
                placeholder="Any problems encountered, delays, or blockers..."
                value={form.issues}
                onChange={e => setField('issues', e.target.value)}
              />
            </div>

            {/* Next day plan */}
            <div className="space-y-1.5">
              <Label htmlFor="nextday">Next Day Plan</Label>
              <Textarea
                id="nextday"
                rows={2}
                placeholder="Planned activities for tomorrow..."
                value={form.nextDayPlan}
                onChange={e => setField('nextDayPlan', e.target.value)}
              />
            </div>

            {/* Attachments */}
            <div className="space-y-1.5">
              <Label>Attachments</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.attachmentNames.map(name => (
                  <span key={name} className="flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full border border-slate-200">
                    <Paperclip className="w-3 h-3 flex-shrink-0" />
                    <span className="max-w-[140px] truncate">{name}</span>
                    <button type="button" onClick={() => removeAttachment(name)} className="ml-1 text-slate-400 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-4 h-4 mr-2" />
                Attach Files (PDF, Excel, Images…)
              </Button>
              <p className="text-xs text-slate-400 mt-1">Accepted: PDF, Excel, Word, JPG, PNG</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={submitDailyReport}>
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.name} — configure export options.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Project Filter</Label>
              <Select value={genProjectId} onValueChange={setGenProjectId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Export Format</Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGenFormat('PDF')}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${genFormat === 'PDF' ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <FileText className={`w-6 h-6 ${genFormat === 'PDF' ? 'text-red-600' : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${genFormat === 'PDF' ? 'text-red-700' : 'text-slate-600'}`}>PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGenFormat('Excel')}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${genFormat === 'Excel' ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <FileSpreadsheet className={`w-6 h-6 ${genFormat === 'Excel' ? 'text-green-600' : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${genFormat === 'Excel' ? 'text-green-700' : 'text-slate-600'}`}>Excel</span>
                </button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={confirmGenerate} disabled={generating}>
              {generating ? 'Generating…' : 'Generate & Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

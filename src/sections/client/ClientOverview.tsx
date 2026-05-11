import {
  Calendar,
  Users,
  MapPin,
  TrendingUp,
  Lock,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { clientMilestones } from '@/data/sampleData';
import type { Project } from '@/types';

interface ClientOverviewProps {
  project: Project;
}

const milestoneTagColor = (status: string) => {
  switch (status) {
    case 'Done':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'In Progress':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

const milestoneDot = (status: string) => {
  switch (status) {
    case 'Done':
      return 'bg-blue-600 text-white';
    case 'In Progress':
      return 'bg-green-600 text-white ring-4 ring-green-100';
    default:
      return 'bg-slate-300 text-white';
  }
};

export function ClientOverview({ project }: ClientOverviewProps) {
  const milestones = clientMilestones.filter((m) => m.projectId === project.id);
  const doneCount = milestones.filter((m) => m.status === 'Done').length;

  return (
    <div className="space-y-6">
      {/* Project Banner */}
      <div className="rounded-xl bg-gradient-to-br from-[#0f172a] to-[#162340] p-6 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full border-[40px] border-blue-500/10 pointer-events-none"></div>
        <div className="absolute right-16 -bottom-12 w-28 h-28 rounded-full border-[30px] border-blue-500/5 pointer-events-none"></div>
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-semibold tracking-[1px] text-slate-400 uppercase mb-1">
              {project.id} · Your Assigned Project
            </p>
            <h1 className="text-xl font-extrabold text-white leading-tight">{project.name}</h1>
            <p className="text-sm text-slate-400 mt-1">
              Client: <span className="text-white/80 font-semibold">{project.client}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-green-500/20 border border-green-400/30 text-green-300">
              {project.status}
            </Badge>
            <Badge className="bg-amber-500/20 border border-amber-400/30 text-amber-300">
              <Lock className="w-3 h-3 mr-1" />
              Read-Only
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{project.progress}%</p>
                <p className="text-xs text-slate-500">Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-base font-bold">
                  {new Date(project.endDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-500">Deadline</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{project.team.length}</p>
                <p className="text-xs text-slate-500">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-base font-bold">{project.location.split(',')[0]}</p>
                <p className="text-xs text-slate-500">Location</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Overall Project Progress</CardTitle>
            <span className="text-2xl font-bold text-blue-600">{project.progress}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={project.progress} className="h-3" />
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>Start</span>
            <span>Completion</span>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Project Milestones</CardTitle>
            <span className="text-xs text-slate-500">
              {doneCount} of {milestones.length} completed
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative pl-7">
            <div className="absolute left-[10px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-blue-500 via-blue-500 to-slate-200"></div>
            <ul className="space-y-3">
              {milestones.map((m) => (
                <li key={m.id} className="flex items-start gap-3 relative">
                  <div
                    className={`absolute -left-7 top-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${milestoneDot(
                      m.status,
                    )}`}
                  >
                    {m.status === 'Done' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : m.status === 'In Progress' ? (
                      <Clock className="w-3 h-3" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        m.status === 'Pending' ? 'text-slate-500 font-normal' : 'text-slate-800'
                      }`}
                    >
                      {m.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {m.status === 'Done' ? 'Completed' : 'Due'}{' '}
                      {new Date(m.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className={milestoneTagColor(m.status)}>
                    {m.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Project Scope */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Project Scope</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}

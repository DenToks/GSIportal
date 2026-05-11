import { Lock, Mail, Phone, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Project } from '@/types';

interface ClientTeamProps {
  project: Project;
}

export function ClientTeam({ project }: ClientTeamProps) {
  const allMembers = [project.manager, ...project.team];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Project Team</h1>
        <p className="text-slate-500">Personnel assigned to your project.</p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2 text-sm text-amber-900">
        <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>
          <strong>View Only:</strong> You may view assigned personnel. Contact your Project
          Manager for any changes.
        </p>
      </div>

      <div className="space-y-3">
        {allMembers.map((name, idx) => {
          const isManager = idx === 0;
          const initials = name
            .replace(/^(Engr\.|Geo\.|Dr\.)\s*/i, '')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
          return (
            <Card key={`${name}-${idx}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-11 h-11">
                    <AvatarFallback
                      className={
                        isManager
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold'
                          : 'bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold'
                      }
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{name}</p>
                    <p className="text-xs text-slate-500">
                      {isManager ? 'Project Manager' : 'Team Member'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {allMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No team members assigned yet</p>
          </div>
        )}
      </div>

      <Card className="bg-slate-50">
        <CardContent className="p-4 text-sm text-slate-600 leading-relaxed">
          <strong className="text-slate-800">Need to reach us?</strong>
          <br />
          Contact your Project Manager at{' '}
          <a href="mailto:projects@geoinnovative.com" className="text-blue-600 font-semibold">
            <Mail className="w-3 h-3 inline mr-1" />
            projects@geoinnovative.com
          </a>{' '}
          or call{' '}
          <a href="#" className="text-blue-600 font-semibold">
            <Phone className="w-3 h-3 inline mr-1" />
            +63 2 8XXX XXXX
          </a>
          . We typically respond within 1 business day.
          <br />
          <span className="text-xs text-slate-400 mt-2 block">
            Project: {project.name} · {project.client}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

import { Lock, FileText, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { clientUpdates } from '@/data/sampleData';
import type { Project } from '@/types';

interface ClientUpdatesProps {
  project: Project;
}

export function ClientUpdates({ project }: ClientUpdatesProps) {
  const updates = clientUpdates.filter((u) => u.projectId === project.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Project Updates</h1>
        <p className="text-slate-500">
          Latest field and management reports from the project team.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2 text-sm text-amber-900">
        <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>
          <strong>View Only:</strong> You can read project updates but cannot post or modify any
          data. Contact your project manager for concerns.
        </p>
      </div>

      <div className="space-y-3">
        {updates.map((u) => {
          const isReport = u.kind === 'Report Update';
          return (
            <Card
              key={u.id}
              className="border-l-4"
              style={{ borderLeftColor: isReport ? '#2563EB' : '#16A34A' }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isReport ? 'bg-blue-100' : 'bg-green-100'
                      }`}
                    >
                      {isReport ? (
                        <FileText className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Wrench className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{u.authorRole}</p>
                      <p
                        className={`text-xs font-semibold ${
                          isReport ? 'text-blue-600' : 'text-green-600'
                        }`}
                      >
                        {u.kind}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(u.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{u.body}</p>
              </CardContent>
            </Card>
          );
        })}

        {updates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No project updates yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Lock, Download, FileText, FileArchive, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { clientDocuments } from '@/data/sampleData';
import type { ClientDocument, Project } from '@/types';

interface ClientDocumentsPageProps {
  project: Project;
}

const docIcon = (type: ClientDocument['type']) => {
  switch (type) {
    case 'PDF':
      return { icon: FileText, color: 'bg-red-100 text-red-700' };
    case 'ZIP':
      return { icon: FileArchive, color: 'bg-blue-100 text-blue-700' };
    case 'XLSX':
      return { icon: FileSpreadsheet, color: 'bg-green-100 text-green-700' };
  }
};

export function ClientDocumentsPage({ project }: ClientDocumentsPageProps) {
  const docs = clientDocuments.filter((d) => d.projectId === project.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Documents</h1>
        <p className="text-slate-500">Official project deliverables shared with your organization.</p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2 text-sm text-amber-900">
        <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>
          <strong>View Only:</strong> You may download shared documents. Uploading or editing
          files is restricted to authorized project personnel.
        </p>
      </div>

      <div className="space-y-3">
        {docs.map((d) => {
          const meta = docIcon(d.type);
          const Icon = meta.icon;
          return (
            <Card key={d.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${meta.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800">{d.name}</h4>
                    <p className="text-sm text-slate-500">
                      Shared {new Date(d.sharedAt).toLocaleDateString()} · {d.size} · {d.type}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {docs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No documents have been shared yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

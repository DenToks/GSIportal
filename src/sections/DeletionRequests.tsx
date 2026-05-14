import { useState } from 'react';
import { Trash2, CheckCircle2, XCircle, Clock, FolderKanban } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { DeletionRequest, User } from '@/types';

interface DeletionRequestsProps {
  requests: DeletionRequest[];
  currentUser: User;
  onApprove: (requestId: string) => void;
  onDeny: (requestId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
    case 'Denied':   return 'bg-red-100 text-red-700 border-red-200';
    default:         return 'bg-amber-100 text-amber-700 border-amber-200';
  }
};

export function DeletionRequests({ requests, onApprove, onDeny }: DeletionRequestsProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [confirmTarget, setConfirmTarget] = useState<DeletionRequest | null>(null);

  const filtered = requests.filter(r => filterStatus === 'all' || r.status === filterStatus);
  const pending = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Deletion Requests</h1>
        <p className="text-slate-500">Review requests to delete projects you created.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
          <div><p className="text-2xl font-bold">{pending}</p><p className="text-xs text-slate-500">Pending</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-2xl font-bold">{requests.filter(r => r.status === 'Approved').length}</p><p className="text-xs text-slate-500">Approved</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><XCircle className="w-5 h-5 text-red-600" /></div>
          <div><p className="text-2xl font-bold">{requests.filter(r => r.status === 'Denied').length}</p><p className="text-xs text-slate-500">Denied</p></div>
        </CardContent></Card>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'Pending', 'Approved', 'Denied'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterStatus === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Trash2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No deletion requests yet.</p>
          </div>
        )}
        {filtered.map(req => (
          <Card key={req.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                    <FolderKanban className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-slate-800">{req.projectName}</p>
                      <Badge variant="outline" className={getStatusColor(req.status)}>{req.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">
                      Requested by <span className="font-medium">{req.requesterName}</span>
                      <span className="text-slate-400 ml-1">({req.requesterRole})</span>
                    </p>
                    <p className="text-sm text-slate-500 bg-slate-50 rounded p-2 mt-1">"{req.reason}"</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(req.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {req.status === 'Pending' && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => onDeny(req.id)}>
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Deny
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setConfirmTarget(req)}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Final confirm before approving (deletion is irreversible) */}
      <Dialog open={!!confirmTarget} onOpenChange={() => setConfirmTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Approve Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-2">
            <p className="text-sm text-slate-700">
              Approving will permanently delete <span className="font-semibold">{confirmTarget?.projectName}</span> and all its tasks.
            </p>
            <p className="text-xs text-slate-400">This cannot be undone.</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmTarget(null)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => {
              if (confirmTarget) { onApprove(confirmTarget.id); setConfirmTarget(null); }
            }}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

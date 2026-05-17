import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, CalendarOff, User } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { LeaveRequest, User as UserType } from '@/types';

interface LeaveRequestsProps {
  leaveRequests: LeaveRequest[];
  currentUser: UserType;
  onResolve: (id: string, decision: 'Approved' | 'Denied') => void;
  onMarkReturned: (staffName: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
    case 'Denied':   return 'bg-red-100 text-red-700 border-red-200';
    default:         return 'bg-amber-100 text-amber-700 border-amber-200';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Sick Leave':       return 'bg-red-50 text-red-600';
    case 'Vacation Leave':   return 'bg-blue-50 text-blue-600';
    case 'Emergency Leave':  return 'bg-orange-50 text-orange-600';
    default:                 return 'bg-slate-50 text-slate-600';
  }
};

function formatDateRange(start: string, end: string) {
  const s = new Date(start).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  const e = new Date(end).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  return start === end ? s : `${s} – ${e}`;
}

function daysBetween(start: string, end: string) {
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.round(diff) + 1);
}

export function LeaveRequests({ leaveRequests, onResolve, onMarkReturned }: LeaveRequestsProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reviewTarget, setReviewTarget] = useState<LeaveRequest | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [markReturnedTarget, setMarkReturnedTarget] = useState<string | null>(null);

  const filtered = leaveRequests.filter(r =>
    filterStatus === 'all' || r.status === filterStatus
  );

  const pending  = leaveRequests.filter(r => r.status === 'Pending').length;
  const approved = leaveRequests.filter(r => r.status === 'Approved').length;
  const denied   = leaveRequests.filter(r => r.status === 'Denied').length;

  const handleDecision = (decision: 'Approved' | 'Denied') => {
    if (!reviewTarget) return;
    onResolve(reviewTarget.id, decision);
    setReviewTarget(null);
    setReviewNote('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Leave Requests</h1>
        <p className="text-slate-500">Review and manage staff leave requests.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div><p className="text-2xl font-bold">{pending}</p><p className="text-xs text-slate-500">Pending</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div><p className="text-2xl font-bold">{approved}</p><p className="text-xs text-slate-500">Approved</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div><p className="text-2xl font-bold">{denied}</p><p className="text-xs text-slate-500">Denied</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'Pending', 'Approved', 'Denied'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterStatus === s
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(req => (
          <Card key={req.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-slate-800">{req.staffName}</p>
                      <Badge className={getTypeColor(req.type)}>{req.type}</Badge>
                      <Badge variant="outline" className={getStatusColor(req.status)}>{req.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 flex items-center gap-1 mb-1">
                      <CalendarOff className="w-3.5 h-3.5" />
                      {formatDateRange(req.startDate, req.endDate)}
                      <span className="text-slate-400 ml-1">({daysBetween(req.startDate, req.endDate)} day{daysBetween(req.startDate, req.endDate) > 1 ? 's' : ''})</span>
                    </p>
                    <p className="text-sm text-slate-500">{req.reason}</p>
                    {req.reviewedBy && (
                      <p className="text-xs text-slate-400 mt-1">
                        Reviewed by {req.reviewedBy} on {new Date(req.reviewedAt!).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {req.status === 'Pending' && (
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setReviewTarget(req)}
                    >
                      Review
                    </Button>
                  </div>
                )}
                {req.status === 'Approved' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => setMarkReturnedTarget(req.staffName)}
                    title="Mark staff as returned from leave"
                  >
                    Mark Returned
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <CalendarOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No {filterStatus === 'all' ? '' : filterStatus.toLowerCase()} leave requests.</p>
          </div>
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={!!reviewTarget} onOpenChange={() => setReviewTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Leave Request</DialogTitle>
          </DialogHeader>
          {reviewTarget && (
            <div className="space-y-4 py-2">
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="font-medium text-slate-800">{reviewTarget.staffName}</p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">{reviewTarget.type}</span> —{' '}
                  {formatDateRange(reviewTarget.startDate, reviewTarget.endDate)}
                  {' '}({daysBetween(reviewTarget.startDate, reviewTarget.endDate)} day{daysBetween(reviewTarget.startDate, reviewTarget.endDate) > 1 ? 's' : ''})
                </p>
                <p className="text-sm text-slate-500">{reviewTarget.reason}</p>
              </div>
              <div className="space-y-1.5">
                <Label>Review Note (optional)</Label>
                <Textarea
                  value={reviewNote}
                  onChange={e => setReviewNote(e.target.value)}
                  placeholder="Add a note for the staff member..."
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewTarget(null)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleDecision('Denied')}>
              <XCircle className="w-4 h-4 mr-1" /> Deny
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleDecision('Approved')}>
              <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Returned Confirmation */}
      <Dialog open={!!markReturnedTarget} onOpenChange={() => setMarkReturnedTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Staff Returned</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <div className="bg-slate-50 rounded-lg p-3 text-sm">
              <p className="text-slate-500 text-xs mb-1">Staff Member</p>
              <p className="font-medium text-slate-800">{markReturnedTarget}</p>
            </div>
            <p className="text-sm text-slate-600">
              Confirm that <span className="font-medium">{markReturnedTarget}</span> has returned from leave? Their status will be set back to Available.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkReturnedTarget(null)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              if (markReturnedTarget) onMarkReturned(markReturnedTarget);
              setMarkReturnedTarget(null);
            }}>
              Confirm Returned
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

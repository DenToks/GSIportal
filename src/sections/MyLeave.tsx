import { useState } from 'react';
import { Plus, CalendarOff, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { LeaveRequest, User } from '@/types';

interface MyLeaveProps {
  leaveRequests: LeaveRequest[];
  currentUser: User;
  onSubmit: (req: LeaveRequest) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
    case 'Denied':   return 'bg-red-100 text-red-700 border-red-200';
    default:         return 'bg-amber-100 text-amber-700 border-amber-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Approved': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case 'Denied':   return <XCircle className="w-4 h-4 text-red-600" />;
    default:         return <Clock className="w-4 h-4 text-amber-600" />;
  }
};

function formatDateRange(start: string, end: string) {
  const s = new Date(start).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  const e = new Date(end).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  return start === end ? s : `${s} – ${e}`;
}

const EMPTY_FORM = {
  type: 'Sick Leave' as LeaveRequest['type'],
  startDate: '',
  endDate: '',
  reason: '',
};

export function MyLeave({ leaveRequests, currentUser, onSubmit }: MyLeaveProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  // Only show this user's leave requests
  const myRequests = leaveRequests.filter(r => r.staffId === currentUser.id);

  const pending  = myRequests.filter(r => r.status === 'Pending').length;
  const approved = myRequests.filter(r => r.status === 'Approved').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: LeaveRequest = {
      id: `LR-${Date.now()}`,
      staffId: currentUser.id,
      staffName: currentUser.name,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate || form.startDate,
      reason: form.reason,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    onSubmit(newReq);
    setForm(EMPTY_FORM);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leave Requests</h1>
          <p className="text-slate-500">Submit and track your leave applications.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarOff className="w-5 h-5 text-blue-600" />
            </div>
            <div><p className="text-2xl font-bold">{myRequests.length}</p><p className="text-xs text-slate-500">Total</p></div>
          </CardContent>
        </Card>
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
      </div>

      {/* List */}
      <div className="space-y-3">
        {myRequests.length === 0 && (
          <div className="text-center py-12">
            <CalendarOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No leave requests yet</p>
            <p className="text-slate-400 text-sm mt-1">Click "+ New Request" to file a leave.</p>
          </div>
        )}
        {myRequests.map(req => (
          <Card key={req.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(req.status)}
                    <span className="font-semibold text-slate-800">{req.type}</span>
                    <Badge variant="outline" className={getStatusColor(req.status)}>{req.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">
                    {formatDateRange(req.startDate, req.endDate)}
                  </p>
                  <p className="text-sm text-slate-500">{req.reason}</p>
                  {req.reviewedBy && (
                    <p className="text-xs text-slate-400 mt-1">
                      {req.status} by {req.reviewedBy} on {new Date(req.reviewedAt!).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <p className="text-xs text-slate-400 shrink-0">
                  Filed {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>File Leave Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Leave Type</Label>
              <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as LeaveRequest['type'] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Vacation Leave">Vacation Leave</SelectItem>
                  <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="start-date">Start Date <span className="text-red-500">*</span></Label>
                <Input
                  id="start-date"
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={form.endDate}
                  min={form.startDate}
                  onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reason">Reason <span className="text-red-500">*</span></Label>
              <Textarea
                id="reason"
                value={form.reason}
                onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                placeholder="Briefly explain your reason for leave..."
                rows={3}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

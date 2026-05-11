import { useMemo, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { RoleRequest, User } from '@/types';

interface ApprovalsProps {
  requests: RoleRequest[];
  currentUser: User;
  onResolve: (requestId: string, decision: 'Approved' | 'Denied') => void;
}

const statusBadge = (status: RoleRequest['status']) => {
  switch (status) {
    case 'Pending':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Approved':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Denied':
      return 'bg-red-100 text-red-700 border-red-200';
  }
};

export function Approvals({ requests, currentUser, onResolve }: ApprovalsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return requests.filter((r) => {
      const matchSearch =
        r.requesterName.toLowerCase().includes(q) ||
        r.targetUserName.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'Pending').length,
    approved: requests.filter((r) => r.status === 'Approved').length,
    denied: requests.filter((r) => r.status === 'Denied').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Approvals</h1>
          <p className="text-slate-500">
            Review and act on role change requests submitted by managers and supervisors.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Requests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-xs text-slate-500">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.denied}</p>
              <p className="text-xs text-slate-500">Denied</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by requester, target user, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Denied">Denied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Target User</TableHead>
                <TableHead>Role Change</TableHead>
                <TableHead className="w-[280px]">Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((req) => {
                const isSelfRequested = req.requesterId === currentUser.id;
                const isPending = req.status === 'Pending';
                return (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="font-medium text-slate-800">{req.requesterName}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(req.createdAt).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">{req.targetUserName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-slate-100 text-slate-700">
                          {req.currentRole}
                        </Badge>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          {req.requestedRole}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      <p className="line-clamp-2">{req.reason}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge(req.status)}>
                        {req.status}
                      </Badge>
                      {req.status !== 'Pending' && req.resolvedBy && (
                        <div className="text-xs text-slate-400 mt-1">by {req.resolvedBy}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={isSelfRequested}
                            title={
                              isSelfRequested
                                ? 'You cannot approve your own request'
                                : 'Approve request'
                            }
                            onClick={() => onResolve(req.id, 'Approved')}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => onResolve(req.id, 'Denied')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Deny
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Resolved</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600">No requests found</h3>
              <p className="text-slate-500">
                Role change requests submitted from the Staff page will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

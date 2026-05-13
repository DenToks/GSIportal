import { Receipt, CheckCircle2, Clock, AlertCircle, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ClientInvoice, Project } from '@/types';

interface ClientInvoicesProps {
  project: Project;
  invoices: ClientInvoice[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid':    return 'bg-green-100 text-green-700 border-green-200';
    case 'Unpaid':  return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
    default:        return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Paid':    return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case 'Unpaid':  return <Clock className="w-4 h-4 text-amber-600" />;
    case 'Overdue': return <AlertCircle className="w-4 h-4 text-red-600" />;
    default:        return null;
  }
};

const formatPeso = (amount: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

export function ClientInvoicesPage({ project, invoices }: ClientInvoicesProps) {
  const projectInvoices = invoices.filter(inv => inv.projectId === project.id);

  const total = projectInvoices.reduce((s, inv) => s + inv.amount, 0);
  const paid  = projectInvoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const unpaid = total - paid;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Invoices</h1>
        <p className="text-slate-500">{project.name}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 mb-1">Total Contract</p>
            <p className="text-xl font-bold text-slate-800">{formatPeso(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 mb-1">Paid</p>
            <p className="text-xl font-bold text-green-600">{formatPeso(paid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 mb-1">Outstanding</p>
            <p className="text-xl font-bold text-amber-600">{formatPeso(unpaid)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice list */}
      <div className="space-y-3">
        {projectInvoices.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No invoices available yet.</p>
          </div>
        )}
        {projectInvoices.map(inv => (
          <Card key={inv.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Receipt className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-800">{inv.invoiceNumber}</p>
                      <Badge variant="outline" className={getStatusColor(inv.status)}>
                        <span className="flex items-center gap-1">{getStatusIcon(inv.status)}{inv.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{inv.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>Issued: {new Date(inv.issuedDate).toLocaleDateString()}</span>
                      <span>Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-slate-800">{formatPeso(inv.amount)}</p>
                  <Button size="sm" variant="outline" className="mt-2 gap-1">
                    <Download className="w-3.5 h-3.5" /> Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

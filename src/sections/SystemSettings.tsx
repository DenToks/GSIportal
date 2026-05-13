import { useState } from 'react';
import { ShieldCheck, Bell, Database, Lock, Settings2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import type { User } from '@/types';

interface SystemSettingsProps {
  currentUser: User;
}

export function SystemSettings({ currentUser }: SystemSettingsProps) {
  const [settings, setSettings] = useState({
    auditAllRoleChanges: true,
    requireApprovalForRoleChanges: true,
    notifyOnProjectCreation: true,
    notifyOnTaskUpdates: true,
    autoArchiveCompletedProjects: false,
    restrictClientDownloads: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
          <p className="text-slate-500">Configure access, alerts, and workflow defaults for the portal.</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Admin only
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="w-5 h-5 text-blue-600" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 border rounded-lg p-4">
              <div>
                <p className="font-medium text-slate-800">Require approval for role changes</p>
                <p className="text-sm text-slate-500">Role changes from supervisors go through the approvals queue.</p>
              </div>
              <Switch checked={settings.requireApprovalForRoleChanges} onCheckedChange={() => toggleSetting('requireApprovalForRoleChanges')} />
            </div>
            <div className="flex items-center justify-between gap-4 border rounded-lg p-4">
              <div>
                <p className="font-medium text-slate-800">Audit all role updates</p>
                <p className="text-sm text-slate-500">Record account changes in activity logs for traceability.</p>
              </div>
              <Switch checked={settings.auditAllRoleChanges} onCheckedChange={() => toggleSetting('auditAllRoleChanges')} />
            </div>
            <div className="flex items-center justify-between gap-4 border rounded-lg p-4">
              <div>
                <p className="font-medium text-slate-800">Restrict client downloads</p>
                <p className="text-sm text-slate-500">Keep client access read-only except for approved final reports and invoices.</p>
              </div>
              <Switch checked={settings.restrictClientDownloads} onCheckedChange={() => toggleSetting('restrictClientDownloads')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings2 className="w-5 h-5 text-blue-600" />
              Active Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="font-semibold text-slate-800">{currentUser.name}</p>
              <p className="text-sm text-slate-500">{currentUser.jobPosition ?? currentUser.role}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm text-slate-600 leading-relaxed">
              This screen is a static admin control surface for the current portal demo. Changes apply locally in the browser only.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-blue-600" />
              Notification Defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800">Project creation alerts</p>
                <p className="text-sm text-slate-500">Notify stakeholders whenever BD creates a new project.</p>
              </div>
              <Switch checked={settings.notifyOnProjectCreation} onCheckedChange={() => toggleSetting('notifyOnProjectCreation')} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800">Task update alerts</p>
                <p className="text-sm text-slate-500">Send internal alerts when tasks change status or due date.</p>
              </div>
              <Switch checked={settings.notifyOnTaskUpdates} onCheckedChange={() => toggleSetting('notifyOnTaskUpdates')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="w-5 h-5 text-blue-600" />
              Workflow Defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800">Auto-archive completed projects</p>
                <p className="text-sm text-slate-500">Move finished projects to archive after completion review.</p>
              </div>
              <Switch checked={settings.autoArchiveCompletedProjects} onCheckedChange={() => toggleSetting('autoArchiveCompletedProjects')} />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

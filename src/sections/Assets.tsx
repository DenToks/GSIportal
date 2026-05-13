import { useState } from 'react';
import { Truck, Wrench, CheckCircle2, AlertCircle, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Label } from '@/components/ui/label';
import type { Vehicle, Equipment, Project, User } from '@/types';

interface AssetsProps {
  vehicles: Vehicle[];
  equipment: Equipment[];
  projects: Project[];
  currentUser: User;
  onDeployVehicle: (vehicleId: string, projectId: string, projectName: string) => void;
  onReturnVehicle: (vehicleId: string) => void;
  onDeployEquipment: (equipmentId: string, projectId: string, projectName: string) => void;
  onReturnEquipment: (equipmentId: string) => void;
}

const getVehicleStatusColor = (status: string) => {
  switch (status) {
    case 'Available':    return 'bg-green-100 text-green-700 border-green-200';
    case 'Deployed':     return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Maintenance':  return 'bg-amber-100 text-amber-700 border-amber-200';
    default:             return 'bg-gray-100 text-gray-700';
  }
};

const getEquipmentStatusColor = (status: string) => {
  switch (status) {
    case 'Available':        return 'bg-green-100 text-green-700 border-green-200';
    case 'Deployed':         return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Under Maintenance':return 'bg-amber-100 text-amber-700 border-amber-200';
    default:                 return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  if (status === 'Available') return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (status === 'Deployed')  return <MapPin className="w-3.5 h-3.5" />;
  return <AlertCircle className="w-3.5 h-3.5" />;
};

export function Assets({ vehicles, equipment, projects, onDeployVehicle, onReturnVehicle, onDeployEquipment, onReturnEquipment }: AssetsProps) {
  const [deployVehicleTarget, setDeployVehicleTarget] = useState<Vehicle | null>(null);
  const [deployEquipTarget, setDeployEquipTarget] = useState<Equipment | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const deployedVehicles  = vehicles.filter(v => v.status === 'Deployed').length;
  const deployedEquip     = equipment.filter(e => e.status === 'Deployed').length;

  const handleDeployVehicle = () => {
    if (!deployVehicleTarget || !selectedProjectId) return;
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) {
      onDeployVehicle(deployVehicleTarget.id, selectedProjectId, project.name);
    }
    setDeployVehicleTarget(null);
    setSelectedProjectId('');
  };

  const handleDeployEquip = () => {
    if (!deployEquipTarget || !selectedProjectId) return;
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) {
      onDeployEquipment(deployEquipTarget.id, selectedProjectId, project.name);
    }
    setDeployEquipTarget(null);
    setSelectedProjectId('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Assets</h1>
        <p className="text-slate-500">Manage vehicles and equipment deployment to projects.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Truck className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-2xl font-bold">{vehicles.length}</p><p className="text-xs text-slate-500">Total Vehicles</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-2xl font-bold">{availableVehicles}</p><p className="text-xs text-slate-500">Available</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Wrench className="w-5 h-5 text-purple-600" /></div>
          <div><p className="text-2xl font-bold">{equipment.length}</p><p className="text-xs text-slate-500">Total Equipment</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><MapPin className="w-5 h-5 text-amber-600" /></div>
          <div><p className="text-2xl font-bold">{deployedVehicles + deployedEquip}</p><p className="text-xs text-slate-500">Deployed</p></div>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="vehicles">
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles ({vehicles.length})</TabsTrigger>
          <TabsTrigger value="equipment">Equipment ({equipment.length})</TabsTrigger>
        </TabsList>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles" className="space-y-3 mt-4">
          {vehicles.map(vehicle => (
            <Card key={vehicle.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-800">{vehicle.name}</p>
                        <Badge variant="outline" className={getVehicleStatusColor(vehicle.status)}>
                          <span className="flex items-center gap-1">{getStatusIcon(vehicle.status)}{vehicle.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">{vehicle.type} • {vehicle.plateNumber}</p>
                      {vehicle.assignedProjectName && (
                        <p className="text-sm text-blue-600 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {vehicle.assignedProjectName}
                          {vehicle.driver && <span className="text-slate-400 ml-2">Driver: {vehicle.driver}</span>}
                        </p>
                      )}
                      {vehicle.lastService && (
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Last service: {new Date(vehicle.lastService).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {vehicle.status === 'Available' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => { setDeployVehicleTarget(vehicle); setSelectedProjectId(''); }}>
                        Deploy
                      </Button>
                    )}
                    {vehicle.status === 'Deployed' && (
                      <Button size="sm" variant="outline" onClick={() => onReturnVehicle(vehicle.id)}>
                        Return
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-3 mt-4">
          {equipment.map(equip => (
            <Card key={equip.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-800">{equip.name}</p>
                        <Badge variant="outline" className={getEquipmentStatusColor(equip.status)}>
                          <span className="flex items-center gap-1">{getStatusIcon(equip.status)}{equip.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">{equip.type} • S/N: {equip.serialNumber}</p>
                      {equip.assignedProjectName && (
                        <p className="text-sm text-blue-600 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {equip.assignedProjectName}
                        </p>
                      )}
                      {equip.lastCalibration && (
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Last calibration: {new Date(equip.lastCalibration).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {equip.status === 'Available' && (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => { setDeployEquipTarget(equip); setSelectedProjectId(''); }}>
                        Deploy
                      </Button>
                    )}
                    {equip.status === 'Deployed' && (
                      <Button size="sm" variant="outline" onClick={() => onReturnEquipment(equip.id)}>
                        Return
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Deploy Vehicle Dialog */}
      <Dialog open={!!deployVehicleTarget} onOpenChange={() => setDeployVehicleTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Deploy Vehicle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-600">
              Deploying: <span className="font-medium">{deployVehicleTarget?.name}</span>
            </p>
            <div className="space-y-1.5">
              <Label>Assign to Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {projects.filter(p => p.status === 'Ongoing' || p.status === 'Pending').map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeployVehicleTarget(null)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleDeployVehicle} disabled={!selectedProjectId}>
              Confirm Deploy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deploy Equipment Dialog */}
      <Dialog open={!!deployEquipTarget} onOpenChange={() => setDeployEquipTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Deploy Equipment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-600">
              Deploying: <span className="font-medium">{deployEquipTarget?.name}</span>
            </p>
            <div className="space-y-1.5">
              <Label>Assign to Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {projects.filter(p => p.status === 'Ongoing' || p.status === 'Pending').map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeployEquipTarget(null)}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleDeployEquip} disabled={!selectedProjectId}>
              Confirm Deploy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

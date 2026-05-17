import { useState } from 'react';
import { Truck, Wrench, CheckCircle2, AlertCircle, Clock, MapPin, Plus, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  onAddVehicle: (v: Vehicle) => void;
  onEditVehicle: (v: Vehicle) => void;
  onAddEquipment: (e: Equipment) => void;
  onEditEquipment: (e: Equipment) => void;
  onSetVehicleMaintenance: (vehicleId: string) => void;
  onSetEquipmentMaintenance: (equipId: string) => void;
  onMarkVehicleAvailable: (vehicleId: string) => void;
  onMarkEquipmentAvailable: (equipId: string) => void;
}

const getVehicleStatusColor = (status: string) => {
  switch (status) {
    case 'Available':   return 'bg-green-100 text-green-700 border-green-200';
    case 'Deployed':    return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
    default:            return 'bg-gray-100 text-gray-700';
  }
};

const getEquipmentStatusColor = (status: string) => {
  switch (status) {
    case 'Available':         return 'bg-green-100 text-green-700 border-green-200';
    case 'Deployed':          return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Under Maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
    default:                  return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  if (status === 'Available') return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (status === 'Deployed')  return <MapPin className="w-3.5 h-3.5" />;
  return <AlertCircle className="w-3.5 h-3.5" />;
};

const EMPTY_VEHICLE = { name: '', type: 'Pickup' as Vehicle['type'], plateNumber: '', driver: '', lastService: '' };
const EMPTY_EQUIP   = { name: '', type: '', serialNumber: '', lastCalibration: '' };

export function Assets({ vehicles, equipment, projects, onDeployVehicle, onReturnVehicle, onDeployEquipment, onReturnEquipment, onAddVehicle, onEditVehicle, onAddEquipment, onEditEquipment, onSetVehicleMaintenance, onSetEquipmentMaintenance, onMarkVehicleAvailable, onMarkEquipmentAvailable }: AssetsProps) {
  const [deployVehicleTarget, setDeployVehicleTarget] = useState<Vehicle | null>(null);
  const [deployEquipTarget, setDeployEquipTarget]     = useState<Equipment | null>(null);
  const [selectedProjectId, setSelectedProjectId]     = useState('');

  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [vehicleForm, setVehicleForm]       = useState(EMPTY_VEHICLE);

  const [addEquipOpen, setAddEquipOpen] = useState(false);
  const [equipForm, setEquipForm]       = useState(EMPTY_EQUIP);

  const [editVehicleTarget, setEditVehicleTarget] = useState<Vehicle | null>(null);
  const [editVehicleForm, setEditVehicleForm]     = useState(EMPTY_VEHICLE);

  const [editEquipTarget, setEditEquipTarget] = useState<Equipment | null>(null);
  const [editEquipForm, setEditEquipForm]     = useState(EMPTY_EQUIP);
  const [assetConfirm, setAssetConfirm] = useState<{
    type: 'return-vehicle' | 'return-equip' | 'maintenance-vehicle' | 'maintenance-equip' | 'available-vehicle' | 'available-equip';
    id: string;
    name: string;
  } | null>(null);

  const openEditVehicle = (v: Vehicle) => {
    setEditVehicleTarget(v);
    setEditVehicleForm({ name: v.name, type: v.type, plateNumber: v.plateNumber, driver: v.driver ?? '', lastService: v.lastService ?? '' });
  };

  const openEditEquip = (e: Equipment) => {
    setEditEquipTarget(e);
    setEditEquipForm({ name: e.name, type: e.type, serialNumber: e.serialNumber, lastCalibration: e.lastCalibration ?? '' });
  };

  const handleEditVehicleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editVehicleTarget || !editVehicleForm.name || !editVehicleForm.plateNumber) return;
    onEditVehicle({ ...editVehicleTarget, name: editVehicleForm.name, type: editVehicleForm.type, plateNumber: editVehicleForm.plateNumber, driver: editVehicleForm.driver || undefined, lastService: editVehicleForm.lastService || undefined });
    setEditVehicleTarget(null);
  };

  const handleEditEquipSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editEquipTarget || !editEquipForm.name || !editEquipForm.serialNumber) return;
    onEditEquipment({ ...editEquipTarget, name: editEquipForm.name, type: editEquipForm.type, serialNumber: editEquipForm.serialNumber, lastCalibration: editEquipForm.lastCalibration || undefined });
    setEditEquipTarget(null);
  };

  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const deployedVehicles  = vehicles.filter(v => v.status === 'Deployed').length;
  const deployedEquip     = equipment.filter(e => e.status === 'Deployed').length;

  const handleDeployVehicle = () => {
    if (!deployVehicleTarget || !selectedProjectId) return;
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) onDeployVehicle(deployVehicleTarget.id, selectedProjectId, project.name);
    setDeployVehicleTarget(null);
    setSelectedProjectId('');
  };

  const handleDeployEquip = () => {
    if (!deployEquipTarget || !selectedProjectId) return;
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) onDeployEquipment(deployEquipTarget.id, selectedProjectId, project.name);
    setDeployEquipTarget(null);
    setSelectedProjectId('');
  };

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.name || !vehicleForm.plateNumber) return;
    onAddVehicle({
      id: `VEH-${Date.now()}`,
      name: vehicleForm.name,
      type: vehicleForm.type,
      plateNumber: vehicleForm.plateNumber,
      status: 'Available',
      driver: vehicleForm.driver || undefined,
      lastService: vehicleForm.lastService || undefined,
    });
    setVehicleForm(EMPTY_VEHICLE);
    setAddVehicleOpen(false);
  };

  const handleAddEquipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipForm.name || !equipForm.serialNumber) return;
    onAddEquipment({
      id: `EQP-${Date.now()}`,
      name: equipForm.name,
      type: equipForm.type,
      serialNumber: equipForm.serialNumber,
      status: 'Available',
      lastCalibration: equipForm.lastCalibration || undefined,
    });
    setEquipForm(EMPTY_EQUIP);
    setAddEquipOpen(false);
  };

  const activeProjects = projects.filter(p => p.status === 'Ongoing' || p.status === 'Pending');

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
          <div className="flex justify-end">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setAddVehicleOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Vehicle
            </Button>
          </div>
          {vehicles.length === 0 && (
            <div className="text-center py-12 text-slate-400">No vehicles in inventory yet.</div>
          )}
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
                      {vehicle.driver && !vehicle.assignedProjectName && (
                        <p className="text-sm text-slate-400 mt-0.5">Driver: {vehicle.driver}</p>
                      )}
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
                  <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                    {vehicle.status !== 'Deployed' && (
                      <Button size="sm" variant="outline" onClick={() => openEditVehicle(vehicle)}>
                        <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                    )}
                    {vehicle.status === 'Available' && (
                      <>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => { setDeployVehicleTarget(vehicle); setSelectedProjectId(''); }}>
                          Deploy
                        </Button>
                        <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => setAssetConfirm({ type: 'maintenance-vehicle', id: vehicle.id, name: vehicle.name })}>
                          Set Maintenance
                        </Button>
                      </>
                    )}
                    {vehicle.status === 'Deployed' && (
                      <Button size="sm" variant="outline" onClick={() => setAssetConfirm({ type: 'return-vehicle', id: vehicle.id, name: vehicle.name })}>
                        Return
                      </Button>
                    )}
                    {vehicle.status === 'Maintenance' && (
                      <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => setAssetConfirm({ type: 'available-vehicle', id: vehicle.id, name: vehicle.name })}>
                        Mark Available
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
          <div className="flex justify-end">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => setAddEquipOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Equipment
            </Button>
          </div>
          {equipment.length === 0 && (
            <div className="text-center py-12 text-slate-400">No equipment in inventory yet.</div>
          )}
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
                  <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                    {equip.status !== 'Deployed' && (
                      <Button size="sm" variant="outline" onClick={() => openEditEquip(equip)}>
                        <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                    )}
                    {equip.status === 'Available' && (
                      <>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => { setDeployEquipTarget(equip); setSelectedProjectId(''); }}>
                          Deploy
                        </Button>
                        <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => setAssetConfirm({ type: 'maintenance-equip', id: equip.id, name: equip.name })}>
                          Set Maintenance
                        </Button>
                      </>
                    )}
                    {equip.status === 'Deployed' && (
                      <Button size="sm" variant="outline" onClick={() => setAssetConfirm({ type: 'return-equip', id: equip.id, name: equip.name })}>
                        Return
                      </Button>
                    )}
                    {equip.status === 'Under Maintenance' && (
                      <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => setAssetConfirm({ type: 'available-equip', id: equip.id, name: equip.name })}>
                        Mark Available
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
          <DialogHeader><DialogTitle>Deploy Vehicle</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-600">Deploying: <span className="font-medium">{deployVehicleTarget?.name}</span></p>
            <div className="space-y-1.5">
              <Label>Assign to Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {activeProjects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeployVehicleTarget(null)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleDeployVehicle} disabled={!selectedProjectId}>Confirm Deploy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deploy Equipment Dialog */}
      <Dialog open={!!deployEquipTarget} onOpenChange={() => setDeployEquipTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Deploy Equipment</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-600">Deploying: <span className="font-medium">{deployEquipTarget?.name}</span></p>
            <div className="space-y-1.5">
              <Label>Assign to Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {activeProjects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeployEquipTarget(null)}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleDeployEquip} disabled={!selectedProjectId}>Confirm Deploy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Vehicle Dialog */}
      <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Vehicle</DialogTitle></DialogHeader>
          <form onSubmit={handleAddVehicleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label>Vehicle Name *</Label>
                <Input placeholder="e.g. Isuzu D-Max" value={vehicleForm.name} onChange={e => setVehicleForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Type *</Label>
                <Select value={vehicleForm.type} onValueChange={v => setVehicleForm(p => ({ ...p, type: v as Vehicle['type'] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Truck','Van','SUV','Pickup','Heavy Equipment','Motorcycle'].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Plate Number *</Label>
                <Input placeholder="e.g. ABC 1234" value={vehicleForm.plateNumber} onChange={e => setVehicleForm(p => ({ ...p, plateNumber: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Driver (optional)</Label>
                <Input placeholder="Driver name" value={vehicleForm.driver} onChange={e => setVehicleForm(p => ({ ...p, driver: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Last Service Date</Label>
                <Input type="date" value={vehicleForm.lastService} onChange={e => setVehicleForm(p => ({ ...p, lastService: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddVehicleOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Vehicle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Equipment Dialog */}
      <Dialog open={addEquipOpen} onOpenChange={setAddEquipOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Equipment</DialogTitle></DialogHeader>
          <form onSubmit={handleAddEquipSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label>Equipment Name *</Label>
                <Input placeholder="e.g. Boring Machine #3" value={equipForm.name} onChange={e => setEquipForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Type *</Label>
                <Input placeholder="e.g. Drilling Equipment" value={equipForm.type} onChange={e => setEquipForm(p => ({ ...p, type: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Serial Number *</Label>
                <Input placeholder="e.g. BM-2024-003" value={equipForm.serialNumber} onChange={e => setEquipForm(p => ({ ...p, serialNumber: e.target.value }))} required />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Last Calibration Date</Label>
                <Input type="date" value={equipForm.lastCalibration} onChange={e => setEquipForm(p => ({ ...p, lastCalibration: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddEquipOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Add Equipment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={!!editVehicleTarget} onOpenChange={() => setEditVehicleTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Vehicle</DialogTitle></DialogHeader>
          <form onSubmit={handleEditVehicleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label>Vehicle Name *</Label>
                <Input value={editVehicleForm.name} onChange={e => setEditVehicleForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Type *</Label>
                <Select value={editVehicleForm.type} onValueChange={v => setEditVehicleForm(p => ({ ...p, type: v as Vehicle['type'] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Truck','Van','SUV','Pickup','Heavy Equipment','Motorcycle'].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Plate Number *</Label>
                <Input value={editVehicleForm.plateNumber} onChange={e => setEditVehicleForm(p => ({ ...p, plateNumber: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Driver</Label>
                <Input placeholder="Driver name" value={editVehicleForm.driver} onChange={e => setEditVehicleForm(p => ({ ...p, driver: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Last Service Date</Label>
                <Input type="date" value={editVehicleForm.lastService} onChange={e => setEditVehicleForm(p => ({ ...p, lastService: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditVehicleTarget(null)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Equipment Dialog */}
      <Dialog open={!!editEquipTarget} onOpenChange={() => setEditEquipTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Equipment</DialogTitle></DialogHeader>
          <form onSubmit={handleEditEquipSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label>Equipment Name *</Label>
                <Input value={editEquipForm.name} onChange={e => setEditEquipForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Type *</Label>
                <Input value={editEquipForm.type} onChange={e => setEditEquipForm(p => ({ ...p, type: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Serial Number *</Label>
                <Input value={editEquipForm.serialNumber} onChange={e => setEditEquipForm(p => ({ ...p, serialNumber: e.target.value }))} required />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Last Calibration Date</Label>
                <Input type="date" value={editEquipForm.lastCalibration} onChange={e => setEditEquipForm(p => ({ ...p, lastCalibration: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditEquipTarget(null)}>Cancel</Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Asset Action Confirmation Dialog */}
      <Dialog open={!!assetConfirm} onOpenChange={() => setAssetConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {assetConfirm?.type.startsWith('return') && 'Return Asset'}
              {assetConfirm?.type.startsWith('maintenance') && 'Set as Maintenance'}
              {assetConfirm?.type.startsWith('available') && 'Mark as Available'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <div className="bg-slate-50 rounded-lg p-3 text-sm">
              <p className="text-slate-500 text-xs mb-1">Asset</p>
              <p className="font-medium text-slate-800">{assetConfirm?.name}</p>
            </div>
            <p className="text-sm text-slate-600">
              {assetConfirm?.type.startsWith('return') && 'Confirm that this asset has been returned and is no longer on-site? Its status will be set to Available.'}
              {assetConfirm?.type.startsWith('maintenance') && 'Set this asset status to Under Maintenance? It will not be available for deployment until marked Available again.'}
              {assetConfirm?.type.startsWith('available') && 'Mark this asset as Available? It will be ready for deployment to a project.'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssetConfirm(null)}>Cancel</Button>
            <Button
              className={
                assetConfirm?.type.startsWith('return') ? 'bg-blue-600 hover:bg-blue-700' :
                assetConfirm?.type.startsWith('maintenance') ? 'bg-amber-600 hover:bg-amber-700' :
                'bg-green-600 hover:bg-green-700'
              }
              onClick={() => {
                if (!assetConfirm) return;
                if (assetConfirm.type === 'return-vehicle') onReturnVehicle(assetConfirm.id);
                if (assetConfirm.type === 'return-equip') onReturnEquipment(assetConfirm.id);
                if (assetConfirm.type === 'maintenance-vehicle') onSetVehicleMaintenance(assetConfirm.id);
                if (assetConfirm.type === 'maintenance-equip') onSetEquipmentMaintenance(assetConfirm.id);
                if (assetConfirm.type === 'available-vehicle') onMarkVehicleAvailable(assetConfirm.id);
                if (assetConfirm.type === 'available-equip') onMarkEquipmentAvailable(assetConfirm.id);
                setAssetConfirm(null);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

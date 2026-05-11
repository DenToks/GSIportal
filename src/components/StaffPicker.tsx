import { useState } from 'react';
import { X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Staff } from '@/types';

interface StaffPickerProps {
  staffList: Staff[];
  selected: string[];
  onChange: (names: string[]) => void;
  multiple?: boolean;
  dropLabel?: string;
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const statusColor: Record<Staff['status'], string> = {
  Available: 'bg-green-100 text-green-700 border-green-200',
  Assigned: 'bg-blue-100 text-blue-700 border-blue-200',
  'On Leave': 'bg-amber-100 text-amber-700 border-amber-200',
};

export function StaffPicker({
  staffList,
  selected,
  onChange,
  multiple = true,
  dropLabel = 'Drag staff here to assign',
}: StaffPickerProps) {
  const [dragOver, setDragOver] = useState(false);

  const available = staffList.filter(s => !selected.includes(s.name));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const name = e.dataTransfer.getData('text/plain');
    if (!name) return;
    if (selected.includes(name)) return;
    onChange(multiple ? [...selected, name] : [name]);
  };

  const remove = (name: string) => onChange(selected.filter(n => n !== name));

  return (
    <div className="space-y-3">
      {/* Available staff — draggable */}
      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">
          Available Staff — drag to assign
        </p>
        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 min-h-[56px]">
          {available.length === 0 && (
            <p className="text-xs text-slate-400 self-center italic">All staff assigned</p>
          )}
          {available.map(staff => (
            <div
              key={staff.id}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('text/plain', staff.name);
                e.dataTransfer.effectAllowed = 'copy';
              }}
              className={`flex items-center gap-1.5 border rounded-full px-2 py-1 cursor-grab active:cursor-grabbing hover:shadow-sm transition-all select-none ${statusColor[staff.status]}`}
              title={`${staff.name} · ${staff.status}`}
            >
              <Avatar className="w-5 h-5">
                <AvatarFallback className="text-[9px] font-bold bg-white/60">
                  {getInitials(staff.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{staff.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drop zone — assigned */}
      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">
          {multiple ? 'Assigned Team' : 'Assigned To'}
        </p>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`min-h-[56px] flex flex-wrap gap-2 p-3 rounded-lg border-2 border-dashed transition-all ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white'
          }`}
        >
          {selected.length === 0 && (
            <p className={`text-xs self-center ${dragOver ? 'text-blue-500 font-medium' : 'text-slate-400 italic'}`}>
              {dragOver ? '⬇ Drop to assign' : dropLabel}
            </p>
          )}
          {selected.map(name => (
            <div
              key={name}
              className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-2 py-1"
            >
              <Avatar className="w-5 h-5">
                <AvatarFallback className="text-[9px] font-bold bg-blue-600 text-white">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-blue-700">{name}</span>
              <button
                type="button"
                onClick={() => remove(name)}
                className="text-blue-400 hover:text-red-500 transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import type { ActivityLog } from '@/types';

export function DemoVisualizer({ logs, onClose }: { logs: ActivityLog[]; onClose?: () => void }) {
  const recent = logs.slice(0, 8);
  return (
    <div className="fixed right-6 bottom-6 z-50 w-96 bg-white border shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b">
        <div className="text-sm font-medium">Demo Progress</div>
        <div>
          <button className="text-xs text-slate-600 hover:text-slate-800" onClick={() => onClose && onClose()}>Close</button>
        </div>
      </div>
      <div className="p-3 max-h-64 overflow-auto">
        {recent.length === 0 && (
          <div className="text-sm text-slate-500">No demo events yet.</div>
        )}
        <ul className="space-y-2">
          {recent.map((l) => (
            <li key={l.id} className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-1 mr-3" />
              <div>
                <div className="text-sm font-semibold">{l.userName}</div>
                <div className="text-xs text-slate-600">{l.action} — <span className="font-medium">{l.target}</span></div>
                <div className="text-2xs text-slate-400 mt-1">{new Date(l.timestamp).toLocaleTimeString()}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

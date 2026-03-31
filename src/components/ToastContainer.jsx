import { useEffect, useRef } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../store/AppStore';

const ICONS = {
  success: <CheckCircle2 size={16} color="var(--accent-teal)" />,
  error:   <AlertCircle  size={16} color="var(--accent-danger)" />,
  warning: <AlertTriangle size={16} color="var(--accent-amber)" />,
  info:    <Info          size={16} color="var(--accent-primary)" />,
};

function Toast({ toast }) {
  return (
    <div className={`toast toast-${toast.type}`}>
      {ICONS[toast.type] || ICONS.info}
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => <Toast key={t.id} toast={t} />)}
    </div>
  );
}

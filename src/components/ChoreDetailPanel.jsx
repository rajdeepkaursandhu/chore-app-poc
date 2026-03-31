import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { X, CheckCircle2, Pencil, Trash2, Calendar, User2, RepeatIcon, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import ChoreModal from './ChoreModal';
import './ChoreDetailPanel.css';

const STATUS_LABELS = {
  ToDo:       { label: 'To Do',       cls: 'badge-todo'       },
  InProgress: { label: 'In Progress', cls: 'badge-inprogress' },
  Completed:  { label: 'Completed',   cls: 'badge-completed'  },
  Overdue:    { label: 'Overdue',     cls: 'badge-overdue'    },
};

export default function ChoreDetailPanel({ chore, onClose, onComplete }) {
  const { members, removeChore, updateChore } = useApp();
  const [editing, setEditing] = useState(false);

  const member = members.find(m => m.id === chore.assignedToId);
  const status = STATUS_LABELS[chore.status] || STATUS_LABELS.ToDo;

  const handleDelete = () => {
    removeChore(chore.id);
    onClose();
  };

  const handleStatusCycle = () => {
    const cycle = ['ToDo', 'InProgress', 'Completed'];
    const idx = cycle.indexOf(chore.status);
    const next = cycle[(idx + 1) % cycle.length];
    updateChore(chore.id, { status: next });
  };

  if (editing) {
    return <ChoreModal chore={chore} onClose={() => { setEditing(false); onClose(); }} />;
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal chore-detail animate-fadeInUp" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className={`badge ${status.cls}`}>{status.label}</span>
            <h2 className="chore-detail-title">{chore.title}</h2>
          </div>
          <button id="detail-close-btn" className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Description */}
        {chore.description && (
          <p className="chore-detail-desc">{chore.description}</p>
        )}

        {/* Meta grid */}
        <div className="chore-meta-grid">
          <div className="chore-meta-item">
            <Calendar size={14} color="var(--text-muted)" />
            <div>
              <span className="meta-label">Due Date</span>
              <span className="meta-value">{format(parseISO(chore.dueDate), 'MMMM d, yyyy')}</span>
            </div>
          </div>
          <div className="chore-meta-item">
            <User2 size={14} color="var(--text-muted)" />
            <div>
              <span className="meta-label">Assigned To</span>
              {member ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="avatar" style={{ background: member.avatarColor, width: 20, height: 20, fontSize: 9 }}>
                    {member.name[0]}
                  </div>
                  <span className="meta-value">{member.name}</span>
                </div>
              ) : (
                <span className="meta-value" style={{ color: 'var(--text-muted)' }}>Unassigned</span>
              )}
            </div>
          </div>
          <div className="chore-meta-item">
            <RepeatIcon size={14} color="var(--text-muted)" />
            <div>
              <span className="meta-label">Recurring</span>
              <span className="meta-value">{chore.recurringType || 'None'}</span>
            </div>
          </div>
          <div className="chore-meta-item">
            <Tag size={14} color="var(--text-muted)" />
            <div>
              <span className="meta-label">Category</span>
              <span className="meta-value">{chore.category || '—'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="chore-detail-actions">
          {chore.status !== 'Completed' && (
            <button id="detail-complete-btn" className="btn btn-primary" onClick={onComplete}>
              <CheckCircle2 size={15} /> Mark Complete
            </button>
          )}
          <button id="detail-cycle-btn" className="btn btn-ghost" onClick={handleStatusCycle}>
            Cycle Status
          </button>
          <button id="detail-edit-btn" className="btn btn-ghost" onClick={() => setEditing(true)}>
            <Pencil size={14} /> Edit
          </button>
          <button id="detail-delete-btn" className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

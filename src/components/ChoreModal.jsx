import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { X, ClipboardList, Calendar, User2, RepeatIcon, Tag, AlignLeft } from 'lucide-react';
import './ChoreModal.css';

const CATEGORIES = ['Kitchen', 'Cleaning', 'Waste', 'Maintenance', 'Other'];
const RECURRING  = ['None', 'Daily', 'Weekly', 'Monthly'];
const STATUSES   = ['ToDo', 'InProgress', 'Completed', 'Overdue'];

export default function ChoreModal({ chore, defaultDate, onClose }) {
  const { members, addChore, updateChore } = useApp();
  const isEdit = !!chore;

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    title:         chore?.title         || '',
    description:   chore?.description   || '',
    assignedToId:  chore?.assignedToId  || '',
    dueDate:       chore?.dueDate       || defaultDate || today,
    recurringType: chore?.recurringType || 'None',
    category:      chore?.category      || 'Other',
    status:        chore?.status        || 'ToDo',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title   = 'Title is required.';
    if (!form.dueDate)       e.dueDate = 'Due date is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (isEdit) updateChore(chore.id, form);
    else addChore(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-fadeInUp" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit chore' : 'Add chore'}>
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-icon"><ClipboardList size={18} /></span>
            <h2 className="modal-title">{isEdit ? 'Edit Chore' : 'New Chore'}</h2>
          </div>
          <button id="chore-modal-close" className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Title */}
          <div className="form-group">
            <label className="form-label"><ClipboardList size={13} /> Title</label>
            <input
              id="chore-title-input"
              className={`field ${errors.title ? 'field-error' : ''}`}
              placeholder="e.g. Empty the dishwasher"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label"><AlignLeft size={13} /> Description <span className="form-optional">(optional)</span></label>
            <textarea
              id="chore-description-input"
              className="field"
              placeholder="Add any helpful details…"
              rows={2}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Two-column row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><Calendar size={13} /> Due Date</label>
              <input
                id="chore-date-input"
                type="date"
                className={`field ${errors.dueDate ? 'field-error' : ''}`}
                value={form.dueDate}
                onChange={e => set('dueDate', e.target.value)}
              />
              {errors.dueDate && <span className="form-error">{errors.dueDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label"><RepeatIcon size={13} /> Recurring</label>
              <select
                id="chore-recurring-select"
                className="field"
                value={form.recurringType}
                onChange={e => set('recurringType', e.target.value)}
              >
                {RECURRING.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Assign & Category row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><User2 size={13} /> Assign To</label>
              <select
                id="chore-assignee-select"
                className="field"
                value={form.assignedToId}
                onChange={e => set('assignedToId', e.target.value)}
              >
                <option value="">— Unassigned —</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label"><Tag size={13} /> Category</label>
              <select
                id="chore-category-select"
                className="field"
                value={form.category}
                onChange={e => set('category', e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Status (edit only) */}
          {isEdit && (
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                id="chore-status-select"
                className="field"
                value={form.status}
                onChange={e => set('status', e.target.value)}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {form.recurringType !== 'None' && (
            <div className="recurring-notice">
              <RepeatIcon size={12} />
              <span>This chore will auto-schedule future instances <strong>{form.recurringType.toLowerCase()}</strong>.</span>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" id="chore-cancel-btn" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" id="chore-submit-btn" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Add Chore'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

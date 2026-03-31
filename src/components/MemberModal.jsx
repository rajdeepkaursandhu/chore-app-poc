import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { X, User, Briefcase, Palette } from 'lucide-react';
import './ChoreModal.css';

const AVATAR_COLORS = [
  '#7c6ef7','#f06c9b','#3ecfb2','#f5a623','#4fa3e0',
  '#e05c97','#a0d468','#fc6e51','#48cfad','#ac92ec',
];

const CATEGORIES = ['Kitchen', 'Cleaning', 'Waste', 'Maintenance', 'Other'];

export default function MemberModal({ member, onClose }) {
  const { addMember, updateMember } = useApp();
  const isEdit = !!member;

  const [form, setForm] = useState({
    name:        member?.name        || '',
    role:        member?.role        || '',
    avatarColor: member?.avatarColor || AVATAR_COLORS[0],
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.role.trim()) e.role = 'Role is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (isEdit) updateMember(member.id, form);
    else addMember(form);
    onClose();
  };

  const initials = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-fadeInUp" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit member' : 'Add member'}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Member' : 'Add Team Member'}</h2>
          <button id="member-modal-close" className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Avatar preview */}
        <div className="member-modal-avatar-preview">
          <div className="avatar" style={{ background: form.avatarColor, width: 56, height: 56, fontSize: 20 }}>
            {initials}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label className="form-label"><User size={13} /> Full Name</label>
            <input
              id="member-name-input"
              className={`field ${errors.name ? 'field-error' : ''}`}
              placeholder="e.g. Jordan Kim"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label"><Briefcase size={13} /> Role / Title</label>
            <input
              id="member-role-input"
              className={`field ${errors.role ? 'field-error' : ''}`}
              placeholder="e.g. Designer"
              value={form.role}
              onChange={e => set('role', e.target.value)}
            />
            {errors.role && <span className="form-error">{errors.role}</span>}
          </div>

          <div className="form-group">
            <label className="form-label"><Palette size={13} /> Avatar Color</label>
            <div className="color-grid">
              {AVATAR_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${form.avatarColor === c ? 'color-swatch--active' : ''}`}
                  style={{ background: c }}
                  onClick={() => set('avatarColor', c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" id="member-cancel-btn" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" id="member-submit-btn" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

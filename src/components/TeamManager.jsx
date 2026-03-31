import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { UserPlus, Pencil, Trash2, Users, ClipboardList } from 'lucide-react';
import MemberModal from './MemberModal';
import './TeamManager.css';

export default function TeamManager() {
  const { members, chores, removeMember } = useApp();
  const [editingMember, setEditingMember] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const choreCountFor = (id) => chores.filter(c => c.assignedToId === id).length;
  const activeFor     = (id) => chores.filter(c => c.assignedToId === id && c.status !== 'Completed').length;

  return (
    <div className="team-manager animate-fadeInUp">
      <div className="section-header">
        <div>
          <h1 className="section-title">Team Members</h1>
          <p className="section-subtitle">{members.length} member{members.length !== 1 ? 's' : ''} in your office</p>
        </div>
        <button id="add-member-btn" className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <UserPlus size={15} /> Add Member
        </button>
      </div>

      {members.length === 0 ? (
        <div className="team-empty glass">
          <Users size={40} opacity={0.3} />
          <p>No team members yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="members-grid">
          {members.map(m => {
            const total  = choreCountFor(m.id);
            const active = activeFor(m.id);
            const initials = m.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

            return (
              <div key={m.id} className="member-card glass animate-fadeInUp">
                <div className="member-card-top">
                  <div className="avatar member-avatar" style={{ background: m.avatarColor, width: 52, height: 52, fontSize: 18 }}>
                    {initials}
                  </div>
                  <div className="member-info">
                    <span className="member-name">{m.name}</span>
                    <span className="member-role">{m.role}</span>
                  </div>
                  <div className="member-actions">
                    <button
                      className="icon-btn"
                      id={`edit-member-${m.id}`}
                      onClick={() => setEditingMember(m)}
                      title="Edit member"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="icon-btn icon-btn--danger"
                      id={`delete-member-${m.id}`}
                      onClick={() => setConfirmDelete(m)}
                      title="Remove member"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="divider" />

                <div className="member-stats">
                  <div className="member-stat">
                    <ClipboardList size={13} />
                    <span><strong>{total}</strong> total chores</span>
                  </div>
                  <div className="member-stat">
                    <span className="stat-dot stat-dot--active" />
                    <span><strong>{active}</strong> active</span>
                  </div>
                  <div className="member-stat">
                    <span className="stat-dot stat-dot--done" />
                    <span><strong>{total - active}</strong> done</span>
                  </div>
                </div>

                {/* Mini progress bar */}
                {total > 0 && (
                  <div className="member-progress-track">
                    <div
                      className="member-progress-fill"
                      style={{ width: `${((total - active) / total) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAdd || editingMember) && (
        <MemberModal
          member={editingMember}
          onClose={() => { setShowAdd(false); setEditingMember(null); }}
        />
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div className="modal animate-fadeInUp" style={{ maxWidth: 400 }}>
            <h2 className="modal-title" style={{ marginBottom: 12 }}>Remove Member?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
              Removing <strong>{confirmDelete.name}</strong> will unassign all their chores.
              This action cannot be undone.
            </p>
            <div className="modal-footer" style={{ marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn btn-danger"
                id={`confirm-delete-member-${confirmDelete.id}`}
                onClick={() => { removeMember(confirmDelete.id); setConfirmDelete(null); }}
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

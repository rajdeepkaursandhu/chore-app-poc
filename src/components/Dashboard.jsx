import { useMemo, useState } from 'react';
import { useApp } from '../store/AppStore';
import { format, isToday, isTomorrow, parseISO, isPast } from 'date-fns';
import {
  CheckCircle2, Clock, AlertCircle, ListTodo,
  TrendingUp, Users, CalendarDays, Plus, ArrowRight, Repeat2
} from 'lucide-react';
import ChoreModal from './ChoreModal';
import ChoreDetailPanel from './ChoreDetailPanel';
import './Dashboard.css';

const STATUS_META = {
  ToDo:       { label: 'To Do',       color: 'var(--status-todo)',       icon: <ListTodo size={16} />      },
  InProgress: { label: 'In Progress', color: 'var(--status-inprogress)', icon: <Clock size={16} />         },
  Completed:  { label: 'Completed',   color: 'var(--status-completed)',  icon: <CheckCircle2 size={16} />  },
  Overdue:    { label: 'Overdue',     color: 'var(--status-overdue)',    icon: <AlertCircle size={16} />   },
};

export default function Dashboard() {
  const { chores, members, completeChore } = useApp();
  const [showModal, setShowModal]   = useState(false);
  const [selected, setSelected]     = useState(null);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const counts = { ToDo: 0, InProgress: 0, Completed: 0, Overdue: 0 };
    chores.forEach(c => { if (counts[c.status] !== undefined) counts[c.status]++; });
    return counts;
  }, [chores]);

  const completionRate = useMemo(() => {
    const total = chores.length;
    if (!total) return 0;
    return Math.round((stats.Completed / total) * 100);
  }, [chores, stats]);

  // ── Upcoming (next 7 days, non-completed) ──────────────────────────────────
  const upcoming = useMemo(() => {
    const today = new Date();
    const limit = new Date(); limit.setDate(limit.getDate() + 7);
    return chores
      .filter(c => c.status !== 'Completed')
      .filter(c => { const d = parseISO(c.dueDate); return d >= today && d <= limit; })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 8);
  }, [chores]);

  // ── Overdue ────────────────────────────────────────────────────────────────
  const overdueChores = useMemo(() =>
    chores.filter(c => c.status === 'Overdue').slice(0, 5),
    [chores]
  );

  const memberById = (id) => members.find(m => m.id === id);

  const dueDateLabel = (dateStr) => {
    const d = parseISO(dateStr);
    if (isToday(d))    return { text: 'Today',    cls: 'due-today' };
    if (isTomorrow(d)) return { text: 'Tomorrow', cls: 'due-tomorrow' };
    return { text: format(d, 'MMM d'), cls: '' };
  };

  return (
    <div className="dashboard animate-fadeInUp">
      {/* ── Greeting ── */}
      <div className="dash-greeting">
        <div>
          <h1 className="dash-title">
            Good {getGreeting()}, <span className="gradient-text">Team! 👋</span>
          </h1>
          <p className="dash-subtitle">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} · {chores.filter(c => isToday(parseISO(c.dueDate)) && c.status !== 'Completed').length} chores due today
          </p>
        </div>
        <button id="dash-add-chore-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> New Chore
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stat-cards">
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <div key={key} className="stat-card glass" style={{ '--stat-color': meta.color }}>
            <div className="stat-icon" style={{ color: meta.color, background: `${meta.color}18` }}>
              {meta.icon}
            </div>
            <div className="stat-info">
              <span className="stat-num">{stats[key]}</span>
              <span className="stat-label">{meta.label}</span>
            </div>
            <div className="stat-bar">
              <div
                className="stat-bar-fill"
                style={{
                  width: `${chores.length ? (stats[key] / chores.length) * 100 : 0}%`,
                  background: meta.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Progress + Members row ── */}
      <div className="dash-mid-row">
        {/* Completion Ring */}
        <div className="completion-card glass">
          <div className="completion-ring-wrap">
            <svg viewBox="0 0 80 80" className="completion-ring">
              <circle cx="40" cy="40" r="32" className="ring-bg" />
              <circle
                cx="40" cy="40" r="32"
                className="ring-fill"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - completionRate / 100)}`}
              />
            </svg>
            <div className="ring-label">
              <span className="ring-pct">{completionRate}%</span>
              <span className="ring-sub">Done</span>
            </div>
          </div>
          <div className="completion-info">
            <h3 className="completion-title">Overall Progress</h3>
            <p className="completion-desc">{stats.Completed} of {chores.length} chores completed</p>
            <div className="completion-stats">
              <span style={{ color: 'var(--status-overdue)' }}>{stats.Overdue} overdue</span>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span style={{ color: 'var(--status-inprogress)' }}>{stats.InProgress} in progress</span>
            </div>
          </div>
        </div>

        {/* Top members by activity */}
        <div className="top-members glass">
          <div className="widget-header">
            <span className="widget-title"><Users size={14} /> Team Activity</span>
          </div>
          <div className="top-member-list">
            {members.slice(0, 4).map(m => {
              const myChores  = chores.filter(c => c.assignedToId === m.id);
              const myDone    = myChores.filter(c => c.status === 'Completed').length;
              const pct       = myChores.length ? Math.round((myDone / myChores.length) * 100) : 0;
              const initials  = m.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
              return (
                <div key={m.id} className="top-member-row">
                  <div className="avatar" style={{ background: m.avatarColor }}>
                    {initials}
                  </div>
                  <div className="top-member-info">
                    <div className="top-member-name-row">
                      <span className="top-member-name">{m.name}</span>
                      <span className="top-member-pct">{pct}%</span>
                    </div>
                    <div className="top-member-bar-track">
                      <div className="top-member-bar-fill" style={{ width: `${pct}%`, background: m.avatarColor }} />
                    </div>
                  </div>
                </div>
              );
            })}
            {members.length === 0 && <p className="widget-empty">No team members yet.</p>}
          </div>
        </div>
      </div>

      {/* ── Overdue + Upcoming ── */}
      <div className="dash-bottom-row">
        {/* Overdue */}
        {overdueChores.length > 0 && (
          <div className="chore-list-widget glass">
            <div className="widget-header">
              <span className="widget-title"><AlertCircle size={14} color="var(--accent-danger)" /> Overdue</span>
              <span className="widget-count" style={{ color: 'var(--accent-danger)' }}>{overdueChores.length}</span>
            </div>
            <div className="chore-widget-list">
              {overdueChores.map(c => <ChoreRow key={c.id} chore={c} memberById={memberById} onSelect={setSelected} onComplete={completeChore} dueDateLabel={dueDateLabel} />)}
            </div>
          </div>
        )}

        {/* Upcoming */}
        <div className="chore-list-widget glass" style={{ flex: 2 }}>
          <div className="widget-header">
            <span className="widget-title"><CalendarDays size={14} /> Upcoming (7 days)</span>
            <span className="widget-count">{upcoming.length}</span>
          </div>
          {upcoming.length === 0 ? (
            <div className="widget-empty-state">
              <CheckCircle2 size={24} opacity={0.3} />
              <p>All clear for the next 7 days!</p>
            </div>
          ) : (
            <div className="chore-widget-list">
              {upcoming.map(c => <ChoreRow key={c.id} chore={c} memberById={memberById} onSelect={setSelected} onComplete={completeChore} dueDateLabel={dueDateLabel} />)}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && <ChoreModal onClose={() => setShowModal(false)} />}
      {selected  && (
        <ChoreDetailPanel
          chore={selected}
          onClose={() => setSelected(null)}
          onComplete={() => { completeChore(selected.id); setSelected(null); }}
        />
      )}
    </div>
  );
}

function ChoreRow({ chore, memberById, onSelect, onComplete, dueDateLabel }) {
  const member = memberById(chore.assignedToId);
  const due    = dueDateLabel(chore.dueDate);

  return (
    <div className={`chore-widget-row chore-widget-row--${chore.status.toLowerCase()}`} onClick={() => onSelect(chore)}>
      <button
        className="chore-complete-btn"
        onClick={e => { e.stopPropagation(); if (chore.status !== 'Completed') onComplete(chore.id); }}
        aria-label="Mark complete"
      >
        <CheckCircle2 size={16} color={chore.status === 'Completed' ? 'var(--accent-teal)' : 'var(--text-muted)'} />
      </button>
      <div className="chore-widget-info">
        <span className={`chore-widget-title ${chore.status === 'Completed' ? 'chore-widget-title--done' : ''}`}>{chore.title}</span>
        <div className="chore-widget-meta">
          {chore.recurringType && chore.recurringType !== 'None' && (
            <span className="chore-recurring-tag"><Repeat2 size={10} /> {chore.recurringType}</span>
          )}
          {chore.category && <span className="chore-category-tag">{chore.category}</span>}
        </div>
      </div>
      <div className="chore-widget-right">
        {member && (
          <div className="avatar" style={{ background: member.avatarColor, width: 22, height: 22, fontSize: 9 }}>
            {member.name[0]}
          </div>
        )}
        <span className={`due-label ${due.cls}`}>{due.text}</span>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

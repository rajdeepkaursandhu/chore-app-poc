import { useState, useMemo } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, addWeeks, subWeeks, addDays, subDays,
  isSameDay, isSameMonth, isToday, parseISO, eachDayOfInterval, getHours
} from 'date-fns';
import { useApp } from '../store/AppStore';
import { ChevronLeft, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';
import ChoreModal from './ChoreModal';
import ChoreDetailPanel from './ChoreDetailPanel';
import './CalendarView.css';

const VIEWS = ['Month', 'Week', 'Day'];

const STATUS_COLORS = {
  ToDo:       'var(--status-todo)',
  InProgress: 'var(--status-inprogress)',
  Completed:  'var(--status-completed)',
  Overdue:    'var(--status-overdue)',
};

export default function CalendarView() {
  const { chores, members, completeChore } = useApp();

  const [view, setView]           = useState('Month');
  const [current, setCurrent]     = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [defaultDate, setDefault] = useState(null);
  const [selected, setSelected]   = useState(null); // selected chore for detail panel

  // ── Navigation ──────────────────────────────────────────────────────────────
  const navigate = (dir) => {
    if (view === 'Month')     setCurrent(dir === 1 ? addMonths(current, 1) : subMonths(current, 1));
    else if (view === 'Week') setCurrent(dir === 1 ? addWeeks(current, 1)  : subWeeks(current, 1));
    else                      setCurrent(dir === 1 ? addDays(current, 1)   : subDays(current, 1));
  };

  const goToday = () => setCurrent(new Date());

  // ── Header label ─────────────────────────────────────────────────────────────
  const headerLabel = useMemo(() => {
    if (view === 'Month') return format(current, 'MMMM yyyy');
    if (view === 'Week') {
      const s = startOfWeek(current, { weekStartsOn: 1 });
      const e = endOfWeek(current,   { weekStartsOn: 1 });
      return `${format(s, 'MMM d')} – ${format(e, 'MMM d, yyyy')}`;
    }
    return format(current, 'EEEE, MMMM d, yyyy');
  }, [current, view]);

  // ── Grid days ────────────────────────────────────────────────────────────────
  const gridDays = useMemo(() => {
    if (view === 'Month') {
      const ms = startOfMonth(current);
      const me = endOfMonth(current);
      return eachDayOfInterval({
        start: startOfWeek(ms, { weekStartsOn: 1 }),
        end:   endOfWeek(me,   { weekStartsOn: 1 }),
      });
    }
    if (view === 'Week') {
      return eachDayOfInterval({
        start: startOfWeek(current, { weekStartsOn: 1 }),
        end:   endOfWeek(current,   { weekStartsOn: 1 }),
      });
    }
    return [current];
  }, [current, view]);

  const choresForDay = (day) =>
    chores.filter(c => isSameDay(parseISO(c.dueDate), day));

  const onDayClick = (day) => {
    setDefault(format(day, 'yyyy-MM-dd'));
    setShowModal(true);
  };

  const memberById = (id) => members.find(m => m.id === id);

  return (
    <div className="calendar-view animate-fadeInUp">
      {/* ── Toolbar ── */}
      <div className="cal-toolbar">
        <div className="cal-toolbar-left">
          <button className="btn btn-ghost cal-today-btn" id="cal-today-btn" onClick={goToday}>Today</button>
          <button className="cal-nav-btn" id="cal-prev-btn" onClick={() => navigate(-1)}><ChevronLeft size={16} /></button>
          <button className="cal-nav-btn" id="cal-next-btn" onClick={() => navigate(1)}><ChevronRight size={16} /></button>
          <h2 className="cal-header-label">{headerLabel}</h2>
        </div>
        <div className="cal-toolbar-right">
          <div className="view-switcher" role="group" aria-label="Calendar view">
            {VIEWS.map(v => (
              <button
                key={v}
                id={`view-${v.toLowerCase()}-btn`}
                className={`view-btn ${view === v ? 'view-btn--active' : ''}`}
                onClick={() => setView(v)}
              >{v}</button>
            ))}
          </div>
          <button id="cal-add-chore-btn" className="btn btn-primary" onClick={() => { setDefault(null); setShowModal(true); }}>
            <Plus size={15} /> Add Chore
          </button>
        </div>
      </div>

      {/* ── Calendar Grid ── */}
      <div className="cal-body glass">
        {/* Day-of-week headers */}
        {(view === 'Month' || view === 'Week') && (
          <div className={`cal-dow-row cal-dow-row--${view.toLowerCase()}`}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} className="cal-dow">{d}</div>
            ))}
          </div>
        )}

        {/* Month / Week Grid */}
        {(view === 'Month' || view === 'Week') && (
          <div className={`cal-grid cal-grid--${view.toLowerCase()}`}>
            {gridDays.map(day => {
              const dayChores = choresForDay(day);
              const isOtherMonth = view === 'Month' && !isSameMonth(day, current);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={`cal-cell ${isOtherMonth ? 'cal-cell--other' : ''} ${isCurrentDay ? 'cal-cell--today' : ''}`}
                  onClick={() => onDayClick(day)}
                >
                  <div className="cal-cell-header">
                    <span className={`cal-day-num ${isCurrentDay ? 'cal-day-num--today' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dayChores.length > 0 && (
                      <span className="cal-day-count">{dayChores.length}</span>
                    )}
                  </div>
                  <div className="cal-cell-chores">
                    {dayChores.slice(0, view === 'Week' ? 6 : 3).map(c => {
                      const member = memberById(c.assignedToId);
                      return (
                        <div
                          key={c.id}
                          className="cal-chore-pill"
                          style={{ borderLeftColor: STATUS_COLORS[c.status] || STATUS_COLORS.ToDo }}
                          onClick={e => { e.stopPropagation(); setSelected(c); }}
                          title={c.title}
                        >
                          {member && (
                            <span
                              className="pill-avatar"
                              style={{ background: member.avatarColor }}
                            >
                              {member.name[0]}
                            </span>
                          )}
                          <span className="pill-title">{c.title}</span>
                          {c.status === 'Completed' && <CheckCircle2 size={10} color="var(--accent-teal)" />}
                        </div>
                      );
                    })}
                    {dayChores.length > (view === 'Week' ? 6 : 3) && (
                      <span className="cal-more">+{dayChores.length - (view === 'Week' ? 6 : 3)} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Day View */}
        {view === 'Day' && (
          <DayView day={current} chores={choresForDay(current)} members={members} onChoreClick={setSelected} onAddClick={() => { setDefault(format(current, 'yyyy-MM-dd')); setShowModal(true); }} />
        )}
      </div>

      {/* Modals & Panels */}
      {showModal && (
        <ChoreModal defaultDate={defaultDate} onClose={() => setShowModal(false)} />
      )}
      {selected && (
        <ChoreDetailPanel
          chore={selected}
          onClose={() => setSelected(null)}
          onComplete={() => { completeChore(selected.id); setSelected(null); }}
        />
      )}
    </div>
  );
}

// ── Day View ──────────────────────────────────────────────────────────────────
function DayView({ day, chores, members, onChoreClick, onAddClick }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const memberById = (id) => members.find(m => m.id === id);

  return (
    <div className="day-view">
      <div className="day-view-header">
        <span className={`day-view-date ${isToday(day) ? 'day-view-date--today' : ''}`}>
          {format(day, 'EEEE, MMMM d')}
        </span>
        <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 14px' }} onClick={onAddClick}>
          <Plus size={13} /> Add
        </button>
      </div>
      {chores.length === 0 ? (
        <div className="day-view-empty">
          <p>No chores scheduled for this day.</p>
          <button className="btn btn-ghost" onClick={onAddClick}><Plus size={14} /> Add one now</button>
        </div>
      ) : (
        <div className="day-chore-list">
          {chores.map(c => {
            const member = memberById(c.assignedToId);
            return (
              <div
                key={c.id}
                className="day-chore-row"
                style={{ borderLeftColor: STATUS_COLORS[c.status] || STATUS_COLORS.ToDo }}
                onClick={() => onChoreClick(c)}
              >
                <div className="day-chore-info">
                  <span className="day-chore-title">{c.title}</span>
                  {c.description && <span className="day-chore-desc">{c.description}</span>}
                </div>
                <div className="day-chore-meta">
                  {member && (
                    <div className="avatar" style={{ background: member.avatarColor, width: 26, height: 26, fontSize: 11 }}>
                      {member.name[0]}
                    </div>
                  )}
                  <span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

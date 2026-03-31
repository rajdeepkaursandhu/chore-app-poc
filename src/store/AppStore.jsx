import { createContext, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateRecurringInstances } from '../utils/scheduleGenerator';

const AppContext = createContext(null);

// ── Seed Data ─────────────────────────────────────────────────────────────────
const SEED_MEMBERS = [
  { id: uuidv4(), name: 'Alex Rivera',   avatarColor: '#7c6ef7', role: 'Office Manager' },
  { id: uuidv4(), name: 'Sam Patel',     avatarColor: '#f06c9b', role: 'Developer'       },
  { id: uuidv4(), name: 'Jordan Kim',    avatarColor: '#3ecfb2', role: 'Designer'        },
  { id: uuidv4(), name: 'Morgan Chase',  avatarColor: '#f5a623', role: 'QA Engineer'     },
];

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

const SEED_CHORES = [
  {
    id: uuidv4(), title: 'Empty the dishwasher', description: 'Unload & stack dishes in the cabinet.',
    assignedToId: SEED_MEMBERS[0].id, status: 'ToDo',
    dueDate: fmt(today), recurringType: 'Daily', category: 'Kitchen',
  },
  {
    id: uuidv4(), title: 'Wipe down kitchen counters', description: 'Use the spray bottle under the sink.',
    assignedToId: SEED_MEMBERS[1].id, status: 'InProgress',
    dueDate: fmt(today), recurringType: 'Daily', category: 'Kitchen',
  },
  {
    id: uuidv4(), title: 'Take out recycling', description: 'Bring blue bins to the service elevator.',
    assignedToId: SEED_MEMBERS[2].id, status: 'Overdue',
    dueDate: fmt(addDays(today, -1)), recurringType: 'Weekly', category: 'Waste',
  },
  {
    id: uuidv4(), title: 'Vacuum common areas', description: 'Focus on lobby and meeting room floors.',
    assignedToId: SEED_MEMBERS[3].id, status: 'ToDo',
    dueDate: fmt(addDays(today, 2)), recurringType: 'Weekly', category: 'Cleaning',
  },
  {
    id: uuidv4(), title: 'Restock coffee station', description: 'Check beans, pods, creamer and sugar.',
    assignedToId: SEED_MEMBERS[0].id, status: 'Completed',
    dueDate: fmt(addDays(today, -2)), recurringType: 'Weekly', category: 'Kitchen',
  },
  {
    id: uuidv4(), title: 'Deep clean fridge', description: 'Remove expired items, wipe shelves.',
    assignedToId: SEED_MEMBERS[1].id, status: 'ToDo',
    dueDate: fmt(addDays(today, 5)), recurringType: 'Monthly', category: 'Kitchen',
  },
  {
    id: uuidv4(), title: 'Replace A/C filters', description: 'Filters are in the supply closet, room 3B.',
    assignedToId: SEED_MEMBERS[2].id, status: 'ToDo',
    dueDate: fmt(addDays(today, 8)), recurringType: 'Monthly', category: 'Maintenance',
  },
];

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [members, setMembers]           = useLocalStorage('choreboard_members', SEED_MEMBERS);
  const [chores, setChores]             = useLocalStorage('choreboard_chores',  SEED_CHORES);
  const [notifications, setNotifs]      = useLocalStorage('choreboard_notifs',  []);
  const [toasts, setToasts]             = useLocalStorage('choreboard_toasts',  []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const pushNotif = useCallback((message, type = 'info') => {
    const notif = { id: uuidv4(), message, type, read: false, date: new Date().toISOString() };
    setNotifs(prev => [notif, ...prev].slice(0, 50));
  }, [setNotifs]);

  const pushToast = useCallback((message, type = 'info') => {
    const id = uuidv4();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, [setToasts]);

  // ── Members CRUD ─────────────────────────────────────────────────────────────
  const addMember = useCallback((data) => {
    const m = { id: uuidv4(), ...data };
    setMembers(prev => [...prev, m]);
    pushNotif(`👤 ${m.name} joined the team.`, 'success');
    pushToast(`${m.name} added to the team!`, 'success');
    return m;
  }, [setMembers, pushNotif, pushToast]);

  const updateMember = useCallback((id, data) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    pushToast('Member updated.', 'success');
  }, [setMembers, pushToast]);

  const removeMember = useCallback((id) => {
    const m = members.find(x => x.id === id);
    setMembers(prev => prev.filter(x => x.id !== id));
    // Unassign chores assigned to this member
    setChores(prev => prev.map(c => c.assignedToId === id ? { ...c, assignedToId: null } : c));
    if (m) pushToast(`${m.name} removed from team.`, 'warning');
  }, [members, setMembers, setChores, pushToast]);

  // ── Chores CRUD ──────────────────────────────────────────────────────────────
  const addChore = useCallback((data) => {
    const base = { id: uuidv4(), status: 'ToDo', ...data };
    const instances = generateRecurringInstances(base);
    setChores(prev => [...prev, ...instances]);
    pushNotif(`📋 Chore "${base.title}" added.`, 'info');
    pushToast(`"${base.title}" added!`, 'success');
  }, [setChores, pushNotif, pushToast]);

  const updateChore = useCallback((id, data) => {
    setChores(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    pushToast('Chore updated.', 'success');
  }, [setChores, pushToast]);

  const removeChore = useCallback((id) => {
    const c = chores.find(x => x.id === id);
    setChores(prev => prev.filter(x => x.id !== id));
    if (c) pushToast(`"${c.title}" removed.`, 'warning');
  }, [chores, setChores, pushToast]);

  const completeChore = useCallback((id) => {
    setChores(prev => prev.map(c => c.id === id ? { ...c, status: 'Completed' } : c));
    const c = chores.find(x => x.id === id);
    if (c) {
      pushNotif(`✅ "${c.title}" marked complete.`, 'success');
      pushToast(`"${c.title}" completed! 🎉`, 'success');
    }
  }, [chores, setChores, pushNotif, pushToast]);

  // ── Notifications ────────────────────────────────────────────────────────────
  const markAllRead = useCallback(() => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifs]);

  const clearNotifications = useCallback(() => setNotifs([]), [setNotifs]);

  const value = {
    members, addMember, updateMember, removeMember,
    chores, addChore, updateChore, removeChore, completeChore,
    notifications, markAllRead, clearNotifications,
    toasts,
    pushNotif, pushToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

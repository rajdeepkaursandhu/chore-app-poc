import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppStore';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import TeamManager from './components/TeamManager';
import ToastContainer from './components/ToastContainer';
import { resolveOverdueStatuses } from './utils/scheduleGenerator';
import './App.css';

// Inner app needs access to context
function AppInner() {
  const [page, setPage] = useState('dashboard');
  const { chores, updateChore } = useApp();

  // Run overdue resolver once on mount (and whenever chores change)
  useEffect(() => {
    const resolved = resolveOverdueStatuses(chores);
    resolved.forEach((c, i) => {
      if (c.status !== chores[i]?.status) {
        updateChore(c.id, { status: c.status });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />;
      case 'calendar':  return <CalendarView />;
      case 'team':      return <TeamManager />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      {/* Ambient background glows */}
      <div className="bg-glow bg-glow--1" />
      <div className="bg-glow bg-glow--2" />
      <div className="bg-glow bg-glow--3" />

      <Sidebar activePage={page} onNavigate={setPage} />

      <main className="app-main" id="main-content">
        {renderPage()}
      </main>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

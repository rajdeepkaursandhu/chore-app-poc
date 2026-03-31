import { useState } from 'react';
import { LayoutDashboard, CalendarDays, Users, ChevronLeft, ChevronRight, ClipboardCheck, Zap } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',  icon: <LayoutDashboard size={18} /> },
  { id: 'calendar',  label: 'Calendar',   icon: <CalendarDays size={18} />    },
  { id: 'team',      label: 'Team',       icon: <Users size={18} />           },
];

export default function Sidebar({ activePage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar glass ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <ClipboardCheck size={20} color="#fff" />
        </div>
        {!collapsed && (
          <div className="logo-text">
            <span className="logo-name gradient-text">ChoreBoard</span>
            <span className="logo-sub">Office Task Manager</span>
          </div>
        )}
      </div>

      <div className="divider" />

      {/* Navigation */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`nav-item ${activePage === item.id ? 'nav-item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : undefined}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {activePage === item.id && !collapsed && (
              <span className="nav-active-dot" />
            )}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Notification Bell */}
      <div className={`sidebar-notifs ${collapsed ? 'sidebar-notifs--center' : ''}`}>
        <NotificationCenter />
        {!collapsed && <span className="notif-sidebar-label">Notifications</span>}
      </div>

      <div className="divider" />

      {/* Collapse Toggle */}
      <button
        id="sidebar-collapse-btn"
        className="sidebar-collapse-btn"
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}

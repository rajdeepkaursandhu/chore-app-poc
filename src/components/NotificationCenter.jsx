import { useState } from 'react';
import { Bell, BellRing, Check, Trash2, X } from 'lucide-react';
import { useApp } from '../store/AppStore';
import { formatDistanceToNow, parseISO } from 'date-fns';
import './NotificationCenter.css';

export default function NotificationCenter() {
  const { notifications, markAllRead, clearNotifications } = useApp();
  const [open, setOpen] = useState(false);

  const unread = notifications.filter(n => !n.read).length;
  const hasAny = notifications.length > 0;

  return (
    <div className="notif-wrapper">
      <button
        id="notification-bell-btn"
        className={`notif-bell btn-ghost ${unread > 0 ? 'notif-bell--active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Notifications"
      >
        {unread > 0 ? <BellRing size={18} /> : <Bell size={18} />}
        {unread > 0 && <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div className="notif-panel glass animate-fadeInUp" role="dialog" aria-label="Notification panel">
          <div className="notif-header">
            <span className="notif-title">Notifications</span>
            <div className="notif-actions">
              {hasAny && (
                <>
                  <button className="notif-action-btn" onClick={markAllRead} title="Mark all read">
                    <Check size={13} />
                  </button>
                  <button className="notif-action-btn notif-action-btn--danger" onClick={clearNotifications} title="Clear all">
                    <Trash2 size={13} />
                  </button>
                </>
              )}
              <button className="notif-action-btn" onClick={() => setOpen(false)}>
                <X size={13} />
              </button>
            </div>
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <Bell size={28} opacity={0.3} />
                <p>All caught up!</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
                >
                  <span className={`notif-dot notif-dot--${n.type}`} />
                  <div className="notif-body">
                    <p className="notif-msg">{n.message}</p>
                    <span className="notif-time">
                      {formatDistanceToNow(parseISO(n.date), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

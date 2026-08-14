import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import Avatar from './Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { unreadCount } from '../lib/api.js';
import { handle } from '../lib/format.js';
import {
  IconHome,
  IconExplore,
  IconBell,
  IconChat,
  IconUser,
  IconSettings,
  IconLogout,
} from './Icons.jsx';

const NAV = [
  { to: '/', label: 'Home', icon: IconHome, end: true },
  { to: '/explore', label: 'Explore', icon: IconExplore },
  { to: '/notifications', label: 'Notifications', icon: IconBell },
  { to: '/messages', label: 'Messages', icon: IconChat },
  { to: '/settings', label: 'Settings', icon: IconSettings },
];

export default function Layout() {
  const { profile, signOut } = useAuth();
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!profile?.id) return;
    unreadCount(profile.id).then(setUnread);
    const ch = window.setInterval(() => {
      if (document.hasFocus()) unreadCount(profile.id).then(setUnread);
    }, 30000);
    return () => clearInterval(ch);
  }, [profile?.id, pathname]);

  const title = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))?.label || 'Flow';

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <Logo />
          <span className="brand-name">Flow</span>
        </div>
        <nav className="nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon />
              <span className="nav-label">{label}</span>
              {label === 'Notifications' && unread > 0 && (
                <span className="badge-count">{unread > 9 ? '9+' : unread}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        {profile && (
          <div className="sidebar-user">
            <Avatar profile={profile} size={40} />
            <div className="meta">
              <div style={{ fontWeight: 700, fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile.display_name || profile.username}
              </div>
              <div className="muted-3">@{handle(profile.username)}</div>
            </div>
            <button
              className="action"
              title="Sign out"
              onClick={async () => {
                await signOut();
                nav('/');
              }}
            >
              <IconLogout size={18} />
            </button>
          </div>
        )}
      </aside>
      <main className="main">
        <header className="topbar">
          <span className="topbar-title">{title}</span>
          {profile && (
            <NavLink to={`/${handle(profile.username)}`} className="action">
              <IconUser size={18} /> <span className="nav-label">My profile</span>
            </NavLink>
          )}
        </header>
        <Outlet />
      </main>
    </div>
  );
}

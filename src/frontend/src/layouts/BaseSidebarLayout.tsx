import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Anchor,
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  Menu,
  X,
  User as UserIcon,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: string | number;
  hasUnread?: boolean;
}

export interface SidebarNavSection {
  header?: string;
  items: SidebarNavItem[];
}

export interface BaseSidebarLayoutProps {
  roleTitle: string;
  roleBadge: string;
  accentColor?: 'primary' | 'secondary' | 'accent';
  navSections: SidebarNavSection[];
  activeItemId?: string;
  onItemSelect?: (id: string) => void;
  pageTitle?: string;
  breadcrumbs?: string[];
  unreadNotificationCount?: number;
  children: React.ReactNode;
}

export const BaseSidebarLayout: React.FC<BaseSidebarLayoutProps> = ({
  roleTitle,
  roleBadge,
  accentColor = 'primary',
  navSections,
  activeItemId,
  onItemSelect,
  pageTitle: propPageTitle,
  breadcrumbs: propBreadcrumbs,
  unreadNotificationCount: propUnreadCount,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, switchRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();

  const effectiveUnreadCount = propUnreadCount !== undefined ? propUnreadCount : unreadCount;

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Accent styling mappings
  const accentStyles = {
    primary: {
      badge: 'bg-primary/15 text-primary border-primary/30',
      activeBg: 'bg-primary/10',
      activeText: 'text-primary',
      activeBorder: 'border-l-2 border-primary',
      ring: 'focus:ring-primary/40',
      dot: 'bg-primary',
      crumb: 'text-primary',
    },
    secondary: {
      badge: 'bg-secondary/15 text-secondary border-secondary/30',
      activeBg: 'bg-secondary/10',
      activeText: 'text-secondary',
      activeBorder: 'border-l-2 border-secondary',
      ring: 'focus:ring-secondary/40',
      dot: 'bg-secondary',
      crumb: 'text-secondary',
    },
    accent: {
      badge: 'bg-accent/15 text-accent border-accent/30',
      activeBg: 'bg-accent/10',
      activeText: 'text-accent',
      activeBorder: 'border-l-2 border-accent',
      ring: 'focus:ring-accent/40',
      dot: 'bg-accent',
      crumb: 'text-accent',
    },
  }[accentColor];

  // Derive current active item from route or prop
  const allItems = navSections.flatMap((section) => section.items);
  const currentActiveItem =
    allItems.find((item) => item.id === activeItemId) ||
    allItems.find((item) => item.path && location.pathname.startsWith(item.path)) ||
    allItems[0];

  const effectivePageTitle =
    propPageTitle || (currentActiveItem ? currentActiveItem.label : 'Control Console');

  const effectiveBreadcrumbs = propBreadcrumbs || [
    'DockNova',
    roleTitle,
    effectivePageTitle,
  ];

  const handleNavClick = (item: SidebarNavItem) => {
    if (onItemSelect) {
      onItemSelect(item.id);
    }
    if (item.path) {
      navigate(item.path);
    }
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // User initials for avatar
  const isAdm = roleTitle.toLowerCase().includes('admin');
  const isMgr = roleTitle.toLowerCase().includes('manager');

  const userName =
    user?.name ||
    (isAdm
      ? 'Marcus Drake'
      : isMgr
      ? 'Capt. Vance Alexander'
      : 'Elena Rostova');
  const userEmail =
    user?.email ||
    (isAdm
      ? 'admin@docknova.com'
      : isMgr
      ? 'captain@docknova.com'
      : 'operator@docknova.com');

  const nameParts = userName.split(' ').filter((part) => !part.includes('.'));
  const initials =
    (nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
      : nameParts[0]?.slice(0, 2) || 'DN'
    ).toUpperCase();

  return (
    <div className="min-h-screen bg-base text-text-primary flex">
      {/* =========================================================================
          1. MOBILE BACKDROP OVERLAY
         ========================================================================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* =========================================================================
          2. SIDEBAR (Fixed w-64 on Desktop, w-20 on Tablet, Slide-in on Mobile)
         ========================================================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 h-screen bg-surface-1 border-r border-border flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } w-64 md:w-20 lg:w-64`}
        aria-label="Sidebar Navigation"
      >
        {/* Sidebar Top: Logo + Role Badge */}
        <div className="p-4 lg:p-5 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center flex-shrink-0 shadow-glow-primary/20">
                <Anchor className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <div className="hidden lg:block truncate">
                <span className="font-heading font-bold text-xl tracking-tight text-text-primary">
                  Dock<span className="text-primary">Nova</span>
                </span>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                  Maritime OS
                </p>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary md:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role badge pill */}
          <div className="mt-3 hidden lg:block">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${accentStyles.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${accentStyles.dot} animate-pulse`} />
              {roleBadge}
            </span>
          </div>
        </div>

        {/* Sidebar Center: Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, sIndex) => (
            <div key={section.header || sIndex} className="space-y-1">
              {section.header && (
                <div className="hidden lg:block px-3 mb-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-text-muted">
                  {section.header}
                </div>
              )}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = currentActiveItem?.id === item.id;
                  const itemBadge =
                    item.id === 'notifications'
                      ? effectiveUnreadCount > 0
                        ? effectiveUnreadCount
                        : undefined
                      : item.badge;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item)}
                      title={item.label}
                      className={`relative w-full py-2.5 px-3 lg:px-4 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors group cursor-pointer ${
                        isActive
                          ? `${accentStyles.activeText} font-semibold`
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                      }`}
                    >
                      {/* Active Sliding Indicator (layoutId) */}
                      {isActive && (
                        <motion.div
                          layoutId={`activeNav-${roleTitle}`}
                          className={`absolute inset-0 rounded-lg ${accentStyles.activeBg} ${accentStyles.activeBorder}`}
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}

                      {/* Icon */}
                      <span className="relative z-10 flex-shrink-0 flex items-center justify-center w-5 h-5">
                        {item.icon}
                      </span>

                      {/* Label (Desktop only, hidden on tablet icons-only mode) */}
                      <span className="relative z-10 hidden lg:inline truncate">
                        {item.label}
                      </span>

                      {/* Badge / Unread notification dot */}
                      {(item.hasUnread || itemBadge !== undefined) && (
                        <span className="relative z-10 ml-auto hidden lg:flex items-center">
                          {itemBadge !== undefined ? (
                            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-full bg-primary/20 text-primary border border-primary/40 font-bold">
                              {itemBadge}
                            </span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Bottom: User Profile + Logout */}
        <div className="p-3 lg:p-4 border-t border-border/60 bg-surface-1/50 space-y-3">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-surface-2 border border-border flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                {initials}
              </div>
              <div className="hidden lg:block truncate">
                <div className="text-xs font-semibold text-text-primary truncate">
                  {userName}
                </div>
                <div className="text-[11px] text-text-muted truncate">
                  {userEmail}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              title="Logout session"
              className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          3. MAIN LAYOUT WRAPPER (Offset by sidebar width)
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-20 lg:ml-64">
        {/* =======================================================================
            TOPBAR (Fixed top-0, h-16, with glassmorphism)
           ======================================================================= */}
        <header className="fixed top-0 right-0 left-0 md:left-20 lg:left-64 h-16 bg-surface-1/80 backdrop-blur-md border-b border-border z-40 px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Topbar Left: Hamburger Toggle + Title + Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 md:hidden"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-text-muted font-mono truncate">
                {effectiveBreadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb}>
                    <span
                      className={
                        idx === effectiveBreadcrumbs.length - 1
                          ? `font-medium ${accentStyles.crumb}`
                          : 'hover:text-text-secondary cursor-default'
                      }
                    >
                      {crumb}
                    </span>
                    {idx < effectiveBreadcrumbs.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-text-muted/60 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <h1 className="font-heading text-lg sm:text-xl font-bold text-text-primary truncate">
                {effectivePageTitle}
              </h1>
            </div>
          </div>

          {/* Topbar Center: Global Search Bar */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vessels, berths, or ask AI..."
                className={`w-full pl-9 pr-4 py-2 rounded-full bg-surface-2 border border-border/80 text-xs sm:text-sm text-text-primary placeholder:text-text-muted/60 outline-none transition-all ${accentStyles.ring} focus:border-transparent`}
              />
            </div>
          </div>

          {/* Topbar Right: Notification + Theme Toggle + User Avatar Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Notification Bell with Ping Dot + Popover Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationDropdownOpen((prev) => !prev)}
                title="Operational notifications"
                className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
                  notificationDropdownOpen
                    ? 'bg-surface-2 text-primary border border-primary/30'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
                aria-label="Notifications"
                aria-expanded={notificationDropdownOpen}
              >
                <Bell className="w-4 h-4" />
                {effectiveUnreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                )}
              </button>

              {/* Notification Interactive Dropdown */}
              <AnimatePresence>
                {notificationDropdownOpen && (
                  <NotificationDropdown
                    isOpen={notificationDropdownOpen}
                    onClose={() => setNotificationDropdownOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle (Dark / Light Mode) */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all cursor-pointer inline-flex items-center justify-center border border-border/40 hover:border-border"
              aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-sky-500 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* User Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-surface-2 transition-colors border border-border/60 cursor-pointer"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 rounded-full bg-surface-2 border border-primary/40 flex items-center justify-center text-xs font-semibold text-primary">
                  {initials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted mr-1 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-1 border border-border shadow-2xl p-1.5 z-50 backdrop-blur-md"
                  >
                    <div className="px-3 py-2 border-b border-border/60 mb-1">
                      <div className="text-xs font-semibold text-text-primary truncate">
                        {userName}
                      </div>
                      <div className="text-[11px] text-text-muted truncate">
                        {userEmail}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border ${accentStyles.badge}`}
                        >
                          {roleBadge}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        switchRole();
                        navigate('/select-role');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors text-left cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Switch Console Role</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        toggleTheme();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors text-left cursor-pointer"
                    >
                      {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-500" />}
                      <span>{isDark ? 'Light Theme Mode' : 'Dark Theme Mode'}</span>
                    </button>

                    <div className="my-1 border-t border-border/60" />

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-danger hover:bg-danger/10 transition-colors text-left font-medium cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Exit / Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* =======================================================================
            4. MAIN CONTENT AREA (ml offset + mt-16 + p-6 + min-h-[calc(100vh-4rem)])
           ======================================================================= */}
        <main className="mt-16 p-4 sm:p-6 min-h-[calc(100vh-4rem)] bg-base">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActiveItem?.id || location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, GraduationCap, BookOpen, ClipboardCheck, CalendarDays, CreditCard, UserCircle, LogOut, Menu, X } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  userName: string;
  activePath: string;
  onNavigate: (path: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'programme', label: 'My Programme', path: '/programme', icon: GraduationCap },
  { id: 'courses', label: 'Courses', path: '/courses', icon: BookOpen },
  { id: 'attendance', label: 'Attendance', path: '/attendance', icon: ClipboardCheck },
  { id: 'events', label: 'Events & Schedule', path: '/events', icon: CalendarDays },
  { id: 'payment', label: 'Payment', path: '/payment', icon: CreditCard },
  { id: 'profile', label: 'Profile', path: '/profile', icon: UserCircle },
];

export const EnterpriseSidebar: React.FC<SidebarProps> = ({ onLogout, userName, activePath, onNavigate }) => {
  // Start closed on mobile so it doesn't block the screen!
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Auto-expand sidebar ONLY on laptops/desktops
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsCollapsed(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile Floating Menu Button - ONLY shows when menu is closed */}
      {isCollapsed && (
        <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#171717] border border-white/10 text-[#e3e3e3] rounded-md shadow-2xl" onClick={() => setIsCollapsed(false)}>
          <Menu size={24} />
        </button>
      )}

      {/* Dark Overlay to tap-to-close on mobile */}
      {!isCollapsed && (
        <div className="md:hidden fixed inset-0 bg-black/70 z-30 transition-opacity" onClick={() => setIsCollapsed(true)} />
      )}

      {/* Sidebar Navigation */}
      <nav className={`absolute md:relative top-0 left-0 h-screen bg-[#171717] border-r border-white/5 text-[#e3e3e3] flex flex-col shadow-2xl transition-all duration-300 z-40 flex-shrink-0 ${isCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64'}`}>
        
        {/* --- BRANDING HEADER (Matched to official KSOM design) --- */}
        <div className="relative pt-4 pb-8 border-b border-white/5 flex flex-col items-center justify-center min-h-[140px]">
          
          {/* Mobile Close Button (Top Right) */}
          <button 
            onClick={() => setIsCollapsed(true)} 
            className="md:hidden absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
          >
            <X size={26} strokeWidth={1.5} />
          </button>

          {/* Desktop Toggle Button (Top Right) */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="hidden md:block absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Logo (Centered & Prominent) */}
          {!isCollapsed && (
            <img 
              src="/logo.png" 
              alt="Koinonia KSOM" 
              className="h-20 w-auto object-contain drop-shadow-lg mt-6" 
            />
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = activePath === item.path;
            const Icon = item.icon;
            return (
              <button key={item.id} 
                onClick={() => { 
                  onNavigate(item.path);
                  // Auto-close menu on phones after clicking a link
                  if (window.innerWidth < 768) setIsCollapsed(true);
                }} 
                className={`relative flex items-center h-12 rounded-lg transition-all duration-200 group ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive ? 'bg-white/10 text-white font-medium' : 'text-white/40 hover:bg-white/5 hover:text-[#e3e3e3]'}`}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e3e3e3] rounded-r-full" />}
                <Icon size={22} className="flex-shrink-0" />
                {!isCollapsed && <span className="ml-4 whitespace-nowrap truncate text-sm">{item.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="px-3 py-4 border-t border-white/5">
          <button onClick={handleLogout} className={`w-full flex items-center h-12 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
            <LogOut size={22} className="flex-shrink-0" />
            {!isCollapsed && <span className="ml-4 text-sm font-medium">Logout</span>}
          </button>
        </div>

        <div className="flex items-center p-4 border-t border-white/5 bg-[#0f0f0f] min-h-[80px]">
          <div className="flex-shrink-0 bg-white/10 p-2 rounded-full"><UserCircle size={24} className="text-[#e3e3e3]"/></div>
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-[#e3e3e3] truncate">{userName}</p>
              <p className="text-xs text-white/40 truncate">Student</p>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
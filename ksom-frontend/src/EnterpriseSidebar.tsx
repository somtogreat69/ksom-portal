import React, { useState } from 'react';
import { LayoutDashboard, GraduationCap, BookOpen, ClipboardCheck, CalendarDays, CreditCard, UserCircle, LogOut, Menu, X } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  userName: string;
  activePath: string;                      // <-- NEW: Receives current path
  onNavigate: (path: string) => void;      // <-- NEW: Tells App.tsx to change path
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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#0f0f0f] text-[#e3e3e3] rounded-md shadow-lg" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <Menu size={24} /> : <X size={24} />}
      </button>

      <nav className={`fixed top-0 left-0 h-screen bg-[#171717] border-r border-white/5 text-[#e3e3e3] flex flex-col shadow-2xl transition-all duration-300 z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
          {!isCollapsed && <img src="/logo.png" alt="Koinonia" className="h-10 object-contain drop-shadow-lg opacity-90" />}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:block p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = activePath === item.path;
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => onNavigate(item.path)} // <-- NEW: Triggers navigation
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
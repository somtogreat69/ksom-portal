import { useState } from 'react';
import { DailyAttendance } from './DailyAttendance';
import { Auth } from './Auth';
import { EnterpriseSidebar } from './EnterpriseSidebar';
import { DashboardView, ProgrammeView, CoursesView, EventsView, PaymentView, ProfileView } from './PortalViews';

function App() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  
  // This state controls which page is currently visible
  const [currentView, setCurrentView] = useState<string>('/dashboard');

  // A simple router function to display the correct component
  const renderView = () => {
    switch (currentView) {
      case '/dashboard':
        return <DashboardView userName={user?.name || ''} />;
      case '/programme':
        return <ProgrammeView />;
      case '/courses':
        return <CoursesView />;
      case '/attendance':
        return (
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-[#e3e3e3] tracking-tight">Daily Attendance</h1>
              <p className="text-white/40 mt-2">Please mark your attendance below.</p>
            </div>
            <DailyAttendance />
          </div>
        );
      case '/events':
        return <EventsView />;
      case '/payment':
        return <PaymentView />;
      case '/profile':
        return <ProfileView userName={user?.name || ''} />;
      default:
        return <DashboardView userName={user?.name || ''} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] font-sans antialiased text-[#e3e3e3] flex overflow-hidden">
      
      {user ? (
        <>
          <EnterpriseSidebar 
            userName={user.name} 
            activePath={currentView}
            onNavigate={(path) => setCurrentView(path)}
            onLogout={() => setUser(null)} 
          />

          <main className="flex-1 h-screen overflow-y-auto relative">
            <div className="min-h-full p-6 pt-24 md:p-12 pb-24">
              {renderView()}
            </div>
          </main>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0f0f0f] via-[#171717] to-[#0f0f0f]">
          <div className="mb-8 flex flex-col items-center">
            <img src="/logo.png" alt="Koinonia" className="h-24 object-contain drop-shadow-lg opacity-90" />
          </div>
          <Auth onSuccess={(loggedInUser) => setUser(loggedInUser)} />
        </div>
      )}
      
    </div>
  )
}

export default App;
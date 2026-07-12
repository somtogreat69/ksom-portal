import React from 'react';
import { CheckCircle2, Clock, Calendar, User, Award, BookOpen } from 'lucide-react';

// --- SHARED UI COMPONENTS ---
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#171717] rounded-2xl border border-white/5 p-6 ${className}`}>
    {children}
  </div>
);

// --- 1. DASHBOARD VIEW ---
export const DashboardView = ({ userName }: { userName: string }) => (
  <div className="space-y-6 w-full max-w-5xl mx-auto animate-in fade-in duration-500">
    <div>
      <h1 className="text-3xl font-extrabold text-[#e3e3e3]">Welcome back, {userName}</h1>
      <p className="text-white/40 mt-1">Here is your ministry training overview for today.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/40 text-sm font-medium">Overall Progress</p>
            <p className="text-3xl font-bold text-[#e3e3e3] mt-2">64%</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl"><Award className="text-[#e3e3e3]" size={24} /></div>
        </div>
        <div className="w-full bg-[#0f0f0f] rounded-full h-2 mt-4"><div className="bg-[#e3e3e3] h-2 rounded-full w-[64%]"></div></div>
      </Card>
      
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/40 text-sm font-medium">Next Class</p>
            <p className="text-xl font-bold text-[#e3e3e3] mt-2">Pneumatology 101</p>
            <p className="text-sm text-white/40 mt-1">Today, 4:00 PM WAT</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl"><Clock className="text-[#e3e3e3]" size={24} /></div>
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/40 text-sm font-medium">Attendance Rate</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">92%</p>
          </div>
          <div className="p-3 bg-emerald-950/30 rounded-xl"><CheckCircle2 className="text-emerald-500" size={24} /></div>
        </div>
        <p className="text-sm text-white/40 mt-4">You are in good standing.</p>
      </Card>
    </div>
  </div>
);

// --- 2. PROGRAMME VIEW ---
export const ProgrammeView = () => (
  <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">
    <h1 className="text-2xl font-bold text-[#e3e3e3] mb-6">My Programme</h1>
    <Card>
      <div className="border-b border-white/5 pb-6 mb-6">
        <h2 className="text-xl font-bold">KSOM Advanced Ministry Training</h2>
        <p className="text-white/40 mt-2">Class of 2026 </p>
      </div>
      <div className="space-y-4">
        {[
          { title: "Semester 1: Foundation of Faith", status: "Completed", date: "Jan - Jun 2025" },
          { title: "Semester 2: Ministerial Ethics", status: "Completed", date: "Jul - Dec 2025" },
          { title: "Semester 3: Spiritual Warfare & Dynamics", status: "In Progress", date: "Jan - Jun 2026" },
          { title: "Semester 4: Apostolic Leadership", status: "Upcoming", date: "Jul - Dec 2026" },
        ].map((mod, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-xl border border-white/5">
            <div>
              <p className="font-bold text-[#e3e3e3]">{mod.title}</p>
              <p className="text-sm text-white/40">{mod.date}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              mod.status === 'Completed' ? 'bg-emerald-950/30 text-emerald-400' : 
              mod.status === 'In Progress' ? 'bg-blue-950/30 text-blue-400' : 'bg-white/5 text-white/40'
            }`}>{mod.status}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// --- 3. COURSES VIEW ---
export const CoursesView = () => (
  <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">
    <h1 className="text-2xl font-bold text-[#e3e3e3] mb-6">Courses</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { name: "Finance", instructor: "Apostle Joshua Selman", progress: 75 },
        { name: "Ministry", instructor: "Pst. David", progress: 40 },
        { name: "Pneumatology", instructor: "Apostle Joshua Selman", progress: 90 },
        { name: "Personal Transformation", instructor: "Min. Grace", progress: 10 },
      ].map((course, i) => (
        <Card key={i} className="hover:border-white/20 transition-colors cursor-pointer">
          <div className="flex items-start space-x-4">
            <div className="p-4 bg-white/5 rounded-xl"><BookOpen className="text-[#e3e3e3]" size={24} /></div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{course.name}</h3>
              <p className="text-sm text-white/40 mb-4">{course.instructor}</p>
              <div className="w-full bg-[#0f0f0f] rounded-full h-1.5"><div className="bg-[#e3e3e3] h-1.5 rounded-full" style={{width: `${course.progress}%`}}></div></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// --- 4. EVENTS VIEW ---
export const EventsView = () => (
  <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-[#e3e3e3]">Events & Schedule</h1>
      <p className="text-white/40 mt-1">Upcoming sessions, services, and special events</p>
    </div>
    
    {/* Empty State Card */}
    <Card className="flex flex-col items-center justify-center py-16">
      <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
        <Calendar size={32} className="text-white/40" />
      </div>
      <h2 className="text-xl font-bold text-[#e3e3e3]">No events available</h2>
      <p className="text-sm text-white/40 text-center mt-2 max-w-sm">
        There are currently no upcoming sessions or services. Please check back later.
      </p>
    </Card>

    {/* Tip Box */}
    <div className="mt-6 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
      <p className="text-sm text-emerald-400/90 leading-relaxed">
        <span className="font-bold text-emerald-400">Tip:</span> Mark these dates on your personal calendar to ensure you don't miss any sessions. Regular attendance is encouraged for your spiritual growth.
      </p>
    </div>
  </div>
);
// --- 5. PAYMENT VIEW ---
export const PaymentView = () => (
  <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">
    <h1 className="text-2xl font-bold text-[#e3e3e3] mb-6">Financial Records</h1>
    <Card>
      <table className="w-full text-left">
        <thead>
          <tr className="text-white/40 text-sm border-b border-white/5">
            <th className="pb-3 font-medium">Invoice ID</th>
            <th className="pb-3 font-medium">Description</th>
            <th className="pb-3 font-medium">Amount (₦)</th>
            <th className="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr>
            <td className="py-4 text-[#e3e3e3]">INV-2026-001</td>
            <td className="py-4">Semester 3 Tuition Fee</td>
            <td className="py-4 font-mono">150,000</td>
            <td className="py-4"><span className="px-2 py-1 bg-emerald-950/30 text-emerald-400 rounded text-xs font-bold">PAID</span></td>
          </tr>
          <tr className="border-t border-white/5">
            <td className="py-4 text-[#e3e3e3]">INV-2026-045</td>
            <td className="py-4">Study Materials & Books</td>
            <td className="py-4 font-mono">25,000</td>
            <td className="py-4"><span className="px-2 py-1 bg-amber-950/30 text-amber-400 rounded text-xs font-bold">PENDING</span></td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
);

// --- 6. PROFILE VIEW ---
export const ProfileView = ({ userName }: { userName: string }) => (
  <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">
    <h1 className="text-2xl font-bold text-[#e3e3e3] mb-6">Student Profile</h1>
    <Card className="flex flex-col md:flex-row items-center md:items-start gap-8">
      <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
        <User size={64} className="text-[#e3e3e3]" />
      </div>
      <div className="flex-1 space-y-4 text-center md:text-left">
        <div>
          <h2 className="text-3xl font-bold text-[#e3e3e3]">{userName}</h2>
          <p className="text-white/40">KSOM/2026/0892 • Advanced Diploma</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
          <div className="bg-[#0f0f0f] p-4 rounded-xl border border-white/5">
            <p className="text-white/40 mb-1">Email Address</p>
            <p className="font-bold">{userName.toLowerCase().replace(' ', '.')}@student.ksom.org</p>
          </div>
          <div className="bg-[#0f0f0f] p-4 rounded-xl border border-white/5">
            <p className="text-white/40 mb-1">Phone Number</p>
            <p className="font-bold">+234 (0) 800 000 0000</p>
          </div>
          <div className="bg-[#0f0f0f] p-4 rounded-xl border border-white/5">
            <p className="text-white/40 mb-1">Campus</p>
            <p className="font-bold">Abuja (DOAF Headquarters)</p>
          </div>
          <div className="bg-[#0f0f0f] p-4 rounded-xl border border-white/5">
            <p className="text-white/40 mb-1">Enrollment Date</p>
            <p className="font-bold">January 12, 2025</p>
          </div>
        </div>
      </div>
    </Card>
  </div>
);
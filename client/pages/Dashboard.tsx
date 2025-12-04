import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { db } from '../services/mockDb';
import { AttendanceRecord } from '../types';
import { Users, Calendar, Award, Fingerprint, Clock, CheckCircle2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ employeeCount: 0, pendingRequests: 0, avgScore: 0 });
  const [attendance, setAttendance] = useState<AttendanceRecord | undefined>(undefined);
  const [isScanning, setIsScanning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const users = await db.getUsers();
      const requests = await db.getTimeOffRequests();
      const scores = await db.getScores();
      
      const pending = requests.filter(r => r.status === 'PENDING').length;
      const totalScore = scores.reduce((acc, curr) => acc + curr.score, 0);
      const avg = scores.length ? Math.round(totalScore / scores.length) : 0;

      setStats({
        employeeCount: users.length,
        pendingRequests: pending,
        avgScore: avg
      });

      if (user) {
        const todayRecord = await db.getTodayAttendance(user.id);
        setAttendance(todayRecord);
      }
    };
    fetchData();
  }, [user]);

  const handleFingerprintClick = async () => {
    if (!user || isScanning) return;
    
    setIsScanning(true);
    
    // Simulate scan delay
    setTimeout(async () => {
      if (attendance && attendance.status === 'CLOCKED_IN') {
        await db.clockOut(user.id);
      } else {
        await db.clockIn(user.id);
      }
      const updated = await db.getTodayAttendance(user.id);
      setAttendance(updated);
      setIsScanning(false);
    }, 1500);
  };

  const Card = ({ title, value, icon, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-mint-500 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
        {icon}
      </div>
    </div>
  );

  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <span className="bg-mint-100 text-mint-800 px-3 py-1 rounded-full text-sm font-medium">
          Role: {user?.role}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Widget (Fingerprint) - Takes up 1 column on large screens */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center border border-gray-100 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-mint-500"></div>
           <h2 className="text-lg font-bold text-gray-700 mb-2">Attendance</h2>
           <p className="text-sm text-gray-400 mb-6">{currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
           
           <button 
             onClick={handleFingerprintClick}
             disabled={attendance?.status === 'CLOCKED_OUT'}
             className={`relative group flex items-center justify-center w-32 h-32 rounded-full border-4 transition-all duration-500 
               ${isScanning ? 'border-mint-400 scale-95' : attendance?.status === 'CLOCKED_IN' ? 'border-mint-500 bg-mint-50' : attendance?.status === 'CLOCKED_OUT' ? 'border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed' : 'border-gray-200 hover:border-mint-300 hover:shadow-lg'}
             `}
           >
             {isScanning && (
               <div className="absolute inset-0 rounded-full border-t-4 border-mint-600 animate-spin"></div>
             )}
             <Fingerprint 
                size={64} 
                className={`transition-colors duration-500 ${attendance?.status === 'CLOCKED_IN' ? 'text-mint-600' : 'text-gray-400 group-hover:text-mint-500'}`} 
             />
           </button>

           <div className="mt-6 text-center">
             <div className="text-3xl font-mono font-bold text-gray-800 mb-1">
               {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
             </div>
             <p className={`text-sm font-medium ${attendance?.status === 'CLOCKED_IN' ? 'text-mint-600' : 'text-gray-500'}`}>
                {isScanning ? 'Scanning...' : attendance?.status === 'CLOCKED_IN' ? 'Currently Clocked In' : attendance?.status === 'CLOCKED_OUT' ? 'Shift Completed' : 'Tap to Clock In'}
             </p>
           </div>

           <div className="mt-6 w-full grid grid-cols-2 gap-4 text-center text-sm border-t pt-4">
              <div>
                <p className="text-gray-400 text-xs">Clock In</p>
                <p className="font-semibold text-gray-700">{formatTime(attendance?.clockInTime)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Clock Out</p>
                <p className="font-semibold text-gray-700">{formatTime(attendance?.clockOutTime)}</p>
              </div>
           </div>
        </div>

        {/* Stats Grid - Takes up 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-mint-500 to-teal-600 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">Hello, {user?.name.split(' ')[0]}!</h2>
              <p className="opacity-90 max-w-md">
                Welcome to your Marabes dashboard. 
                {user?.role === 'ADMIN' 
                  ? ' You have pending approvals requiring your attention.' 
                  : ' Don\'t forget to check your upcoming training sessions.'}
              </p>
            </div>
            <div className="hidden md:block opacity-20">
               <Fingerprint size={100} />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {user?.role === 'ADMIN' && (
              <Card 
                title="Employees" 
                value={stats.employeeCount} 
                icon={<Users className="text-mint-600" />} 
                color="bg-mint-100" 
              />
            )}
            <Card 
              title="Time Off" 
              value={stats.pendingRequests} 
              icon={<Calendar className="text-orange-500" />} 
              color="bg-orange-100" 
            />
            <Card 
              title="Avg Score" 
              value={`${stats.avgScore}%`} 
              icon={<Award className="text-purple-500" />} 
              color="bg-purple-100" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
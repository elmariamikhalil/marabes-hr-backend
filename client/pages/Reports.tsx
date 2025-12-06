import React, { useState, useEffect } from "react";
import { useAuth } from "../App";
import * as api from "../services/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Download, TrendingUp, Users, Calendar, Award } from "lucide-react";

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [timeFrame, setTimeFrame] = useState("month");
  const [departmentStats, setDepartmentStats] = useState<any[]>([]);
  const [scoresTrend, setScoresTrend] = useState<any[]>([]);
  const [timeOffStats, setTimeOffStats] = useState<any[]>([]);
  const [attendanceRate, setAttendanceRate] = useState(0);

  useEffect(() => {
    loadReports();
  }, [timeFrame]);

  const loadReports = async () => {
    const employees = await api.getUsers();
    const scores = await api.getScores();
    const timeOff = await api.getTimeOffRequests();

    // Department distribution
    const deptMap: any = {};
    employees.forEach((emp) => {
      const dept = emp.department || "General";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    setDepartmentStats(
      Object.keys(deptMap).map((dept) => ({ name: dept, value: deptMap[dept] }))
    );

    // Scores trend (last 6 months)
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const trendData: any = {};
    scores.forEach((score) => {
      const month = new Date(score.date).getMonth();
      const monthName = monthNames[month];
      if (!trendData[monthName]) {
        trendData[monthName] = { month: monthName, total: 0, count: 0 };
      }
      trendData[monthName].total += score.score;
      trendData[monthName].count += 1;
    });
    const trend = Object.values(trendData).map((d: any) => ({
      month: d.month,
      average: Math.round(d.total / d.count),
    }));
    setScoresTrend(trend);

    // Time off distribution
    const typeMap: any = { Vacation: 0, Sick: 0, Personal: 0 };
    timeOff.forEach((req) => {
      if (req.status === "APPROVED") {
        typeMap[req.type] = (typeMap[req.type] || 0) + 1;
      }
    });
    setTimeOffStats([
      { name: "Vacation", value: typeMap.Vacation, color: "#14b8a6" },
      { name: "Sick", value: typeMap.Sick, color: "#f59e0b" },
      { name: "Personal", value: typeMap.Personal, color: "#8b5cf6" },
    ]);

    // Calculate attendance rate (mock calculation)
    const rate = Math.round(85 + Math.random() * 10);
    setAttendanceRate(rate);
  };

  const handleExport = (type: string) => {
    console.log(`Exporting ${type} report...`);
    // Generate CSV or PDF export
    const csvContent = `Report Type: ${type}\nGenerated: ${new Date().toLocaleString()}\n\nData will be exported here...`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}-report-${Date.now()}.csv`;
    link.click();
  };

  if (user?.role !== "ADMIN") {
    return (
      <div className="text-center text-gray-500 mt-20">
        Access Restricted: Admins Only
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Reports & Analytics
        </h1>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={() => handleExport("full")}
            className="flex items-center gap-2 px-4 py-2 bg-mint-600 text-white rounded-lg hover:bg-mint-700"
          >
            <Download size={18} /> Export All
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {attendanceRate}%
              </p>
              <p className="text-xs text-green-600 mt-1">
                ↑ 2.5% from last month
              </p>
            </div>
            <div className="p-3 bg-mint-100 rounded-full">
              <Calendar className="text-mint-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Performance</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">78%</p>
              <p className="text-xs text-green-600 mt-1">
                ↑ 5.2% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Award className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {departmentStats.reduce((a, b) => a + b.value, 0)}
              </p>
              <p className="text-xs text-blue-600 mt-1">Active workforce</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Time Off</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {timeOffStats.reduce((a, b) => a + b.value, 0)}
              </p>
              <p className="text-xs text-orange-600 mt-1">Approved requests</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Department Distribution
            </h2>
            <button
              onClick={() => handleExport("department")}
              className="text-sm text-mint-600 hover:text-mint-700"
            >
              Export
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#14b8a6", "#f59e0b", "#8b5cf6", "#3b82f6", "#ef4444"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Off Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Time Off Requests
            </h2>
            <button
              onClick={() => handleExport("timeoff")}
              className="text-sm text-mint-600 hover:text-mint-700"
            >
              Export
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeOffStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Trend */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Performance Trend
          </h2>
          <button
            onClick={() => handleExport("performance")}
            className="text-sm text-mint-600 hover:text-mint-700"
          >
            Export
          </button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoresTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ fill: "#14b8a6", r: 5 }}
                activeDot={{ r: 7 }}
                name="Average Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-mint-500 pl-4">
            <p className="text-sm text-gray-500">Best Performing Department</p>
            <p className="text-xl font-bold text-gray-800 mt-1">Finance</p>
            <p className="text-sm text-mint-600">Average Score: 85%</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-sm text-gray-500">Most Enrolled Course</p>
            <p className="text-xl font-bold text-gray-800 mt-1">
              Workplace Safety
            </p>
            <p className="text-sm text-purple-600">45 Enrollments</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="text-sm text-gray-500">Peak Absence Month</p>
            <p className="text-xl font-bold text-gray-800 mt-1">December</p>
            <p className="text-sm text-orange-600">28 Days Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

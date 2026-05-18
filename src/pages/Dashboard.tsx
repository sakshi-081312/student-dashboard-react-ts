import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  ComposedChart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Users,
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  Bell,
  Search,
} from "lucide-react";

import { Student } from "../types/Student";

interface Props {
  students?: Student[];
  attendance?: any[];
  assignments?: any[];
  marks?: any[];
  role?: "admin" | "teacher" | "student";
}

const COLORS = ["#2563eb", "#0f766e", "#d97706", "#7c3aed", "#dc2626"];
const CHART_COLORS = {
  blue: "#2563eb",
  green: "#0f766e",
  amber: "#d97706",
  purple: "#7c3aed",
  red: "#dc2626",
};

const EVENTS = [
  { title: "PTM Meeting", date: "18 May", type: "Event" },
  { title: "Annual Function Practice", date: "22 May", type: "Event" },
];

const NOTICES = [
  {
    title: "Holiday on Friday",
    desc: "School will remain closed due to maintenance.",
  },
  {
    title: "Fee Submission",
    desc: "Last date for fee submission is 25 May.",
  },
];

const Dashboard: React.FC<Props> = ({
  students = [],
  attendance = [],
  assignments = [],
  marks = [],
  role = "admin",
}) => {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");

  const safeStudents = useMemo(
    () => (Array.isArray(students) ? students : []),
    [students]
  );
  const safeAttendance = useMemo(
    () => (Array.isArray(attendance) ? attendance : []),
    [attendance]
  );
  const safeAssignments = useMemo(
    () => (Array.isArray(assignments) ? assignments : []),
    [assignments]
  );
  const safeMarks = useMemo(
    () => (Array.isArray(marks) ? marks : []),
    [marks]
  );

  const courses = useMemo(
    () => Array.from(new Set(safeStudents.map((s) => s.course || "Unknown"))),
    [safeStudents]
  );

  const filteredStudents = useMemo(() => {
    return safeStudents.filter((s) => {
      const matchSearch =
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.course?.toLowerCase().includes(search.toLowerCase());

      const matchCourse = courseFilter === "All" || s.course === courseFilter;

      return matchSearch && matchCourse;
    });
  }, [safeStudents, search, courseFilter]);

  const totalStudents = filteredStudents.length;
  const totalCourses = courses.length;
  const presentCount = safeAttendance.filter((a) => a.status === "Present").length;
  const attendancePercent =
    safeAttendance.length > 0
      ? Math.round((presentCount / safeAttendance.length) * 100)
      : 0;
  const totalAssignments = safeAssignments.length;

  const courseData = useMemo(() => {
    const map: Record<string, number> = {};

    filteredStudents.forEach((s) => {
      const course = s.course || "Unknown";
      map[course] = (map[course] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      students: map[key],
    }));
  }, [filteredStudents]);

  const marksData = useMemo(() => {
    if (safeMarks.length === 0) {
      return [
        { name: "Aman", marks: 78 },
        { name: "Riya", marks: 92 },
        { name: "Kunal", marks: 66 },
      ];
    }

    return safeMarks.slice(0, 6).map((m) => ({
      name: m.student_name || "Student",
      marks: m.total || m.score || 0,
    }));
  }, [safeMarks]);

  const assignmentData = useMemo(() => {
    const completed = safeAssignments.filter((a) => a.status === "completed").length;
    const pending = safeAssignments.length - completed;

    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ];
  }, [safeAssignments]);

  const attendanceTrend = useMemo(() => {
    if (safeAttendance.length === 0) {
      return [
        { name: "Mon", present: 32, absent: 4 },
        { name: "Tue", present: 36, absent: 2 },
        { name: "Wed", present: 34, absent: 5 },
        { name: "Thu", present: 38, absent: 3 },
        { name: "Fri", present: 35, absent: 4 },
      ];
    }

    const map: Record<string, { name: string; present: number; absent: number }> = {};

    safeAttendance.forEach((item) => {
      const label = item.date || item.name || "Today";
      if (!map[label]) {
        map[label] = { name: label, present: 0, absent: 0 };
      }

      if (item.status === "Present") {
        map[label].present += 1;
      } else if (item.status === "Absent") {
        map[label].absent += 1;
      } else {
        map[label].present += Number(item.present || 0);
        map[label].absent += Number(item.absent || 0);
      }
    });

    return Object.values(map).slice(-7);
  }, [safeAttendance]);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back ({role})</p>
        </div>

        <div className="toolbar">
          <div className="field">
            <Search size={18} />
            <input
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="select-field"
          >
            <option value="All">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          <Bell color="#667085" />
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Students" value={totalStudents} icon={<Users />} color="#2563eb" />
        <StatCard title="Attendance" value={`${attendancePercent}%`} icon={<ClipboardCheck />} color="#0f766e" />
        <StatCard title="Courses" value={totalCourses} icon={<GraduationCap />} color="#7c3aed" />
        <StatCard title="Assignments" value={totalAssignments} icon={<BookOpen />} color="#d97706" />
      </div>

      <div className="dashboard-grid">
        <GlassCard title="Attendance Overview" badge="Last 7 records">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.blue} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={CHART_COLORS.blue} stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.red} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={CHART_COLORS.red} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#edf1f5" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="present"
                stroke={CHART_COLORS.blue}
                fill="url(#presentGradient)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="absent"
                stroke={CHART_COLORS.red}
                fill="url(#absentGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard title="Assignments" badge="Completion">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={assignmentData}
                dataKey="value"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={4}
              >
                {assignmentData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="dashboard-bottom-grid">
        <GlassCard title="Students Per Course" badge="Courses">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courseData}>
              <CartesianGrid stroke="#edf1f5" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill={CHART_COLORS.blue} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard title="Marks Trend" badge="Top scores">
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={marksData}>
              <CartesianGrid stroke="#edf1f5" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="marks" fill="#dbeafe" radius={[8, 8, 0, 0]} />
              <Line
                type="monotone"
                dataKey="marks"
                stroke={CHART_COLORS.green}
                strokeWidth={3}
                dot={{ r: 4, fill: CHART_COLORS.green }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard title="Attendance Trend" badge={`${attendancePercent}% present`}>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={attendanceTrend}>
              <CartesianGrid stroke="#edf1f5" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="absent" stackId="a" fill="#fecaca" radius={[0, 0, 8, 8]} />
              <Bar dataKey="present" stackId="a" fill={CHART_COLORS.green} radius={[8, 8, 0, 0]} />
              <Line type="monotone" dataKey="present" stroke={CHART_COLORS.blue} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="dashboard-bottom-grid">
        <GlassCard title="Events" badge="Upcoming">
          {EVENTS.map((event, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <b>{event.title}</b>
              <div style={{ fontSize: 12, color: "#667085" }}>{event.date}</div>
            </div>
          ))}
        </GlassCard>

        <GlassCard title="Notices" badge="Important">
          {NOTICES.map((notice, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <b>{notice.title}</b>
              <div style={{ fontSize: 12, color: "#667085" }}>{notice.desc}</div>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="stat-card">
    <div style={{ color }}>{icon}</div>
    <h2>{value}</h2>
    <p>{title}</p>
  </div>
);

const GlassCard = ({ title, badge, children }: any) => (
  <div className="glass-card chart-wrap">
    <div className="chart-card-header">
      <h3>{title}</h3>
      {badge && <span className="chart-pill">{badge}</span>}
    </div>
    {children}
  </div>
);

export default Dashboard;

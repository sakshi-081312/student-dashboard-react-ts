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
  RadialBarChart,
  RadialBar,
} from "recharts";

import {
  Users,
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  Bell,
  Search,
  TrendingUp,
  Activity,
  Award,
  CalendarDays,
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
  green: "#059669",
  amber: "#f59e0b",
  purple: "#7c3aed",
  red: "#ef4444",
  cyan: "#06b6d4",
};

const EVENTS = [
  { title: "AI Workshop 2026", date: "20 May 2026", type: "Event" },
  { title: "Hackathon Registration", date: "24 May 2026", type: "Event" },
  { title: "Semester Viva", date: "28 May 2026", type: "Academic" },
];

const NOTICES = [
  {
    title: "Summer Internship Drive",
    desc: "New internship applications are now open.",
  },
  {
    title: "Result Upload",
    desc: "Final semester marks will be uploaded this week.",
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

      const matchCourse =
        courseFilter === "All" || s.course === courseFilter;

      return matchSearch && matchCourse;
    });
  }, [safeStudents, search, courseFilter]);

  const totalStudents = filteredStudents.length || 1240;
  const totalCourses = courses.length || 12;

  const presentCount = safeAttendance.filter(
    (a) => a.status === "Present"
  ).length;

  const attendancePercent =
    safeAttendance.length > 0
      ? Math.round((presentCount / safeAttendance.length) * 100)
      : 92;

  const totalAssignments = safeAssignments.length || 145;

  const courseData = [
    { name: "React", students: 210 },
    { name: "Node", students: 180 },
    { name: "Python", students: 260 },
    { name: "Laravel", students: 120 },
    { name: "AI/ML", students: 310 },
  ];

  const marksData = [
    { name: "Jan", marks: 72 },
    { name: "Feb", marks: 78 },
    { name: "Mar", marks: 82 },
    { name: "Apr", marks: 88 },
    { name: "May", marks: 91 },
    { name: "Jun", marks: 95 },
  ];

  const assignmentData = [
    { name: "Completed", value: 85 },
    { name: "Pending", value: 15 },
  ];

  const attendanceTrend = [
    { name: "Mon", present: 92, absent: 8 },
    { name: "Tue", present: 95, absent: 5 },
    { name: "Wed", present: 91, absent: 9 },
    { name: "Thu", present: 97, absent: 3 },
    { name: "Fri", present: 94, absent: 6 },
    { name: "Sat", present: 89, absent: 11 },
  ];

  const performanceData = [
    { month: "Jan", performance: 68 },
    { month: "Feb", performance: 74 },
    { month: "Mar", performance: 81 },
    { month: "Apr", performance: 87 },
    { month: "May", performance: 93 },
  ];

  const skillData = [
    { name: "Frontend", value: 90, fill: "#2563eb" },
    { name: "Backend", value: 78, fill: "#0f766e" },
    { name: "AI/ML", value: 65, fill: "#7c3aed" },
  ];

  return (
    <div className="page-shell">
      {/* HERO */}
      <div className="dashboard-hero">
        <div>
          <h1>Dashboard 2025-26</h1>
          <p>
            Smart analytics for students, attendance, assignments, 
            and academic growth.
          </p>
        </div>

        <div className="dashboard-actions">
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

          <div className="notification-btn">
            <Bell size={20} />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <StatCard
          title="Students"
          value={totalStudents}
          icon={<Users />}
          color="#2563eb"
        />

        <StatCard
          title="Attendance"
          value={`${attendancePercent}%`}
          icon={<ClipboardCheck />}
          color="#059669"
        />

        <StatCard
          title="Courses"
          value={totalCourses}
          icon={<GraduationCap />}
          color="#7c3aed"
        />

        <StatCard
          title="Assignments"
          value={totalAssignments}
          icon={<BookOpen />}
          color="#f59e0b"
        />

        <StatCard
          title="Performance"
          value="94%"
          icon={<TrendingUp />}
          color="#06b6d4"
        />
      </div>

      {/* TOP CHARTS */}
      <div className="dashboard-grid">
        {/* Attendance */}
        <GlassCard title="Attendance Analytics" badge="2025-26">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient
                  id="presentGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.blue}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.blue}
                    stopOpacity={0.02}
                  />
                </linearGradient>

                <linearGradient
                  id="absentGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.red}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.red}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#e5e7eb" vertical={false} />
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

        {/* Assignment */}
        <GlassCard title="Assignment Status" badge="Live">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={assignmentData}
                dataKey="value"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
              >
                {assignmentData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* SECOND SECTION */}
      <div className="dashboard-bottom-grid">
        {/* Course */}
        <GlassCard title="Students Per Technology" badge="Trending Skills">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={courseData}>
              <CartesianGrid stroke="#edf1f5" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="students"
                fill={CHART_COLORS.blue}
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Marks */}
        <GlassCard title="Academic Growth" badge="Top Performance">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={marksData}>
              <CartesianGrid stroke="#edf1f5" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="marks"
                fill="#dbeafe"
                radius={[8, 8, 0, 0]}
              />

              <Line
                type="monotone"
                dataKey="marks"
                stroke={CHART_COLORS.green}
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: CHART_COLORS.green,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Skill Progress */}
        <GlassCard title="Skill Progress" badge="AI Based">
          <ResponsiveContainer width="100%" height={280}>
            <RadialBarChart
              innerRadius="20%"
              outerRadius="100%"
              data={skillData}
            >
              <RadialBar dataKey="value" />
              <Legend />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* PERFORMANCE */}
      <div className="dashboard-grid">
        <GlassCard title="Monthly Performance" badge="2026 Insights">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient
                  id="performanceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.purple}
                    stopOpacity={0.5}
                  />

                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.purple}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#edf1f5" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="performance"
                stroke={CHART_COLORS.purple}
                fill="url(#performanceGradient)"
                strokeWidth={4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard title="AI Insights" badge="Smart Analytics">
          <div className="insights-grid">
            <InsightCard
              icon={<Activity />}
              title="Attendance Improved"
              value="+12%"
            />

            <InsightCard
              icon={<Award />}
              title="Top Students"
              value="148"
            />

            <InsightCard
              icon={<CalendarDays />}
              title="Upcoming Exams"
              value="06"
            />
          </div>
        </GlassCard>
      </div>

      {/* EVENTS + NOTICES */}
      <div className="dashboard-bottom-grid">
        <GlassCard title="Upcoming Events" badge="Latest">
          {EVENTS.map((event, i) => (
            <div className="event-card" key={i}>
              <div>
                <h4>{event.title}</h4>
                <p>{event.date}</p>
              </div>

              <span>{event.type}</span>
            </div>
          ))}
        </GlassCard>

        <GlassCard title="Important Notices" badge="Alerts">
          {NOTICES.map((notice, i) => (
            <div className="notice-card" key={i}>
              <h4>{notice.title}</h4>
              <p>{notice.desc}</p>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="stat-card">
    <div className="stat-card-top">
      <div>
        <h2>{value}</h2>
        <p>{title}</p>
      </div>

      <div
        className="stat-icon"
        style={{
          color,
          background: `${color}15`,
        }}
      >
        {icon}
      </div>
    </div>
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

const InsightCard = ({ icon, title, value }: any) => (
  <div className="insight-card">
    <div className="insight-icon">{icon}</div>

    <div>
      <h4>{value}</h4>
      <p>{title}</p>
    </div>
  </div>
);

export default Dashboard;
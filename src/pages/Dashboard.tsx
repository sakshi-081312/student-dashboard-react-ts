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

const COLORS = [
  "#2563eb",
  "#127474",
  "#f59e0b",
  "#7389b9",
  "#8b5cf6",
];

const EVENTS = [
  {
    title: "AI Workshop 2026",
    date: "20 May 2026",
    type: "Event",
  },
  {
    title: "Hackathon Registration",
    date: "24 May 2026",
    type: "Event",
  },
  {
    title: "Semester Viva",
    date: "28 May 2026",
    type: "Academic",
  },
];

const NOTICES = [
  {
    title: "Summer Internship Drive",
    desc: "Applications are now open.",
  },
  {
    title: "Result Upload",
    desc: "Semester marks upload this week.",
  },
];

const Dashboard: React.FC<Props> = ({
  students = [],
  attendance = [],
  assignments = [],
  marks = [],
}) => {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] =
    useState("All");

  const safeStudents = useMemo(
    () => (Array.isArray(students) ? students : []),
    [students]
  );

  const safeAttendance = useMemo(
    () =>
      Array.isArray(attendance)
        ? attendance
        : [],
    [attendance]
  );

  const safeAssignments = useMemo(
    () =>
      Array.isArray(assignments)
        ? assignments
        : [],
    [assignments]
  );

  const courses = useMemo(
    () =>
      Array.from(
        new Set(
          safeStudents.map(
            (s) => s.course || "Unknown"
          )
        )
      ),
    [safeStudents]
  );

  const filteredStudents = useMemo(() => {
    return safeStudents.filter((s) => {
      const matchSearch =
        s.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        s.course
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchCourse =
        courseFilter === "All" ||
        s.course === courseFilter;

      return matchSearch && matchCourse;
    });
  }, [safeStudents, search, courseFilter]);

  const totalStudents =
    filteredStudents.length || 1240;

  const totalCourses =
    courses.length || 12;

  const presentCount =
    safeAttendance.filter(
      (a) => a.status === "Present"
    ).length;

  const attendancePercent =
    safeAttendance.length > 0
      ? Math.round(
          (presentCount /
            safeAttendance.length) *
            100
        )
      : 92;

  const totalAssignments =
    safeAssignments.length || 145;

  const attendanceTrend = [
    { day: "Mon", present: 92 },
    { day: "Tue", present: 95 },
    { day: "Wed", present: 91 },
    { day: "Thu", present: 97 },
    { day: "Fri", present: 94 },
    { day: "Sat", present: 89 },
  ];

  const performanceData = [
    { month: "Jan", marks: 72 },
    { month: "Feb", marks: 78 },
    { month: "Mar", marks: 82 },
    { month: "Apr", marks: 88 },
    { month: "May", marks: 93 },
    { month: "Jun", marks: 96 },
  ];

  const courseData = [
    { name: "React", students: 240 },
    { name: "Node", students: 190 },
    { name: "Python", students: 310 },
    { name: "Laravel", students: 150 },
    { name: "AI/ML", students: 340 },
  ];

  const assignmentData = [
    { name: "Completed", value: 85 },
    { name: "Pending", value: 15 },
  ];

  const skillData = [
    {
      name: "Frontend",
      value: 90,
      fill: "#2563eb",
    },
    {
      name: "Backend",
      value: 78,
      fill: "#127474",
    },
    {
      name: "AI/ML",
      value: 68,
      fill: "#8b5cf6",
    },
  ];

  return (
    <div style={styles.page}>
      {/* HERO */}
      <div style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>
            Dashboard 2025-26
          </h1>

          <p style={styles.heroSubtitle}>
            Smart analytics for students,
            attendance, assignments and
            academic growth.
          </p>
        </div>

        <div style={styles.heroActions}>
          <div style={styles.searchBox}>
            <Search
              size={18}
              color="#64748b"
            />

            <input
              placeholder="Search student..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={styles.searchInput}
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) =>
              setCourseFilter(
                e.target.value
              )
            }
            style={styles.select}
          >
            <option value="All">
              All Courses
            </option>

            {courses.map((course) => (
              <option
                key={course}
                value={course}
              >
                {course}
              </option>
            ))}
          </select>

          <div style={styles.notifyBtn}>
            <Bell size={20} />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>
        <StatCard
          title="Students"
          value={totalStudents}
          icon={<Users />}
          bg="rgb(239 138 22)"
        />

        <StatCard
          title="Attendance"
          value={`${attendancePercent}%`}
          icon={<ClipboardCheck />}
          bg="#127474"
        />

        <StatCard
          title="Courses"
          value={totalCourses}
          icon={<GraduationCap />}
          bg="rgb(143 177 77 / 92%)"
        />

        <StatCard
          title="Assignments"
          value={totalAssignments}
          icon={<BookOpen />}
          bg="#7389b9"
        />

        <StatCard
          title="Performance"
          value="94%"
          icon={<TrendingUp />}
          bg="#5b5fc7"
        />
      </div>

      {/* CHARTS */}
      <div style={styles.chartGrid}>
        {/* ATTENDANCE */}
        <GlassCard title="Attendance Analytics">
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <AreaChart
              data={attendanceTrend}
            >
              <defs>
                <linearGradient
                  id="colorAttendance"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#2563eb"
                    stopOpacity={0.5}
                  />

                  <stop
                    offset="95%"
                    stopColor="#2563eb"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#edf2f7"
                vertical={false}
              />

              <XAxis dataKey="day" />
              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="present"
                stroke="#2563eb"
                fill="url(#colorAttendance)"
                strokeWidth={4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* ASSIGNMENT */}
        <GlassCard title="Assignment Status">
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <PieChart>
              <Pie
                data={assignmentData}
                dataKey="value"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={5}
              >
                {assignmentData.map(
                  (_, i) => (
                    <Cell
                      key={i}
                      fill={
                        COLORS[
                          i % COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* SECOND CHARTS */}
      <div style={styles.bottomGrid}>
        {/* BAR */}
        <GlassCard title="Students Per Technology">
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={courseData}>
              <CartesianGrid
                stroke="#edf2f7"
                vertical={false}
              />

              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="students"
                fill="#127474"
                radius={[12, 12, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* PERFORMANCE */}
        <GlassCard title="Academic Growth">
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <ComposedChart
              data={performanceData}
            >
              <CartesianGrid
                stroke="#edf2f7"
                vertical={false}
              />

              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="marks"
                fill="#dbeafe"
                radius={[10, 10, 0, 0]}
              />

              <Line
                type="monotone"
                dataKey="marks"
                stroke="#5b5fc7"
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: "#5b5fc7",
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* SKILL */}
        <GlassCard title="Skill Progress">
          <ResponsiveContainer
            width="100%"
            height={300}
          >
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

      {/* INSIGHTS */}
      <div style={styles.chartGrid}>
        <GlassCard title="AI Insights">
          <div style={styles.insightGrid}>
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

        <GlassCard title="Upcoming Events">
          {EVENTS.map((event, i) => (
            <div
              key={i}
              style={styles.eventCard}
            >
              <div>
                <h4 style={styles.eventTitle}>
                  {event.title}
                </h4>

                <p style={styles.eventDate}>
                  {event.date}
                </p>
              </div>

              <span style={styles.badge}>
                {event.type}
              </span>
            </div>
          ))}
        </GlassCard>
      </div>

      {/* NOTICES */}
      <GlassCard title="Important Notices">
        {NOTICES.map((notice, i) => (
          <div
            key={i}
            style={styles.noticeCard}
          >
            <h4 style={styles.noticeTitle}>
              {notice.title}
            </h4>

            <p style={styles.noticeText}>
              {notice.desc}
            </p>
          </div>
        ))}
      </GlassCard>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  bg,
}: any) => (
  <div
    style={{
      ...styles.statCard,
      background: bg,
    }}
  >
    <div>
      <h2 style={styles.statValue}>
        {value}
      </h2>

      <p style={styles.statTitle}>
        {title}
      </p>
    </div>

    <div style={styles.statIcon}>
      {icon}
    </div>
  </div>
);

const GlassCard = ({
  title,
  children,
}: any) => (
  <div style={styles.glassCard}>
    <div style={styles.cardHeader}>
      <h3 style={styles.cardTitle}>
        {title}
      </h3>
    </div>

    {children}
  </div>
);

const InsightCard = ({
  icon,
  title,
  value,
}: any) => (
  <div style={styles.insightCard}>
    <div style={styles.insightIcon}>
      {icon}
    </div>

    <div>
      <h4 style={styles.insightValue}>
        {value}
      </h4>

      <p style={styles.insightTitle}>
        {title}
      </p>
    </div>
  </div>
);

const styles: any = {
  page: {
    padding: 24,
    background:
      "linear-gradient(to bottom right,#f8fafc,#eef2ff)",
    minHeight: "100vh",
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 20,
    marginBottom: 28,
  },

  heroTitle: {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
    color: "#172033",
  },

  heroSubtitle: {
    marginTop: 8,
    color: "#667085",
    fontSize: 15,
  },

  heroActions: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#fff",
    borderRadius: 14,
    padding: "0 14px",
    border: "1px solid #dce4ec",
    minWidth: 240,
    height: 50,
  },

  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    width: "100%",
  },

  select: {
    height: 50,
    borderRadius: 14,
    border: "1px solid #dce4ec",
    padding: "0 14px",
    background: "#fff",
    outline: "none",
  },

  notifyBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #dce4ec",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: 18,
    marginBottom: 28,
  },

  statCard: {
    borderRadius: 22,
    padding: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.12)",
  },

  statValue: {
    margin: 0,
    fontSize: 30,
    fontWeight: 800,
  },

  statTitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
  },

  statIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    background:
      "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(420px,1fr))",
    gap: 22,
    marginBottom: 24,
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: 22,
    marginBottom: 24,
  },

  glassCard: {
    background:
      "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    borderRadius: 24,
    padding: 22,
    boxShadow:
      "0 8px 24px rgba(15,23,42,0.08)",
  },

  cardHeader: {
    marginBottom: 18,
  },

  cardTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#172033",
  },

  insightGrid: {
    display: "grid",
    gap: 18,
  },

  insightCard: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    background: "#f8fafc",
    borderRadius: 18,
    padding: 18,
  },

  insightIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: "#2563eb15",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2563eb",
  },

  insightValue: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
  },

  insightTitle: {
    marginTop: 4,
    color: "#667085",
  },

  eventCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom:
      "1px solid #eef2f7",
  },

  eventTitle: {
    margin: 0,
    color: "#172033",
  },

  eventDate: {
    marginTop: 4,
    color: "#667085",
    fontSize: 14,
  },

  badge: {
    background: "#2563eb15",
    color: "#2563eb",
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
  },

  noticeCard: {
    padding: "18px 0",
    borderBottom:
      "1px solid #eef2f7",
  },

  noticeTitle: {
    margin: 0,
    color: "#172033",
  },

  noticeText: {
    marginTop: 6,
    color: "#667085",
    lineHeight: 1.6,
  },
};

export default Dashboard;
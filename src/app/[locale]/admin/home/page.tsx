"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import AdminService from "@/lib/services/admin.service";
import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaListUl,
  FaUserGraduate,
  FaTrophy,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaFire,
  FaStar,
  FaChartLine,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { useTranslations } from "next-intl";

export default function AdminExercise() {
  const t = useTranslations("AdminHome");
  const items = [{ label: "Home", href: "/admin/home" }];

  const [stats, setStats] = useState({
    totalExercises: 0,
    totalLessons: 0,
    totalTopics: 0,
    totalUsers: 0,
  });

  // Mock data for enhanced features
  const [leaderboard] = useState([
    {
      id: 1,
      name: "Emily Chen",
      score: 2450,
      exercises: 45,
      trend: "up",
      level: "Advanced",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      score: 2380,
      exercises: 42,
      trend: "up",
      level: "Intermediate",
    },
    {
      id: 3,
      name: "Aisha Patel",
      score: 2290,
      exercises: 38,
      trend: "down",
      level: "Advanced",
    },
    {
      id: 4,
      name: "James Wilson",
      score: 2150,
      exercises: 35,
      trend: "up",
      level: "Beginner",
    },
    {
      id: 5,
      name: "Luna Zhang",
      score: 2050,
      exercises: 32,
      trend: "up",
      level: "Intermediate",
    },
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      action: "Generated Grammar Exercise",
      item: "Past Tense Practice",
      time: "2 minutes ago",
      type: "exercise",
    },
    {
      id: 2,
      action: "New User Registration",
      item: "Sarah Johnson",
      time: "5 minutes ago",
      type: "user",
    },
    {
      id: 3,
      action: "Vocabulary Set Created",
      item: "Advanced Business English",
      time: "8 minutes ago",
      type: "lesson",
    },
    {
      id: 4,
      action: "AI Generated Quiz",
      item: "IELTS Reading Comprehension",
      time: "12 minutes ago",
      type: "exercise",
    },
    {
      id: 5,
      action: "Topic Created",
      item: "Conversational English",
      time: "15 minutes ago",
      type: "topic",
    },
    {
      id: 6,
      action: "Exercise Updated",
      item: "Phrasal Verbs Challenge",
      time: "18 minutes ago",
      type: "exercise",
    },
    {
      id: 7,
      action: "Generated Listening Task",
      item: "Business Meeting Dialogue",
      time: "22 minutes ago",
      type: "exercise",
    },
    {
      id: 8,
      action: "User Completed Lesson",
      item: "English Pronunciation",
      time: "25 minutes ago",
      type: "lesson",
    },
  ]);

  const [weeklyData] = useState([
    { day: "Mon", exercises: 12, users: 8, lessons: 3, aiGenerated: 8 },
    { day: "Tue", exercises: 19, users: 12, lessons: 5, aiGenerated: 14 },
    { day: "Wed", exercises: 15, users: 10, lessons: 4, aiGenerated: 11 },
    { day: "Thu", exercises: 22, users: 15, lessons: 6, aiGenerated: 18 },
    { day: "Fri", exercises: 28, users: 20, lessons: 8, aiGenerated: 22 },
    { day: "Sat", exercises: 35, users: 25, lessons: 10, aiGenerated: 28 },
    { day: "Sun", exercises: 18, users: 14, lessons: 5, aiGenerated: 12 },
  ]);

  const adminService = new AdminService();

  const cards = [
    {
      title: t("ExerciseTitle"),
      count: stats.totalExercises,
      icon: <FaBookOpen size={24} />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: "+12%",
      changeType: "up",
    },
    {
      title: t("LessonTitle"),
      count: stats.totalLessons,
      icon: <FaListUl size={24} />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      change: "+8%",
      changeType: "up",
    },
    {
      title: t("TopicTitle"),
      count: stats.totalTopics,
      icon: <FaFire size={24} />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      change: "+5%",
      changeType: "up",
    },
    {
      title: t("UserTitle"),
      count: stats.totalUsers,
      icon: <FaUserGraduate size={24} />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      change: "-2%",
      changeType: "down",
    },
  ];

  const chartData = [
    { name: "Exercises", value: stats.totalExercises },
    { name: "Lessons", value: stats.totalLessons },
    { name: "Topics", value: stats.totalTopics },
    { name: "Users", value: stats.totalUsers },
  ];

  const pieColors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        if (!response) {
          throw new Error("Failed to fetch stats");
        }
        setStats({
          totalExercises: response.total_exercises || 8,
          totalLessons: response.total_lessons || 1,
          totalTopics: response.total_topics || 0,
          totalUsers: response.total_users || 2,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback data
        setStats({
          totalExercises: 8,
          totalLessons: 1,
          totalTopics: 0,
          totalUsers: 2,
        });
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={items} />

        {/* Welcome Header */}
        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            English Learning Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor AI-generated exercises, student progress, and platform
            analytics.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-gray-900/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-5`}
              ></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`${card.bgColor} ${card.textColor} p-3 rounded-xl`}
                  >
                    {card.icon}
                  </div>
                  <div
                    className={`flex items-center text-sm font-medium ${
                      card.changeType === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {card.changeType === "up" ? (
                      <FaArrowUp className="mr-1" />
                    ) : (
                      <FaArrowDown className="mr-1" />
                    )}
                    {card.change}
                  </div>
                </div>
                <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">
                  {card.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {card.count.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Activity Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/25 p-6">
            <div className="flex items-center mb-6">
              <FaChartLine className="text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Exercise Generation
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient
                    id="colorExercises"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                  wrapperClassName="dark:[&_.recharts-tooltip-wrapper]:!bg-gray-800 dark:[&_.recharts-tooltip-wrapper]:!text-white dark:[&_.recharts-tooltip-wrapper]:!border-gray-700"
                />
                <Area
                  type="monotone"
                  dataKey="exercises"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExercises)"
                  name="Total Exercises"
                />
                <Area
                  type="monotone"
                  dataKey="aiGenerated"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAI)"
                  name="AI Generated"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/25 p-6">
            <div className="flex items-center mb-6">
              <FaStar className="text-yellow-600 dark:text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Content Distribution
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                  wrapperClassName="dark:[&_.recharts-tooltip-wrapper]:!bg-gray-800 dark:[&_.recharts-tooltip-wrapper]:!text-white dark:[&_.recharts-tooltip-wrapper]:!border-gray-700"
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center mt-4">
              {chartData.map((entry, index) => (
                <div key={entry.name} className="flex items-center mr-4 mb-2">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: pieColors[index % pieColors.length],
                    }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/25 p-6">
            <div className="flex items-center mb-6">
              <FaTrophy className="text-yellow-600 dark:text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Performers
              </h3>
            </div>
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-amber-600"
                          : "bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {user.exercises} exercises completed
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.level === "Advanced"
                              ? "bg-red-100 text-red-800"
                              : user.level === "Intermediate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-gray-900 dark:text-white mr-2">
                      {user.score.toLocaleString()}
                    </span>
                    {user.trend === "up" ? (
                      <FaArrowUp className="text-green-500" />
                    ) : (
                      <FaArrowDown className="text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/25 p-6">
            <div className="flex items-center mb-6">
              <FaClock className="text-gray-600 dark:text-gray-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                      activity.type === "exercise"
                        ? "bg-blue-500"
                        : activity.type === "user"
                        ? "bg-purple-500"
                        : activity.type === "lesson"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }`}
                  >
                    {activity.type === "exercise" ? (
                      <FaBookOpen />
                    ) : activity.type === "user" ? (
                      <FaUserGraduate />
                    ) : activity.type === "lesson" ? (
                      <FaListUl />
                    ) : (
                      <FaFire />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {activity.item}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

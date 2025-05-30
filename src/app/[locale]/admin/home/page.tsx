"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import AdminService from "@/lib/services/admin.service";
import { useEffect, useState } from "react";
import { FaBookOpen, FaListUl, FaUserGraduate } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {useTranslations} from 'next-intl';
export default function AdminExercise() {
  // Use translations for internationalization
  const t = useTranslations('AdminHome');
  // Breadcrumb items for navigation
  const items = [{ label: "Home", href: "/admin/home" }];

  const [stats, setStats] = useState({
    totalExercises: 0,
    totalLessons: 0,
    totalTopics: 0,
    totalUsers: 0,
  });

  const adminService = new AdminService();

  const cards = [
    {
      title: t('ExerciseTitle'),
      count: stats.totalExercises,
      icon: <FaBookOpen size={28} />,
    },
    {
      title: t('LessonTitle'),
      count: stats.totalLessons,
      icon: <FaListUl size={28} />,
    },
    {
      title: t('TopicTitle'),
      count: stats.totalTopics,
      icon: <FaListUl size={28} />,
    },
    {
      title: t('UserTitle'),
      count: stats.totalUsers,
      icon: <FaUserGraduate size={28} />,
    },
  ];

  const chartData = [
    { name: t('ExerciseTitle'), value: stats.totalExercises },
    { name: "Lessons", value: stats.totalLessons },
    { name: "Topics", value: stats.totalTopics },
    { name: "Users", value: stats.totalUsers },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        if (!response) {
          throw new Error("Failed to fetch stats");
        }
        // const data = await response.json();
        setStats({
          totalExercises: response.total_exercises,
          totalLessons: response.total_lessons,
          totalTopics: response.total_topics,
          totalUsers: response.total_users,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-4">
      <Breadcrumb items={items} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 mt-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="card"
          >
            <div>
              <h3>{card.title}</h3>
              <p className="text-2xl font-semibold">{card.count}</p>
            </div>
            <div className="text-blue-600 bg-blue-100 p-3 rounded-lg">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-700">Overview Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

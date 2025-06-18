"use client";
import React, { useState } from 'react';
import { 
  Calendar,
  BarChart3,
  Clock,
  Trophy,
  Book,
  Target,
  TrendingUp,
  CheckCircle,
  Star,
  Award,
  Activity,
  Users,
  BookOpen,
  PlayCircle
} from 'lucide-react';
// Mock data
const mockStudentData = {
  user: {
    id: 1,
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    avatar: "/api/placeholder/40/40",
    level: "Cấp độ B1",
    joinDate: "2024-01-15"
  },
  streak: {
    current: 7,
    best: 15,
    days: ['T4', 'T5', 'T6', 'T7', 'CN', 'T2', 'T3']
  },
  coins: {
    current: 220,
    totalEarned: 1250,
    weeklyGoal: 300
  },
  stats: {
    totalLessons: 45,
    completedTests: 23,
    studyHours: 67,
    accuracy: 85
  },
  recentActivities: [
    {
      id: 1,
      type: 'test',
      title: '[FPT CHÍNH THỨC] TEST CUỐI KHÓA N4 - ĐỀ 1',
      reward: 50,
      date: '10/06/2025',
      status: 'completed'
    },
    {
      id: 2,
      type: 'lesson',
      title: 'Bài 27 Phần 3',
      reward: 10,
      date: '01/01/2025',
      status: 'completed'
    },
    {
      id: 3,
      type: 'lesson',
      title: 'Bài 27 Phần 2',
      reward: 10,
      date: '01/01/2025',
      status: 'completed'
    },
    {
      id: 4,
      type: 'practice',
      title: 'Luyện tập Kanji N4',
      reward: 15,
      date: '30/05/2025',
      status: 'completed'
    }
  ],
  loginHistory: [
    { date: '17/06/2025', time: '1 phút trước', activity: 'Đã đăng nhập trên Website' },
    { date: '12/06/2025', time: '5 ngày trước', activity: 'Đã đăng nhập trên Website' },
    { date: '11/06/2025', time: '6 ngày trước', activity: 'Đã đăng xuất khỏi hệ thống' }
  ]
};

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const tabs = [
    { id: 'overview', label: 'Thống kê học tập', icon: BarChart3 },
    { id: 'coins', label: 'Thống kê Coin', icon: Star },
    { id: 'activity', label: 'Lịch sử hoạt động', icon: Activity }
  ];

  const renderStreakDays = () => {
    return mockStudentData.streak.days.map((day, index) => (
      <div key={index} className="flex flex-col items-center">
        <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white mb-1">
          <CheckCircle size={20} />
        </div>
        <span className="text-sm font-medium text-gray-600">{day}</span>
      </div>
    ));
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Level Progress */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Tiến độ học tập</h3>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {mockStudentData.user.level}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{mockStudentData.stats.totalLessons}</div>
            <div className="text-sm text-blue-600">Bài học</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{mockStudentData.stats.completedTests}</div>
            <div className="text-sm text-green-600">Bài kiểm tra</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">{mockStudentData.stats.studyHours}h</div>
            <div className="text-sm text-purple-600">Giờ học</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-800">{mockStudentData.stats.accuracy}%</div>
            <div className="text-sm text-orange-600">Độ chính xác</div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thành tựu gần đây</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
            <Trophy className="w-10 h-10 text-yellow-600 mr-3" />
            <div>
              <div className="font-semibold text-gray-800">Streak Master</div>
              <div className="text-sm text-gray-600">7 ngày liên tiếp</div>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <Award className="w-10 h-10 text-green-600 mr-3" />
            <div>
              <div className="font-semibold text-gray-800">Test Champion</div>
              <div className="text-sm text-gray-600">Hoàn thành đề thi</div>
            </div>
          </div>
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <Star className="w-10 h-10 text-blue-600 mr-3" />
            <div>
              <div className="font-semibold text-gray-800">Coin Collector</div>
              <div className="text-sm text-gray-600">220 coins</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoinsTab = () => (
    <div className="space-y-6">
      {/* Coins Overview */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan Coin</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-800">{mockStudentData.coins.current}</div>
            <div className="text-sm text-yellow-600">Coin hiện tại</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{mockStudentData.coins.totalEarned}</div>
            <div className="text-sm text-green-600">Tổng đã kiếm</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{mockStudentData.coins.weeklyGoal}</div>
            <div className="text-sm text-blue-600">Mục tiêu tuần</div>
          </div>
        </div>
      </div>

      {/* Coin History */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Lịch sử Coin</h3>
          <select 
            className="px-3 py-1 border rounded-lg text-sm"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">Coin đã nhận</option>
            <option value="month">Tháng này</option>
            <option value="all">Tất cả</option>
          </select>
        </div>
        <div className="space-y-3">
          {mockStudentData.recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                  {activity.type === 'test' ? <Trophy className="w-5 h-5 text-white" /> : 
                   activity.type === 'lesson' ? <Book className="w-5 h-5 text-white" /> :
                   <PlayCircle className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{activity.title}</div>
                  <div className="text-sm text-gray-500">{activity.date}</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-600 font-semibold">+{activity.reward}</span>
                <Star className="w-4 h-4 text-yellow-500 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-6">
      {/* Activity Summary */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h3>
        <div className="text-sm text-gray-600 mb-4">
          Lưu ý: Lịch sử đăng nhập sẽ được lưu lại trong 30 ngày
        </div>
        <div className="space-y-4">
          {mockStudentData.loginHistory.map((log, index) => (
            <div key={index}>
              <div className="font-semibold text-gray-800 mb-2">Ngày {log.date}</div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">{log.activity}</div>
                  <div className="text-sm text-gray-500">{log.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Học tập</h1>
              <p className="text-gray-600">Chào mừng trở lại, {mockStudentData.user.name}!</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div>
                <div className="font-medium text-gray-800">{mockStudentData.user.name}</div>
                <div className="text-sm text-gray-500">{mockStudentData.user.level}</div>
              </div>
            </div>
          </div>

          {/* Streak and Coins Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Streak Card */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold">{mockStudentData.streak.current}</div>
                  <div className="text-teal-100">ngày streak</div>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                {renderStreakDays()}
              </div>
            </div>

            {/* Coins Card */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold">{mockStudentData.coins.current}</div>
                  <div className="text-orange-100">coin</div>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <ul className="text-sm space-y-1">
                  <li>• Giữ chuỗi streak để được cộng nhiều coin hơn.</li>
                  <li>• Hãy tiếp tục học để nhận thêm coin cho bản thân nhé !</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'coins' && renderCoinsTab()}
            {activeTab === 'activity' && renderActivityTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
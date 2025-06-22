"use client";
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Volume2, Star, Filter, Download, Upload, MoreVertical } from 'lucide-react';

const AdminFlashcardManager = () => {
  const [activeTab, setActiveTab] = useState('flashcards');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSet, setSelectedSet] = useState('all');

  // Mock data
  const categories = [
    { id: 1, name: 'IELTS', color: '#3B82F6', count: 150 },
    { id: 2, name: 'TOEIC', color: '#10B981', count: 200 },
    { id: 3, name: 'General English', color: '#F59E0B', count: 300 }
  ];

  const flashcardSets = [
    { id: 1, title: 'Exercise 1', category: 'IELTS', wordCount: 17, isPublic: true, difficulty: 'intermediate' },
    { id: 2, title: 'Exercise 2', category: 'IELTS', wordCount: 25, isPublic: true, difficulty: 'advanced' },
    { id: 3, title: 'Business Vocabulary', category: 'TOEIC', wordCount: 50, isPublic: false, difficulty: 'beginner' }
  ];

  const flashcards = [
    {
      id: 1,
      frontText: 'a brick arch',
      backText: 'mái vòm bằng gạch',
      pronunciation: '/ə brɪk ɑːrtʃ/',
      setId: 1,
      setName: 'Exercise 1',
      difficulty: 3,
      viewCount: 150,
      successRate: 85,
      hasAudio: true,
      hasImage: false
    },
    {
      id: 2,
      frontText: 'astonishing rate',
      backText: 'tốc độ kinh ngạc',
      pronunciation: '/əˈstɒnɪʃɪŋ reɪt/',
      setId: 1,
      setName: 'Exercise 1',
      difficulty: 4,
      viewCount: 200,
      successRate: 72,
      hasAudio: true,
      hasImage: false
    },
    {
      id: 3,
      frontText: 'coincided with',
      backText: 'đồng thời với',
      pronunciation: '/koʊˈɪnsaɪd wɪð/',
      setId: 1,
      setName: 'Exercise 1',
      difficulty: 5,
      viewCount: 120,
      successRate: 68,
      hasAudio: true,
      hasImage: false
    }
  ];

//   type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
//   const DifficultyBadge = ({ level }:Record<DifficultyLevel, string>) => {
//     const colors = {
//       1: 'bg-green-100 text-green-800',
//       2: 'bg-blue-100 text-blue-800',
//       3: 'bg-yellow-100 text-yellow-800',
//       4: 'bg-orange-100 text-orange-800',
//       5: 'bg-red-100 text-red-800'
//     };
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
//         Level {level}
//       </span>
//     );
//   };

  const FlashcardTable = () => (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Quản lý Flashcards</h2>
          <div className="flex space-x-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Flashcard
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm flashcard..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={selectedSet}
            onChange={(e) => setSelectedSet(e.target.value)}
          >
            <option value="all">Tất cả bộ thẻ</option>
            {flashcardSets.map(set => (
              <option key={set.id} value={set.id}>{set.title}</option>
            ))}
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Bộ lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flashcard
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bộ thẻ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Độ khó
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thống kê
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Media
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flashcards.map((card) => (
              <tr key={card.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{card.frontText}</div>
                    <div className="text-sm text-gray-500">{card.backText}</div>
                    {card.pronunciation && (
                      <div className="text-xs text-gray-400 mt-1">{card.pronunciation}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{card.setName}</span>
                </td>
                {/* <td className="px-6 py-4">
                  <DifficultyBadge level={card.difficulty} />
                </td> */}
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="text-gray-900">{card.viewCount} lượt xem</div>
                    <div className="text-gray-500">{card.successRate}% thành công</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {card.hasAudio && (
                      <Volume2 className="w-4 h-4 text-blue-500" />
                    )}
                    {card.hasImage && (
                      <Eye className="w-4 h-4 text-green-500"/>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">3</span> trong tổng số <span className="font-medium">50</span> kết quả
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Trước
            </button>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">2</button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">3</button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const FlashcardSetsTable = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Quản lý Bộ Flashcard</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Tạo bộ mới
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên bộ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số từ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Độ khó
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flashcardSets.map((set) => (
              <tr key={set.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{set.title}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{set.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{set.wordCount} từ</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {set.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    set.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {set.isPublic ? 'Công khai' : 'Riêng tư'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Flashcard</h1>
              <p className="text-gray-600">Quản lý toàn bộ hệ thống flashcard và từ vựng</p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Eye className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng Flashcard</p>
                <p className="text-2xl font-semibold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Star className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bộ thẻ</p>
                <p className="text-2xl font-semibold text-gray-900">52</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <Volume2 className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lượt học hôm nay</p>
                <p className="text-2xl font-semibold text-gray-900">3,524</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <Star className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tỷ lệ thành công</p>
                <p className="text-2xl font-semibold text-gray-900">78.5%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'flashcards'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setActiveTab('sets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bộ Flashcard
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Danh mục
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Thống kê
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'flashcards' && <FlashcardTable />}
        {activeTab === 'sets' && <FlashcardSetsTable />}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quản lý Danh mục</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-500">{category.count} flashcards</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê và Báo cáo</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Flashcards phổ biến nhất</h4>
                <div className="space-y-2">
                  {flashcards.slice(0, 5).map((card) => (
                    <div key={card.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{card.frontText}</span>
                      <span className="text-sm font-medium text-gray-900">{card.viewCount} views</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Hiệu suất theo danh mục</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{category.name}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.floor(Math.random() * 20 + 70)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFlashcardManager;
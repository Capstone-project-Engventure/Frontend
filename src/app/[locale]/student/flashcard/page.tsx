"use client";
import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, RotateCcw, Check, X, Star, BookOpen, Trophy, Calendar, ArrowLeft, ArrowRight, Shuffle, Settings } from 'lucide-react';

const UserFlashcardApp = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, study, flashcard
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState('learn'); // learn, review, test
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, total: 0 });

  // Mock data
  const user = {
    name: 'letrongbach02',
    level: 5,
    exp: 1250,
    dailyGoal: 20,
    studiedToday: 12,
    streak: 7
  };

  const flashcardSets = [
    {
      id: 1,
      title: 'Exercise 1',
      description: 'IELTS Vocabulary Practice',
      totalCards: 17,
      studiedCards: 5,
      category: 'IELTS',
      difficulty: 'Intermediate',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Exercise 2',
      description: 'Advanced IELTS Words',
      totalCards: 25,
      studiedCards: 0,
      category: 'IELTS',
      difficulty: 'Advanced',
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Business Vocabulary',
      description: 'Professional English Terms',
      totalCards: 50,
      studiedCards: 30,
      category: 'TOEIC',
      difficulty: 'Beginner',
      color: 'bg-purple-500'
    }
  ];

  const flashcards = [
    {
      id: 1,
      frontText: 'a brick arch',
      backText: 'mái vòm bằng gạch',
      pronunciation: '/ə brɪk ɑːrtʃ/',
      example: 'The old building features a beautiful brick arch at the entrance.',
      difficulty: 3,
      mastery: 'learning',
      hasAudio: true
    },
    {
      id: 2,
      frontText: 'astonishing rate',
      backText: 'tốc độ kinh ngạc',
      pronunciation: '/əˈstɒnɪʃɪŋ reɪt/',
      example: 'Technology is advancing at an astonishing rate.',
      difficulty: 4,
      mastery: 'new',
      hasAudio: true
    },
    {
      id: 3,
      frontText: 'coincided with',
      backText: 'đồng thời với',
      pronunciation: '/koʊˈɪnsaɪd wɪð/',
      example: 'The meeting coincided with my vacation plans.',
      difficulty: 5,
      mastery: 'review',
      hasAudio: true
    }
  ];

  const Dashboard = () => (
    <div className="max-w-4xl mx-auto p-6">
      {/* User Stats Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Chào {user.name}!</h1>
            <p className="text-blue-100">Hôm nay bạn đã học {user.studiedToday}/{user.dailyGoal} từ</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">Level {user.level}</div>
            <div className="text-blue-100">{user.exp} EXP</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-blue-100 mb-1">
            <span>Tiến độ hàng ngày</span>
            <span>{Math.round((user.studiedToday / user.dailyGoal) * 100)}%</span>
          </div>
          <div className="w-full bg-blue-400 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(user.studiedToday / user.dailyGoal) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Trophy className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Chuỗi ngày học</p>
              <p className="text-2xl font-bold text-gray-900">{user.streak} ngày</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Tổng từ đã học</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Thời gian học</p>
              <p className="text-2xl font-bold text-gray-900">2.5h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard Sets */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Bộ Flashcard của bạn</h2>
          <p className="text-gray-600">Chọn bộ thẻ để bắt đầu học</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcardSets.map((set) => (
              <div key={set.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => setCurrentView('study')}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 ${set.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                    {set.title.charAt(0)}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {set.category}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{set.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{set.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500">{set.studiedCards}/{set.totalCards} từ</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {set.difficulty}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(set.studiedCards / set.totalCards) * 100}%` }}
                  ></div>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  {set.studiedCards === 0 ? 'Bắt đầu học' : 'Tiếp tục học'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const StudyModeSelection = () => (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Exercise 1</h1>
        <p className="text-gray-600">Chọn chế độ học phù hợp với bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 cursor-pointer transition-colors"
          onClick={() => {
            setStudyMode('learn');
            setCurrentView('flashcard');
          }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Học mới</h3>
            <p className="text-gray-600 text-sm">Học những từ vựng mới chưa từng gặp</p>
            <div className="mt-4 text-2xl font-bold text-green-600">12 từ</div>
          </div>
        </div>

        <div 
          className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 cursor-pointer transition-colors"
          onClick={() => {
            setStudyMode('review');
            setCurrentView('flashcard');
          }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ôn tập</h3>
            <p className="text-gray-600 text-sm">Ôn lại những từ đã học để ghi nhớ lâu hơn</p>
            <div className="mt-4 text-2xl font-bold text-yellow-600">5 từ</div>
          </div>
        </div>

        <div 
          className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 cursor-pointer transition-colors"
          onClick={() => {
            setStudyMode('test');
            setCurrentView('flashcard');
          }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kiểm tra</h3>
            <p className="text-gray-600 text-sm">Kiểm tra khả năng ghi nhớ của bạn</p>
            <div className="mt-4 text-2xl font-bold text-red-600">17 từ</div>
          </div>
        </div>
      </div>
    </div>
  );

  const FlashcardStudy = () => {
    const currentCard = flashcards[currentCardIndex];
    
    const handleAnswer = (isCorrect) => {
      setSessionStats(prev => ({
        ...prev,
        [isCorrect ? 'correct' : 'incorrect']: prev[isCorrect ? 'correct' : 'incorrect'] + 1,
        total: prev.total + 1
      }));
      
      // Move to next card
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setIsFlipped(false);
        setShowAnswer(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setCurrentView('study')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </button>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">
              {currentCardIndex + 1} / {flashcards.length}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {studyMode === 'learn' ? 'Học mới' : studyMode === 'review' ? 'Ôn tập' : 'Kiểm tra'}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Shuffle className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
          ></div>
        </div>

        {/* Session Stats */}
        <div className="flex justify-center space-x-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{sessionStats.correct}</div>
            <div className="text-sm text-gray-600">Đúng</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{sessionStats.incorrect}</div>
            <div className="text-sm text-gray-600">Sai</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{sessionStats.total}</div>
            <div className="text-sm text-gray-600">Tổng</div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 min-h-[300px] flex flex-col justify-center">
          <div className="text-center">
            {/* Front of card */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentCard.frontText}</h2>
              {currentCard.pronunciation && (
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-gray-600">{currentCard.pronunciation}</span>
                  {currentCard.hasAudio && (
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <Volume2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Show answer button or answer */}
            {!showAnswer ? (
              <button 
                onClick={() => setShowAnswer(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Hiển thị đáp án
              </button>
            ) : (
              <div className="border-t pt-6">
                <div className="text-2xl font-semibold text-gray-900 mb-4">
                  {currentCard.backText}
                </div>
                {currentCard.example && (
                  <div className="text-gray-600 italic mb-4">
                    <strong>Ví dụ:</strong> {currentCard.example}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Answer Buttons */}
        {showAnswer && (
          <div className="flex space-x-4">
            <button 
              onClick={() => handleAnswer(false)}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 mr-2" />
              Không biết
            </button>
            <button 
              onClick={() => handleAnswer(true)}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <Check className="w-5 h-5 mr-2" />
              Biết rồi
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button 
            onClick={() => {
              if (currentCardIndex > 0) {
                setCurrentCardIndex(prev => prev - 1);
                setShowAnswer(false);
              }
            }}
            disabled={currentCardIndex === 0}
            className="flex items-center text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Trước
          </button>
          
          <button 
            onClick={() => {
              if (currentCardIndex < flashcards.length - 1) {
                setCurrentCardIndex(prev => prev + 1);
                setShowAnswer(false);
              }
            }}
            disabled={currentCardIndex === flashcards.length - 1}
            className="flex items-center text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Sau
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'study' && <StudyModeSelection />}
      {currentView === 'flashcard' && <FlashcardStudy />}
    </div>
  );
};

export default UserFlashcardApp;
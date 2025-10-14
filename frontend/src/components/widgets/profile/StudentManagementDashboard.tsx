"use client";

import { useState } from "react";
import { StudentProfile } from "./StudentProfile";
import { LearningAnalytics } from "./LearningAnalytics";
import { SubjectCard } from "./SubjectCard";
import { AchievementGrid, AchievementBadge } from "./AchievementBadge";

// Mock data
const mockSubjects = [
  {
    id: "MATH12",
    name: "Toán học",
    code: "MATH12", 
    teacher: "Trần Văn A",
    currentGrade: "A",
    currentScore: 9.0,
    credits: 4,
    attendance: 96.5,
    assignments: {
      total: 15,
      completed: 14,
      avgScore: 8.8
    },
    exams: {
      midterm: 9.2,
      final: 8.8,
      quizzes: [9.0, 8.5, 9.5, 8.8]
    },
    progress: {
      completed: 28,
      total: 32
    },
    nextAssignment: {
      title: "Bài tập về đạo hàm",
      dueDate: "2024-11-15",
      type: "assignment" as const
    },
    recentActivities: [
      { date: "2024-11-01", activity: "Kiểm tra 15 phút", score: 9.0 },
      { date: "2024-10-28", activity: "Nộp bài tập chương 3", score: 8.5 },
      { date: "2024-10-25", activity: "Tham gia thảo luận nhóm" }
    ]
  },
  {
    id: "PHYS12",
    name: "Vật lý",
    code: "PHYS12",
    teacher: "Lê Thị B", 
    currentGrade: "B+",
    currentScore: 8.5,
    credits: 3,
    attendance: 94.2,
    assignments: {
      total: 12,
      completed: 11,
      avgScore: 8.2
    },
    exams: {
      midterm: 8.0,
      quizzes: [8.5, 7.8, 8.8, 8.2]
    },
    progress: {
      completed: 22,
      total: 28
    },
    nextAssignment: {
      title: "Thí nghiệm về sóng cơ",
      dueDate: "2024-11-20",
      type: "project" as const
    },
    recentActivities: [
      { date: "2024-11-02", activity: "Bài lab thực hành", score: 8.5 },
      { date: "2024-10-30", activity: "Kiểm tra giữa kỳ", score: 8.0 },
      { date: "2024-10-27", activity: "Thuyết trình nhóm", score: 8.8 }
    ]
  }
];

const mockAchievements = [
  {
    id: "perfect_attendance",
    title: "Chuyên cần xuất sắc",
    description: "Đi học đầy đủ trong cả học kỳ",
    icon: "🏆",
    category: "attendance" as const,
    rarity: "uncommon" as const,
    isEarned: true,
    earnedDate: "2024-01-15"
  },
  {
    id: "top_student",
    title: "Học sinh giỏi",
    description: "Đạt GPA >= 8.5 trong học kỳ",
    icon: "⭐",
    category: "academic" as const,
    rarity: "rare" as const,
    isEarned: true,
    earnedDate: "2024-06-20"
  },
  {
    id: "math_master",
    title: "Bậc thầy Toán học",
    description: "Đạt điểm 9+ trong tất cả bài kiểm tra Toán",
    icon: "🧮",
    category: "academic" as const,
    rarity: "legendary" as const,
    isEarned: false,
    progress: {
      current: 3,
      target: 5
    }
  },
  {
    id: "participation_star",
    title: "Ngôi sao tham gia",
    description: "Tham gia tích cực trong 50 hoạt động lớp",
    icon: "🌟",
    category: "participation" as const,
    rarity: "common" as const,
    isEarned: true,
    earnedDate: "2024-03-10"
  },
  {
    id: "science_explorer",
    title: "Nhà khám phá khoa học",
    description: "Hoàn thành 10 thí nghiệm khoa học",
    icon: "🔬",
    category: "academic" as const,
    rarity: "uncommon" as const,
    isEarned: false,
    progress: {
      current: 7,
      target: 10
    }
  }
];

export const StudentManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'analytics' | 'subjects' | 'achievements'>('profile');



  const handleSubjectDetails = (subjectId: string) => {
    console.log("View subject details:", subjectId);
    // Navigate to subject detail page
  };

  const handleTabClick = (tab: 'profile' | 'analytics' | 'subjects' | 'achievements') => {
    console.log("Switching to tab:", tab);
    setActiveTab(tab);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Navigation Header - Fixed */}
      <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => handleTabClick('profile')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-[#1e1e2f] text-[#1e1e2f]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hồ sơ học sinh
            </button>
            <button
              onClick={() => handleTabClick('analytics')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-[#1e1e2f] text-[#1e1e2f]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Phân tích học tập
            </button>
            <button
              onClick={() => handleTabClick('subjects')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'subjects'
                  ? 'border-[#1e1e2f] text-[#1e1e2f]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Môn học ({mockSubjects.length})
            </button>
            <button
              onClick={() => handleTabClick('achievements')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'achievements'
                  ? 'border-[#1e1e2f] text-[#1e1e2f]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Thành tích ({mockAchievements.filter(a => a.isEarned).length}/{mockAchievements.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-6">
          {activeTab === 'profile' && (
            <div className="max-w-7xl mx-auto px-6">
              <StudentProfile />
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="max-w-7xl mx-auto px-6">
              <LearningAnalytics />
            </div>
          )}
          
          {activeTab === 'subjects' && (
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Môn học</h1>
                <p className="text-gray-600">Theo dõi tiến độ và kết quả học tập từng môn</p>
                

              </div>
              
              {/* Subject Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tổng môn học</p>
                      <p className="text-2xl font-bold text-gray-800">{mockSubjects.length}</p>
                    </div>
                    <div className="text-3xl">📚</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">GPA trung bình</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {(mockSubjects.reduce((sum, s) => sum + s.currentScore, 0) / mockSubjects.length).toFixed(1)}
                      </p>
                    </div>
                    <div className="text-3xl">📊</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Điểm danh TB</p>
                      <p className="text-2xl font-bold text-green-600">
                        {(mockSubjects.reduce((sum, s) => sum + s.attendance, 0) / mockSubjects.length).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-3xl">✅</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Bài tập hoàn thành</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.round((mockSubjects.reduce((sum, s) => sum + (s.assignments.completed / s.assignments.total), 0) / mockSubjects.length) * 100)}%
                      </p>
                    </div>
                    <div className="text-3xl">📝</div>
                  </div>
                </div>
              </div>
              
              {/* Subject Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onViewDetails={handleSubjectDetails}
                  />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'achievements' && (
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Hệ thống thành tích</h1>
                <p className="text-gray-600">Các huy hiệu và thành tích đã đạt được trong quá trình học tập</p>
                

                
                {/* Achievement Overview */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Đã đạt được</p>
                        <p className="text-2xl font-bold">{mockAchievements.filter(a => a.isEarned).length}</p>
                      </div>
                      <div className="text-3xl">🏆</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Đang tiến bộ</p>
                        <p className="text-2xl font-bold">{mockAchievements.filter(a => !a.isEarned && a.progress).length}</p>
                      </div>
                      <div className="text-3xl">⚡</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Tổng cộng</p>
                        <p className="text-2xl font-bold">{mockAchievements.length}</p>
                      </div>
                      <div className="text-3xl">🎯</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Featured Achievement Badges - Hiển thị AchievementBadge riêng lẻ */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Thành tích nổi bật</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(() => {
                    // Lấy thành tích hiếm đã đạt được trước
                    const rareEarned = mockAchievements.filter(a => a.isEarned && (a.rarity === 'rare' || a.rarity === 'legendary'));
                    // Nếu không có, lấy bất kỳ thành tích đã đạt được nào
                    const featured = rareEarned.length > 0 ? rareEarned : mockAchievements.filter(a => a.isEarned);
                    return featured.slice(0, 3).map((achievement) => (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        size="large"
                        showProgress={false}
                      />
                    ));
                  })()}
                </div>
              </div>
              
              {/* Achievement Grid Component - Tổng hợp tất cả AchievementBadge */}
              {mockAchievements && mockAchievements.length > 0 ? (
                <AchievementGrid achievements={mockAchievements} />
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-500">Không có dữ liệu thành tích</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
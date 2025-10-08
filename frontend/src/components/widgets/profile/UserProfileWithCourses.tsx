"use client";

import { useState } from "react";
import { UserProfile } from "./UserProfile";
import { CourseCard } from "./CourseCard";
import { CustomButton } from "../../ui/CustomButton";

interface Course {
  id: string;
  name: string;
  description: string;
  instructor: string;
  progress: number;
  status: 'enrolled' | 'completed' | 'in-progress';
  startDate: string;
  endDate: string;
  thumbnail: string;
  totalLessons: number;
  completedLessons: number;
}

export const UserProfileWithCourses = () => {
  // Mock courses data
  const [courses] = useState<Course[]>([
    {
      id: "C001",
      name: "Lập trình Web với React và Node.js",
      description: "Khóa học toàn diện về phát triển ứng dụng web hiện đại với React frontend và Node.js backend",
      instructor: "Nguyễn Văn Hưng",
      progress: 75,
      status: "in-progress",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      thumbnail: "/api/placeholder/400/200",
      totalLessons: 40,
      completedLessons: 30
    },
    {
      id: "C002", 
      name: "Cơ sở dữ liệu MySQL nâng cao",
      description: "Học về thiết kế, tối ưu hóa và quản trị cơ sở dữ liệu MySQL cho các ứng dụng lớn",
      instructor: "Trần Thị Lan",
      progress: 100,
      status: "completed",
      startDate: "2023-09-01",
      endDate: "2023-12-01",
      thumbnail: "/api/placeholder/400/200",
      totalLessons: 25,
      completedLessons: 25
    },
    {
      id: "C003",
      name: "Machine Learning cơ bản",
      description: "Giới thiệu về Machine Learning, các thuật toán cơ bản và ứng dụng thực tế",
      instructor: "Lê Minh Tuấn",
      progress: 0,
      status: "enrolled",
      startDate: "2024-03-01",
      endDate: "2024-06-01",
      thumbnail: "/api/placeholder/400/200",
      totalLessons: 35,
      completedLessons: 0
    },
    {
      id: "C004",
      name: "UI/UX Design với Figma",
      description: "Thiết kế giao diện người dùng chuyên nghiệp với các công cụ và nguyên tắc thiết kế hiện đại",
      instructor: "Phạm Thu Hà",
      progress: 45,
      status: "in-progress",
      startDate: "2024-02-01",
      endDate: "2024-05-01",
      thumbnail: "/api/placeholder/400/200",
      totalLessons: 30,
      completedLessons: 13
    }
  ]);

  const [activeTab, setActiveTab] = useState<'profile' | 'courses'>('profile');

  const handleViewCourseDetails = (courseId: string) => {
    console.log("View course details:", courseId);
    // Navigate to course details page
  };

  const handleContinueCourse = (courseId: string) => {
    console.log("Continue course:", courseId);
    // Navigate to course learning page
  };

  const getCoursesCount = () => {
    const total = courses.length;
    const completed = courses.filter(c => c.status === 'completed').length;
    const inProgress = courses.filter(c => c.status === 'in-progress').length;
    
    return { total, completed, inProgress };
  };

  const coursesCount = getCoursesCount();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-4 text-sm font-medium focus:outline-none ${
              activeTab === 'profile'
                ? 'border-b-2 border-[#1e1e2f] text-[#1e1e2f]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-4 text-sm font-medium focus:outline-none ${
              activeTab === 'courses'
                ? 'border-b-2 border-[#1e1e2f] text-[#1e1e2f]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Khóa học của tôi ({coursesCount.total})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && <UserProfile />}

      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Course Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thống kê khóa học</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-medium text-blue-800">Tổng khóa học</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{coursesCount.total}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-medium text-yellow-800">Đang học</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{coursesCount.inProgress}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-medium text-green-800">Hoàn thành</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{coursesCount.completed}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-medium text-purple-800">Tỷ lệ hoàn thành</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {Math.round((coursesCount.completed / coursesCount.total) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Course Filters */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <CustomButton className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm">
                Tất cả ({coursesCount.total})
              </CustomButton>
              <CustomButton className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm">
                Đang học ({coursesCount.inProgress})
              </CustomButton>
              <CustomButton className="bg-green-100 hover:bg-green-200 text-green-800 text-sm">
                Hoàn thành ({coursesCount.completed})
              </CustomButton>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewDetails={handleViewCourseDetails}
                onContinue={handleContinueCourse}
              />
            ))}
          </div>

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Chưa có khóa học nào
              </h3>
              <p className="text-gray-500 mb-4">
                Bắt đầu hành trình học tập của bạn bằng cách đăng ký khóa học đầu tiên
              </p>
              <CustomButton className="bg-[#1e1e2f] hover:bg-[#2a2a40] text-white">
                Khám phá khóa học
              </CustomButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
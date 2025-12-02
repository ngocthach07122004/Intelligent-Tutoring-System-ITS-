"use client";

import { useState } from "react";
import { CustomButton } from "@/components/ui/CustomButton";
import { CourseDetailModal } from "./CourseDetailModal";
import { mockCourses } from "@/lib/mockData/courses";
import {
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Calendar,
  Users,
  BarChart3
} from "lucide-react";

// Local interface for component (matches mock data structure)
interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  instructor: string;
  semester: string;
  credits: number;
  schedule: string;
  status: 'active' | 'completed' | 'upcoming';
  enrollmentDate: string;
  progress: number;
  students: number;
  maxStudents: number;
  modules?: any[];
}

export const CourseManagement = () => {
  const [courses] = useState<Course[]>(Object.values(mockCourses));
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'upcoming'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Đang học';
      case 'completed': return 'Hoàn thành';
      case 'upcoming': return 'Sắp diễn ra';
      default: return '';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'all' || course.status === filter;
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý Khóa học
          </h1>
          <p className="text-gray-600">Quản lý các khóa học đã đăng ký và theo dõi tiến độ học tập</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Tổng khóa học</p>
                <p className="text-3xl font-bold text-gray-900">
                  {courses.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Đang học</p>
                <p className="text-3xl font-bold text-gray-900">
                  {courses.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Tổng tín chỉ</p>
                <p className="text-3xl font-bold text-gray-900">
                  {courses.reduce((sum, c) => sum + c.credits, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Tiến độ TB</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học, giảng viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-800 bg-white"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filter === 'active'
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Đang học
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filter === 'completed'
                    ? 'bg-gray-700 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hoàn thành
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200">
              {/* Course Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{course.code} • {course.instructor}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}>
                    {getStatusLabel(course.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{course.description}</p>
              </div>

              {/* Course Info */}
              <div className="p-6 border-b border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-gray-500">Học kỳ</p>
                      <p className="font-medium text-gray-800">{course.semester}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-gray-500">Tín chỉ</p>
                      <p className="font-medium text-gray-800">{course.credits}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-gray-500">Lịch học</p>
                      <p className="font-medium text-gray-800">{course.schedule}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-gray-500">Sĩ số</p>
                      <p className="font-medium text-gray-800">{course.students}/{course.maxStudents}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Tiến độ học tập</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {course.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gray-800 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <CustomButton
                    onClick={() => setSelectedCourse(course)}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white shadow-md"
                  >
                    Xem chi tiết
                  </CustomButton>
                  <CustomButton
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                  >
                    Tài liệu
                  </CustomButton>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Không tìm thấy khóa học nào
            </h3>
            <p className="text-gray-500">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};
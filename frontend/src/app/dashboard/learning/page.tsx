"use client";

import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Search, 
  Filter,
  Star,
  Users,
  Clock,
  Award,
  TrendingUp,
  BookMarked,
  GraduationCap,
  ChevronRight,
  CheckCircle2,
  Plus,
  X
} from "lucide-react";
import { CustomButton } from "@/components/ui/CustomButton";
import { allAvailableCourses, type AvailableCourse } from "@/lib/mockData/allCourses";
import { courseServiceApi } from "@/lib/BE-library/course-service-api";
import type { CourseResponse } from "@/lib/BE-library/course-service-interfaces";

export default function LearningPage() {
  const [courses, setCourses] = useState<AvailableCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'enrolled' | 'available'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<AvailableCourse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  // Fetch courses from API with mock fallback
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await courseServiceApi.getPublishedCourses({ page: 0, size: 100 });
        
        if (response.success && response.data?.content) {
          // Map API response to AvailableCourse format
          const apiCourses: AvailableCourse[] = (response.data.content as CourseResponse[]).map((course) => ({
            id: course.id?.toString() || '',
            name: course.title || '',
            code: course.code || '',
            instructor: course.instructorName || 'Unknown',
            department: 'Computer Science', // Not in API
            credits: course.credits || 3,
            schedule: course.schedule || '',
            enrolled: course.enrolled || false,
            currentStudents: course.currentStudents || 0,
            maxStudents: course.maxStudents || 50,
            rating: 4.5, // Not in API
            reviews: 0, // Not in API
            level: 'Intermediate', // Could map from tags
            description: course.description || '',
            prerequisites: course.prerequisites?.map(p => p.requiredCourseTitle || '') || [],
            tags: course.tags?.map(t => t.name || '') || [],
            semester: course.semester || '',
            startDate: course.startDate || '',
            endDate: course.endDate || '',
          }));
          
          console.log('✅ Loaded', apiCourses.length, 'courses from API');
          setCourses(apiCourses);
        } else {
          console.warn('⚠️ API returned no courses, using mock data');
          setCourses(allAvailableCourses);
        }
      } catch (error) {
        console.warn('⚠️ Backend offline, using mock data:', error);
        setCourses(allAvailableCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'Beginner': return 'Cơ bản';
      case 'Intermediate': return 'Trung cấp';
      case 'Advanced': return 'Nâng cao';
      default: return '';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesEnrollment = 
      filter === 'all' ? true :
      filter === 'enrolled' ? course.enrolled :
      filter === 'available' ? !course.enrolled : true;
    
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesEnrollment && matchesLevel && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, levelFilter, searchTerm]);

  const stats = {
    total: courses.length,
    enrolled: courses.filter(c => c.enrolled).length,
    available: courses.filter(c => !c.enrolled).length,
    avgRating: (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1),
  };

  const handleEnroll = (course: AvailableCourse) => {
    alert(`Đăng ký khóa học: ${course.name}\n\nChức năng này sẽ được kết nối với backend để xử lý đăng ký.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-gray-900" />
            <h1 className="text-3xl font-bold text-gray-900">
              Khám phá Khóa học
            </h1>
          </div>
          <p className="text-gray-600">
            Tìm kiếm và đăng ký các khóa học phù hợp với bạn
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải khóa học...</p>
            </div>
          </div>
          
        )}


        {/* Main Content */}
        {!loading && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Tổng khóa học</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Đã đăng ký</p>
                <p className="text-3xl font-bold text-gray-900">{stats.enrolled}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Có thể đăng ký</p>
                <p className="text-3xl font-bold text-gray-900">{stats.available}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <BookMarked className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Đánh giá TB</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học, giảng viên, khoa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-800 bg-white"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    filter === 'all'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilter('enrolled')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    filter === 'enrolled'
                      ? 'bg-gray-800 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Đã đăng ký
                </button>
                <button
                  onClick={() => setFilter('available')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    filter === 'available'
                      ? 'bg-gray-700 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Có thể đăng ký
                </button>
              </div>

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setLevelFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    levelFilter === 'all'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tất cả cấp độ
                </button>
                <button
                  onClick={() => setLevelFilter('Beginner')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    levelFilter === 'Beginner'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cơ bản
                </button>
                <button
                  onClick={() => setLevelFilter('Intermediate')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    levelFilter === 'Intermediate'
                      ? 'bg-yellow-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Trung cấp
                </button>
                <button
                  onClick={() => setLevelFilter('Advanced')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    levelFilter === 'Advanced'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Nâng cao
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 flex flex-col"
            >
              {/* Course Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        {course.code}
                      </span>
                      {course.enrolled && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200">
                          Đã đăng ký
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-500">{course.department}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border shrink-0 ${getLevelColor(course.level)}`}>
                    {getLevelLabel(course.level)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              </div>

              {/* Instructor & Rating */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium text-xs">
                      {course.instructor.charAt(course.instructor.indexOf('.') + 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-gray-900">{course.rating}</span>
                    <span className="text-xs text-gray-500">({course.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6 border-b border-gray-100 flex-1">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-600 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs">Tín chỉ</p>
                      <p className="font-medium text-gray-800">{course.credits}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs">Sĩ số</p>
                      <p className="font-medium text-gray-800">{course.students}/{course.maxStudents}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Clock className="w-4 h-4 text-gray-600 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs">Lịch học</p>
                      <p className="font-medium text-gray-800">{course.schedule}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {course.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6">
                <div className="flex gap-3">
                  <CustomButton
                    onClick={() => setSelectedCourse(course)}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                  >
                    Xem chi tiết
                  </CustomButton>
                  {!course.enrolled ? (
                    <CustomButton
                      onClick={() => handleEnroll(course)}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white shadow-md flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Đăng ký
                    </CustomButton>
                  ) : (
                    <CustomButton
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center gap-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Vào học
                    </CustomButton>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              ← Trước
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, current, and adjacent pages
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Sau →
            </button>
          </div>
        )}

        {/* Results Info */}
        {filteredCourses.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredCourses.length)} trong tổng số {filteredCourses.length} khóa học
          </div>
        )}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Không tìm thấy khóa học nào
            </h3>
            <p className="text-gray-500">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-gray-900" />
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết khóa học</h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Course Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-500 uppercase">
                        {selectedCourse.code}
                      </span>
                      {selectedCourse.enrolled && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200">
                          Đã đăng ký
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(selectedCourse.level)}`}>
                        {getLevelLabel(selectedCourse.level)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedCourse.name}
                    </h3>
                    <p className="text-gray-600">{selectedCourse.description}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(selectedCourse.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-900">{selectedCourse.rating}</span>
                    <span className="text-sm text-gray-500">({selectedCourse.reviews} đánh giá)</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                    {selectedCourse.instructor.charAt(selectedCourse.instructor.indexOf('.') + 2)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giảng viên</p>
                    <p className="font-semibold text-gray-900">{selectedCourse.instructor}</p>
                    <p className="text-sm text-gray-600">{selectedCourse.department}</p>
                  </div>
                </div>
              </div>

              {/* Course Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Award className="w-6 h-6 text-gray-600 mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Tín chỉ</p>
                  <p className="text-xl font-bold text-gray-900">{selectedCourse.credits}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Users className="w-6 h-6 text-gray-600 mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Sĩ số</p>
                  <p className="text-xl font-bold text-gray-900">{selectedCourse.students}/{selectedCourse.maxStudents}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 col-span-2">
                  <Clock className="w-6 h-6 text-gray-600 mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Lịch học</p>
                  <p className="text-lg font-bold text-gray-900">{selectedCourse.schedule}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Chủ đề</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md border border-gray-200 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <CustomButton
                  onClick={() => setSelectedCourse(null)}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                >
                  Đóng
                </CustomButton>
                {!selectedCourse.enrolled ? (
                  <CustomButton
                    onClick={() => {
                      handleEnroll(selectedCourse);
                      setSelectedCourse(null);
                    }}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white shadow-md flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Đăng ký khóa học
                  </CustomButton>
                ) : (
                  <CustomButton
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                    Vào học ngay
                  </CustomButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </>
        )}
      </div>
    </div>
  );
}
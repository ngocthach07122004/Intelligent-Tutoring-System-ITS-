"use client";

import { ArrowLeft, BookOpen, Clock, Award, Users, Calendar, CheckCircle2, PlayCircle, FileText, Download, Star } from "lucide-react";
import { EnrollmentResponse } from "@/lib/BE-library/interfaces";

interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessons: {
    id: string;
    title: string;
    type: 'video' | 'reading' | 'quiz' | 'assignment';
    duration: string;
    completed: boolean;
  }[];
}

interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  semester: string;
  credits: number;
  schedule: string;
  status: 'active' | 'completed' | 'upcoming';
  enrollmentDate: string;
  progress: number;
  students: number;
  maxStudents: number;
  description: string;
}

interface CourseDetailModalProps {
  course: EnrollmentResponse;
  onClose: () => void;
}

export const CourseDetailModal = ({ course, onClose }: CourseDetailModalProps) => {
  // Mock data for course details
  const courseDetails = {
    fullDescription: `. Khóa học này được thiết kế để cung cấp nền tảng vững chắc về các khái niệm cơ bản và nâng cao trong lĩnh vực này. Bạn sẽ được học từ những giảng viên giàu kinh nghiệm với phương pháp giảng dạy thực tế và dễ hiểu.`,
    
    whatYouWillLearn: [
      "Nắm vững các khái niệm cơ bản và nền tảng của môn học",
      "Áp dụng kiến thức vào các bài tập thực tế và dự án",
      "Phát triển tư duy phản biện và giải quyết vấn đề",
      "Làm việc nhóm hiệu quả và trình bày ý tưởng",
      "Chuẩn bị tốt cho các kỳ thi và đánh giá",
      "Xây dựng portfolio và kinh nghiệm thực tế"
    ],
    
    requirements: [
      "Kiến thức cơ bản về môn học tiên quyết (nếu có)",
      "Máy tính/laptop để thực hành",
      "Tinh thần học tập nhiệt huyết và chủ động",
      "Sẵn sàng tham gia thảo luận và làm việc nhóm"
    ],

    instructorInfo: {
      name: course.instructorName,
      title: "Giảng viên chính",
      rating: 4.8,
      students: 1250,
      courses: 8,
      bio: "Giảng viên với hơn 10 năm kinh nghiệm giảng dạy, chuyên sâu về lĩnh vực này. Đã hướng dẫn hàng trăm sinh viên thành công trong học tập và nghề nghiệp."
    },

    modules: [
      {
        id: "module1",
        title: "Chương 1: Giới thiệu và Khái niệm cơ bản",
        duration: "2 tuần",
        lessons: [
          { id: "1.1", title: "Giới thiệu về khóa học", type: "video" as const, duration: "15:30", completed: true },
          { id: "1.2", title: "Các khái niệm cơ bản", type: "video" as const, duration: "25:45", completed: true },
          { id: "1.3", title: "Bài đọc: Tài liệu tham khảo", type: "reading" as const, duration: "10 phút", completed: true },
          { id: "1.4", title: "Bài tập thực hành 1", type: "assignment" as const, duration: "30 phút", completed: false },
          { id: "1.5", title: "Kiểm tra trắc nghiệm", type: "quiz" as const, duration: "15 phút", completed: false }
        ]
      },
      {
        id: "module2",
        title: "Chương 2: Kiến thức nâng cao",
        duration: "3 tuần",
        lessons: [
          { id: "2.1", title: "Đi sâu vào các khái niệm", type: "video" as const, duration: "35:20", completed: false },
          { id: "2.2", title: "Thực hành nâng cao", type: "video" as const, duration: "40:15", completed: false },
          { id: "2.3", title: "Case study thực tế", type: "reading" as const, duration: "20 phút", completed: false },
          { id: "2.4", title: "Dự án nhóm", type: "assignment" as const, duration: "2 giờ", completed: false }
        ]
      },
      {
        id: "module3",
        title: "Chương 3: Ứng dụng thực tế",
        duration: "2 tuần",
        lessons: [
          { id: "3.1", title: "Dự án thực tế", type: "video" as const, duration: "45:00", completed: false },
          { id: "3.2", title: "Workshop và thảo luận", type: "video" as const, duration: "30:00", completed: false },
          { id: "3.3", title: "Bài tập tổng hợp", type: "assignment" as const, duration: "1 giờ", completed: false },
          { id: "3.4", title: "Kiểm tra cuối khóa", type: "quiz" as const, duration: "45 phút", completed: false }
        ]
      }
    ],

    ratings: {
      average: 4.7,
      total: 156,
      breakdown: [
        { stars: 5, count: 98, percentage: 63 },
        { stars: 4, count: 42, percentage: 27 },
        { stars: 3, count: 12, percentage: 8 },
        { stars: 2, count: 3, percentage: 2 },
        { stars: 1, count: 1, percentage: 1 }
      ]
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-4 h-4" />;
      case 'reading': return <FileText className="w-4 h-4" />;
      case 'quiz': return <CheckCircle2 className="w-4 h-4" />;
      case 'assignment': return <Download className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const totalLessons = courseDetails.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const completedLessons = courseDetails.modules.reduce(
    (sum, module) => sum + module.lessons.filter(l => l.completed).length, 
    0
  );

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Hero Section */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 mb-6">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">
                {course.courseCode}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">
                {course.courseSemester}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.courseTitle}</h1>
            <p className="text-lg text-white/90 mb-6">{courseDetails.fullDescription}</p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gray-300 fill-gray-300" />
                <span className="font-semibold">{courseDetails.ratings.average}</span>
                <span className="text-white/80">({courseDetails.ratings.total} đánh giá)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{course.courseMaxStudents} sinh viên</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{course.courseSchedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>{course.courseCredits} tín chỉ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* What you'll learn */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Bạn sẽ học được gì</h2>
                    <div className="grid md:grid-cols-2 gap-3">
                      {courseDetails.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Course Content */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-800">Nội dung khóa học</h2>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">{courseDetails.modules.length}</span> chương • 
                        <span className="font-semibold ml-1">{totalLessons}</span> bài học • 
                        <span className="font-semibold ml-1">{completedLessons}/{totalLessons}</span> hoàn thành
                      </div>
                    </div>

                    <div className="space-y-3">
                      {courseDetails.modules.map((module, moduleIndex) => (
                        <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-100 p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-800">{module.title}</h3>
                              <span className="text-sm text-gray-600">{module.duration}</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              {module.lessons.length} bài học • 
                              {module.lessons.filter(l => l.completed).length} hoàn thành
                            </div>
                          </div>
                          
                          <div className="divide-y divide-gray-100">
                            {module.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className={`p-4 flex items-center justify-between hover:bg-blue-50/50 transition-colors ${
                                  lesson.completed ? 'bg-green-50/30' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className={`p-2 rounded-lg ${
                                    lesson.completed 
                                      ? 'bg-green-100 text-green-600' 
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {getLessonIcon(lesson.type)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`font-medium ${
                                        lesson.completed ? 'text-gray-700' : 'text-gray-800'
                                      }`}>
                                        {lesson.title}
                                      </span>
                                      {lesson.completed && (
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-500 capitalize">{lesson.type}</div>
                                  </div>
                                </div>
                                <span className="text-sm text-gray-600">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Yêu cầu</h2>
                    <ul className="space-y-2">
                      {courseDetails.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8 space-y-6">
                    {/* Progress Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-800 mb-4">Tiến độ học tập</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Hoàn thành</span>
                            <span className="font-bold text-gray-900">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gray-800 h-3 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bài học hoàn thành</span>
                            <span className="font-semibold">{completedLessons}/{totalLessons}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Thời gian học</span>
                            <span className="font-semibold">45 giờ</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Điểm trung bình</span>
                            <span className="font-semibold text-green-600">8.5/10</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instructor Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-800 mb-4">Giảng viên</h3>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {((courseDetails.instructorInfo.name ?? "").charAt(0))}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{courseDetails.instructorInfo.name}</div>
                          <div className="text-sm text-gray-600">{courseDetails.instructorInfo.title}</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{courseDetails.instructorInfo.rating} đánh giá giảng viên</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{courseDetails.instructorInfo.students} học viên</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{courseDetails.instructorInfo.courses} khóa học</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{courseDetails.instructorInfo.bio}</p>
                    </div>

                    {/* Rating Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-800 mb-4">Đánh giá khóa học</h3>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-4xl font-bold text-gray-800">
                          {courseDetails.ratings.average}
                        </div>
                        <div>
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.round(courseDetails.ratings.average)
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-600">
                            {courseDetails.ratings.total} đánh giá
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {courseDetails.ratings.breakdown.map((rating) => (
                          <div key={rating.stars} className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[...Array(rating.stars)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              ))}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${rating.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 w-8 text-right">
                              {rating.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  );
};

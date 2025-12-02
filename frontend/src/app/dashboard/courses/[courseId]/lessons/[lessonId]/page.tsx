'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  Clock,
  Award
} from 'lucide-react';
import { CourseOperation } from '@/lib/BE-library/main';
import type { Course, CourseLesson, CourseModule } from '@/lib/BE-library/interfaces';
import { getCourseWithFallback, getLessonWithFallback } from '@/lib/mockData/courses';

export default function VideoLessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completingLesson, setCompletingLesson] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const courseOp = new CourseOperation();

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      
      // Try API first, fallback to mock data
      const result = await getCourseWithFallback(
        courseId,
        () => courseOp.getCourseById(courseId)
      );
      
      if (result.success && result.data) {
        setCourse(result.data);
      } else {
        console.error('Failed to fetch course:', result.message);
      }
      setLoading(false);
    };

    fetchCourse();
  }, [courseId]);

  // Fetch lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      // Try API first, fallback to mock data
      const result = await getLessonWithFallback(
        lessonId,
        () => courseOp.getLessonById(courseId, lessonId)
      );
      
      if (result.success && result.data) {
        setCurrentLesson(result.data);
      } else {
        console.error('Failed to fetch lesson:', result.message);
      }
    };

    if (courseId && lessonId) {
      fetchLesson();
    }
  }, [courseId, lessonId]);

  // Mark lesson as complete when video ends
  const handleVideoEnd = async () => {
    if (currentLesson && !currentLesson.completed && !completingLesson) {
      setCompletingLesson(true);
      const result = await courseOp.markLessonComplete(courseId, lessonId);
      
      if (result.success) {
        setCurrentLesson({ ...currentLesson, completed: true });
        
        // Update course progress
        if (course) {
          const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
          const completedLessons = course.modules.reduce(
            (acc, module) => acc + module.lessons.filter(l => l.completed || l.id === lessonId).length,
            0
          );
          const newProgress = Math.round((completedLessons / totalLessons) * 100);
          await courseOp.updateProgress(courseId, newProgress);
        }
      }
      setCompletingLesson(false);
    }
  };

  // Get all lessons in flat array
  const getAllLessons = (): CourseLesson[] => {
    if (!course) return [];
    return course.modules.flatMap(module => module.lessons);
  };

  // Find current lesson index
  const getCurrentLessonIndex = (): number => {
    const allLessons = getAllLessons();
    return allLessons.findIndex(lesson => lesson.id === lessonId);
  };

  // Navigate to previous lesson
  const goToPreviousLesson = () => {
    const allLessons = getAllLessons();
    const currentIndex = getCurrentLessonIndex();
    
    if (currentIndex > 0) {
      const previousLesson = allLessons[currentIndex - 1];
      router.push(`/dashboard/courses/${courseId}/lessons/${previousLesson.id}`);
    }
  };

  // Navigate to next lesson
  const goToNextLesson = () => {
    const allLessons = getAllLessons();
    const currentIndex = getCurrentLessonIndex();
    
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      router.push(`/dashboard/courses/${courseId}/lessons/${nextLesson.id}`);
    }
  };

  // Navigate to specific lesson
  const goToLesson = (lesson: CourseLesson) => {
    router.push(`/dashboard/courses/${courseId}/lessons/${lesson.id}`);
  };

  // Get lesson icon
  const getLessonIcon = (type: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle2 className="w-5 h-5 text-gray-900" />;
    }
    
    switch (type) {
      case 'video':
        return <PlayCircle className="w-5 h-5 text-gray-600" />;
      case 'reading':
        return <FileText className="w-5 h-5 text-gray-600" />;
      case 'quiz':
        return <ClipboardList className="w-5 h-5 text-gray-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 font-semibold mb-2">Không tìm thấy bài học</p>
          <button
            onClick={() => router.push('/dashboard/courses')}
            className="text-gray-600 hover:text-gray-900"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = getCurrentLessonIndex();
  const allLessons = getAllLessons();
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard/courses')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <h1 className="text-lg font-semibold text-gray-900">{course.name}</h1>
              <p className="text-sm text-gray-600">{currentLesson.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Award className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-900 font-medium">{course.progress}%</span>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden hidden md:block">
              <div 
                className="h-full bg-gray-900 transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Course Outline */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:sticky
          top-[57px]
          left-0
          h-[calc(100vh-57px)]
          w-80
          bg-white
          border-r border-gray-200
          overflow-y-auto
          transition-transform duration-300
          z-40
        `}>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-gray-900" />
              <h2 className="font-semibold text-gray-900">Nội dung khóa học</h2>
            </div>

            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {moduleIndex + 1}. {module.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{module.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isActive = lesson.id === lessonId;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => goToLesson(lesson)}
                          className={`
                            w-full px-4 py-3 flex items-center gap-3 text-left transition-colors
                            ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}
                          `}
                        >
                          {getLessonIcon(lesson.type, lesson.completed)}
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              isActive ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {lessonIndex + 1}. {lesson.title}
                            </p>
                            <p className="text-xs text-gray-600">{lesson.duration}</p>
                          </div>

                          {isActive && (
                            <div className="w-1 h-8 bg-gray-900 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0 ml-0">
          <div className="max-w-5xl mx-auto p-4 lg:p-6">
            {/* Video Player or Content */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 mb-6">
              {currentLesson.type === 'video' && currentLesson.videoUrl ? (
                <div className="relative" style={{ paddingBottom: '56.25%' }}>
                  {currentLesson.videoUrl.includes('youtube.com') || currentLesson.videoUrl.includes('youtu.be') ? (
                    // YouTube embedded video
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={currentLesson.videoUrl}
                      title={currentLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    // Regular video file
                    <video
                      ref={videoRef}
                      className="absolute top-0 left-0 w-full h-full"
                      controls
                      onEnded={handleVideoEnd}
                      src={currentLesson.videoUrl}
                    >
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  )}
                </div>
              ) : (
                <div className="p-8">
                  <div className="prose max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {currentLesson.title}
                    </h2>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: currentLesson.content || '' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {currentLesson.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentLesson.duration}</span>
                    </div>
                    {currentLesson.completed && (
                      <div className="flex items-center gap-1 text-gray-900">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đã hoàn thành</span>
                      </div>
                    )}
                  </div>
                </div>

                {!currentLesson.completed && currentLesson.type === 'video' && (
                  <button
                    onClick={handleVideoEnd}
                    disabled={completingLesson}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {completingLesson ? 'Đang xử lý...' : 'Đánh dấu hoàn thành'}
                  </button>
                )}
              </div>

              {currentLesson.type !== 'video' && currentLesson.content && (
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousLesson}
                disabled={!hasPrevious}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 transition-colors
                  ${hasPrevious 
                    ? 'hover:bg-gray-50 text-gray-900' 
                    : 'opacity-50 cursor-not-allowed text-gray-400'
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Bài trước</span>
              </button>

              <button
                onClick={goToNextLesson}
                disabled={!hasNext}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${hasNext 
                    ? 'bg-gray-900 text-white hover:bg-gray-800' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <span>Bài tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

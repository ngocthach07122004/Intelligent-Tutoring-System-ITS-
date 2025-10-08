"use client";

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

interface CourseCardProps {
  course: Course;
  onViewDetails?: (courseId: string) => void;
  onContinue?: (courseId: string) => void;
}

export const CourseCard = ({ course, onViewDetails, onContinue }: CourseCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enrolled':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Đã đăng ký</span>;
      case 'in-progress':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Đang học</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Hoàn thành</span>;
      default:
        return null;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Course Thumbnail */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={course.thumbnail || "/api/placeholder/400/200"}
          alt={course.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge(course.status)}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {course.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>Giảng viên: {course.instructor}</span>
        </div>

        {/* Progress Bar */}
        {course.status !== 'enrolled' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Tiến độ học tập</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getProgressColor(course.progress)} transition-all duration-300`}
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{course.completedLessons}/{course.totalLessons} bài học</span>
              <span>{course.endDate}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <CustomButton
            onClick={() => onViewDetails?.(course.id)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
          >
            Xem chi tiết
          </CustomButton>
          
          {course.status === 'enrolled' && (
            <CustomButton
              onClick={() => onContinue?.(course.id)}
              className="flex-1 bg-[#1e1e2f] hover:bg-[#2a2a40] text-white transition-colors"
            >
              Bắt đầu học
            </CustomButton>
          )}
          
          {course.status === 'in-progress' && (
            <CustomButton
              onClick={() => onContinue?.(course.id)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              Tiếp tục học
            </CustomButton>
          )}
          
          {course.status === 'completed' && (
            <CustomButton
              onClick={() => onContinue?.(course.id)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white transition-colors"
            >
              Ôn tập
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
};
'use client';

import { useState, useEffect } from 'react';
import { CourseDetailModal } from './CourseDetailModal';
import { mockCourses } from '@/lib/mockData/courses';
import type { Course } from '@/lib/BE-library/interfaces';

interface CourseDetailWrapperProps {
  courseId: string;
  onClose: () => void;
}

export const CourseDetailWrapper = ({ courseId, onClose }: CourseDetailWrapperProps) => {
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    // Try to get course from API first, fallback to mock data
    const fetchCourse = async () => {
      try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`/api/courses/${courseId}`);
        // const data = await response.json();
        // setCourse(data);
        
        // For now, use mock data
        const mockCourse = mockCourses[courseId];
        if (mockCourse) {
          setCourse(mockCourse);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        // Fallback to mock data
        const mockCourse = mockCourses[courseId];
        if (mockCourse) {
          setCourse(mockCourse);
        }
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return <CourseDetailModal course={course} onClose={onClose} />;
};

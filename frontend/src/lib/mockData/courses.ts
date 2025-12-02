import type { Course, CourseModule, CourseLesson } from '../BE-library/interfaces';

// Mock lessons data
export const mockLessons: Record<string, CourseLesson> = {
  '1.1': {
    id: '1.1',
    title: 'Giới thiệu về Kỹ thuật phần mềm',
    type: 'video',
    duration: '15:30',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    completed: false,
  },
  '1.2': {
    id: '1.2',
    title: 'Quy trình phát triển phần mềm',
    type: 'video',
    duration: '20:45',
    videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    completed: true,
  },
  '1.3': {
    id: '1.3',
    title: 'Tài liệu yêu cầu phần mềm',
    type: 'reading',
    duration: '10:00',
    content: `
      <h3>Tài liệu yêu cầu phần mềm (SRS - Software Requirements Specification)</h3>
      <p>Tài liệu yêu cầu phần mềm là một tài liệu quan trọng mô tả chi tiết các yêu cầu chức năng và phi chức năng của hệ thống phần mềm.</p>
      
      <h4>Các thành phần chính:</h4>
      <ul>
        <li><strong>Giới thiệu:</strong> Mục đích, phạm vi, định nghĩa các thuật ngữ</li>
        <li><strong>Mô tả tổng quan:</strong> Bối cảnh sản phẩm, chức năng chính</li>
        <li><strong>Yêu cầu chức năng:</strong> Các tính năng cụ thể của hệ thống</li>
        <li><strong>Yêu cầu phi chức năng:</strong> Hiệu năng, bảo mật, khả năng mở rộng</li>
        <li><strong>Giao diện người dùng:</strong> Mockup, wireframe</li>
      </ul>
      
      <h4>Lợi ích:</h4>
      <p>Tài liệu SRS giúp đảm bảo tất cả các bên liên quan hiểu rõ và đồng ý về những gì sẽ được xây dựng, giảm thiểu rủi ro và chi phí thay đổi sau này.</p>
    `,
    completed: false,
  },
  '1.4': {
    id: '1.4',
    title: 'Bài kiểm tra: Kiến thức cơ bản',
    type: 'quiz',
    duration: '15:00',
    content: `
      <h3>Bài kiểm tra: Kiến thức cơ bản về Kỹ thuật phần mềm</h3>
      <p><strong>Thời gian:</strong> 15 phút | <strong>Số câu hỏi:</strong> 10 câu</p>
      
      <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
        <p><strong>Câu 1:</strong> SDLC là viết tắt của từ gì?</p>
        <ul style="list-style: none; padding-left: 1rem;">
          <li>A. Software Design Life Cycle</li>
          <li>B. Software Development Life Cycle</li>
          <li>C. System Development Life Cycle</li>
          <li>D. Software Deployment Life Cycle</li>
        </ul>
      </div>
      
      <p style="color: #6b7280; font-style: italic;">Nhấn "Bắt đầu làm bài" để làm bài kiểm tra đầy đủ.</p>
    `,
    completed: false,
  },
  '2.1': {
    id: '2.1',
    title: 'Mô hình Waterfall',
    type: 'video',
    duration: '18:20',
    videoUrl: 'https://www.youtube.com/embed/3YDiloj8_d0',
    completed: false,
  },
  '2.2': {
    id: '2.2',
    title: 'Mô hình Agile và Scrum',
    type: 'video',
    duration: '22:15',
    videoUrl: 'https://www.youtube.com/embed/502ILHjX9EE',
    completed: false,
  },
  '2.3': {
    id: '2.3',
    title: 'UML và sơ đồ Use Case',
    type: 'reading',
    duration: '12:00',
    content: `
      <h3>UML và sơ đồ Use Case</h3>
      <p>UML (Unified Modeling Language) là ngôn ngữ mô hình hóa tiêu chuẩn trong phát triển phần mềm.</p>
      
      <h4>Sơ đồ Use Case:</h4>
      <p>Use Case Diagram mô tả các tương tác giữa người dùng (actors) và hệ thống.</p>
      
      <h4>Các thành phần chính:</h4>
      <ul>
        <li><strong>Actor:</strong> Người dùng hoặc hệ thống bên ngoài tương tác với hệ thống</li>
        <li><strong>Use Case:</strong> Chức năng hoặc dịch vụ mà hệ thống cung cấp</li>
        <li><strong>Relationship:</strong> Quan hệ giữa các use case (include, extend, generalization)</li>
      </ul>
      
      <h4>Ví dụ:</h4>
      <p>Trong hệ thống ngân hàng, Actor có thể là "Khách hàng", Use Case là "Rút tiền", "Chuyển khoản", "Kiểm tra số dư".</p>
    `,
    completed: false,
  },
  '2.4': {
    id: '2.4',
    title: 'Bài tập: Thiết kế Use Case',
    type: 'assignment',
    duration: '60:00',
    content: `
      <h3>Bài tập: Thiết kế Use Case Diagram</h3>
      
      <h4>Yêu cầu:</h4>
      <p>Thiết kế Use Case Diagram cho hệ thống quản lý thư viện với các yêu cầu sau:</p>
      
      <ul>
        <li>Sinh viên có thể tìm kiếm sách, mượn sách, trả sách</li>
        <li>Thủ thư có thể quản lý sách (thêm, sửa, xóa), quản lý mượn/trả</li>
        <li>Admin có thể quản lý tài khoản người dùng</li>
        <li>Hệ thống tự động gửi thông báo quá hạn</li>
      </ul>
      
      <h4>Nộp bài:</h4>
      <p>File PDF hoặc hình ảnh sơ đồ Use Case, kèm mô tả ngắn gọn về các use case.</p>
      
      <p><strong>Hạn nộp:</strong> 7 ngày kể từ khi bắt đầu bài học</p>
    `,
    completed: false,
  },
};

// Mock modules data
export const mockModules: CourseModule[] = [
  {
    id: 'module-1',
    title: 'Chương 1: Giới thiệu Kỹ thuật phần mềm',
    duration: '1h 15m',
    lessons: [
      mockLessons['1.1'],
      mockLessons['1.2'],
      mockLessons['1.3'],
      mockLessons['1.4'],
    ],
  },
  {
    id: 'module-2',
    title: 'Chương 2: Quy trình phát triển phần mềm',
    duration: '2h 30m',
    lessons: [
      mockLessons['2.1'],
      mockLessons['2.2'],
      mockLessons['2.3'],
      mockLessons['2.4'],
    ],
  },
];

// Mock courses data
export const mockCourses: Record<string, Course> = {
  'KTPM101': {
    id: 'KTPM101',
    name: 'Kỹ thuật phần mềm',
    code: 'KTPM101',
    instructor: 'TS. Nguyễn Văn A',
    semester: 'HK1 2024-2025',
    credits: 3,
    schedule: 'Thứ 2, 7:00 - 9:30',
    status: 'active',
    enrollmentDate: '01/09/2024',
    progress: 25,
    students: 45,
    maxStudents: 50,
    description: 'Môn học cung cấp kiến thức nền tảng về quy trình phát triển phần mềm, các mô hình phát triển, và kỹ thuật thiết kế hệ thống',
    modules: mockModules,
  },
  'MATH201': {
    id: 'MATH201',
    name: 'Toán rời rạc',
    code: 'MATH201',
    instructor: 'PGS. Trần Thị B',
    semester: 'HK1 2024-2025',
    credits: 4,
    schedule: 'Thứ 3, 13:00 - 16:30',
    status: 'active',
    enrollmentDate: '01/09/2024',
    progress: 60,
    students: 48,
    maxStudents: 50,
    description: 'Môn học về lý thuyết tập hợp, logic, đồ thị và các cấu trúc rời rạc trong khoa học máy tính',
    modules: [
      {
        id: 'math-module-1',
        title: 'Chương 1: Lý thuyết tập hợp',
        duration: '3h 00m',
        lessons: [
          {
            id: '1.1',
            title: 'Khái niệm tập hợp',
            type: 'video',
            duration: '25:00',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: true,
          },
          {
            id: '1.2',
            title: 'Các phép toán trên tập hợp',
            type: 'video',
            duration: '30:00',
            videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
            completed: true,
          },
        ],
      },
    ],
  },
};

// Helper function to check if API is available
export const isAPIAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/health', { 
      method: 'GET',
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Get course with fallback to mock data
export const getCourseWithFallback = async (
  courseId: string,
  apiCall: () => Promise<any>
): Promise<{ success: boolean; data?: Course; message?: string }> => {
  try {
    const result = await apiCall();
    
    // If API call successful, return API data
    if (result.success && result.data) {
      return result;
    }
    
    // If API call failed, use mock data
    console.warn('API call failed, using mock data');
    const mockCourse = mockCourses[courseId];
    
    if (mockCourse) {
      return {
        success: true,
        data: mockCourse,
      };
    }
    
    return {
      success: false,
      message: 'Course not found',
    };
  } catch (error) {
    // If API error, use mock data
    console.warn('API error, using mock data:', error);
    const mockCourse = mockCourses[courseId];
    
    if (mockCourse) {
      return {
        success: true,
        data: mockCourse,
      };
    }
    
    return {
      success: false,
      message: 'Course not found',
    };
  }
};

// Get lesson with fallback to mock data
export const getLessonWithFallback = async (
  lessonId: string,
  apiCall: () => Promise<any>
): Promise<{ success: boolean; data?: CourseLesson; message?: string }> => {
  try {
    const result = await apiCall();
    
    // If API call successful, return API data
    if (result.success && result.data) {
      return result;
    }
    
    // If API call failed, use mock data
    console.warn('API call failed, using mock data');
    const mockLesson = mockLessons[lessonId];
    
    if (mockLesson) {
      return {
        success: true,
        data: mockLesson,
      };
    }
    
    return {
      success: false,
      message: 'Lesson not found',
    };
  } catch (error) {
    // If API error, use mock data
    console.warn('API error, using mock data:', error);
    const mockLesson = mockLessons[lessonId];
    
    if (mockLesson) {
      return {
        success: true,
        data: mockLesson,
      };
    }
    
    return {
      success: false,
      message: 'Lesson not found',
    };
  }
};

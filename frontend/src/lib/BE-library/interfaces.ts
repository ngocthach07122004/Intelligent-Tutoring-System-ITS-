export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
  oldPassword: string;
  newPassword: string;
}

// Course related interfaces
export interface CourseLesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  duration: string;
  videoUrl?: string;
  content?: string;
  completed: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessons: CourseLesson[];
}

export interface Course {
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
  modules: CourseModule[];
}

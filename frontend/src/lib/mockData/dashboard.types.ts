// Dashboard API Response Types
export interface DashboardSummary {
  coursesInProgress: number;
  nextAssignmentDue?: string;
}

export interface RiskProfileDTO {
  level: "LOW" | "MEDIUM" | "HIGH";
  trend: string;
}

export interface StudentDashboardResponse {
  summary: DashboardSummary;
  riskProfile: RiskProfileDTO;
  skillRadar: { [key: string]: number };
}

export interface AchievementResponse {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  earnedDate?: string;
  progress?: Progress;
  earned: boolean;
}

export interface Progress {
  current: number;
  target: number;
}

export interface CourseStats {
  totalCourses: number;
  inProgressCourses: number;
  completedCourses: number;
  averageProgress: number;
}

export interface EnrollmentResponse {
  id: number;
  courseId: number;
  courseTitle: string;
  courseCode: string;
  studentId: number;
  status: string;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  lastAccessAt?: string;
}

export interface SemesterSummary {
  semester: string;
  gpa: number;
  totalCredits: number;
  rank: number;
  totalStudents: number;
  achievements: number;
  attendance: number;
}

export interface OverallSummary {
  gpa: number;
  totalCredits: number;
}

export interface GradebookSummaryResponse {
  studentId: string;
  semesters: SemesterSummary[];
  overall: OverallSummary;
}

export interface UserProfileResponse {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  gender?: string;
  classId?: string;
  className?: string;
  academicYear?: string;
}

export interface DashboardSummaryResponse {
  profile: UserProfileResponse;
  courses: EnrollmentResponse[];
  courseStats: CourseStats;
  performance: GradebookSummaryResponse;
  achievements: AchievementResponse[];
  achievementsCount: number;
  totalLearningHours: number;
  upcomingAssignments: number;
}

export interface SubjectPerformance {
  name: string;
  currentScore: number;
  previousScore: number;
  trend: string;
  percentChange: number;
  color: string;
}

export interface ExamScore {
  month: string;
  score: number;
  average: number;
}

export interface LearningTime {
  week: string;
  hours: number;
}

export interface AcademicProgress {
  currentGPA: number;
  previousGPA: number;
  trend: string;
  percentChange: number;
}

export interface StudentAnalyticsResponse {
  academicProgress: AcademicProgress;
  subjectPerformance: SubjectPerformance[];
  attendanceRate: number;
  assignmentCompletion: number;
  examScores: ExamScore[];
  learningTime: LearningTime[];
  strengths: string[];
  improvements: string[];
}

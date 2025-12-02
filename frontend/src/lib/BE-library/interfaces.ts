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

export interface PageableParams {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface SortObject {
  sorted?: boolean;
  empty?: boolean;
  unsorted?: boolean;
}

export interface PageableObject {
  paged?: boolean;
  pageNumber?: number;
  pageSize?: number;
  offset?: number;
  sort?: SortObject;
  unpaged?: boolean;
}

export interface Page<T> {
  totalPages?: number;
  totalElements?: number;
  pageable?: PageableObject;
  size?: number;
  content?: T[];
  number?: number;
  sort?: SortObject;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

export interface InstructorSummaryResponse {
  id?: number;
  fullName?: string;
  avatarUrl?: string;
}

export interface TagResponse {
  id?: number;
  name?: string;
  type?: "TOPIC" | "SKILL" | "DIFFICULTY";
  description?: string;
}

export interface PrerequisiteResponse {
  id?: number;
  requiredCourseId?: number;
  requiredCourseTitle?: string;
  type?: "HARD" | "SOFT";
  description?: string;
}

export interface CourseResponse {
  id?: number;
  title?: string;
  description?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  visibility?: "PUBLIC" | "PRIVATE";
  instructorId?: number;
  instructorName?: string;
  instructorAvatarUrl?: string;
  thumbnailUrl?: string;
  objectives?: string;
  code?: string;
  credits?: number;
  semester?: string;
  schedule?: string;
  maxStudents?: number;
  startDate?: string; 
  endDate?: string;
  currentStudents?: number;
  enrolled?: boolean;
  progress?: number;
  instructor?: InstructorSummaryResponse;
  tags?: TagResponse[];
  prerequisites?: PrerequisiteResponse[];
  createdAt?: string;
  updatedAt?: string; 
  publishedAt?: string; 
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  visibility: "PUBLIC" | "PRIVATE";
  code?: string;
  credits?: number;
  semester?: string;
  schedule?: string;
  maxStudents?: number;
  startDate?: string; // date
  endDate?: string; // date
  thumbnailUrl?: string;
  objectives?: string;
  tagIds?: number[];
  prerequisiteCourseIds?: number[];
}

export interface EnrollmentResponse {
  id?: number;
  courseId?: number;
  courseTitle?: string;
  courseCode?: string;
  courseSemester?: string;
  courseSchedule?: string;
  courseCredits?: number;
  courseMaxStudents?: number;
  courseThumbnailUrl?: string;
  instructorName?: string;
  instructorAvatarUrl?: string;
  studentId?: number;
  status?: "ACTIVE" | "COMPLETED" | "DROPPED";
  progress?: number;
  enrolledAt?: string;
  completedAt?: string;
  lastAccessAt?: string; 
  updatedAt?: string; 
}

export interface SkillRequest {
  skillName: string;
  category?: string;
  level: number;
  description?: string;
}

export interface SkillResponse {
  id?: number;
  skillName?: string;
  category?: string;
  level?: number;
  description?: string;
  createdAt?: string; // date-time
  updatedAt?: string; // date-time
}

// --- USER PROFILE INTERFACES ---

export interface UserProfileRequest {
  bio?: string;
  timezone?: string;
  learningStyle?: string;
  avatarUrl?: string;
  studentId?: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string; // date
  address?: string;
  gender?: string;
  classId?: string;
  className?: string;
  academicYear?: string;
  enrollmentDate?: string; // date
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  emergencyContact?: string;
  bloodType?: string;
  medicalNotes?: string;
}

export interface UserProfileResponse {
  id?: number;
  userId?: string; // uuid
  bio?: string;
  timezone?: string;
  learningStyle?: string;
  avatarUrl?: string;
  studentId?: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string; // date
  address?: string;
  gender?: string;
  classId?: string;
  className?: string;
  academicYear?: string;
  enrollmentDate?: string; // date
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  emergencyContact?: string;
  bloodType?: string;
  medicalNotes?: string;
  skills?: SkillResponse[];
  createdAt?: string; // date-time
  updatedAt?: string; // date-time
}

// --- SCHEDULE INTERFACES ---

export interface ScheduleRequest {
  title?: string;
  startTime: string; // date-time
  endTime: string; // date-time
  isRecurring?: boolean;
  recurrenceRule?: string;
}

export interface ScheduleResponse {
  id?: number;
  title?: string;
  startTime?: string; // date-time
  endTime?: string; // date-time
  isRecurring?: boolean;
  recurrenceRule?: string;
}

// --- GROUP INTERFACES ---

export interface GroupRequest {
  name: string;
  description?: string;
}

export interface GroupResponse {
  id?: number;
  name?: string;
  description?: string;
  joinCode?: string;
  role?: "LEADER" | "MEMBER";
  memberCount?: number;
}

export interface PromoteMemberRequest {
  role: "LEADER" | "MEMBER";
}

export interface JoinGroupRequest {
  joinCode: string;
}

export interface GroupMemberResponse {
  studentId?: string; // uuid
  role?: "LEADER" | "MEMBER";
  joinedAt?: string; // date-time
}

export interface DashboardSummary {
  coursesInProgress?: number;
  nextAssignmentDue?: string; // date-time
}

export interface RiskProfileDTO {
  level?: "LOW" | "MEDIUM" | "HIGH";
  trend?: string;
}

export interface StudentDashboardResponse {
  summary?: DashboardSummary;
  riskProfile?: RiskProfileDTO;
  skillRadar?: Record<string, number>;
}

export interface Progress {
  current?: number;
  target?: number;
}

export interface AchievementResponse {
  id?: string;
  title?: string;
  description?: string;
  icon?: string;
  category?: string;
  rarity?: string;
  earnedDate?: string; // date-time
  progress?: Progress;
  earned?: boolean;
}

export interface CourseStats {
  totalCourses?: number;
  inProgressCourses?: number;
  completedCourses?: number;
  averageProgress?: number;
}

export interface OverallSummary {
  gpa?: number;
  totalCredits?: number;
}

export interface SemesterSummary {
  semester?: string;
  gpa?: number;
  totalCredits?: number;
  rank?: number;
  totalStudents?: number;
  achievements?: number;
  attendance?: number;
}

export interface GradebookSummaryResponse {
  studentId?: string;
  semesters?: SemesterSummary[];
  overall?: OverallSummary;
}

export interface DashboardSummaryResponse {
  profile?: UserProfileResponse;
  courses?: EnrollmentResponse[];
  courseStats?: CourseStats;
  performance?: GradebookSummaryResponse;
  achievements?: AchievementResponse[];
  achievementsCount?: number;
  totalLearningHours?: number;
  upcomingAssignments?: number;
}

export interface AcademicProgress {
  currentGPA?: number;
  previousGPA?: number;
  trend?: string;
  percentChange?: number;
}

export interface SubjectPerformance {
  name?: string;
  currentScore?: number;
  previousScore?: number;
  trend?: string;
  percentChange?: number;
  color?: string;
}

export interface ExamScore {
  month?: string;
  score?: number;
  average?: number;
}

export interface LearningTime {
  week?: string;
  hours?: number;
}

export interface StudentAnalyticsResponse {
  academicProgress?: AcademicProgress;
  subjectPerformance?: SubjectPerformance[];
  attendanceRate?: number;
  assignmentCompletion?: number;
  examScores?: ExamScore[];
  learningTime?: LearningTime[];
  strengths?: string[];
  improvements?: string[];
}

export interface InstructorCourseStatsResponse {
  averageScore?: number;
  atRiskCount?: number;
  completionRate?: number;
}

export interface AtRiskStudentDTO {
  studentId?: string; // uuid
  studentName?: string;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
  reasons?: string[];
}

export interface AtRiskListResponse {
  students?: AtRiskStudentDTO[];
}

export interface AdminStatsResponse {
  activeUsers?: number;
  revenueThisMonth?: number;
  totalCourses?: number;
  systemHealth?: string;
}
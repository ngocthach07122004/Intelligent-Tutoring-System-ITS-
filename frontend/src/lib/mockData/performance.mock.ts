// Mock data for Performance page

export interface PerformanceOverview {
  currentGPA: number;
  semesterGPA: number;
  classRank: number;
  totalStudents: number;
  creditsEarned: number;
  totalCredits: number;
}

export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
}

export interface CourseGrade {
  courseCode: string;
  courseName: string;
  grade: string;
  gpa: number;
  credits: number;
  semester: string;
}

export interface AssignmentPerformance {
  id: number;
  title: string;
  course: string;
  submittedDate: string;
  grade: number;
  maxGrade: number;
  feedback?: string;
}

export interface AttendanceRecord {
  month: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

export const mockPerformanceOverview: PerformanceOverview = {
  currentGPA: 3.75,
  semesterGPA: 3.82,
  classRank: 5,
  totalStudents: 120,
  creditsEarned: 68,
  totalCredits: 120,
};

export const mockGradeDistribution: GradeDistribution[] = [
  { grade: "A", count: 8, percentage: 40 },
  { grade: "B", count: 7, percentage: 35 },
  { grade: "C", count: 3, percentage: 15 },
  { grade: "D", count: 1, percentage: 5 },
  { grade: "F", count: 1, percentage: 5 },
];

export const mockCourseGrades: CourseGrade[] = [
  {
    courseCode: "CS201",
    courseName: "Data Structures & Algorithms",
    grade: "A",
    gpa: 4.0,
    credits: 4,
    semester: "Fall 2024",
  },
  {
    courseCode: "CS301",
    courseName: "Database Systems",
    grade: "A-",
    gpa: 3.7,
    credits: 3,
    semester: "Fall 2024",
  },
  {
    courseCode: "CS202",
    courseName: "Web Development",
    grade: "A",
    gpa: 4.0,
    credits: 3,
    semester: "Spring 2024",
  },
  {
    courseCode: "MATH201",
    courseName: "Linear Algebra",
    grade: "B+",
    gpa: 3.3,
    credits: 4,
    semester: "Spring 2024",
  },
  {
    courseCode: "CS101",
    courseName: "Introduction to Programming",
    grade: "A",
    gpa: 4.0,
    credits: 4,
    semester: "Fall 2023",
  },
];

export const mockAssignmentPerformance: AssignmentPerformance[] = [
  {
    id: 1,
    title: "Midterm Exam",
    course: "CS201",
    submittedDate: "2024-11-01T10:00:00Z",
    grade: 92,
    maxGrade: 100,
    feedback: "Excellent work! Strong understanding of core concepts.",
  },
  {
    id: 2,
    title: "Project 1 - Binary Tree",
    course: "CS201",
    submittedDate: "2024-10-15T23:59:00Z",
    grade: 95,
    maxGrade: 100,
    feedback: "Clean code and well-documented.",
  },
  {
    id: 3,
    title: "Database Design Assignment",
    course: "CS301",
    submittedDate: "2024-11-10T23:59:00Z",
    grade: 88,
    maxGrade: 100,
    feedback: "Good normalization, could improve query optimization.",
  },
  {
    id: 4,
    title: "Quiz 3",
    course: "CS301",
    submittedDate: "2024-10-28T14:00:00Z",
    grade: 85,
    maxGrade: 100,
  },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    month: "September",
    present: 18,
    absent: 1,
    late: 1,
    total: 20,
    percentage: 90,
  },
  {
    month: "October",
    present: 20,
    absent: 0,
    late: 2,
    total: 22,
    percentage: 100,
  },
  {
    month: "November",
    present: 16,
    absent: 0,
    late: 0,
    total: 16,
    percentage: 100,
  },
  {
    month: "December",
    present: 8,
    absent: 1,
    late: 0,
    total: 9,
    percentage: 88.9,
  },
];

export interface PerformanceTrend {
  semester: string;
  gpa: number;
  credits: number;
}

export const mockPerformanceTrends: PerformanceTrend[] = [
  { semester: "Fall 2023", gpa: 3.5, credits: 16 },
  { semester: "Spring 2024", gpa: 3.65, credits: 18 },
  { semester: "Summer 2024", gpa: 3.8, credits: 6 },
  { semester: "Fall 2024", gpa: 3.82, credits: 18 },
];

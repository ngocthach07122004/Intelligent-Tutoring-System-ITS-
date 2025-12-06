import type { 
  DashboardSummaryResponse, 
  StudentAnalyticsResponse 
} from "./dashboard.types";

export const mockDashboardSummary: DashboardSummaryResponse = {
  profile: {
    id: "mock-uuid-1",
    userId: "mock-user-1",
    fullName: "Nguyễn Văn A",
    email: "student@example.com",
    avatarUrl: "/user.jpg",
    bio: "Student at University",
    phone: "+84 123 456 789",
    dateOfBirth: "2002-05-15",
    gender: "Male",
    classId: "CS2023",
    className: "Computer Science 2023",
    academicYear: "2023-2024"
  },
  courses: [
    {
      id: 1,
      courseId: 101,
      courseTitle: "Data Structures & Algorithms",
      courseCode: "CS201",
      studentId: 1,
      status: "IN_PROGRESS",
      progress: 75,
      enrolledAt: "2024-09-01T00:00:00Z",
      lastAccessAt: "2024-12-05T14:30:00Z"
    },
    {
      id: 2,
      courseId: 102,
      courseTitle: "Database Systems",
      courseCode: "CS301",
      studentId: 1,
      status: "IN_PROGRESS",
      progress: 60,
      enrolledAt: "2024-09-01T00:00:00Z",
      lastAccessAt: "2024-12-04T10:15:00Z"
    },
    {
      id: 3,
      courseId: 103,
      courseTitle: "Web Development",
      courseCode: "CS202",
      studentId: 1,
      status: "COMPLETED",
      progress: 100,
      enrolledAt: "2024-09-01T00:00:00Z",
      completedAt: "2024-11-20T00:00:00Z",
      lastAccessAt: "2024-11-20T16:45:00Z"
    }
  ],
  courseStats: {
    totalCourses: 5,
    inProgressCourses: 3,
    completedCourses: 2,
    averageProgress: 72.5
  },
  performance: {
    studentId: "mock-user-1",
    semesters: [
      {
        semester: "Fall 2024",
        gpa: 3.75,
        totalCredits: 18,
        rank: 5,
        totalStudents: 120,
        achievements: 3,
        attendance: 95.5
      },
      {
        semester: "Spring 2024",
        gpa: 3.60,
        totalCredits: 16,
        rank: 8,
        totalStudents: 115,
        achievements: 2,
        attendance: 92.0
      }
    ],
    overall: {
      gpa: 3.68,
      totalCredits: 68
    }
  },
  achievements: [
    {
      id: "ach-1",
      title: "Perfect Attendance",
      description: "100% attendance for the semester",
      icon: "🏆",
      category: "Attendance",
      rarity: "RARE",
      earnedDate: "2024-11-30T00:00:00Z",
      earned: true
    },
    {
      id: "ach-2",
      title: "Top Performer",
      description: "Ranked in top 10% of class",
      icon: "⭐",
      category: "Academic",
      rarity: "EPIC",
      earnedDate: "2024-11-25T00:00:00Z",
      earned: true
    },
    {
      id: "ach-3",
      title: "Fast Learner",
      description: "Complete 5 courses in record time",
      icon: "🚀",
      category: "Progress",
      rarity: "COMMON",
      progress: { current: 2, target: 5 },
      earned: false
    }
  ],
  achievementsCount: 8,
  totalLearningHours: 245,
  upcomingAssignments: 4
};

export const mockStudentAnalytics: StudentAnalyticsResponse = {
  academicProgress: {
    currentGPA: 3.75,
    previousGPA: 3.60,
    trend: "UP",
    percentChange: 4.17
  },
  subjectPerformance: [
    {
      name: "Mathematics",
      currentScore: 88,
      previousScore: 82,
      trend: "UP",
      percentChange: 7.32,
      color: "#10b981"
    },
    {
      name: "Computer Science",
      currentScore: 92,
      previousScore: 90,
      trend: "UP",
      percentChange: 2.22,
      color: "#3b82f6"
    },
    {
      name: "Physics",
      currentScore: 75,
      previousScore: 80,
      trend: "DOWN",
      percentChange: -6.25,
      color: "#ef4444"
    },
    {
      name: "English",
      currentScore: 85,
      previousScore: 85,
      trend: "STABLE",
      percentChange: 0,
      color: "#6b7280"
    }
  ],
  attendanceRate: 95.5,
  assignmentCompletion: 88.5,
  examScores: [
    { month: "Sep", score: 82, average: 75 },
    { month: "Oct", score: 85, average: 78 },
    { month: "Nov", score: 88, average: 80 },
    { month: "Dec", score: 90, average: 82 }
  ],
  learningTime: [
    { week: "Week 1", hours: 18 },
    { week: "Week 2", hours: 22 },
    { week: "Week 3", hours: 20 },
    { week: "Week 4", hours: 25 },
    { week: "Week 5", hours: 23 },
    { week: "Week 6", hours: 28 }
  ],
  strengths: [
    "Strong problem-solving skills",
    "Excellent attendance record",
    "Consistent improvement in Mathematics"
  ],
  improvements: [
    "Physics - needs more practice",
    "Time management for assignments",
    "Active participation in class discussions"
  ]
};

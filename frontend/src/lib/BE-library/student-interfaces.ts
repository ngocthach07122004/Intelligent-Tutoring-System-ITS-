// Student Management Interfaces for User Profile Service API

export interface Student {
    id?: string;
    studentId?: string;
    name?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    className?: string;
    academicYear?: string;
    enrollmentDate?: string;
    avatar?: string;
    emergencyContact?: string;
    bloodType?: string;
    medicalNotes?: string;
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
}

export interface AcademicRecordSubject {
    name?: string;
    code?: string;
    credits?: number;
    grade?: string;
    score?: number;
    teacher?: string;
}

export interface AcademicRecord {
    semester?: string;
    gpa?: number;
    totalCredits?: number;
    rank?: number;
    totalStudents?: number;
    subjects?: AcademicRecordSubject[];
}

export interface LearningAnalytics {
    academicProgress?: any;
    subjectPerformance?: any[];
    attendanceRate?: number;
    assignmentCompletion?: number;
    examScores?: any[];
    learningTime?: any[];
    strengths?: string[];
    improvements?: string[];
}

export interface CurrentSubjectAssignments {
    total?: number;
    completed?: number;
    avgScore?: number;
}

export interface CurrentSubjectExams {
    midterm?: number;
    finalExam?: number;
    final?: number; // optional alias if backend returns "final"
    quizzes?: number[];
}

export interface CurrentSubjectProgress {
    completed?: number;
    total?: number;
}

export interface CurrentSubjectNextAssignment {
    title?: string;
    dueDate?: string;
    type?: "assignment" | "exam" | "project";
}

export interface CurrentSubjectActivity {
    date?: string;
    activity?: string;
    score?: number;
}

export interface CurrentSubject {
    id?: string;
    name?: string;
    code?: string;
    teacher?: string;
    currentGrade?: string;
    currentScore?: number;
    credits?: number;
    attendance?: number;
    assignments?: CurrentSubjectAssignments;
    exams?: CurrentSubjectExams;
    progress?: CurrentSubjectProgress;
    nextAssignment?: CurrentSubjectNextAssignment;
    recentActivities?: CurrentSubjectActivity[];
}

export interface AchievementProgress {
    current?: number;
    target?: number;
}

export interface Achievement {
    id?: string;
    title?: string;
    description?: string;
    icon?: string;
    category?: "academic" | "attendance" | "participation";
    rarity?: "common" | "uncommon" | "rare" | "legendary";
    isEarned?: boolean;
    earnedDate?: string;
    progress?: AchievementProgress;
}

export interface PerformanceRank {
    rank?: number;
    totalStudents?: number;
}

export interface PerformanceSummary {
    overallGpa?: number;
    totalCredits?: number;
    totalAchievements?: number;
    currentRank?: PerformanceRank;
}

export interface SemesterPerformance {
    semester?: string;
    gpa?: number;
    totalCredits?: number;
    rank?: number;
    totalStudents?: number;
    achievements?: number;
    attendance?: number;
}

export interface PerformanceSkill {
    name?: string;
    level?: number;
    category?: string;
}

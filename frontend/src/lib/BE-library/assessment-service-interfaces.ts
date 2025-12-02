// Assessment Service interfaces for assessment-service API (port 8086)

export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "UNDER_REVIEW" | "GRADED";
export type DocumentCategory = "NOTE" | "ASSIGNMENT" | "REFERENCE" | "PROJECT";
export type QuestionType = "MCQ" | "CODING" | "ESSAY";

export interface HealthStatus {
    status?: string;
    service?: string;
}

export interface AnswerRequest {
    questionId: number;
    response?: Record<string, unknown>;
}

export interface AttemptSubmitRequest {
    answers: AnswerRequest[];
}

export interface AttemptSubmitResponse {
    message?: string;
    submittedAt?: string;
}

export interface ExamSectionRuleRequest {
    poolId: number;
    countToPull: number;
    pointsPerQuestion?: number;
}

export interface ExamConfigRequest {
    title: string;
    courseId: number;
    lessonId?: number;
    policy?: string;
    browserLockEnabled?: boolean;
    timeLimitMinutes?: number;
    windowStart?: string;
    windowEnd?: string;
    policyConfig?: Record<string, unknown>;
    sections?: ExamSectionRuleRequest[];
}

export interface ExamSectionRuleResponse {
    id?: number;
    poolId?: number;
    poolName?: string;
    countToPull?: number;
    pointsPerQuestion?: number;
}

export interface ExamConfigResponse {
    id?: number;
    title?: string;
    courseId?: number;
    lessonId?: number;
    policy?: string;
    browserLockEnabled?: boolean;
    timeLimitMinutes?: number;
    windowStart?: string;
    windowEnd?: string;
    policyConfig?: Record<string, unknown>;
    instructorId?: string;
    createdAt?: string;
    sections?: ExamSectionRuleResponse[];
}

export interface AttemptStartResponse {
    attemptId?: number;
    examConfigId?: number;
    startedAt?: string;
    timeLimit?: number;
}

export interface AnswerResultResponse {
    questionId?: number;
    yourAnswer?: Record<string, unknown>;
    correct?: boolean;
    score?: number;
}

export interface AttemptResultResponse {
    attemptId?: number;
    score?: number;
    maxScore?: number;
    passed?: boolean;
    feedback?: string;
    answers?: AnswerResultResponse[];
}

export interface GradebookListQuery {
    page?: number;
    size?: number;
}

export interface GradebookSummaryQuery {
    semester?: string;
    studentId?: string;
}

export interface GradebookResponse {
    studentId?: string;
    studentName?: string;
    examId?: number;
    examTitle?: string;
    score?: number;
    status?: string;
    gradedAt?: string;
}

export interface CourseGradeDetail {
    courseId?: number;
    courseName?: string;
    courseCode?: string;
    finalScore?: number;
    grade?: string;
    gpa?: number;
    status?: string;
}

export interface GradebookSummaryResponse {
    overallGpa?: number;
    totalCredits?: number;
    completedCourses?: number;
    inProgressCourses?: number;
    rank?: number;
    totalStudents?: number;
    totalAchievements?: number;
    semester?: string;
    courseGrades?: CourseGradeDetail[];
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

export interface OverallStats {
    gpa?: number;
    totalCredits?: number;
}

export interface GradebookSummaryV2Response {
    studentId?: string;
    semesters?: SemesterSummary[];
    overall?: OverallStats;
}

export interface SubjectRecord {
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
    achievements?: number;
    attendance?: number;
    subjects?: SubjectRecord[];
}

export interface GradebookHistoryResponse {
    studentId?: string;
    records?: AcademicRecord[];
}

export interface AchievementProgress {
    current?: number;
    target?: number;
}

export interface AchievementResponse {
    id?: number;
    code?: string;
    name?: string;
    description?: string;
    iconUrl?: string;
    icon?: string;
    points?: number;
    category?: string;
    rarity?: string;
    earned?: boolean;
    isEarned?: boolean;
    earnedAt?: string;
    progress?: number;
    progressDetail?: AchievementProgress;
}

export interface ExamScorePoint {
    month?: string;
    score?: number;
    average?: number;
}

export interface LearningTimePoint {
    week?: string;
    hours?: number;
}

export interface AnalyticsResponse {
    examScores?: ExamScorePoint[];
    learningTime?: LearningTimePoint[];
    strengths?: string[];
    improvements?: string[];
}

export interface DocumentRequest {
    title: string;
    content: string;
    category: DocumentCategory;
    course?: string;
    tags?: string[];
}

export interface FavoriteToggleRequest {
    isFavorite: boolean;
}

export interface DocumentResponse {
    id?: string;
    title?: string;
    content?: string;
    category?: DocumentCategory;
    course?: string;
    tags?: string[];
    isFavorite?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface DocumentStatisticsResponse {
    totalDocuments?: number;
    notesCount?: number;
    assignmentsCount?: number;
    referencesCount?: number;
    projectsCount?: number;
    favoritesCount?: number;
}

export interface DocumentListQuery {
    category?: DocumentCategory | string;
    isFavorite?: boolean;
    q?: string;
}

export interface QuestionPoolRequest {
    name: string;
    difficulty?: string;
    isPublic?: boolean;
}

export interface QuestionPoolResponse {
    id?: number;
    name?: string;
    difficulty?: string;
    isPublic?: boolean;
    instructorId?: string;
    createdAt?: string;
}

export interface QuestionRequest {
    poolId: number;
    type: QuestionType;
    content: string;
    metadata?: Record<string, unknown>;
    weight?: number;
    skillTag?: string;
}

export interface QuestionResponse {
    id?: number;
    poolId?: number;
    type?: QuestionType;
    content?: string;
    metadata?: Record<string, unknown>;
    weight?: number;
    skillTag?: string;
}

export interface SkillEntry {
    name?: string;
    level?: number;
    category?: string;
}

export interface SkillRadarResponse {
    studentId?: string;
    skills?: SkillEntry[];
}

export interface AssessmentSkillResponse {
    mastery?: Record<string, number>;
}
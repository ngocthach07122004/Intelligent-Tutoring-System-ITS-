"use client";

import React from "react";
import QuickStatsCard from "./QuickStatsCard";
import GPACard from "./GPACard";
import CourseStatsCard from "./CourseStatsCard";
import SubjectPerformanceCard from "./SubjectPerformanceCard";
import ActiveCoursesCard from "./ActiveCoursesCard";
import AchievementsCard from "./AchievementsCard";
import LearningTimeChart from "./LearningTimeChart";
import type {
  DashboardSummaryResponse,
  StudentAnalyticsResponse,
} from "@/lib/mockData/dashboard.types";

interface MainDetailProps {
  summary: DashboardSummaryResponse | null;
  analytics: StudentAnalyticsResponse | null;
}

export default function MainDetail({ summary, analytics }: MainDetailProps) {
  if (!summary || !analytics) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Quick Stats */}
      <QuickStatsCard
        attendanceRate={analytics.attendanceRate}
        assignmentCompletion={analytics.assignmentCompletion}
        totalLearningHours={summary.totalLearningHours}
        upcomingAssignments={summary.upcomingAssignments}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GPACard progress={analytics.academicProgress} />
        <CourseStatsCard stats={summary.courseStats} />
        <AchievementsCard achievements={summary.achievements} />
        <LearningTimeChart data={analytics.learningTime} />
      </div>

      {/* Performance & Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SubjectPerformanceCard subjects={analytics.subjectPerformance} />
        <ActiveCoursesCard courses={summary.courses} />
      </div>
    </div>
  );
}

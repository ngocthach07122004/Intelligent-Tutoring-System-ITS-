"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Trophy,
  Star,
  TrendingUp,
  Target,
} from "lucide-react";
import { dashboardServiceApi } from "@/lib/BE-library/dashboard-service-api";
import {
  DashboardSummaryResponse,
  StudentAnalyticsResponse,
  SubjectPerformance as SubjectPerformanceType,
} from "@/lib/BE-library/dashboard-service-interfaces";
import { SemesterSummary } from "@/lib/BE-library/interfaces";

const getGPAColor = (gpa?: number) => {
  if (gpa === undefined || gpa === null) return "text-gray-600";
  if (gpa >= 9.0) return "text-green-600";
  if (gpa >= 8.0) return "text-blue-600";
  if (gpa >= 7.0) return "text-yellow-600";
  if (gpa >= 5.0) return "text-orange-600";
  return "text-red-600";
};

const formatPercent = (value?: number, fallback = "--") => {
  if (value === undefined || value === null || Number.isNaN(value)) return fallback;
  return `${Math.round(value)}%`;
};

const formatNumber = (value?: number, fallback = "--") => {
  if (value === undefined || value === null || Number.isNaN(value)) return fallback;
  return value;
};

export const PerformanceSummary = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [analytics, setAnalytics] = useState<StudentAnalyticsResponse | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, analyticsRes] = await Promise.all([
        dashboardServiceApi.getStudentSummary(),
        dashboardServiceApi.getStudentAnalytics(),
      ]);

      if (!summaryRes?.success) {
        throw new Error(summaryRes?.message || "Failed to load dashboard summary");
      }
      if (!analyticsRes?.success) {
        throw new Error(analyticsRes?.message || "Failed to load dashboard analytics");
      }

      setSummary(summaryRes.data);
      setAnalytics(analyticsRes.data);

      const firstSemester = summaryRes.data?.performance?.semesters?.[0]?.semester;
      setSelectedSemester((current) => current ?? firstSemester);
    } catch (err: any) {
      setError(err?.message || "Failed to load performance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const firstSemester = summary?.performance?.semesters?.[0]?.semester;
    if (firstSemester && !selectedSemester) {
      setSelectedSemester(firstSemester);
    }
  }, [summary, selectedSemester]);

  const semesters: SemesterSummary[] = summary?.performance?.semesters || [];
  const currentPerformance =
    semesters.find((p) => p.semester === selectedSemester) || semesters[0];

  const overallGPA =
    summary?.performance?.overall?.gpa ??
    (semesters.length
      ? Number(
          (
            semesters.reduce((sum, p) => sum + (p.gpa || 0), 0) /
            semesters.length
          ).toFixed(2)
        )
      : undefined);

  const totalCredits = semesters.reduce(
    (sum, p) => sum + (p.totalCredits || 0),
    0
  );

  const achievementsCount =
    summary?.achievementsCount ?? summary?.achievements?.length ?? 0;

  const subjectPerformance: SubjectPerformanceType[] =
    analytics?.subjectPerformance || [];

  const gpaTrendData = semesters.slice().reverse();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto text-gray-700">Loading performance data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Overview</h1>
          <p className="text-gray-600">Track GPA, credits, and achievements</p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Overall GPA</p>
                <p className={`text-4xl font-bold ${getGPAColor(overallGPA)}`}>
                  {overallGPA !== undefined ? overallGPA : "--"}
                </p>
                <p className="text-xs mt-1 text-gray-600">Cumulative average</p>
              </div>
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total credits</p>
                <p className="text-4xl font-bold text-gray-900">{formatNumber(totalCredits)}</p>
                <p className="text-xs mt-1 text-gray-600">Accumulated credits</p>
              </div>
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Achievements</p>
                <p className="text-4xl font-bold text-gray-900">{formatNumber(achievementsCount)}</p>
                <p className="text-xs mt-1 text-gray-600">Badges earned</p>
              </div>
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Ranking</p>
                <p className="text-4xl font-bold text-gray-900">
                  {currentPerformance?.rank ? `#${currentPerformance.rank}` : "--"}
                </p>
                <p className="text-xs mt-1 text-gray-600">
                  Out of {formatNumber(currentPerformance?.totalStudents)} students
                </p>
              </div>
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                <Star className="w-8 h-8 text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Semester Performance */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Semester results</h2>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
                disabled={!semesters.length}
              >
                {semesters.map((perf) => (
                  <option key={perf.semester} value={perf.semester}>
                    {perf.semester}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6">
            {currentPerformance ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Semester GPA</p>
                  <p className="text-4xl font-bold text-gray-900">{formatNumber(currentPerformance.gpa)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Attendance</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {formatPercent(currentPerformance.attendance)}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Credits</p>
                  <p className="text-4xl font-bold text-gray-900">{formatNumber(currentPerformance.totalCredits)}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No semester data yet.</p>
            )}
          </div>
        </div>

        {/* GPA Trend Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">GPA trend</h2>
          </div>
          {gpaTrendData.length ? (
            <div className="relative h-64">
              <div className="flex items-end justify-between h-full">
                {gpaTrendData.map((perf, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end px-2">
                    <div className="text-sm font-bold text-gray-900 mb-2">
                      {perf.gpa ?? "--"}
                    </div>
                    <div
                      className="w-full bg-gray-800 rounded-t-xl transition-all duration-300 hover:bg-gray-700"
                      style={{ height: `${((perf.gpa || 0) / 10) * 100}%` }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2 text-center">{perf.semester}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No GPA data yet.</p>
          )}
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Subject performance</h2>
          </div>

          {subjectPerformance.length ? (
            <div className="space-y-4">
              {subjectPerformance.map((subject, index) => (
                <div key={`${subject.name}-${index}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatPercent(subject.currentScore)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${subject.currentScore || 0}%`,
                        backgroundColor: subject.color || "#111827",
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {subject.trend ? `Trend: ${subject.trend}` : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No subject performance data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

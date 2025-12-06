"use client";

import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  CheckCircle2,
  FileCheck,
  Clock,
  Zap,
  Target,
} from "lucide-react";
import { StudentAnalyticsResponse, SubjectPerformance as SubjectPerformanceType, ExamScore, LearningTime } from "../../lib/BE-library/interfaces";

type Props = {
  data?: StudentAnalyticsResponse | null;
  loading?: boolean;
};

const toPercentChange = (value?: number | null) => (value ?? 0).toFixed(1);

const fallbackSubjectPerf: SubjectPerformanceType[] = [];

export const LearningAnalytics = ({ data, loading }: Props) => {
  const [timeFrame, setTimeFrame] = useState<"semester" | "year" | "all">("semester");

  const analytics = useMemo(() => {
    const subjectPerformance = data?.subjectPerformance ?? fallbackSubjectPerf;
    return {
      academicProgress: {
        currentGPA: data?.academicProgress?.currentGPA ?? 0,
        previousGPA: data?.academicProgress?.previousGPA ?? 0,
        trend: data?.academicProgress?.trend ?? "stable",
        percentChange: data?.academicProgress?.percentChange ?? 0,
      },
      subjectPerformance,
      attendanceRate: data?.attendanceRate ?? 0,
      assignmentCompletion: data?.assignmentCompletion ?? 0,
      examScores: data?.examScores ?? [],
      learningTime: data?.learningTime ?? [],
      strengths: data?.strengths ?? [],
      improvements: data?.improvements ?? [],
    };
  }, [data]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-gray-600">Dang tai phan tich...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-gray-600 border border-dashed border-gray-300">
          Chua co du lieu phan tich.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phan tich hoc tap</h1>
          <p className="text-gray-600 mt-1 font-medium">Theo doi tien do va phat trien ky nang</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as "semester" | "year" | "all")}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium text-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            <option value="semester">Hoc ky nay</option>
            <option value="year">Nam hoc</option>
            <option value="all">Toan bo</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* GPA Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">GPA hien tai</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.academicProgress.currentGPA}</p>
              <div className={`flex items-center gap-1 text-sm ${getTrendColor(analytics.academicProgress.trend)}`}>
                {getTrendIcon(analytics.academicProgress.trend)}
                <span>
                  {analytics.academicProgress.percentChange > 0 ? "+" : ""}
                  {toPercentChange(analytics.academicProgress.percentChange)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <BarChart3 className="w-8 h-8 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ti le tham gia</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.attendanceRate}%</p>
              <p className="text-sm text-gray-700 font-medium">On dinh</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Assignment Completion */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hoan thanh bai tap</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.assignmentCompletion}%</p>
              <p className="text-sm text-gray-700 font-medium">Tien bo</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <FileCheck className="w-8 h-8 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Study Time */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Thoi gian hoc/tuan</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics.learningTime[analytics.learningTime.length - 1]?.hours ?? 0}h
              </p>
              <p className="text-sm text-gray-700 font-medium">Deu dan</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Clock className="w-8 h-8 text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Ket qua theo mon hoc</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart3 className="w-4 h-4" />
              <span>{analytics.subjectPerformance.length} mon</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Cao nhat</div>
              <div className="text-lg font-bold text-gray-900">
                {analytics.subjectPerformance.length
                  ? Math.max(...analytics.subjectPerformance.map((s: SubjectPerformanceType) => s.currentScore ?? 0)).toFixed(1)
                  : "0.0"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Trung binh</div>
              <div className="text-lg font-bold text-gray-900">
                {analytics.subjectPerformance.length
                  ? (
                    analytics.subjectPerformance.reduce((sum: number, s: SubjectPerformanceType) => sum + (s.currentScore ?? 0), 0) /
                    analytics.subjectPerformance.length
                  ).toFixed(1)
                  : "0.0"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Thap nhat</div>
              <div className="text-lg font-bold text-gray-900">
                {analytics.subjectPerformance.length
                  ? Math.min(...analytics.subjectPerformance.map((s: SubjectPerformanceType) => s.currentScore ?? 0)).toFixed(1)
                  : "0.0"}
              </div>
            </div>
          </div>

          {/* Subject Cards */}
          <div className="space-y-3">
            {analytics.subjectPerformance.map((subject: SubjectPerformanceType, index: number) => (
              <div
                key={index}
                className="group bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${subject.color ?? "bg-gray-200"} bg-opacity-10 flex items-center justify-center`}>
                      <span className="text-lg font-bold text-gray-900">{subject.name?.[0] ?? "M"}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{subject.name ?? "Mon hoc"}</div>
                      <div className="text-xs text-gray-500">Diem hien tai</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{subject.currentScore ?? 0}</div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor(subject.trend ?? "stable")} justify-end`}>
                      {getTrendIcon(subject.trend ?? "stable")}
                      <span>
                        {subject.percentChange && subject.percentChange > 0 ? "+" : ""}
                        {toPercentChange(subject.percentChange)}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Diem truoc: {subject.previousScore ?? 0}</span>
                    <span>{(((subject.currentScore ?? 0) / 10) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ease-out ${subject.color ?? "bg-gray-900"}`}
                      style={{ width: `${((subject.currentScore ?? 0) / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Scores Trend */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Xu huong diem kiem tra</h3>
              <p className="text-sm text-gray-500 mt-1">So sanh voi trung binh lop</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Diem gan nhat</div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics.examScores[analytics.examScores.length - 1]?.score ?? 0}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mb-6 bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-900"></div>
              <span className="text-sm font-medium text-gray-700">Diem cua ban</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-gray-400 bg-white"></div>
              <span className="text-sm font-medium text-gray-500">Trung binh lop</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Target className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">
                {analytics.examScores.filter((d: ExamScore) => (d.score ?? 0) > (d.average ?? 0)).length}/
                {analytics.examScores.length} tren trung binh
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-72">
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 font-medium">
              <span>10</span>
              <span>7.5</span>
              <span>5</span>
              <span>2.5</span>
              <span>0</span>
            </div>

            <div className="ml-10 mr-2 h-full relative pb-8">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[10, 7.5, 5, 2.5, 0].map((value, idx) => (
                  <div key={idx} className="border-t border-gray-100"></div>
                ))}
              </div>

              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height: "calc(100% - 2rem)" }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "#111827", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#4b5563", stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#374151", stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: "#9ca3af", stopOpacity: 0.05 }} />
                  </linearGradient>
                </defs>

                <path
                  d={`M ${(100 / Math.max(analytics.examScores.length - 1, 1)) * 0} ${100 - ((analytics.examScores[0]?.score ?? 0) / 10) * 100
                    } 
                      ${analytics.examScores
                      .map(
                        (data: ExamScore, index: number) =>
                          `L ${(100 / Math.max(analytics.examScores.length - 1, 1)) * index} ${100 - ((data.score ?? 0) / 10) * 100
                          }`
                      )
                      .join(" ")}
                      L 100 100 L 0 100 Z`}
                  fill="url(#areaGradient)"
                />

                <polyline
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  points={analytics.examScores
                    .map(
                      (data: ExamScore, index: number) =>
                        `${(100 / Math.max(analytics.examScores.length - 1, 1)) * index},${100 - ((data.score ?? 0) / 10) * 100
                        }`
                    )
                    .join(" ")}
                  className="drop-shadow-md"
                />

                <polyline
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  points={analytics.examScores
                    .map(
                      (data: ExamScore, index: number) =>
                        `${(100 / Math.max(analytics.examScores.length - 1, 1)) * index},${100 - ((data.average ?? 0) / 10) * 100
                        }`
                    )
                    .join(" ")}
                />

                {analytics.examScores.map((data: ExamScore, index: number) => (
                  <g key={`student-${index}`}>
                    {data.score !== undefined && data.score >= 9.0 && (
                      <circle
                        cx={(100 / Math.max(analytics.examScores.length - 1, 1)) * index}
                        cy={100 - ((data.score ?? 0) / 10) * 100}
                        r="12"
                        fill="#1f2937"
                        opacity="0.15"
                      />
                    )}
                    <circle
                      cx={(100 / Math.max(analytics.examScores.length - 1, 1)) * index}
                      cy={100 - ((data.score ?? 0) / 10) * 100}
                      r="6"
                      fill="white"
                      stroke="#111827"
                      strokeWidth="3"
                      className="transition-all hover:r-8 cursor-pointer drop-shadow-lg"
                    />
                  </g>
                ))}

                {analytics.examScores.map((data: ExamScore, index: number) => (
                  <circle
                    key={`avg-${index}`}
                    cx={(100 / Math.max(analytics.examScores.length - 1, 1)) * index}
                    cy={100 - ((data.average ?? 0) / 10) * 100}
                    r="4"
                    fill="white"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    className="transition-all hover:r-6 cursor-pointer"
                  />
                ))}
              </svg>

              <div className="absolute inset-0 flex justify-between items-end" style={{ height: "calc(100% - 2rem)" }}>
                {analytics.examScores.map((data: ExamScore, index: number) => (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end group relative">
                    <div className="absolute bottom-full mb-14 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                      <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl text-center whitespace-nowrap">
                        <div className="text-xs text-gray-300 mb-1">{data.month ?? `T${index + 1}`}</div>
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-xs text-gray-400">Ban</div>
                            <div className="text-xl font-bold">{data.score ?? 0}</div>
                          </div>
                          <div className="w-px h-8 bg-gray-700"></div>
                          <div>
                            <div className="text-xs text-gray-400">TB</div>
                            <div className="text-lg font-semibold text-gray-300">{data.average ?? 0}</div>
                          </div>
                        </div>
                        <div
                          className={`text-xs mt-2 px-2 py-1 rounded-full ${(data.score ?? 0) > (data.average ?? 0)
                            ? "bg-green-900 text-green-200"
                            : (data.score ?? 0) === (data.average ?? 0)
                              ? "bg-gray-800 text-gray-300"
                              : "bg-red-900 text-red-200"
                            }`}
                        >
                          {(data.score ?? 0) > (data.average ?? 0)
                            ? `+${((data.score ?? 0) - (data.average ?? 0)).toFixed(1)} tren TB`
                            : (data.score ?? 0) === (data.average ?? 0)
                              ? "Bang TB"
                              : `${((data.score ?? 0) - (data.average ?? 0)).toFixed(1)} duoi TB`}
                        </div>
                      </div>
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900 mx-auto"></div>
                    </div>

                    <div className="text-xs font-semibold text-gray-600 mt-4 group-hover:text-gray-900 transition-colors">
                      {data.month ?? `T${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary stats */}
          <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
              <p className="text-xs text-gray-500 font-medium mb-1">Cao nhat</p>
              <p className="text-xl font-bold text-gray-900">
                {analytics.examScores.length
                  ? Math.max(...analytics.examScores.map((d: ExamScore) => d.score ?? 0))
                  : 0}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
              <p className="text-xs text-gray-500 font-medium mb-1">Trung binh</p>
              <p className="text-xl font-bold text-gray-900">
                {analytics.examScores.length
                  ? (
                    analytics.examScores.reduce((sum: number, d: ExamScore) => sum + (d.score ?? 0), 0) /
                    analytics.examScores.length
                  ).toFixed(1)
                  : "0.0"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
              <p className="text-xs text-gray-500 font-medium mb-1">Thap nhat</p>
              <p className="text-xl font-bold text-gray-900">
                {analytics.examScores.length
                  ? Math.min(...analytics.examScores.map((d: ExamScore) => d.score ?? 0))
                  : 0}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
              <p className="text-xs text-gray-500 font-medium mb-1">Xu huong</p>
              <div className="flex items-center justify-center gap-1">
                {analytics.examScores.length > 1 &&
                  (analytics.examScores[analytics.examScores.length - 1]?.score ?? 0) >
                  (analytics.examScores[0]?.score ?? 0) ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-bold text-gray-700">Tang</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-bold text-gray-600">Giam</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 lg-grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Zap className="w-5 h-5 text-gray-700" />
            </div>
            <span className="text-gray-900">Diem manh</span>
          </h3>
          <div className="space-y-3">
            {analytics.strengths.map((strength: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{strength}</p>
              </div>
            ))}
            {analytics.strengths.length === 0 && <p className="text-gray-500 text-sm">Chua co du lieu.</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Target className="w-5 h-5 text-gray-700" />
            </div>
            <span className="text-gray-900">Can cai thien</span>
          </h3>
          <div className="space-y-3">
            {analytics.improvements.map((improvement: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{improvement}</p>
              </div>
            ))}
            {analytics.improvements.length === 0 && <p className="text-gray-500 text-sm">Chua co du lieu.</p>}
          </div>
        </div>
      </div>

      {/* Learning Progress Timeline */}
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tien do hoc tap theo tuan</h3>
        <div className="flex items-end justify-between space-x-2 h-40">
          {analytics.learningTime.map((week: LearningTime, index: number) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full">
                <div
                  className="bg-gray-800 rounded-t-lg transition-all duration-300 hover:bg-gray-700 cursor-pointer"
                  style={{ height: `${((week.hours ?? 0) / 35) * 120}px` }}
                ></div>
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-bold text-gray-900">{week.hours ?? 0}h</div>
                <div className="text-xs text-gray-500 font-medium">{week.week ?? `T${index + 1}`}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-center font-medium text-gray-700">
            Trung binh:{" "}
            {analytics.learningTime.length
              ? (
                analytics.learningTime.reduce((sum: number, week: LearningTime) => sum + (week.hours ?? 0), 0) /
                analytics.learningTime.length
              ).toFixed(1)
              : "0.0"}{" "}
            gio/tuan
          </p>
        </div>
      </div>
    </div>
  );
};

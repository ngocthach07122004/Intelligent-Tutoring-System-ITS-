"use client";

import { useState } from "react";

interface AnalyticsData {
  academicProgress: {
    currentGPA: number;
    previousGPA: number;
    trend: 'up' | 'down' | 'stable';
    percentChange: number;
  };
  subjectPerformance: {
    name: string;
    currentScore: number;
    previousScore: number;
    trend: 'up' | 'down' | 'stable';
    percentChange: number;
    color: string;
  }[];
  attendanceRate: number;
  assignmentCompletion: number;
  examScores: {
    month: string;
    score: number;
    average: number;
  }[];
  learningTime: {
    week: string;
    hours: number;
  }[];
  strengths: string[];
  improvements: string[];
}

export const LearningAnalytics = () => {
  const [timeFrame, setTimeFrame] = useState<'semester' | 'year' | 'all'>('semester');

  // Mock analytics data
  const [analyticsData] = useState<AnalyticsData>({
    academicProgress: {
      currentGPA: 8.75,
      previousGPA: 8.45,
      trend: 'up',
      percentChange: 3.55
    },
    subjectPerformance: [
      { name: "Toán", currentScore: 9.0, previousScore: 8.5, trend: 'up', percentChange: 5.88, color: "bg-blue-500" },
      { name: "Văn", currentScore: 8.8, previousScore: 8.9, trend: 'down', percentChange: -1.12, color: "bg-green-500" },
      { name: "Anh", currentScore: 8.7, previousScore: 8.4, trend: 'up', percentChange: 3.57, color: "bg-purple-500" },
      { name: "Lý", currentScore: 8.5, previousScore: 8.8, trend: 'down', percentChange: -3.41, color: "bg-red-500" },
      { name: "Hóa", currentScore: 9.2, previousScore: 8.6, trend: 'up', percentChange: 6.98, color: "bg-yellow-500" },
      { name: "Sử", currentScore: 8.2, previousScore: 8.0, trend: 'up', percentChange: 2.50, color: "bg-indigo-500" }
    ],
    attendanceRate: 96.5,
    assignmentCompletion: 98.2,
    examScores: [
      { month: "T9", score: 8.2, average: 7.8 },
      { month: "T10", score: 8.5, average: 7.9 },
      { month: "T11", score: 8.8, average: 8.1 },
      { month: "T12", score: 8.7, average: 8.0 },
      { month: "T1", score: 9.0, average: 8.2 },
      { month: "T2", score: 8.9, average: 8.3 }
    ],
    learningTime: [
      { week: "T1", hours: 25 },
      { week: "T2", hours: 28 },
      { week: "T3", hours: 22 },
      { week: "T4", hours: 30 },
      { week: "T5", hours: 27 },
      { week: "T6", hours: 32 }
    ],
    strengths: [
      "Toán học - Tư duy logic tốt",
      "Hóa học - Hiểu bản chất phản ứng",
      "Tiếng Anh - Giao tiếp tự tin",
      "Hoàn thành bài tập đầy đủ",
      "Tham gia tích cực vào lớp"
    ],
    improvements: [
      "Vật lý - Cần cải thiện kỹ năng giải bài tập",
      "Văn học - Phát triển khả năng phân tích",
      "Quản lý thời gian học tập",
      "Tăng cường ôn tập trước kiểm tra"
    ]
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <span className="text-green-500">↗️</span>;
      case 'down':
        return <span className="text-red-500">↘️</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Phân tích học tập</h1>
        <div className="flex space-x-2">
          <select 
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as 'semester' | 'year' | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e1e2f]"
          >
            <option value="semester">Học kỳ này</option>
            <option value="year">Năm học</option>
            <option value="all">Toàn bộ</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* GPA Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">GPA Hiện tại</p>
              <p className="text-3xl font-bold text-gray-800">{analyticsData.academicProgress.currentGPA}</p>
              <div className={`flex items-center text-sm ${getTrendColor(analyticsData.academicProgress.trend)}`}>
                {getTrendIcon(analyticsData.academicProgress.trend)}
                <span className="ml-1">
                  {analyticsData.academicProgress.percentChange > 0 ? '+' : ''}
                  {analyticsData.academicProgress.percentChange.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ tham gia</p>
              <p className="text-3xl font-bold text-gray-800">{analyticsData.attendanceRate}%</p>
              <p className="text-sm text-green-600">Rất tốt</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        {/* Assignment Completion */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hoàn thành BT</p>
              <p className="text-3xl font-bold text-gray-800">{analyticsData.assignmentCompletion}%</p>
              <p className="text-sm text-purple-600">Xuất sắc</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>

        {/* Study Time */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Thời gian học/tuần</p>
              <p className="text-3xl font-bold text-gray-800">
                {analyticsData.learningTime[analyticsData.learningTime.length - 1]?.hours || 0}h
              </p>
              <p className="text-sm text-orange-600">Đều đặn</p>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Kết quả theo môn học</h3>
          <div className="space-y-4">
            {analyticsData.subjectPerformance.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                  <span className="font-medium text-gray-700">{subject.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold text-gray-800">{subject.currentScore}</div>
                    <div className={`text-sm ${getTrendColor(subject.trend)}`}>
                      {getTrendIcon(subject.trend)}
                      {subject.percentChange > 0 ? '+' : ''}{subject.percentChange.toFixed(1)}%
                    </div>
                  </div>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${subject.color}`}
                      style={{ width: `${(subject.currentScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Scores Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Xu hướng điểm kiểm tra</h3>
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Student scores line */}
              <polyline
                fill="none"
                stroke="#1e1e2f"
                strokeWidth="3"
                points={analyticsData.examScores.map((data, index) => 
                  `${60 + index * 50},${180 - (data.score * 18)}`
                ).join(' ')}
              />
              
              {/* Average line */}
              <polyline
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="5,5"
                points={analyticsData.examScores.map((data, index) => 
                  `${60 + index * 50},${180 - (data.average * 18)}`
                ).join(' ')}
              />
              
              {/* Data points */}
              {analyticsData.examScores.map((data, index) => (
                <g key={index}>
                  <circle
                    cx={60 + index * 50}
                    cy={180 - (data.score * 18)}
                    r="4"
                    fill="#1e1e2f"
                  />
                  <text
                    x={60 + index * 50}
                    y={195}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {data.month}
                  </text>
                </g>
              ))}
              
              {/* Legend */}
              <g transform="translate(20, 20)">
                <line x1="0" y1="0" x2="20" y2="0" stroke="#1e1e2f" strokeWidth="3" />
                <text x="25" y="4" className="text-xs fill-gray-700">Điểm của bạn</text>
                <line x1="0" y1="15" x2="20" y2="15" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
                <text x="25" y="19" className="text-xs fill-gray-700">Điểm trung bình lớp</text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💪</span>
            Điểm mạnh
          </h3>
          <div className="space-y-3">
            {analyticsData.strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Improvements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            Cần cải thiện
          </h3>
          <div className="space-y-3">
            {analyticsData.improvements.map((improvement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{improvement}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Progress Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tiến độ học tập theo tuần</h3>
        <div className="flex items-end justify-between space-x-2 h-40">
          {analyticsData.learningTime.map((week, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full">
                <div
                  className="bg-gradient-to-t from-[#1e1e2f] to-[#2a2a40] rounded-t-md transition-all duration-300 hover:opacity-80"
                  style={{ height: `${(week.hours / 35) * 120}px` }}
                ></div>
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-700">{week.hours}h</div>
                <div className="text-xs text-gray-500">{week.week}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Trung bình: {(analyticsData.learningTime.reduce((sum, week) => sum + week.hours, 0) / analyticsData.learningTime.length).toFixed(1)} giờ/tuần
          </p>
        </div>
      </div>
    </div>
  );
};
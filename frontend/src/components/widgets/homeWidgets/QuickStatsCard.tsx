"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, FileCheck, Clock, Bell } from "lucide-react";

interface QuickStatsProps {
  attendanceRate: number;
  assignmentCompletion: number;
  totalLearningHours: number;
  upcomingAssignments: number;
}

export default function QuickStatsCard({
  attendanceRate,
  assignmentCompletion,
  totalLearningHours,
  upcomingAssignments,
}: QuickStatsProps) {
  const stats = [
    {
      label: "Attendance",
      value: `${attendanceRate.toFixed(0)}%`,
      Icon: CalendarCheck,
    },
    {
      label: "Completion",
      value: `${assignmentCompletion.toFixed(0)}%`,
      Icon: FileCheck,
    },
    {
      label: "Hours",
      value: totalLearningHours,
      Icon: Clock,
    },
    {
      label: "Upcoming",
      value: upcomingAssignments,
      Icon: Bell,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.Icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

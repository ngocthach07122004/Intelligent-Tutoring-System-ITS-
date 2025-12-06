"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Loader, CheckCircle2, BarChart3 } from "lucide-react";
import type { CourseStats } from "@/lib/mockData/dashboard.types";

interface CourseStatsCardProps {
  stats: CourseStats;
}

export default function CourseStatsCard({ stats }: CourseStatsCardProps) {
  const statItems = [
    { label: "Total", value: stats.totalCourses, Icon: BookOpen },
    { label: "Active", value: stats.inProgressCourses, Icon: Loader },
    { label: "Done", value: stats.completedCourses, Icon: CheckCircle2 },
    { label: "Progress", value: `${stats.averageProgress.toFixed(0)}%`, Icon: BarChart3 },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {statItems.map((item, index) => {
            const Icon = item.Icon;
            return (
              <div key={index} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-bold">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
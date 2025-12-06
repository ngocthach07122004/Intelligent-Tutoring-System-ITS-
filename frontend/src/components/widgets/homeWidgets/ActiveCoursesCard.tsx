"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EnrollmentResponse } from "@/lib/mockData/dashboard.types";

interface ActiveCoursesCardProps {
  courses: EnrollmentResponse[];
}

export default function ActiveCoursesCard({ courses }: ActiveCoursesCardProps) {
  const activeCourses = courses.filter(c => c.status === "IN_PROGRESS").slice(0, 4);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeCourses.map((course) => (
            <div key={course.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{course.courseTitle}</p>
                  <p className="text-xs text-muted-foreground">{course.courseCode}</p>
                </div>
                <span className="text-xs font-bold ml-2">{course.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { SubjectPerformance } from "@/lib/mockData/dashboard.types";

interface SubjectPerformanceCardProps {
  subjects: SubjectPerformance[];
}

export default function SubjectPerformanceCard({ subjects }: SubjectPerformanceCardProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "UP": return TrendingUp;
      case "DOWN": return TrendingDown;
      default: return Minus;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Subjects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {subjects.map((subject, index) => {
            const TrendIcon = getTrendIcon(subject.trend);
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{subject.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{subject.currentScore}</span>
                    <TrendIcon className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${subject.currentScore}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

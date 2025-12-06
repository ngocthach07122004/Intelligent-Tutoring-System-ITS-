"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { AcademicProgress } from "@/lib/mockData/dashboard.types";

interface GPACardProps {
  progress: AcademicProgress;
}

export default function GPACard({ progress }: GPACardProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "UP":
        return TrendingUp;
      case "DOWN":
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const TrendIcon = getTrendIcon(progress.trend);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">GPA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold">{progress.currentGPA.toFixed(2)}</p>
              <div className="flex items-center gap-1">
                <TrendIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {progress.percentChange > 0 ? "+" : ""}{progress.percentChange.toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Current semester</p>
          </div>
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-xs text-muted-foreground">Previous</span>
            <span className="text-sm font-medium">{progress.previousGPA.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

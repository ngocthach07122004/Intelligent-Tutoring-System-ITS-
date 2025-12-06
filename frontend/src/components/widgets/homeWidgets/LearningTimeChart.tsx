"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LearningTime } from "@/lib/mockData/dashboard.types";

interface LearningTimeChartProps {
  data: LearningTime[];
}

export default function LearningTimeChart({ data }: LearningTimeChartProps) {
  const maxHours = Math.max(...data.map(d => d.hours));
  const totalHours = data.reduce((sum, item) => sum + item.hours, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.slice(-4).map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{item.week}</span>
                <span className="font-medium">{item.hours}h</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all"
                  style={{ width: `${(item.hours / maxHours) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <div className="pt-3 mt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-lg font-bold">{totalHours}h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

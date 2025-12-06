"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import type { AchievementResponse } from "@/lib/mockData/dashboard.types";

interface AchievementsCardProps {
  achievements: AchievementResponse[];
}

export default function AchievementsCard({ achievements }: AchievementsCardProps) {
  const earned = achievements.filter(a => a.earned).slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {earned.map((achievement) => (
            <div key={achievement.id} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <Trophy className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{achievement.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

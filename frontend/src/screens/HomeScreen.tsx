"use client";

import React, { useEffect, useState } from "react";
import HomeToolBar from "@/components/widgets/homeWidgets/HomeToolBar";
import MainDetail from "@/components/widgets/homeWidgets/MainDetail";
import { GithubIcon, XIcon } from "@/components/icons";
import TopBar from "@/components/blocks/bars/TopBar";
import { dashboardServiceApi } from "@/lib/BE-library/dashboard-service-api";
import type {
  DashboardSummaryResponse,
  StudentAnalyticsResponse,
} from "@/lib/mockData/dashboard.types";

export default function HomeScreen() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [analytics, setAnalytics] = useState<StudentAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Fetch both summary and analytics
        const [summaryResult, analyticsResult] = await Promise.all([
          dashboardServiceApi.getStudentSummary(),
          dashboardServiceApi.getStudentAnalytics(),
        ]);

        if (summaryResult.success && summaryResult.data) {
          setSummary(summaryResult.data);
        }

        if (analyticsResult.success && analyticsResult.data) {
          setAnalytics(analyticsResult.data);
        }
      } catch (error) {
        console.error("[HomeScreen] Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="overflow-auto h-screen">
      <TopBar
        title="Dashboard Overview"
        tooltipMessage="Student performance and learning analytics"
        actions={[
          <GithubIcon key="github" size={20} className="text-muted-foreground" />,
          <XIcon key="x" size={20} className="text-muted-foreground" />,
        ]}
      />

      <HomeToolBar />

      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <MainDetail summary={summary} analytics={analytics} />
        )}
      </div>
    </div>
  );
}

import React from "react";
import { BarChartComponent } from "../charts/BarChart"; // Adjust the path based on your project structure
import LeadGenerationCard from "./LeadGenerationCard";
import MobileEngagementCard from "./MobileEngagementCard";

export default function MainDetail() {
  return (
    <div className="p-6">
      <BarChartComponent />
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
        <LeadGenerationCard />
        <MobileEngagementCard />
      </div>
    </div>
  );
}

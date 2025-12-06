import React from "react";
import HomeToolBar from "@/components/widgets/homeWidgets/HomeToolBar";
import MainDetail from "@/components/widgets/homeWidgets/MainDetail";
import { GithubIcon, XIcon } from "@/components/icons";
import TopBar from "@/components/blocks/bars/TopBar";

export default function HomeScreen() {
  return (
      <div className="overflow-auto h-screen">
        <TopBar
          title="Overview"
          tooltipMessage="Lead and contact engagement metrics"
          actions={[
            <GithubIcon size={20} className="text-muted-foreground" />,
            <XIcon size={20} className="text-muted-foreground" />,
          ]}
        />

        <HomeToolBar />

        <div className="flex-1">
          <MainDetail />
        </div>
      </div>
  );
}

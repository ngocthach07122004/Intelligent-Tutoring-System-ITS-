"use client";
import React, { useState } from "react";
import { DatePickerWithRange } from "../DatePicker";

export default function HomeToolBar() {
  const [selectedRange, setSelectedRange] = useState("30d"); // Default selected range

  const handleRangeClick = (range: string) => {
    setSelectedRange(range);
  };

  return (
    <div className="sticky top-16 z-30 flex gap-3 border-b px-6 h-12 bg-background">
      {/* Predefined Time Ranges */}
      <div className="justify-start gap-3 hidden lg:flex ">
        {["1d", "3d", "7d", "30d", "Custom"].map((range) => (
          <button
            key={range}
            onClick={() => handleRangeClick(range)}
            className={`relative py-1 text-sm group ${
              selectedRange === range
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <p className="group-hover:bg-accent p-2 rounded-md">{range}</p>
            {selectedRange === range && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full "></span>
            )}
          </button>
        ))}
      </div>

      {/* Custom Date Picker */}
      <div className="flex items-center gap-2">
        <DatePickerWithRange />
      </div>
    </div>
  );
}
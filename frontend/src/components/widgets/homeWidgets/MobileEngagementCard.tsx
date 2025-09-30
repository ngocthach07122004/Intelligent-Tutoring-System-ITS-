"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const leastVisitedContacts = [
  { name: "Disney", icon: "🎥", visits: 0 },
  { name: "Apple", icon: "🍎", visits: 0 },
  { name: "Adobe", icon: "🎨", visits: 0 },
  { name: "Tesla", icon: "🚗", visits: 0 },
  { name: "Nvidia", icon: "🎮", visits: 0 },
  { name: "Kathleen Graves", icon: "👤", visits: 0 },
];

export default function MobileEngagementCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Least visited contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {leastVisitedContacts.map((contact, index) => (
            <li
            key={index}
            className="group flex justify-between items-center p-2 rounded-md hover:bg-accent hover:text-foreground hover:cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{contact.icon}</span>
                <span>{contact.name}</span>
              </div>
              <span className="transition-transform duration-300">
                <span className="hidden group-hover:inline">→</span>
                <span className="group-hover:hidden">{contact.visits}</span>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

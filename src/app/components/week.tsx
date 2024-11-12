"use client";

import { useState } from "react";
import Link from "next/link";

interface WeekProps {
  weekNumber: number;
  days: {
    [key: number]: React.ReactElement;
  };
}

export default function Week({ weekNumber, days }: WeekProps) {
  const [selectedDay, setSelectedDay] = useState(1);

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Powrót
        </Link>
        <h1 className="text-2xl font-bold">Tydzień {weekNumber}</h1>
      </div>

      <div className="grid grid-cols-[250px_1fr] gap-8">
        <aside className="space-y-2">
          {[1, 2, 3, 4, 5].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                selectedDay === day ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              Dzień {day}
            </button>
          ))}
        </aside>

        <main className="min-h-[500px] p-6 rounded-sm">
          {days[selectedDay]}
        </main>
      </div>
    </div>
  );
}

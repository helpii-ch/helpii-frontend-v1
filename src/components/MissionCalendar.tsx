import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Mission {
  id: string;
  subject: string;
  date: Date;
  time: string;
  neederName?: string;
  helperName?: string;
}

interface MissionCalendarProps {
  missions: Mission[];
  userRole: "needer" | "helper";
  onMissionClick?: (missionId: string) => void;
}

const MissionCalendar = ({
  missions = [],
  userRole,
  onMissionClick = () => {},
}: MissionCalendarProps) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Group missions by date
  const groupedMissions = missions.reduce(
    (acc, mission) => {
      const dateStr = mission.date.toDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(mission);
      return acc;
    },
    {} as Record<string, Mission[]>,
  );

  // Get week dates for a specific week offset
  const getWeekDates = (weekOffset: number) => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 6 is Saturday
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      diff + weekOffset * 7,
    );

    return Array(7)
      .fill(0)
      .map((_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        return date;
      });
  };

  // Generate multiple weeks (current week + 4 weeks ahead)
  const generateWeeks = () => {
    return Array(5)
      .fill(0)
      .map((_, weekIndex) => {
        const weekDates = getWeekDates(weekIndex);
        return {
          weekIndex,
          dates: weekDates,
          isCurrentWeek: weekIndex === 0,
        };
      });
  };

  const weeks = generateWeeks();
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Format week range for display
  const formatWeekRange = (dates: Date[]) => {
    const firstDate = dates[0];
    const lastDate = dates[6];
    const firstMonth = firstDate.toLocaleDateString("en-US", {
      month: "short",
    });
    const lastMonth = lastDate.toLocaleDateString("en-US", { month: "short" });

    if (firstMonth === lastMonth) {
      return `${firstMonth} ${firstDate.getDate()}-${lastDate.getDate()}`;
    } else {
      return `${firstMonth} ${firstDate.getDate()} - ${lastMonth} ${lastDate.getDate()}`;
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Schedule</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))
              }
              disabled={currentWeekOffset === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">
              {currentWeekOffset === 0
                ? "This Week"
                : `Week ${currentWeekOffset + 1}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentWeekOffset(Math.min(4, currentWeekOffset + 1))
              }
              disabled={currentWeekOffset === 4}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Week calendar */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {weekDays.map((day, index) => {
              const currentWeekDates = getWeekDates(currentWeekOffset);
              return (
                <div key={day} className="text-center">
                  <p className="text-sm font-medium">{day}</p>
                  <p className="text-xs text-gray-500">
                    {currentWeekDates[index].getDate()}/
                    {currentWeekDates[index].getMonth() + 1}
                  </p>
                </div>
              );
            })}

            {/* Day cells with missions */}
            {getWeekDates(currentWeekOffset).map((date, dayIndex) => {
              const dateStr = date.toDateString();
              const dayMissions = groupedMissions[dateStr] || [];
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={dateStr}
                  className={`min-h-24 border rounded-md p-1 overflow-y-auto ${
                    isToday ? "border-blue-300 bg-blue-50/30" : ""
                  }`}
                >
                  {dayMissions.map((mission) => (
                    <div
                      key={mission.id}
                      onClick={() => onMissionClick(mission.id)}
                      className="text-xs p-1 mb-1 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <p className="font-medium truncate">{mission.subject}</p>
                      <p className="text-gray-500">{mission.time}</p>
                      <p className="truncate">
                        {userRole === "helper"
                          ? mission.neederName
                          : mission.helperName}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionCalendar;

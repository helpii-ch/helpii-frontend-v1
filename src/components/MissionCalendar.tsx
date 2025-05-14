import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Mission {
  id: string;
  subject: string;
  date: Date;
  time: string;
  studentName?: string;
  tutorName?: string;
}

interface MissionCalendarProps {
  missions: Mission[];
  userRole: "student" | "tutor";
  onMissionClick?: (missionId: string) => void;
}

const MissionCalendar = ({
  missions = [],
  userRole,
  onMissionClick = () => {},
}: MissionCalendarProps) => {
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

  // Get current week dates
  const getCurrentWeekDates = () => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 6 is Saturday
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday

    return Array(7)
      .fill(0)
      .map((_, index) => {
        const date = new Date(today.setDate(diff + index));
        return new Date(date); // Create a new Date object to avoid reference issues
      });
  };

  const weekDates = getCurrentWeekDates();
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Your Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => (
            <div key={day} className="text-center">
              <p className="text-sm font-medium">{day}</p>
              <p className="text-xs text-gray-500">
                {weekDates[index].getDate()}/{weekDates[index].getMonth() + 1}
              </p>
            </div>
          ))}

          {weekDates.map((date) => {
            const dateStr = date.toDateString();
            const dayMissions = groupedMissions[dateStr] || [];

            return (
              <div
                key={dateStr}
                className="min-h-24 border rounded-md p-1 overflow-y-auto"
              >
                {dayMissions.map((mission) => (
                  <div
                    key={mission.id}
                    onClick={() => onMissionClick(mission.id)}
                    className="text-xs p-1 mb-1 bg-blue-50 rounded cursor-pointer hover:bg-blue-100"
                  >
                    <p className="font-medium truncate">{mission.subject}</p>
                    <p className="text-gray-500">{mission.time}</p>
                    <p className="truncate">
                      {userRole === "tutor"
                        ? mission.studentName
                        : mission.tutorName}
                    </p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionCalendar;

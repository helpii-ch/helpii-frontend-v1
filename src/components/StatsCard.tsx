import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  userRole?: "student" | "tutor";
}

const StatsCard = ({
  title,
  value,
  icon,
  color,
  userRole = "student",
}: StatsCardProps) => {
  // Define role-based colors
  const roleColors = {
    student: "bg-[#F37221]", // Orange for student
    tutor: "bg-[#5e17eb]", // Purple for tutor
  };

  // Use provided color or default to role-based color
  const bgColor = color || roleColors[userRole];

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;

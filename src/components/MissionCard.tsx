import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, CheckCircle, Star } from "lucide-react";

interface MissionCardProps {
  id?: string;
  subject?: string;
  description?: string;
  imageUrl?: string;
  userRole?: "tutor" | "student";
  onHelp?: (id: string) => void;
  onCantHelp?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isMatched?: boolean;
  studentName?: string;
  studentRating?: number;
  studentImage?: string;
  price?: string;
  date?: string;
  time?: string;
  location?: string;
  onClick?: () => void;
  appliedMissions?: string[];
}

const MissionCard = ({
  id = "1",
  subject = "Mathematics",
  description = "Need help with calculus and linear algebra. Looking for a tutor who can explain complex concepts in simple terms.",
  imageUrl = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80",
  userRole = "tutor",
  onHelp = () => {},
  onCantHelp = () => {},
  onEdit = () => {},
  onDelete = () => {},
  isMatched = false,
  studentName = "Alex Johnson",
  studentRating = 4.5,
  studentImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
  price = "$25/hr",
  date = "Today",
  time = "3:00 PM - 5:00 PM",
  location = "Online",
  onClick = () => {},
  appliedMissions = [],
}: MissionCardProps) => {
  const isApplied = appliedMissions.includes(id);

  return (
    <Card
      className="w-full max-w-[350px] h-[280px] overflow-hidden flex flex-col bg-white cursor-pointer"
      onClick={onClick}
    >
      <div
        className="h-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {subject}
          </Badge>
          {isMatched && (
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Matched
            </Badge>
          )}
          {!isMatched && isApplied && (
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 flex items-center gap-1"
            >
              Applied
            </Badge>
          )}
        </div>
        <div className="flex items-center mt-2 justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img
                src={studentImage}
                alt={studentName}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-medium">{studentName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs">{studentRating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-grow overflow-hidden">
        <p className="text-sm line-clamp-2">{description}</p>
        <div className="mt-2 text-xs text-gray-600">
          <div className="flex items-center gap-1 mb-1">
            <span className="font-medium">Date:</span> {date}
          </div>
          <div className="flex items-center gap-1 mb-1">
            <span className="font-medium">Time:</span> {time}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Location:</span> {location}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <span className="font-semibold text-sm">{price}</span>
        {userRole === "tutor" ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onHelp(id);
            }}
            variant={isMatched ? "outline" : "default"}
            disabled={isMatched || isApplied}
            className={
              isMatched
                ? "text-green-600 border-green-600"
                : isApplied
                  ? "bg-blue-500 hover:bg-blue-500 text-white"
                  : "bg-[#5E17EB] hover:bg-[#5E17EB]/90 text-white"
            }
          >
            {isMatched ? "Matched" : isApplied ? "Applied" : "Help"}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MissionCard;

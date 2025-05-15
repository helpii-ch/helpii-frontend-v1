import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Calendar, Globe, User } from "lucide-react";

interface MissionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  mission?: {
    id: string;
    subject: string;
    description: string;
    date: string;
    time: string;
    location: string;
    price: string;
    student: {
      name: string;
      image: string;
      rating: number;
      age: number;
      languages: string[];
      location: string;
    };
  };
  userRole: "tutor" | "student";
  onHelp?: () => void;
  onCantHelp?: () => void;
}

const MissionDetail = ({
  isOpen,
  onClose,
  mission,
  userRole,
  onHelp = () => {},
  onCantHelp = () => {},
}: MissionDetailProps) => {
  if (!mission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mission.subject}
          </DialogTitle>
        </DialogHeader>

        {userRole === "tutor" ? (
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Student Profile</h3>
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden">
                <img
                  src={mission.student.image}
                  alt={mission.student.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">
                    {mission.student.name}
                  </h4>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{mission.student.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{mission.student.age} years old</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{mission.student.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 col-span-2">
                    <Globe className="h-4 w-4" />
                    <span>{mission.student.languages.join(", ")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Tutor Information</h3>
            <div className="flex items-start gap-4">
              {/* Find matched tutor for this mission */}
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">Your Matched Tutor</h4>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  Contact your tutor to confirm details before the session
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Mission Details</h3>
            <p className="text-gray-700">{mission.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{mission.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{mission.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{mission.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="px-3 py-1 text-base font-bold"
              >
                {mission.price}
              </Badge>
            </div>
          </div>
        </div>

        {userRole === "tutor" && (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onCantHelp}>
              Can't Help
            </Button>
            <Button
              onClick={onHelp}
              className="bg-[#5E17EB] hover:bg-[#5E17EB]/90 text-white"
            >
              Help
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MissionDetail;

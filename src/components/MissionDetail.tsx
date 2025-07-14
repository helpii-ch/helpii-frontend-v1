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
import { Star, MapPin, Clock, Calendar, Globe, User, X } from "lucide-react";
import {Mission} from "@/types/mission.ts";

interface MissionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  mission?: Mission;
  userRole: "helper" | "needer";
  onHelp?: () => void;
  onCantHelp?: () => void;
  onComplete?: (missionId: string) => void;
}

const MissionDetail = ({
  isOpen,
  onClose,
  mission,
  userRole,
  onHelp = () => {},
  onCantHelp = () => {},
  onComplete = () => {},
}: MissionDetailProps) => {
  if (!mission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {mission.subject}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {userRole === "helper" ? (
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Needer Profile</h3>
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden">
                <img
                  src={mission.needer.image}
                  alt={mission.needer.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">{mission.needer.name}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{mission.needer.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{mission.needer.age} years old</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{mission.needer.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 col-span-2">
                    <Globe className="h-4 w-4" />
                    <span>{mission.needer.languages.join(", ")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Helper Information</h3>
            <div className="flex items-start gap-4">
              {/* Find matched helper for this mission */}
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">Your Matched Helper</h4>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  Contact your helper to confirm details before the session
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

        {userRole === "helper" &&
          mission?.status !== "matched" &&
          mission?.status !== "completed" &&
          mission?.status !== "needer_completed" &&
          mission?.status !== "helper_completed" && (
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

        {mission?.status === "matched" ||
        mission?.status === "needer_completed" ||
        mission?.status === "helper_completed" ? (
          <div className="mt-6 border-t pt-4">
            <div className="flex flex-col gap-2">
              {mission.status === "needer_completed" &&
                userRole === "needer" && (
                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                    You have marked this mission as complete. Waiting for the
                    helper to confirm.
                  </div>
                )}
              {mission.status === "helper_completed" &&
                userRole === "helper" && (
                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                    You have marked this mission as complete. Waiting for the
                    needer to confirm.
                  </div>
                )}
              {mission.status === "needer_completed" &&
                userRole === "helper" && (
                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                    The needer has marked this mission as complete. Please
                    confirm if the mission is complete.
                  </div>
                )}
              {mission.status === "helper_completed" &&
                userRole === "needer" && (
                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                    The helper has marked this mission as complete. Please
                    confirm if the mission is complete.
                  </div>
                )}
              {mission.status === "completed" && (
                <div className="bg-green-50 p-3 rounded-md text-sm text-green-700">
                  This mission has been completed and payment has been released
                  to the helper.
                </div>
              )}

              <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-info"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                Both helper and needer need to confirm the mission is complete
                for payment to be released.
              </div>

              {mission.status !== "completed" && (
                <DialogFooter className="gap-2">
                  {(userRole === "needer" &&
                    mission.status !== "needer_completed") ||
                  (userRole === "helper" &&
                    mission.status !== "helper_completed") ? (
                    <Button
                      onClick={() => onComplete(mission.id)}
                      className="bg-green-600 hover:bg-green-700 text-white w-full"
                    >
                      {userRole === "needer"
                        ? "Tap to Confirm"
                        : "Mark as Completed"}
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="bg-gray-300 text-gray-600 w-full cursor-not-allowed"
                    >
                      Waiting for {userRole === "needer" ? "helper" : "needer"}{" "}
                      to confirm
                    </Button>
                  )}
                </DialogFooter>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default MissionDetail;

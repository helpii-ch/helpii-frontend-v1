import { Mission } from "@/types/mission.ts";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, CheckCircle, Star } from "lucide-react";
import MissionCard from "./MissionCard";
import StatsCard from "./StatsCard";
import MissionCalendar from "./MissionCalendar";
import MissionDetail from "./MissionDetail";
import {mockMissions} from "@/mocks/missions.ts";


interface TutorFeedProps {
  missions?: Mission[];
  onHelp?: (missionId: string) => void;
}

const TutorFeed: React.FC<TutorFeedProps> = ({
  missions = mockMissions,
  onHelp = (missionId) => console.log(`Helped with mission ${missionId}`),
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("feed");
  const [helpedMissions, setHelpedMissions] = useState<string[]>([]);
  const [appliedMissions, setAppliedMissions] = useState<string[]>([]);
  const [matchedMissions, setMatchedMissions] = useState<string[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [acceptedMissions, setAcceptedMissions] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  const handleHelp = (missionId: string) => {
    // Add to applied missions
    setAppliedMissions((prev) => [...prev, missionId]);
    onHelp(missionId);
    setIsDetailOpen(false);

    // In a real app, this would send a notification to the student
    // For demo purposes, we'll simulate a student accepting after 3 seconds
    setTimeout(() => {
      // Simulate student accepting the help (70% chance)
      if (Math.random() > 0.3) {
        setMatchedMissions((prev) => [...prev, missionId]);
        setHelpedMissions((prev) => [...prev, missionId]);
        setAcceptedMissions((prev) => [...prev, missionId]);
        setNotificationCount((prev) => prev + 1);
        setShowNotification(true);

        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
    }, 3000);
  };

  const handleMissionClick = (mission: Mission) => {
    setSelectedMission(mission);
    setIsDetailOpen(true);
  };

  const filteredMissions = missions.filter((mission) => {
    const matchesSearch =
      mission.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    if (activeFilter === "feed") return matchesSearch;
    if (activeFilter === "matched")
      return matchesSearch && matchedMissions.includes(mission.id);
    if (activeFilter === "applied")
      return (
        matchesSearch &&
        appliedMissions.includes(mission.id) &&
        !matchedMissions.includes(mission.id)
      );
    if (activeFilter === "rejected") return false; // Placeholder for rejected logic
    if (activeFilter === "completed") return false; // Placeholder for completed logic

    return matchesSearch;
  });

  // Get missions for calendar view (only matched ones)
  const calendarMissions = missions
    .filter((mission) => helpedMissions.includes(mission.id))
    .map((mission) => ({
      id: mission.id,
      subject: mission.subject,
      date: mission.date,
      time: mission.time,
      studentName: mission.student.name,
    }));

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white">
      {/* Stats Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-[#5e17eb]">
          What's happening today
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Help Missions"
            value={5}
            icon={<BookOpen className="h-5 w-5 text-white" />}
            userRole="tutor"
          />
          <StatsCard
            title="Completions to Confirm"
            value={2}
            icon={<CheckCircle className="h-5 w-5 text-white" />}
            userRole="tutor"
          />
          <StatsCard
            title="Pending Reviews"
            value={3}
            icon={<Star className="h-5 w-5 text-white" />}
            userRole="tutor"
          />
        </div>
      </div>

      <Tabs
        defaultValue="feed"
        className="w-full"
        value={activeFilter}
        onValueChange={setActiveFilter}
      >
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by subject, description, or tags..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <TabsList>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="matched">Matched</TabsTrigger>
            <TabsTrigger value="applied">Applied</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="feed">
          {filteredMissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-6 mb-4">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No missions found
              </h3>
              <p className="text-gray-600 max-w-md">
                {searchTerm
                  ? `No tutoring missions match your search for "${searchTerm}".`
                  : "There are currently no tutoring missions available."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  id={mission.id}
                  subject={mission.subject}
                  description={mission.description}
                  imageUrl={mission.imageUrl}
                  userRole="tutor"
                  isMatched={helpedMissions.includes(mission.id)}
                  onHelp={() => handleHelp(mission.id)}
                  studentName={mission.student.name}
                  studentImage={mission.student.image}
                  studentRating={mission.student.rating}
                  price={mission.price}
                  date={mission.date.toLocaleDateString()}
                  time={mission.time}
                  location={mission.location}
                  onClick={() => handleMissionClick(mission)}
                  appliedMissions={appliedMissions}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matched">
          {matchedMissions.length > 0 ? (
            <MissionCalendar
              missions={calendarMissions}
              userRole="tutor"
              onMissionClick={(missionId) => {
                const mission = missions.find((m) => m.id === missionId);
                if (mission) {
                  handleMissionClick(mission);
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No matched missions
              </h3>
              <p className="text-gray-600 max-w-md">
                You don't have any matched missions yet.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="applied">
          {appliedMissions.length > 0 &&
          appliedMissions.some((id) => !matchedMissions.includes(id)) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {missions
                .filter(
                  (mission) =>
                    appliedMissions.includes(mission.id) &&
                    !matchedMissions.includes(mission.id),
                )
                .map((mission) => (
                  <MissionCard
                    key={mission.id}
                    id={mission.id}
                    subject={mission.subject}
                    description={mission.description}
                    imageUrl={mission.imageUrl}
                    userRole="tutor"
                    isMatched={false}
                    onHelp={() => {}}
                    studentName={mission.student.name}
                    studentImage={mission.student.image}
                    studentRating={mission.student.rating}
                    price={mission.price}
                    date={mission.date.toLocaleDateString()}
                    time={mission.time}
                    location={mission.location}
                    onClick={() => handleMissionClick(mission)}
                    appliedMissions={appliedMissions}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No applied missions
              </h3>
              <p className="text-gray-600 max-w-md">
                You haven't applied to any missions yet or all your applications
                have been processed.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No rejected missions
            </h3>
            <p className="text-gray-600 max-w-md">
              You don't have any rejected missions.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No completed missions
            </h3>
            <p className="text-gray-600 max-w-md">
              You haven't completed any missions yet.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Mission Detail Dialog */}
      {selectedMission && (
        <MissionDetail
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          mission={{
            id: selectedMission.id,
            subject: selectedMission.subject,
            description: selectedMission.description,
            date: selectedMission.date.toLocaleDateString(),
            time: selectedMission.time,
            location: selectedMission.location,
            price: selectedMission.price,
            student: selectedMission.student,
          }}
          userRole="tutor"
          onHelp={() => handleHelp(selectedMission.id)}
          onCantHelp={() => setIsDetailOpen(false)}
        />
      )}

      {/* Notification for Accepted Missions */}
      {showNotification && acceptedMissions.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full border-l-4 border-green-500 z-50">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Mission Accepted!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                A student has accepted your help offer. They will contact you
                shortly.
              </p>
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowNotification(false);
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorFeed;

import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  BookOpen,
  CheckCircle,
  Star,
  MapPin,
  ArrowLeft,
  Phone,
} from "lucide-react";
import MissionCard from "./MissionCard";
import StatsCard from "./StatsCard";
import MissionCalendar from "./MissionCalendar";
import MissionDetail from "./MissionDetail";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Mission {
  id: string;
  subject: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  isMatched?: boolean;
  neederName: string;
  neederImage: string;
  neederRating: number;
  price: string;
  date: Date;
  time: string;
  location: string;
  needer: {
    name: string;
    image: string;
    rating: number;
    age: number;
    languages: string[];
    location: string;
  };
}

interface HelperFeedProps {
  missions?: Mission[];
  onHelp?: (missionId: string) => void;
}

const HelperFeed: React.FC<HelperFeedProps> = ({
  missions = [
    {
      id: "1",
      subject: "Mathematics",
      description:
        "Need help with calculus and differential equations for upcoming exam.",
      imageUrl:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
      tags: ["Calculus", "University", "Exam Prep"],
      neederName: "Alex Johnson",
      neederImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      neederRating: 4.8,
      price: "$25/hr",
      date: new Date(),
      time: "3:00 PM - 5:00 PM",
      location: "Online",
      needer: {
        name: "Alex Johnson",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
        rating: 4.8,
        age: 19,
        languages: ["English", "Spanish"],
        location: "New York, NY",
      },
    },
    {
      id: "2",
      subject: "Physics",
      description:
        "Looking for assistance with mechanics and thermodynamics concepts.",
      imageUrl:
        "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80",
      tags: ["Mechanics", "High School", "Weekly"],
      neederName: "Emma Wilson",
      neederImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      neederRating: 4.5,
      price: "$30/hr",
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: "4:00 PM - 6:00 PM",
      location: "Local Library",
      needer: {
        name: "Emma Wilson",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        rating: 4.5,
        age: 17,
        languages: ["English"],
        location: "Boston, MA",
      },
    },
    {
      id: "3",
      subject: "Computer Science",
      description: "Need help understanding data structures and algorithms.",
      imageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      tags: ["Programming", "University", "Project"],
      neederName: "Michael Chen",
      neederImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
      neederRating: 4.9,
      price: "$35/hr",
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      time: "6:00 PM - 8:00 PM",
      location: "Online",
      needer: {
        name: "Michael Chen",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
        rating: 4.9,
        age: 21,
        languages: ["English", "Mandarin"],
        location: "San Francisco, CA",
      },
    },
    {
      id: "4",
      subject: "English Literature",
      description: "Looking for help analyzing Shakespeare and writing essays.",
      imageUrl:
        "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80",
      tags: ["Literature", "High School", "Essay Writing"],
      neederName: "Sophia Martinez",
      neederImage:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
      neederRating: 4.7,
      price: "$28/hr",
      date: new Date(Date.now() + 259200000), // 3 days from now
      time: "5:00 PM - 6:30 PM",
      location: "Coffee Shop",
      needer: {
        name: "Sophia Martinez",
        image:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
        rating: 4.7,
        age: 18,
        languages: ["English", "Spanish"],
        location: "Miami, FL",
      },
    },
    {
      id: "5",
      subject: "Chemistry",
      description:
        "Need assistance with organic chemistry reactions and mechanisms.",
      imageUrl:
        "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&q=80",
      tags: ["Organic Chemistry", "University", "Lab Work"],
      neederName: "James Wilson",
      neederImage:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80",
      neederRating: 4.6,
      price: "$32/hr",
      date: new Date(Date.now() + 345600000), // 4 days from now
      time: "2:00 PM - 4:00 PM",
      location: "University Lab",
      needer: {
        name: "James Wilson",
        image:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80",
        rating: 4.6,
        age: 20,
        languages: ["English"],
        location: "Chicago, IL",
      },
    },
    {
      id: "6",
      subject: "History",
      description: "Looking for help with world history research project.",
      imageUrl:
        "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80",
      tags: ["World History", "Research", "High School"],
      neederName: "Olivia Brown",
      neederImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
      neederRating: 4.4,
      price: "$27/hr",
      date: new Date(Date.now() + 432000000), // 5 days from now
      time: "4:30 PM - 6:30 PM",
      location: "Public Library",
      needer: {
        name: "Olivia Brown",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        rating: 4.4,
        age: 16,
        languages: ["English", "French"],
        location: "Seattle, WA",
      },
    },
  ],
  onHelp = (missionId) => console.log(`Helped with mission ${missionId}`),
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("feed");
  const [helpedMissions, setHelpedMissions] = useState<string[]>([]);
  const [appliedMissions, setAppliedMissions] = useState<string[]>([]);
  const [matchedMissions, setMatchedMissions] = useState<string[]>([]);

  const [notificationCount, setNotificationCount] = useState(0);
  const [acceptedMissions, setAcceptedMissions] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [completedMissions, setCompletedMissions] = useState<
    Record<string, string>
  >({});

  // State for mission detail modal
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // State for horizontal scroll indicators
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleHelp = (missionId: string) => {
    // Add to applied missions
    setAppliedMissions((prev) => [...prev, missionId]);
    onHelp(missionId);
    setIsDetailOpen(false);

    // In a real app, this would send a notification to the needer
    // For demo purposes, we'll simulate a needer accepting after 3 seconds
    setTimeout(() => {
      // Simulate needer accepting the help (70% chance)
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

  const handleMissionComplete = (missionId: string) => {
    setCompletedMissions((prev) => {
      const currentStatus = prev[missionId];

      if (currentStatus === "needer_completed") {
        // Both have confirmed, mark as fully completed
        return { ...prev, [missionId]: "completed" };
      } else {
        // Helper is confirming first
        return { ...prev, [missionId]: "helper_completed" };
      }
    });

    // Close the detail modal
    setIsDetailOpen(false);
  };

  const handleMissionClick = (mission: Mission | any) => {
    // Handle both Mission type and calendar mission format
    const missionData = {
      id: mission.id,
      subject: mission.subject,
      description: mission.description,
      date: mission.date
        ? mission.date.toLocaleDateString
          ? mission.date.toLocaleDateString()
          : mission.date
        : "",
      time: mission.time,
      location: mission.location,
      price: mission.price,
      status:
        mission.status ||
        (helpedMissions.includes(mission.id)
          ? "matched"
          : appliedMissions.includes(mission.id)
            ? "applied"
            : completedMissions[mission.id] === "helper_completed"
              ? "helper_completed"
              : completedMissions[mission.id] === "needer_completed"
                ? "needer_completed"
                : completedMissions[mission.id] === "completed"
                  ? "completed"
                  : "pending"),
      needer: mission.needer || {
        name: mission.neederName || "Unknown",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=needer",
        rating: 4.5,
        age: 20,
        languages: ["English"],
        location: "Unknown",
      },
    };

    setSelectedMission(missionData);
    setIsDetailOpen(true);
  };

  // Handle scroll for horizontal mission list
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    setShowLeftShadow(scrollLeft > 0);
    setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Check initial scroll state
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      setShowRightShadow(scrollWidth > clientWidth);
    }
  }, [missions]);

  // Get missions happening today that the helper is matched with
  const getTodaysMissions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return missions.filter((mission) => {
      const missionDate = new Date(mission.date);
      missionDate.setHours(0, 0, 0, 0);
      return (
        missionDate.getTime() === today.getTime() &&
        helpedMissions.includes(mission.id)
      );
    });
  };

  const todaysMissions = getTodaysMissions();

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
      description: mission.description,
      date: mission.date,
      time: mission.time,
      location: mission.location,
      price: mission.price,
      neederName: mission.neederName,
      helperName: "You",
      needer: mission.needer,
      status: completedMissions[mission.id] || "matched",
    }));

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white">
      {/* Stats Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-[#5e17eb]">
          What's happening today
        </h2>

        {/* Enhanced Stats Cards with Scrollable Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Help Missions Tile */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Help Missions
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {todaysMissions.length}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-[#5e17eb]">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            {todaysMissions.length > 0 && (
              <div className="p-4">
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto horizontal-scroll pb-2">
                    {todaysMissions.map((mission) => (
                      <div
                        key={mission.id}
                        className="flex-shrink-0 w-48 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleMissionClick(mission)}
                      >
                        <h4 className="font-medium text-sm mb-1 truncate">
                          {mission.subject}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {mission.time}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full overflow-hidden">
                            <img
                              src={mission.neederImage}
                              alt={mission.neederName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 truncate">
                            with {mission.neederName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Completions to Confirm Tile */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Completions to Confirm
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {
                      missions.filter((mission) => {
                        const missionDateTime = new Date(
                          `${mission.date.toDateString()} ${mission.time.split(" - ")[1]}`,
                        );
                        const now = new Date();
                        return (
                          missionDateTime < now &&
                          helpedMissions.includes(mission.id) &&
                          (completedMissions[mission.id] ===
                            "needer_completed" ||
                            !completedMissions[mission.id]) &&
                          completedMissions[mission.id] !==
                            "helper_completed" &&
                          completedMissions[mission.id] !== "completed"
                        );
                      }).length
                    }
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-[#5e17eb]">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            {missions.filter((mission) => {
              const missionDateTime = new Date(
                `${mission.date.toDateString()} ${mission.time.split(" - ")[1]}`,
              );
              const now = new Date();
              return (
                missionDateTime < now &&
                helpedMissions.includes(mission.id) &&
                (completedMissions[mission.id] === "needer_completed" ||
                  !completedMissions[mission.id]) &&
                completedMissions[mission.id] !== "helper_completed" &&
                completedMissions[mission.id] !== "completed"
              );
            }).length > 0 && (
              <div className="p-4">
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto horizontal-scroll pb-2">
                    {missions
                      .filter((mission) => {
                        const missionDateTime = new Date(
                          `${mission.date.toDateString()} ${mission.time.split(" - ")[1]}`,
                        );
                        const now = new Date();
                        return (
                          missionDateTime < now &&
                          helpedMissions.includes(mission.id) &&
                          (completedMissions[mission.id] ===
                            "needer_completed" ||
                            !completedMissions[mission.id]) &&
                          completedMissions[mission.id] !==
                            "helper_completed" &&
                          completedMissions[mission.id] !== "completed"
                        );
                      })
                      .map((mission) => {
                        const isWaitingForHelper =
                          completedMissions[mission.id] === "needer_completed";
                        return (
                          <div
                            key={mission.id}
                            className="flex-shrink-0 w-52 p-3 bg-gray-50 rounded-lg"
                          >
                            <h4 className="font-medium text-sm mb-1 truncate">
                              {mission.subject}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                              {mission.date.toLocaleDateString()} •{" "}
                              {mission.time}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-6 w-6 rounded-full overflow-hidden">
                                <img
                                  src={mission.neederImage}
                                  alt={mission.neederName}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span className="text-xs text-gray-700 truncate">
                                with {mission.neederName}
                              </span>
                            </div>
                            <div className="mb-2">
                              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                {isWaitingForHelper
                                  ? "Waiting for you"
                                  : "Waiting for needer"}
                              </span>
                            </div>
                            {isWaitingForHelper && (
                              <Button
                                size="sm"
                                className="w-full text-xs bg-[#5e17eb] hover:bg-[#5e17eb]/90 text-white"
                                onClick={() =>
                                  handleMissionComplete(mission.id)
                                }
                              >
                                Confirm Completion
                              </Button>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pending Reviews Tile */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Pending Reviews
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {
                      missions.filter(
                        (mission) =>
                          completedMissions[mission.id] === "completed" &&
                          helpedMissions.includes(mission.id),
                      ).length
                    }
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-[#5e17eb]">
                  <Star className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            {missions.filter(
              (mission) =>
                completedMissions[mission.id] === "completed" &&
                helpedMissions.includes(mission.id),
            ).length > 0 && (
              <div className="p-4">
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto horizontal-scroll pb-2">
                    {missions
                      .filter(
                        (mission) =>
                          completedMissions[mission.id] === "completed" &&
                          helpedMissions.includes(mission.id),
                      )
                      .map((mission) => (
                        <div
                          key={mission.id}
                          className="flex-shrink-0 w-52 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                              <img
                                src={mission.studentImage}
                                alt={mission.studentName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium truncate block">
                                {mission.studentName}
                              </span>
                              <p className="text-xs text-gray-600">
                                {mission.date.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full text-xs text-[#5e17eb] bg-white border border-[#5e17eb] hover:bg-[#5e17eb]/10"
                          >
                            Leave Review
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Missions Happening Today */}
        {todaysMissions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-[#5e17eb]">
              📅 Help Missions Happening Today
            </h3>
            <div className="relative">
              {/* Left shadow indicator */}
              {showLeftShadow && (
                <div className="absolute left-0 top-0 bottom-0 w-8 z-10 scroll-shadow-left pointer-events-none" />
              )}

              {/* Right shadow indicator */}
              {showRightShadow && (
                <div className="absolute right-0 top-0 bottom-0 w-8 z-10 scroll-shadow-right pointer-events-none" />
              )}

              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto horizontal-scroll pb-2"
                onScroll={handleScroll}
              >
                {todaysMissions.map((mission) => (
                  <Card
                    key={mission.id}
                    className="flex-shrink-0 w-80 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleMissionClick(mission)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">
                          {mission.subject}
                        </h4>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Today
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img
                            src={mission.neederImage}
                            alt={mission.neederName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">
                            with {mission.neederName}
                          </span>
                          <p className="text-xs text-gray-600">
                            {mission.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{mission.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{mission.location}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {mission.price}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">
                              {mission.neederRating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
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
                  userRole="helper"
                  isMatched={helpedMissions.includes(mission.id)}
                  onHelp={() => handleHelp(mission.id)}
                  neederName={mission.neederName}
                  neederImage={mission.neederImage}
                  neederRating={mission.neederRating}
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
              userRole="helper"
              onMissionClick={handleMissionClick}
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
                    userRole="helper"
                    isMatched={false}
                    onHelp={() => {}}
                    neederName={mission.neederName}
                    neederImage={mission.neederImage}
                    neederRating={mission.neederRating}
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
                A needer has accepted your help offer. They will contact you
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

      {/* Mission Detail Modal */}
      <MissionDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        mission={selectedMission}
        userRole="helper"
        onHelp={handleHelp}
        onComplete={handleMissionComplete}
      />
    </div>
  );
};

export default HelperFeed;

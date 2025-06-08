import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  PlusCircle,
  Upload,
  X,
  BookOpen,
  CheckCircle,
  Star,
  Phone,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  AlertCircle,
  Search,
  Globe,
  Video,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MissionCard from "./MissionCard";
import StatsCard from "./StatsCard";
import MissionCalendar from "./MissionCalendar";
import MissionDetail from "./MissionDetail";

interface Mission {
  id: string;
  subject: string;
  description: string;
  imageUrl?: string;
  status?: "pending" | "matched" | "completed" | "new_match" | "applied";
  date: Date;
  time: string;
  location: string;
  price: string;
  hourly?: boolean;
  startTime?: string;
  endTime?: string;
}

interface MatchedHelper {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  missionId: string;
  contactInfo?: string;
}

interface NeederDashboardProps {
  missions?: Mission[];
  matchedHelpers?: MatchedHelper[];
}

const StudentDashboard = ({
  missions = [
    {
      id: "1",
      subject: "Mathematics",
      description: "Need help with calculus and linear algebra",
      imageUrl:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
      status: "matched",
      date: new Date(),
      time: "3:00 PM - 5:00 PM",
      location: "Online",
      price: "25",
      hourly: true,
    },
    {
      id: "2",
      subject: "Physics",
      description: "Looking for assistance with mechanics and thermodynamics",
      imageUrl:
        "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80",
      status: "pending",
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: "4:00 PM - 6:00 PM",
      location: "Local Library",
      price: "30",
      hourly: true,
    },
    {
      id: "3",
      subject: "Chemistry",
      description: "Need help understanding organic chemistry concepts",
      imageUrl:
        "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&q=80",
      status: "new_match",
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      time: "6:00 PM - 8:00 PM",
      location: "Online",
      price: "35",
      hourly: true,
    },
    {
      id: "4",
      subject: "Biology",
      description: "Need help with cellular biology and genetics",
      imageUrl:
        "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80",
      status: "completed",
      date: new Date(Date.now() + 259200000), // 3 days from now
      time: "5:00 PM - 6:30 PM",
      location: "Coffee Shop",
      price: "28",
      hourly: true,
    },
  ],
  matchedHelpers: defaultMatchedHelpers = [
    {
      id: "1",
      name: "John Doe",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&q=80",
      subject: "Mathematics",
      missionId: "1",
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
      subject: "Physics",
      missionId: "2",
    },
    {
      id: "3",
      name: "Alex Johnson",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
      subject: "Chemistry",
      missionId: "3",
    },
  ],
}: NeederDashboardProps) => {
  // Create a state to manage matched helpers
  const [matchedHelpers, setMatchedHelpers] = useState<MatchedHelper[]>(
    defaultMatchedHelpers,
  );
  const [activeTab, setActiveTab] = useState("missions");
  const [newMission, setNewMission] = useState<Partial<Mission>>({
    subject: "",
    description: "",
    imageUrl: "",
    status: "pending",
    date: new Date(Date.now() + 86400000), // Tomorrow by default
    time: "",
    location: "",
    price: "",
    hourly: true,
    startTime: "",
    endTime: "",
  });
  const [showOtherSubject, setShowOtherSubject] = useState(false);
  const [otherSubjectText, setOtherSubjectText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isHourlyRate, setIsHourlyRate] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMissionId, setNewMissionId] = useState<string | null>(null);
  const { toast } = useToast();
  const [missionFilter, setMissionFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedMissions, setAppliedMissions] = useState<string[]>(["2"]);
  const [notificationCount, setNotificationCount] = useState(1);
  const [pendingHelperOffers, setPendingHelperOffers] = useState<
    {
      helperId: string;
      missionId: string;
      helperName: string;
      helperAvatar: string;
    }[]
  >([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedHelperOffer, setSelectedHelperOffer] = useState<{
    helperId: string;
    missionId: string;
    helperName: string;
    helperAvatar: string;
    contactInfo?: string;
  } | null>(null);

  // State for helper profile modal
  const [showHelperProfileModal, setShowHelperProfileModal] = useState(false);
  const [selectedHelperProfile, setSelectedHelperProfile] = useState<any>(null);
  const [acceptedHelpers, setAcceptedHelpers] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewMission((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubjectChange = (value: string) => {
    if (value === "Other") {
      setShowOtherSubject(true);
      setNewMission((prev) => ({ ...prev, subject: "" }));
    } else {
      setShowOtherSubject(false);
      setOtherSubjectText("");
      setNewMission((prev) => ({ ...prev, subject: value }));
      validateField("subject", value);
    }
  };

  const handleOtherSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherSubjectText(value);
    setNewMission((prev) => ({ ...prev, subject: value }));
    validateField("subject", value);
  };

  const validateField = (name: string, value: any) => {
    const errors: Record<string, string> = { ...formErrors };

    switch (name) {
      case "subject":
        if (!value) {
          errors.subject = "Title is required";
        } else if (value.length > 100) {
          errors.subject = "Title must be less than 100 characters";
        } else {
          delete errors.subject;
        }
        break;
      case "description":
        if (!value) {
          errors.description = "Description is required";
        } else if (value.length > 500) {
          errors.description = "Description must be less than 500 characters";
        } else {
          delete errors.description;
        }
        break;
      case "price":
        if (!value) {
          errors.price = "Price is required";
        } else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          errors.price = "Price must be a positive number";
        } else {
          delete errors.price;
        }
        break;
      case "startTime":
        if (!value) {
          errors.startTime = "Start time is required";
        } else {
          delete errors.startTime;
          // Check if both times are set to validate time range
          if (newMission.endTime && newMission.endTime <= value) {
            errors.timeRange = "End time must be after start time";
          } else {
            delete errors.timeRange;
          }
        }
        break;
      case "endTime":
        if (!value) {
          errors.endTime = "End time is required";
        } else {
          delete errors.endTime;
          // Check if both times are set to validate time range
          if (newMission.startTime && value <= newMission.startTime) {
            errors.timeRange = "End time must be after start time";
          } else {
            delete errors.timeRange;
          }
        }
        break;
      case "location":
        if (!value) {
          errors.location = "Location is required";
        } else {
          delete errors.location;
        }
        break;
      default:
        break;
    }

    setFormErrors(errors);
  };

  const validateDate = (date: Date | undefined) => {
    const errors = { ...formErrors };

    if (!date) {
      errors.date = "Date is required";
    } else if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      errors.date = "Date must be in the future";
    } else {
      delete errors.date;
    }

    setFormErrors(errors);
  };

  // Check if the form is valid whenever formErrors or newMission changes
  useEffect(() => {
    const requiredFields = isHourlyRate
      ? ["subject", "description", "price", "startTime", "endTime", "location"]
      : ["subject", "description", "price", "location"];

    const hasAllRequiredFields = requiredFields.every(
      (field) => !!newMission[field as keyof Partial<Mission>],
    );
    const hasNoErrors = Object.keys(formErrors).length === 0;
    const dateIsValid =
      newMission.date &&
      newMission.date >= new Date(new Date().setHours(0, 0, 0, 0));

    // Update the time field for compatibility with existing code
    if (newMission.startTime && newMission.endTime) {
      setNewMission((prev) => ({
        ...prev,
        time: `${prev.startTime} - ${prev.endTime}`,
      }));
    }

    setIsFormValid(hasAllRequiredFields && hasNoErrors && dateIsValid);
  }, [formErrors, newMission, isHourlyRate]);

  // Calculate duration in hours between start and end time
  const calculateDuration = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;

    try {
      // Parse times to 24-hour format
      const parseTime = (timeStr: string): number => {
        const [timePart, period] = timeStr.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        return hours + minutes / 60;
      };

      const startHours = parseTime(startTime);
      const endHours = parseTime(endTime);

      // Calculate duration
      return endHours > startHours ? endHours - startHours : 0;
    } catch (error) {
      console.error("Error calculating duration:", error);
      return 0;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a storage service
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setNewMission((prev) => ({ ...prev, imageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you would save this to a database
      console.log("New mission:", newMission);

      // Generate a unique ID for the new mission
      const id = (missions.length + 1).toString();

      // Create the complete mission object
      const completeMission: Mission = {
        id,
        subject: newMission.subject || "",
        description: newMission.description || "",
        imageUrl: newMission.imageUrl,
        status: "pending",
        date: newMission.date || new Date(),
        time:
          newMission.startTime && newMission.endTime
            ? `${newMission.startTime} - ${newMission.endTime}`
            : "",
        location: newMission.location || "",
        price: newMission.price || "",
        hourly: isHourlyRate,
        startTime: newMission.startTime,
        endTime: newMission.endTime,
      };

      // In a real app, this would be an API call
      // Simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Store the new mission ID to highlight it
      setNewMissionId(id);

      // Show success toast
      toast({
        title: "Mission Created",
        description:
          "Your help mission has been posted! Helpers will see it shortly.",
        duration: 5000,
      });

      // Reset form
      setNewMission({
        subject: "",
        description: "",
        imageUrl: "",
        status: "pending",
        date: new Date(Date.now() + 86400000), // Tomorrow by default
        time: "",
        location: "",
        price: "",
        hourly: true,
        startTime: "",
        endTime: "",
      });
      setImagePreview(null);
      setFormErrors({});
      setShowOtherSubject(false);
      setOtherSubjectText("");

      // Switch to missions tab
      setActiveTab("missions");
    } catch (error) {
      console.error("Error creating mission:", error);
      toast({
        title: "Error",
        description:
          "There was an error creating your mission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMission = (id: string) => {
    // In a real app, you would delete this from a database
    console.log("Delete mission:", id);
  };

  const handleEditMission = (mission: Mission) => {
    // In a real app, you would update this in a database
    console.log("Edit mission:", mission);
  };

  const handleAcceptHelper = (helperId: string, missionId: string) => {
    setSelectedHelperOffer(
      matchedHelpers.find((t) => t.id === helperId) || null,
    );
    setShowPaymentModal(true);
  };

  const handleRejectHelper = (helperId: string, missionId: string) => {
    // In a real app, you would update this in a database
    console.log(`Rejected helper ${helperId} for mission ${missionId}`);
    // Remove notification
    setNotificationCount((prev) => Math.max(0, prev - 1));
    // Update UI by removing this helper from matchedHelpers
    const updatedHelpers = matchedHelpers.filter((t) => t.id !== helperId);
    // This would normally update the database
    setMatchedHelpers(updatedHelpers);
  };

  const handlePayment = () => {
    if (!selectedHelperOffer) return;

    // In a real app, this would process the payment
    // For demo purposes, we'll just close the modal and show the contact info

    // Update mission status
    const missionId = selectedHelperOffer.missionId;
    const mission = missions.find((m) => m.id === missionId);
    if (mission) {
      mission.status = "matched";
    }

    // Add contact info to helper
    const updatedHelper = {
      ...selectedHelperOffer,
      contactInfo: "+41 79 123 45 67",
    };
    setSelectedHelperOffer(updatedHelper);

    // Add to accepted helpers
    setAcceptedHelpers((prev) => [...prev, selectedHelperOffer.helperId]);

    // Remove from new matches notification
    setNotificationCount((prev) => Math.max(0, prev - 1));

    // Find the helper in matchedHelpers and update with contact info
    const updatedMatchedHelpers = matchedHelpers.map((helper) => {
      if (helper.id === selectedHelperOffer.helperId) {
        return { ...helper, contactInfo: "+41 79 123 45 67" };
      }
      return helper;
    });

    // Remove all other helpers for the same mission
    const filteredHelpers = updatedMatchedHelpers.filter(
      (helper) =>
        helper.id === selectedHelperOffer.helperId ||
        helper.missionId !== missionId,
    );

    setMatchedHelpers(filteredHelpers);
  };

  // Helper function to calculate hours from time string (e.g., "3:00 PM - 5:30 PM" => 2.5)
  const calculateHoursFromTimeRange = (timeRange: string): number => {
    try {
      const [startTime, endTime] = timeRange.split(" - ");
      return calculateDuration(startTime, endTime);
    } catch (error) {
      console.error("Error parsing time range:", error);
      return 0;
    }
  };

  // Calculate platform fee (12%) and helper's actual payment
  const calculatePlatformFee = (
    totalPrice: number,
  ): { platformFee: number; helperReceives: number } => {
    const platformFeePercentage = 0.12; // 12%
    const platformFee = totalPrice * platformFeePercentage;
    const helperReceives = totalPrice - platformFee;

    return {
      platformFee,
      helperReceives,
    };
  };

  // Helper function to format price display
  const formatPriceDisplay = (mission: Mission): string => {
    if (!mission.price) return "";

    if (mission.hourly && mission.time) {
      const hours = calculateHoursFromTimeRange(mission.time);
      const hourlyRate = parseFloat(mission.price);
      const totalPrice = hourlyRate * hours;
      const { helperReceives } = calculatePlatformFee(totalPrice);

      return `CHF ${totalPrice.toFixed(0)} total (CHF ${hourlyRate}/hr × ${hours}h)`;
    } else {
      const totalPrice = parseFloat(mission.price);
      const { helperReceives } = calculatePlatformFee(totalPrice);

      return `CHF ${totalPrice.toFixed(0)}`;
    }
  };

  // Helper function to format detailed price breakdown
  const formatPriceBreakdown = (
    price: string,
    isHourly: boolean,
    startTime?: string,
    endTime?: string,
  ): React.ReactNode => {
    if (!price) return null;

    const hourlyRate = parseFloat(price);
    if (isNaN(hourlyRate)) return null;

    let totalPrice = hourlyRate;
    let hoursText = "";

    if (isHourly && startTime && endTime) {
      const hours = calculateDuration(startTime, endTime);
      totalPrice = hourlyRate * hours;
      hoursText = ` (${hourlyRate} × ${hours.toFixed(1)}h)`;
    }

    const { helperReceives } = calculatePlatformFee(totalPrice);

    return (
      <div className="mt-2 text-xs space-y-1 bg-blue-50 p-2 rounded-md">
        <div className="font-medium">
          You are offering: CHF {totalPrice.toFixed(0)}
          {hoursText}
        </div>
        <div className="font-medium">
          Helper receives: CHF {helperReceives.toFixed(0)}
        </div>
        <div className="text-gray-500 text-xs mt-1">
          💡 Fair pay = more likely matches.
          <br />
          📉 We take 12% to keep Helpii running and get a cookie sometimes
        </div>
      </div>
    );
  };

  // Filter missions based on the selected filter and search term
  const filteredMissions = missions.filter((mission) => {
    // First apply the search filter if there is a search term
    const matchesSearch = searchTerm
      ? mission.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Then apply the tab filter
    if (!matchesSearch) return false;
    if (missionFilter === "all") return true;
    if (missionFilter === "new_matches") return mission.status === "new_match";
    if (missionFilter === "pending") return mission.status === "pending";
    if (missionFilter === "matched") return mission.status === "matched";
    if (missionFilter === "completed") return mission.status === "completed";
    if (missionFilter === "applied") return mission.status === "applied";
    return true;
  });

  const [completedMissions, setCompletedMissions] = useState<
    Record<string, string>
  >({});

  // State for horizontal scroll indicators
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State for mission detail modal
  const [selectedCalendarMission, setSelectedCalendarMission] =
    useState<any>(null);
  const [showMissionDetailModal, setShowMissionDetailModal] = useState(false);

  // Get missions for calendar view (only matched ones)
  const calendarMissions = missions
    .filter((mission) => mission.status === "matched")
    .map((mission) => ({
      id: mission.id,
      subject: mission.subject,
      date: mission.date,
      time: mission.time,
      tutorName:
        matchedHelpers.find((helper) => helper.missionId === mission.id)
          ?.name || "Unknown Helper",
    }));

  // Handle mission completion
  const handleMissionComplete = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    // Update mission status based on current status
    let newStatus: string;
    if (mission.status === "matched") {
      newStatus = "needer_completed";
    } else if (mission.status === "helper_completed") {
      newStatus = "completed";
    } else {
      return; // Already completed or invalid status
    }

    // Update the completed missions state
    setCompletedMissions((prev) => ({
      ...prev,
      [missionId]: newStatus,
    }));

    // Update the mission status in the missions array
    const updatedMissions = missions.map((m) =>
      m.id === missionId ? { ...m, status: newStatus as any } : m,
    );

    // In a real app, this would be an API call to update the database
    console.log(`Mission ${missionId} marked as ${newStatus}`);

    // Show success message
    toast({
      title:
        newStatus === "completed"
          ? "Mission Completed!"
          : "Confirmation Recorded",
      description:
        newStatus === "completed"
          ? "Payment has been released to the helper. Thank you!"
          : "Waiting for helper confirmation to complete the mission.",
      duration: 5000,
    });
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

  // Get missions happening today
  const getTodaysMissions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return missions.filter((mission) => {
      const missionDate = new Date(mission.date);
      missionDate.setHours(0, 0, 0, 0);
      return (
        missionDate.getTime() === today.getTime() &&
        mission.status === "matched"
      );
    });
  };

  const todaysMissions = getTodaysMissions();

  const handleCalendarMissionClick = (mission: any) => {
    // Handle both old format (with just id) and new format (full mission object)
    let fullMission;
    if (mission.id && !mission.subject) {
      // Old format - find the mission by ID
      fullMission = missions.find((m) => m.id === mission.id);
    } else {
      // New format - mission object passed directly
      fullMission = missions.find((m) => m.id === mission.id) || mission;
    }

    if (fullMission) {
      setSelectedCalendarMission({
        id: fullMission.id,
        subject: fullMission.subject,
        description: fullMission.description,
        date: fullMission.date
          ? fullMission.date.toLocaleDateString()
          : mission.date?.toLocaleDateString() || "",
        time: fullMission.time,
        location: fullMission.location,
        price: fullMission.price,
        status: completedMissions[fullMission.id] || fullMission.status,
        needer: {
          name: "You",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=student",
          rating: 4.8,
          age: 20,
          languages: ["English"],
          location: "Student",
        },
      });
      setShowMissionDetailModal(true);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white">
      {/* Stats Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#F37221]">
            What's happening today
          </h2>
          <Button
            onClick={() => setActiveTab("create")}
            className="bg-[#F37221] hover:bg-[#F37221] text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Mission
          </Button>
        </div>

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
                <div className="p-3 rounded-full bg-[#F37221]">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            {todaysMissions.length > 0 && (
              <div className="p-4">
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto horizontal-scroll pb-2">
                    {todaysMissions.map((mission) => {
                      const matchedHelper = matchedHelpers.find(
                        (helper) => helper.missionId === mission.id,
                      );
                      return (
                        <div
                          key={mission.id}
                          className="flex-shrink-0 w-48 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() =>
                            handleCalendarMissionClick({
                              id: mission.id,
                              subject: mission.subject,
                              date: mission.date,
                              time: mission.time,
                              tutorName:
                                matchedHelper?.name || "Unknown Helper",
                            })
                          }
                        >
                          <h4 className="font-medium text-sm mb-1 truncate">
                            {mission.subject}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {mission.time}
                          </p>
                          {matchedHelper && (
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full overflow-hidden">
                                <img
                                  src={matchedHelper.avatar}
                                  alt={matchedHelper.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span className="text-xs text-gray-700 truncate">
                                {matchedHelper.name}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                          (mission.status === "matched" ||
                            completedMissions[mission.id] ===
                              "tutor_completed") &&
                          completedMissions[mission.id] !==
                            "student_completed" &&
                          completedMissions[mission.id] !== "completed"
                        );
                      }).length
                    }
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-[#F37221]">
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
                (mission.status === "matched" ||
                  completedMissions[mission.id] === "helper_completed") &&
                completedMissions[mission.id] !== "needer_completed" &&
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
                          (mission.status === "matched" ||
                            completedMissions[mission.id] ===
                              "tutor_completed") &&
                          completedMissions[mission.id] !==
                            "student_completed" &&
                          completedMissions[mission.id] !== "completed"
                        );
                      })
                      .map((mission) => {
                        const matchedHelper = matchedHelpers.find(
                          (helper) => helper.missionId === mission.id,
                        );
                        const isWaitingForStudent =
                          completedMissions[mission.id] === "helper_completed";
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
                            {matchedHelper && (
                              <div className="flex items-center gap-2 mb-2">
                                <div className="h-6 w-6 rounded-full overflow-hidden">
                                  <img
                                    src={matchedHelper.avatar}
                                    alt={matchedHelper.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="text-xs text-gray-700 truncate">
                                  {matchedHelper.name}
                                </span>
                              </div>
                            )}
                            <div className="mb-2">
                              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                {isWaitingForStudent
                                  ? "Waiting for you"
                                  : "Waiting for helper"}
                              </span>
                            </div>
                            {!isWaitingForStudent && (
                              <Button
                                size="sm"
                                className="w-full text-xs bg-[#F37221] hover:bg-[#F37221]/90 text-white"
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
                          completedMissions[mission.id] === "completed" ||
                          mission.status === "completed",
                      ).length
                    }
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-[#F37221]">
                  <Star className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            {missions.filter(
              (mission) =>
                completedMissions[mission.id] === "completed" ||
                mission.status === "completed",
            ).length > 0 && (
              <div className="p-4">
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto horizontal-scroll pb-2">
                    {missions
                      .filter(
                        (mission) =>
                          completedMissions[mission.id] === "completed" ||
                          mission.status === "completed",
                      )
                      .map((mission) => {
                        const matchedHelper = matchedHelpers.find(
                          (helper) => helper.missionId === mission.id,
                        );
                        return (
                          <div
                            key={mission.id}
                            className="flex-shrink-0 w-52 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img
                                  src={
                                    matchedHelper?.avatar ||
                                    "https://api.dicebear.com/7.x/avataaars/svg?seed=helper"
                                  }
                                  alt={matchedHelper?.name || "Helper"}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium truncate block">
                                  {matchedHelper?.name || "Helper"}
                                </span>
                                <p className="text-xs text-gray-600">
                                  {mission.date.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="w-full text-xs text-[#F37221] bg-white border border-[#F37221] hover:bg-[#F37221]/10"
                            >
                              Leave Review
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Tabs
        defaultValue="missions"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search missions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <TabsList>
            <TabsTrigger value="missions">My Missions</TabsTrigger>
            <TabsTrigger value="new_matches" className="relative">
              New Matches
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </div>
              )}
            </TabsTrigger>
            <TabsTrigger value="calendar">Matched</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="missions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMissions.length > 0 ? (
              filteredMissions.map((mission) => (
                <Card
                  key={mission.id}
                  className={`overflow-hidden relative ${newMissionId === mission.id ? "ring-2 ring-[#F37221] ring-offset-2" : ""}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{mission.subject}</CardTitle>
                      {mission.status && (
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${mission.status === "pending" ? "bg-yellow-100 text-yellow-800" : mission.status === "matched" ? "bg-blue-100 text-blue-800" : mission.status === "completed" ? "bg-green-100 text-green-800" : mission.status === "applied" ? "bg-purple-100 text-purple-800" : "bg-purple-100 text-purple-800"}`}
                        >
                          {mission.status === "pending"
                            ? "Pending"
                            : mission.status === "matched"
                              ? "Matched"
                              : mission.status === "completed"
                                ? "Completed"
                                : mission.status === "applied"
                                  ? "Applied"
                                  : "New Match"}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {mission.description}
                    </p>
                    {mission.imageUrl && (
                      <div className="mt-4 h-40 w-full overflow-hidden rounded-md">
                        <img
                          src={mission.imageUrl}
                          alt={mission.subject}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="mt-3 space-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Date:</span>{" "}
                        {mission.date.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Time:</span>{" "}
                        {mission.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Location:</span>{" "}
                        {mission.location}
                      </div>
                      <div className="flex justify-end">
                        <span className="font-semibold">
                          {formatPriceDisplay(mission)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMission(mission)}
                      className="border-[#F37221] text-[#F37221] hover:bg-orange-50"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMission(mission.id)}
                      className="bg-gray-600 text-white hover:bg-gray-100"
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">
                  No missions found with the selected filter.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab("create")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Mission
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="new_matches" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedHelpers.length > 0 ? (
              matchedHelpers.map((tutor) => {
                // Mock data for tutor profile (in a real app, this would come from the database)
                const tutorProfile = {
                  id: tutor.id,
                  name: tutor.name,
                  avatar: tutor.avatar,
                  subject: tutor.subject,
                  slogan:
                    "I'm passionate about helping students understand complex concepts in simple ways.",
                  isHelpHero: tutor.id === "1", // Just for demo purposes
                  helpMissions: 12,
                  languages: ["English", "Spanish", "German"],
                  rating: 4.8,
                  ratingDetails: {
                    friendliness: 4.9,
                    reliability: 4.7,
                    skills: 4.8,
                    efficiency: 4.6,
                  },
                  subjects: [tutor.subject, "Algebra", "Calculus"],
                  location: "Bern",
                  radius: 10,
                  whyChooseMe:
                    "I have 5+ years of experience teaching at university level and can break down complex topics into easy-to-understand concepts.",
                  videoUrl: "",
                  joinDate: "June 2023",
                  missionsCompleted: 12,
                  reviews: [
                    {
                      id: "1",
                      studentName: "Emma S.",
                      rating: 5,
                      comment:
                        "Excellent tutor! Made complex concepts easy to understand.",
                    },
                    {
                      id: "2",
                      studentName: "Michael T.",
                      rating: 4.5,
                      comment:
                        "Very patient and knowledgeable. Would recommend!",
                    },
                    {
                      id: "3",
                      studentName: "Sarah L.",
                      rating: 5,
                      comment: "Helped me pass my exam with flying colors!",
                    },
                  ],
                };

                return (
                  <Card
                    key={tutor.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={(e) => {
                      // Only open modal if not clicking on buttons
                      if (!(e.target as HTMLElement).closest("button")) {
                        setSelectedHelperProfile(tutorProfile);
                        setShowHelperProfileModal(true);
                      }
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start space-x-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden">
                          <img
                            src={tutor.avatar}
                            alt={tutor.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                              {tutor.name}
                            </CardTitle>
                            {tutorProfile.isHelpHero && (
                              <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                                Help Hero
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {tutorProfile.slogan}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium mb-2">
                        Matched with your{" "}
                        <span className="text-[#F37221]">{tutor.subject}</span>{" "}
                        mission
                      </p>
                      <div className="text-xs space-y-2">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Help Missions:</span>{" "}
                          {tutorProfile.helpMissions}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Languages:</span>{" "}
                          {tutorProfile.languages.join(", ")}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Rating:</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1">
                              {tutorProfile.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        {acceptedHelpers.includes(tutor.id) &&
                          tutor.contactInfo && (
                            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-200">
                              <span className="font-medium flex items-center">
                                <Phone className="h-3 w-3 mr-1" /> Contact:
                              </span>
                              <span>{tutor.contactInfo}</span>
                            </div>
                          )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      {acceptedHelpers.includes(tutor.id) ? (
                        <Button className="w-full bg-[#F37221] hover:bg-[#F37221]/90 text-white">
                          Contact Helper
                        </Button>
                      ) : (
                        <div className="flex gap-2 w-full">
                          <Button
                            className="flex-1 bg-[#F37221] hover:bg-[#F37221]/90 text-white"
                            onClick={() => {
                              setSelectedHelperOffer({
                                helperId: tutor.id,
                                missionId: tutor.missionId,
                                helperName: tutor.name,
                                helperAvatar: tutor.avatar,
                              });
                              setShowPaymentModal(true);
                            }}
                          >
                            Accept Help
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() =>
                              handleRejectHelper(tutor.id, tutor.missionId)
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">
                  No helpers have matched with your missions yet.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="matched" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.filter((m) => m.status === "matched").length > 0 ? (
              missions
                .filter((m) => m.status === "matched")
                .map((mission) => {
                  // Find the matched helper for this mission
                  const matchedHelper = matchedHelpers.find(
                    (helper) =>
                      helper.missionId === mission.id &&
                      acceptedHelpers.includes(helper.id),
                  );

                  return (
                    <Card key={mission.id} className="overflow-hidden relative">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{mission.subject}</CardTitle>
                          <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Matched
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {matchedHelper && (
                          <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-gray-100">
                            <div className="h-12 w-12 rounded-full overflow-hidden">
                              <img
                                src={matchedHelper.avatar}
                                alt={matchedHelper.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">
                                {matchedHelper.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Your matched helper
                              </p>
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-gray-600">
                          {mission.description}
                        </p>
                        {mission.imageUrl && (
                          <div className="mt-4 h-40 w-full overflow-hidden rounded-md">
                            <img
                              src={mission.imageUrl}
                              alt={mission.subject}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="mt-3 space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Date:</span>{" "}
                            {mission.date.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Time:</span>{" "}
                            {mission.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Location:</span>{" "}
                            {mission.location}
                          </div>
                          <div className="flex justify-end">
                            <span className="font-semibold">
                              {formatPriceDisplay(mission)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between mt-2">
                        {matchedHelper && matchedHelper.contactInfo ? (
                          <Button className="w-full bg-[#F37221] hover:bg-[#F37221]/90 text-white">
                            <Phone className="h-4 w-4 mr-2" /> Contact Helper:{" "}
                            {matchedHelper.contactInfo}
                          </Button>
                        ) : (
                          <p className="text-sm text-gray-600">
                            You have been matched with a helper for this
                            mission.
                          </p>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">
                  No matched missions found. Accept a helper to see them here.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applied" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.filter((m) => m.status === "applied").length > 0 ? (
              missions
                .filter((m) => m.status === "applied")
                .map((mission) => (
                  <Card key={mission.id} className="overflow-hidden relative">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{mission.subject}</CardTitle>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Applied
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {mission.description}
                      </p>
                      {mission.imageUrl && (
                        <div className="mt-4 h-40 w-full overflow-hidden rounded-md">
                          <img
                            src={mission.imageUrl}
                            alt={mission.subject}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="mt-3 space-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Date:</span>{" "}
                          {mission.date.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Time:</span>{" "}
                          {mission.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Location:</span>{" "}
                          {mission.location}
                        </div>
                        <div className="flex justify-end">
                          <span className="font-semibold">
                            {formatPriceDisplay(mission)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between mt-2">
                      <p className="text-sm text-gray-600">
                        Helpers have applied to help with this mission.
                      </p>
                    </CardFooter>
                  </Card>
                ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">
                  No helpers have applied to your missions yet.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.filter((m) => m.status === "pending").length > 0 ? (
              missions
                .filter((m) => m.status === "pending")
                .map((mission) => (
                  <Card key={mission.id} className="overflow-hidden relative">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{mission.subject}</CardTitle>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {mission.description}
                      </p>
                      {mission.imageUrl && (
                        <div className="mt-4 h-40 w-full overflow-hidden rounded-md">
                          <img
                            src={mission.imageUrl}
                            alt={mission.subject}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="mt-3 space-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Date:</span>{" "}
                          {mission.date.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Time:</span>{" "}
                          {mission.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Location:</span>{" "}
                          {mission.location}
                        </div>
                        <div className="flex justify-end">
                          <span className="font-semibold">
                            {formatPriceDisplay(mission)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMission(mission)}
                        className="border-[#F37221] text-[#F37221] hover:bg-orange-50"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMission(mission.id)}
                        className="border-gray-600 text-gray-600 hover:bg-gray-100"
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No pending missions found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.filter((m) => m.status === "completed").length > 0 ? (
              missions
                .filter((m) => m.status === "completed")
                .map((mission) => (
                  <Card key={mission.id} className="overflow-hidden relative">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{mission.subject}</CardTitle>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {mission.description}
                      </p>
                      {mission.imageUrl && (
                        <div className="mt-4 h-40 w-full overflow-hidden rounded-md">
                          <img
                            src={mission.imageUrl}
                            alt={mission.subject}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="mt-3 space-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Date:</span>{" "}
                          {mission.date.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Time:</span>{" "}
                          {mission.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Location:</span>{" "}
                          {mission.location}
                        </div>
                        <div className="flex justify-end">
                          <span className="font-semibold">
                            {formatPriceDisplay(mission)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end mt-2">
                      <Button
                        className="bg-[#F37221] hover:bg-[#F37221]/90 text-white"
                        size="sm"
                      >
                        Leave Review
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No completed missions found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <MissionCalendar
            missions={calendarMissions}
            userRole="student"
            onMissionClick={handleCalendarMissionClick}
          />
        </TabsContent>

        <TabsContent value="create">
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("missions")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Missions
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Help Mission</CardTitle>
                <CardDescription>
                  Fill out the details below to create a new help mission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="image" className="block mb-2">
                      Image (Optional)
                    </Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("image")?.click()
                        }
                        className="w-full h-32 flex flex-col items-center justify-center border-dashed"
                      >
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImagePreview(null);
                                setNewMission((prev) => ({
                                  ...prev,
                                  imageUrl: "",
                                }));
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mb-2 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              Upload an image
                            </span>
                          </>
                        )}
                      </Button>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="subject">Choose a subject</Label>
                      {showOtherSubject && (
                        <span className="text-xs text-gray-500">
                          {otherSubjectText?.length || 0}/100
                        </span>
                      )}
                    </div>
                    <Select
                      onValueChange={handleSubjectChange}
                      value={
                        showOtherSubject ? "Other" : newMission.subject || ""
                      }
                    >
                      <SelectTrigger
                        className={formErrors.subject ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Geography">Geography</SelectItem>
                        <SelectItem value="Programming">Programming</SelectItem>
                        <SelectItem value="Economics">Economics</SelectItem>
                        <SelectItem value="Law">Law</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {showOtherSubject && (
                      <Input
                        placeholder="Please specify the subject"
                        value={otherSubjectText}
                        onChange={handleOtherSubjectChange}
                        maxLength={100}
                        className={formErrors.subject ? "border-red-500" : ""}
                      />
                    )}
                    {formErrors.subject && (
                      <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.subject}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="description">Description</Label>
                      <span className="text-xs text-gray-500">
                        {newMission.description?.length || 0}/500
                      </span>
                    </div>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe what you need help with..."
                      value={newMission.description}
                      onChange={handleInputChange}
                      maxLength={500}
                      rows={4}
                      className={formErrors.description ? "border-red-500" : ""}
                    />
                    {formErrors.description && (
                      <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.description}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="price">Price</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Flat</span>
                        <Switch
                          checked={isHourlyRate}
                          onCheckedChange={setIsHourlyRate}
                        />
                        <span className="text-xs">Hourly</span>
                      </div>
                    </div>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        CHF
                      </span>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="25"
                        value={newMission.price}
                        onChange={handleInputChange}
                        className={`rounded-l-none ${formErrors.price ? "border-red-500" : ""}`}
                      />
                    </div>
                    {formErrors.price && (
                      <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.price}
                      </div>
                    )}
                    {newMission.price && (
                      <div className="mt-2 text-xs space-y-1 bg-blue-50 p-2 rounded-md">
                        <div className="font-medium">
                          💰 You are offering: CHF{" "}
                          {isHourlyRate &&
                          newMission.startTime &&
                          newMission.endTime
                            ? (
                                parseFloat(newMission.price) *
                                calculateDuration(
                                  newMission.startTime,
                                  newMission.endTime,
                                )
                              ).toFixed(0)
                            : newMission.price}
                          <div className="text-xs text-gray-500">
                            this is how much you will pay
                          </div>
                        </div>
                        <div className="font-medium">
                          🧑‍🏫 Tutor receives: CHF{" "}
                          {isHourlyRate &&
                          newMission.startTime &&
                          newMission.endTime
                            ? (
                                parseFloat(newMission.price) *
                                calculateDuration(
                                  newMission.startTime,
                                  newMission.endTime,
                                ) *
                                0.88
                              ).toFixed(0)
                            : (parseFloat(newMission.price) * 0.88).toFixed(0)}
                          <div className="text-xs text-gray-500">
                            fair pay = more matches
                          </div>
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          📉 We take 12% to keep Helpii running and get a cookie
                          sometimes
                        </div>
                      </div>
                    )}
                    {isHourlyRate && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        Price will be calculated based on your selected
                        duration.
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="date">Date & Time</Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <Label htmlFor="date" className="text-xs mb-1 block">
                          Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${formErrors.date ? "border-red-500" : ""}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newMission.date ? (
                                format(newMission.date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={newMission.date}
                              onSelect={(date) => {
                                setNewMission((prev) => ({ ...prev, date }));
                                validateDate(date);
                              }}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {formErrors.date && (
                          <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.date}
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <Label
                              htmlFor="startTime"
                              className="text-xs mb-1 block"
                            >
                              Start Time
                            </Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                <Clock className="h-4 w-4" />
                              </span>
                              <Input
                                id="startTime"
                                name="startTime"
                                placeholder="e.g. 3:00 PM"
                                value={newMission.startTime}
                                onChange={handleInputChange}
                                className={`rounded-l-none ${formErrors.startTime ? "border-red-500" : ""}`}
                              />
                            </div>
                            {formErrors.startTime && (
                              <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3" />
                                {formErrors.startTime}
                              </div>
                            )}
                          </div>
                          <div>
                            <Label
                              htmlFor="endTime"
                              className="text-xs mb-1 block"
                            >
                              End Time
                            </Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                <Clock className="h-4 w-4" />
                              </span>
                              <Input
                                id="endTime"
                                name="endTime"
                                placeholder="e.g. 5:00 PM"
                                value={newMission.endTime}
                                onChange={handleInputChange}
                                className={`rounded-l-none ${formErrors.endTime ? "border-red-500" : ""}`}
                              />
                            </div>
                            {formErrors.endTime && (
                              <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3" />
                                {formErrors.endTime}
                              </div>
                            )}
                          </div>
                        </div>
                        {formErrors.timeRange && (
                          <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.timeRange}
                          </div>
                        )}
                        {isHourlyRate &&
                          newMission.startTime &&
                          newMission.endTime && (
                            <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              Duration:{" "}
                              {calculateDuration(
                                newMission.startTime,
                                newMission.endTime,
                              ).toFixed(1)}{" "}
                              hours
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Enter location or PLZ (e.g. 8001, Online, ETH Library...)"
                        value={newMission.location}
                        onChange={handleInputChange}
                        className={`rounded-l-none ${formErrors.location ? "border-red-500" : ""}`}
                      />
                    </div>
                    {formErrors.location && (
                      <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.location}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#F37221] hover:bg-[#F37221] text-white"
                    disabled={!isFormValid || isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Mission"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Live Preview Card */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Mission Preview</h3>
              <Card className="overflow-hidden relative">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {newMission.subject || "Mission Title"}
                    </CardTitle>
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Preview
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {newMission.description ||
                      "Your mission description will appear here..."}
                  </p>
                  {(imagePreview || newMission.imageUrl) && (
                    <div className="mt-4 h-40 w-full overflow-hidden rounded-md">
                      <img
                        src={imagePreview || newMission.imageUrl}
                        alt={newMission.subject || "Preview"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Date:</span>{" "}
                      {newMission.date
                        ? format(newMission.date, "PPP")
                        : "Select a date"}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Time:</span>{" "}
                      {newMission.time || "Specify time"}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Location:</span>{" "}
                      {newMission.location || "Specify location"}
                    </div>
                    {newMission.price ? (
                      <div className="mt-4 bg-blue-50 p-3 rounded-md space-y-2">
                        <div className="font-medium">
                          💰 You are offering: CHF{" "}
                          {isHourlyRate &&
                          newMission.startTime &&
                          newMission.endTime
                            ? (
                                parseFloat(newMission.price) *
                                calculateDuration(
                                  newMission.startTime,
                                  newMission.endTime,
                                )
                              ).toFixed(0)
                            : newMission.price}
                          <div className="text-xs text-gray-500">
                            this is how much you will pay
                          </div>
                        </div>
                        <div className="font-medium">
                          🧑‍🏫 Tutor receives: CHF{" "}
                          {isHourlyRate &&
                          newMission.startTime &&
                          newMission.endTime
                            ? (
                                parseFloat(newMission.price) *
                                calculateDuration(
                                  newMission.startTime,
                                  newMission.endTime,
                                ) *
                                0.88
                              ).toFixed(0)
                            : (parseFloat(newMission.price) * 0.88).toFixed(0)}
                          <div className="text-xs text-gray-500">
                            fair pay = more matches
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          📉 We take 12% to keep Helpii running and get a cookie
                          sometimes
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <span className="font-semibold">Set price</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="text-sm font-medium text-blue-800">
                  What happens next?
                </h4>
                <ul className="mt-2 text-xs text-blue-700 space-y-1 list-disc pl-4">
                  <li>Your mission will be visible to qualified helpers</li>
                  <li>Helpers can apply to help with your mission</li>
                  <li>You'll receive notifications when helpers apply</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Modal */}
      {showPaymentModal && selectedHelperOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img
                  src={selectedHelperOffer.helperAvatar}
                  alt={selectedHelperOffer.helperName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{selectedHelperOffer.helperName}</p>
                <p className="text-sm text-gray-600">Helper</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-600 mb-2">Payment Details:</p>
              {selectedHelperOffer && (
                <>
                  <div className="font-medium">
                    {(() => {
                      const mission = missions.find(
                        (m) => m.id === selectedHelperOffer.missionId,
                      );
                      if (!mission || !mission.price)
                        return "Amount: CHF 25.00";

                      let totalPrice = parseFloat(mission.price);
                      if (mission.hourly && mission.time) {
                        const hours = calculateHoursFromTimeRange(mission.time);
                        totalPrice = totalPrice * hours;
                      }

                      const { tutorReceives } =
                        calculatePlatformFee(totalPrice);

                      return (
                        <div className="space-y-1">
                          <p>You pay: CHF {totalPrice.toFixed(0)}</p>
                          <p className="text-sm">
                            Helper receives: CHF {tutorReceives.toFixed(0)}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Funds will be held in escrow until the mission is completed
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    12% platform fee included to keep Helpii running and get a
                    cookie sometimes
                  </p>
                </>
              )}
            </div>
            <div className="space-y-4">
              <Button
                className="w-full bg-[#F37221] hover:bg-[#F37221] text-white"
                onClick={() => {
                  handlePayment();
                  setShowPaymentModal(false);
                }}
              >
                Pay with TWINT
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedHelperOffer(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Helper Profile Modal */}
      <Dialog
        open={showHelperProfileModal}
        onOpenChange={setShowHelperProfileModal}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedHelperProfile && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden">
                    <img
                      src={selectedHelperProfile.avatar}
                      alt={selectedHelperProfile.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-2xl">
                        {selectedHelperProfile.name}
                      </DialogTitle>
                      {selectedHelperProfile.isHelpHero && (
                        <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                          Help Hero
                        </Badge>
                      )}
                    </div>
                    <DialogDescription className="mt-1">
                      {selectedHelperProfile.slogan}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Left column - Helper info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">I help with</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedHelperProfile.subjects.map((subject: string) => (
                        <Badge key={subject} className="px-3 py-1">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Where I help</h3>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>
                        {selectedHelperProfile.location} (
                        {selectedHelperProfile.radius}km radius)
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Languages I speak</h3>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span>{selectedHelperProfile.languages.join(", ")}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">
                      Why you should choose me
                    </h3>
                    <p className="text-sm">
                      {selectedHelperProfile.whyChooseMe}
                    </p>

                    {selectedHelperProfile.videoUrl && (
                      <div className="mt-2 flex items-center gap-2 text-blue-600">
                        <Video className="h-4 w-4" />
                        <span className="text-sm">
                          Watch my introduction video
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">
                      On helpii since {selectedHelperProfile.joinDate}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedHelperProfile.missionsCompleted} missions
                      completed
                    </div>
                  </div>
                </div>

                {/* Right column - Ratings and reviews */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">Needer Reviews</h3>
                    <div className="space-y-4">
                      {selectedHelperProfile.reviews.map((review: any) => (
                        <div
                          key={review.id}
                          className="bg-gray-50 p-3 rounded-md"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">
                              {review.neederName}
                            </span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1 text-sm">
                                {review.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            "{review.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowHelperProfileModal(false)}
                  className="mr-2"
                >
                  Close
                </Button>
                <Button
                  className="bg-[#F37221] hover:bg-[#F37221]/90 text-white"
                  onClick={() => {
                    setShowHelperProfileModal(false);
                    if (selectedHelperProfile) {
                      setSelectedHelperOffer({
                        helperId: selectedHelperProfile.id,
                        missionId:
                          matchedHelpers.find(
                            (t) => t.id === selectedHelperProfile.id,
                          )?.missionId || "",
                        helperName: selectedHelperProfile.name,
                        helperAvatar: selectedHelperProfile.avatar,
                      });
                      setShowPaymentModal(true);
                    }
                  }}
                >
                  Accept Help
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Mission Detail Modal */}
      <MissionDetail
        isOpen={showMissionDetailModal}
        onClose={() => setShowMissionDetailModal(false)}
        mission={selectedCalendarMission}
        userRole="needer"
        onComplete={handleMissionComplete}
      />
    </div>
  );
};

export default StudentDashboard;

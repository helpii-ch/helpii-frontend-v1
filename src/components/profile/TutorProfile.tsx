import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileLayout from "./ProfileLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Star,
  Upload,
  X,
  Info,
  MapPin,
  Globe,
  Phone,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TutorProfileProps {
  activeRole: "tutor" | "student";
  onTabChange: (tab: string) => void;
}

interface TutorData {
  profilePicture: string;
  firstName: string;
  lastName: string;
  birthdate: Date | undefined;
  phoneNumber: string;
  aboutMe: string;
  motivation: string;
  subjects: string[];
  location: string;
  radius: number;
  languages: string[];
  whyChooseMe: string;
  videoUrl: string;
  joinDate: string;
  status: "Junior hero" | "Senior hero" | "Super hero";
  rating: number;
  missionsCompleted: number;
  ratingDetails: {
    friendliness: number;
    reliability: number;
    skills: number;
    efficiency: number;
  };
}

const TutorProfile = ({ activeRole, onTabChange }: TutorProfileProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(30);

  const [profile, setProfile] = useState<TutorData>({
    profilePicture: "",
    firstName: "John",
    lastName: "Doe",
    birthdate: new Date(1995, 0, 15),
    phoneNumber: "+41 79 123 45 67",
    aboutMe: "",
    motivation: "",
    subjects: ["Mathematics", "Physics"],
    location: "Bern",
    radius: 10,
    languages: ["English", "German"],
    whyChooseMe: "",
    videoUrl: "",
    joinDate: "June 2023",
    status: "Super hero",
    rating: 4.8,
    missionsCompleted: 12,
    ratingDetails: {
      friendliness: 4.9,
      reliability: 4.7,
      skills: 4.8,
      efficiency: 4.6,
    },
  });

  // Calculate completion percentage based on filled fields
  useEffect(() => {
    const requiredFields = [
      !!profile.profilePicture,
      !!profile.firstName,
      !!profile.lastName,
      !!profile.birthdate,
      !!profile.phoneNumber,
      !!profile.aboutMe,
      !!profile.motivation,
      profile.subjects.length > 0,
      !!profile.location,
      profile.languages.length > 0,
      !!profile.whyChooseMe,
    ];

    const completedFields = requiredFields.filter(Boolean).length;
    const newPercentage = (completedFields / requiredFields.length) * 100;
    setCompletionPercentage(newPercentage);

    // If profile is more than 80% complete, consider it not first time
    if (newPercentage > 80) {
      setIsFirstTime(false);
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setProfile((prev) => ({ ...prev, profilePicture: imageUrl }));
    }
  };

  const handleSave = () => {
    // In a real app, this would save to a database
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };

  const handleBack = () => {
    onTabChange("missions");
  };

  const handleAddSubject = (subject: string) => {
    if (subject && !profile.subjects.includes(subject)) {
      setProfile((prev) => ({
        ...prev,
        subjects: [...prev.subjects, subject],
      }));
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setProfile((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s !== subject),
    }));
  };

  const handleAddLanguage = (language: string) => {
    if (language && !profile.languages.includes(language)) {
      setProfile((prev) => ({
        ...prev,
        languages: [...prev.languages, language],
      }));
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }));
  };

  const calculateAge = (birthdate: Date | undefined) => {
    if (!birthdate) return "";
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthdate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const renderRatingBar = (rating: number, label: string) => (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{rating.toFixed(1)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-yellow-400 h-1.5 rounded-full"
          style={{ width: `${(rating / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <ProfileLayout
      title="Tutor Profile"
      isEditing={isEditing}
      onBack={handleBack}
      onToggleEdit={() => setIsEditing(true)}
      onSave={handleSave}
      completionPercentage={completionPercentage}
      isFirstTime={isFirstTime}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <div className="md:col-span-1">
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="mb-6">
              {isEditing ? (
                <div className="relative">
                  <div
                    className="h-40 w-40 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300"
                    onClick={() =>
                      document.getElementById("profile-picture")?.click()
                    }
                  >
                    {imagePreview || profile.profilePicture ? (
                      <img
                        src={imagePreview || profile.profilePicture}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {(imagePreview || profile.profilePicture) && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      onClick={() => {
                        setImagePreview(null);
                        setProfile((prev) => ({ ...prev, profilePicture: "" }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="h-40 w-40 rounded-full overflow-hidden bg-gray-100">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500 text-xl font-bold">
                        {profile.firstName.charAt(0)}
                        {profile.lastName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status Badge */}
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
              {profile.status}
            </Badge>

            {/* Rating Summary */}
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-lg">
                {profile.rating.toFixed(1)}
              </span>
            </div>

            {/* Missions Completed */}
            <div className="text-sm text-gray-600 mb-6">
              {profile.missionsCompleted} missions completed
            </div>

            {/* Detailed Ratings */}
            <div className="w-full">
              <h3 className="font-medium mb-3 text-sm">Rating Details</h3>
              {renderRatingBar(
                profile.ratingDetails.friendliness,
                "Friendliness",
              )}
              {renderRatingBar(
                profile.ratingDetails.reliability,
                "Reliability",
              )}
              {renderRatingBar(profile.ratingDetails.skills, "Skills")}
              {renderRatingBar(profile.ratingDetails.efficiency, "Efficiency")}
            </div>

            {/* Join Date */}
            <div className="mt-6 text-sm text-gray-600">
              On helpii since {profile.joinDate}
            </div>
          </div>
        </div>

        {/* Right Column - Main Info */}
        <div className="md:col-span-2">
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="flex items-center gap-1">
                  First Name
                </Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 font-medium">{profile.firstName}</div>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="flex items-center gap-1">
                  Last Name
                </Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 font-medium">{profile.lastName}</div>
                )}
              </div>
            </div>

            {/* Birthdate and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthdate" className="flex items-center gap-1">
                  Birthdate
                  {!isEditing && profile.birthdate && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({calculateAge(profile.birthdate)} years old)
                    </span>
                  )}
                </Label>
                {isEditing ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {profile.birthdate ? (
                          format(profile.birthdate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={profile.birthdate}
                        onSelect={(date) =>
                          setProfile((prev) => ({ ...prev, birthdate: date }))
                        }
                        disabled={(date) =>
                          date > new Date() ||
                          date >
                            new Date(
                              new Date().setFullYear(
                                new Date().getFullYear() - 16,
                              ),
                            )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="mt-1">
                    {profile.birthdate
                      ? format(profile.birthdate, "PPP")
                      : "Not specified"}
                  </div>
                )}
              </div>
              <div>
                <Label
                  htmlFor="phoneNumber"
                  className="flex items-center gap-1"
                >
                  Phone Number
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          We use this to pay you via TWINT and share it with
                          students after a match
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                {isEditing ? (
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      <Phone className="h-4 w-4" />
                    </span>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                    />
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{profile.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* About Me */}
            <div>
              <Label htmlFor="aboutMe" className="flex items-center gap-1">
                About Me
              </Label>
              {isEditing ? (
                <Textarea
                  id="aboutMe"
                  name="aboutMe"
                  value={profile.aboutMe}
                  onChange={handleInputChange}
                  placeholder="Tell students about yourself..."
                  className="mt-1"
                  rows={4}
                />
              ) : (
                <div className="mt-1">
                  {profile.aboutMe || (
                    <span className="text-gray-500 italic">
                      No information provided
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Motivation */}
            <div>
              <Label htmlFor="motivation" className="flex items-center gap-1">
                I'm on helpii because...
              </Label>
              {isEditing ? (
                <Textarea
                  id="motivation"
                  name="motivation"
                  value={profile.motivation}
                  onChange={handleInputChange}
                  placeholder="Share your motivation for tutoring..."
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <div className="mt-1">
                  {profile.motivation || (
                    <span className="text-gray-500 italic">
                      No information provided
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Subjects */}
            <div>
              <Label className="flex items-center gap-1">I help with</Label>
              <div className="mt-2">
                {isEditing ? (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {profile.subjects.map((subject) => (
                        <Badge
                          key={subject}
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          {subject}
                          <X
                            className="h-3 w-3 cursor-pointer ml-1"
                            onClick={() => handleRemoveSubject(subject)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="new-subject"
                        placeholder="Add a subject..."
                        className="flex-1"
                      />
                      <Button
                        onClick={() => {
                          const input = document.getElementById(
                            "new-subject",
                          ) as HTMLInputElement;
                          handleAddSubject(input.value);
                          input.value = "";
                        }}
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.subjects.length > 0 ? (
                      profile.subjects.map((subject) => (
                        <Badge key={subject} className="px-3 py-1">
                          {subject}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">
                        No subjects specified
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="flex items-center gap-1">
                  Where I help
                </Label>
                {isEditing ? (
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <Input
                      id="location"
                      name="location"
                      value={profile.location}
                      onChange={handleInputChange}
                      placeholder="City or area"
                      className="rounded-l-none"
                    />
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>
                      {profile.location ? (
                        <>
                          {profile.location} ({profile.radius}km radius)
                        </>
                      ) : (
                        <span className="text-gray-500 italic">
                          No location specified
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
              {isEditing && (
                <div>
                  <Label htmlFor="radius" className="flex items-center gap-1">
                    Radius (km)
                  </Label>
                  <Input
                    id="radius"
                    name="radius"
                    type="number"
                    min="1"
                    max="50"
                    value={profile.radius}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        radius: parseInt(e.target.value) || 5,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {/* Languages */}
            <div>
              <Label className="flex items-center gap-1">
                <Globe className="h-4 w-4 mr-1" />
                Languages I speak
              </Label>
              <div className="mt-2">
                {isEditing ? (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {profile.languages.map((language) => (
                        <Badge
                          key={language}
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          {language}
                          <X
                            className="h-3 w-3 cursor-pointer ml-1"
                            onClick={() => handleRemoveLanguage(language)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="new-language"
                        placeholder="Add a language..."
                        className="flex-1"
                      />
                      <Button
                        onClick={() => {
                          const input = document.getElementById(
                            "new-language",
                          ) as HTMLInputElement;
                          handleAddLanguage(input.value);
                          input.value = "";
                        }}
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.length > 0 ? (
                      profile.languages.map((language) => (
                        <Badge key={language} className="px-3 py-1">
                          {language}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">
                        No languages specified
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Why Choose Me */}
            <div>
              <Label htmlFor="whyChooseMe" className="flex items-center gap-1">
                Why should someone choose me
              </Label>
              {isEditing ? (
                <Textarea
                  id="whyChooseMe"
                  name="whyChooseMe"
                  value={profile.whyChooseMe}
                  onChange={handleInputChange}
                  placeholder="What makes you stand out as a tutor?"
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <div className="mt-1">
                  {profile.whyChooseMe || (
                    <span className="text-gray-500 italic">
                      No information provided
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div>
              <Label htmlFor="video" className="flex items-center gap-1">
                Introduction Video (Optional)
              </Label>
              <div className="mt-2">
                {isEditing ? (
                  <div>
                    {profile.videoUrl ? (
                      <div className="relative">
                        <video
                          src={profile.videoUrl}
                          controls
                          className="w-full max-h-60 rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            setProfile((prev) => ({ ...prev, videoUrl: "" }))
                          }
                        >
                          <X className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                          Upload a short video (30-60 seconds) introducing
                          yourself
                        </p>
                        <p className="text-xs text-gray-400 mb-4">
                          More info = more matches!
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            // In a real app, this would open a file picker
                            // For demo purposes, we'll just set a sample video URL
                            setProfile((prev) => ({
                              ...prev,
                              videoUrl: "https://example.com/sample-video.mp4",
                            }));
                          }}
                        >
                          Select Video
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {profile.videoUrl ? (
                      <video
                        src={profile.videoUrl}
                        controls
                        className="w-full max-h-60 rounded-md"
                      />
                    ) : (
                      <span className="text-gray-500 italic">
                        No video uploaded
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default TutorProfile;

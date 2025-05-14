import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileLayout from "./ProfileLayout";
import { Input } from "@/components/ui/input";
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
  Globe,
  Mail,
  Phone,
} from "lucide-react";

interface StudentProfileProps {
  activeRole: "tutor" | "student";
  onTabChange: (tab: string) => void;
}

interface StudentData {
  profilePicture: string;
  firstName: string;
  lastName: string;
  birthdate: Date | undefined;
  email: string;
  phoneNumber: string;
  languages: string[];
  joinDate: string;
  rating: {
    friendliness: number;
    fairness: number;
  };
}

const StudentProfile = ({ activeRole, onTabChange }: StudentProfileProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(40);

  const [profile, setProfile] = useState<StudentData>({
    profilePicture: "",
    firstName: "Alex",
    lastName: "Johnson",
    birthdate: new Date(2000, 5, 15),
    email: "alex.johnson@example.com",
    phoneNumber: "+41 79 987 65 43",
    languages: ["English", "French"],
    joinDate: "September 2023",
    rating: {
      friendliness: 4.7,
      fairness: 4.9,
    },
  });

  // Calculate completion percentage based on filled fields
  useEffect(() => {
    const requiredFields = [
      !!profile.profilePicture,
      !!profile.firstName,
      !!profile.lastName,
      !!profile.birthdate,
      !!profile.email,
      !!profile.phoneNumber,
      profile.languages.length > 0,
    ];

    const completedFields = requiredFields.filter(Boolean).length;
    const newPercentage = (completedFields / requiredFields.length) * 100;
    setCompletionPercentage(newPercentage);

    // If profile is more than 80% complete, consider it not first time
    if (newPercentage > 80) {
      setIsFirstTime(false);
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          className="h-1.5 rounded-full bg-yellow-400"
          style={{ width: `${(rating / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <ProfileLayout
      title="Student Profile"
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

            {/* Rating Summary */}
            <div className="w-full mb-6">
              <h3 className="font-medium mb-3 text-sm text-center">
                Your Rating
              </h3>
              {renderRatingBar(profile.rating.friendliness, "Friendliness")}
              {renderRatingBar(profile.rating.fairness, "Fairness")}
              <div className="flex items-center justify-center gap-1 mt-3">
                <Star className="h-5 w-5 fill-yellow-400 text-amber-500" />
                <span className="font-bold text-lg">
                  {(
                    (profile.rating.friendliness + profile.rating.fairness) /
                    2
                  ).toFixed(1)}
                </span>
              </div>
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

            {/* Birthdate */}
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

            {/* Contact Information */}
            <div>
              <h3 className="font-medium mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-1">
                    Email
                  </Label>
                  {isEditing ? (
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <Mail className="h-4 w-4" />
                      </span>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                      />
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="phoneNumber"
                    className="flex items-center gap-1"
                  >
                    Phone Number
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

            {/* Privacy Notice */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-8">
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                Privacy Information
              </h4>
              <p className="text-xs text-blue-700">
                Your contact information will only be shared with tutors after
                you accept their help offer and complete payment. Your birthdate
                is used for age verification and will not be shared with tutors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default StudentProfile;

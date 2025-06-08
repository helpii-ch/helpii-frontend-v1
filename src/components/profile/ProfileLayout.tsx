import React from "react";
import { ArrowLeft, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfileLayoutProps {
  children: React.ReactNode;
  title: string;
  isEditing: boolean;
  onBack?: () => void;
  onToggleEdit: () => void;
  onSave?: () => void;
  completionPercentage?: number;
  isFirstTime?: boolean;
  role?: "student" | "tutor";
}

export const ProfileLayout = ({
  children,
  title,
  isEditing,
  onBack,
  onToggleEdit,
  onSave,
  completionPercentage = 100,
  isFirstTime = false,
  role = "tutor",
}: ProfileLayoutProps) => {
  const navigate = useNavigate();

  // Use CSS variable names for cleaner theme handling
  const primaryColorVar =
    role === "student" ? "var(--student-primary)" : "var(--tutor-primary)";

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>

      {isFirstTime && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Complete your profile</h3>
            <span className="text-sm text-gray-500">
              {Math.round(completionPercentage)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full"
              style={{
                width: `${completionPercentage}%`,
                backgroundColor: primaryColorVar,
              }}
            ></div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-end mb-4">
          {isEditing ? (
            <Button onClick={onSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button
              onClick={onToggleEdit}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;

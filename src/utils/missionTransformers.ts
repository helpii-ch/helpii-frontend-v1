import {
  HelperMissionResponse,
  NeederMissionResponse,
  StudentMissionCardProps,
} from "@/types/api";

/**
 * Transform HelperMissionResponse from API to format expected by MissionCard component
 */
export const transformMissionForCard = (mission: HelperMissionResponse) => {
  return {
    id: mission.id,
    subject: mission.subject,
    description: mission.description,
    imageUrl:
      mission.imageUrl ||
      `https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80`,
    neederName: mission.neederName,
    neederImage: mission.neederImage,
    neederRating: mission.neederRating,
    price: mission.price,
    date: new Date(mission.date),
    time: mission.time,
    location: mission.location,
    tags: mission.tags || [],
    isMatched: mission.status === "matched",
    needer: mission.needer,
  };
};

/**
 * Transform array of missions for use in components
 */
export const transformMissionsForCards = (
  missions: HelperMissionResponse[],
) => {
  return missions.map(transformMissionForCard);
};

/**
 * Get mission status display text
 */
export const getMissionStatusText = (
  status: HelperMissionResponse["status"],
) => {
  const statusMap = {
    pending: "Available",
    applied: "Applied",
    matched: "Matched",
    completed: "Completed",
    rejected: "Rejected",
  };

  return statusMap[status] || status;
};

/**
 * Check if mission is available for application
 */
export const canApplyToMission = (mission: HelperMissionResponse) => {
  return mission.status === "pending";
};

/**
 * Format price for display
 */
export const formatMissionPrice = (price: string | number) => {
  if (typeof price === "number") {
    return `${price}/hr`;
  }
  return price;
};

// Needer mission transformers

/**
 * Transform NeederMissionResponse from API to format expected by needer MissionCard component
 */
export const transformNeederMissionForCard = (
  mission: NeederMissionResponse,
) => {
  return {
    id: mission.id,
    subject: mission.subject,
    description: mission.description,
    imageUrl:
      mission.imageUrl ||
      `https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80`,
    price: mission.price,
    date: new Date(mission.date),
    time: mission.time,
    location: mission.location,
    status: mission.status,
    tags: mission.tags || [],
    applicants: mission.applicants || [],
    matchedHelper: mission.matchedHelper,
    createdAt: mission.createdAt,
    updatedAt: mission.updatedAt,
  };
};

/**
 * Transform array of needer missions for use in components
 */
export const transformNeederMissionsForCards = (
  missions: NeederMissionResponse[],
) => {
  return missions.map(transformNeederMissionForCard);
};

/**
 * Transform NeederMissionResponse to StudentMissionCardProps for MissionCard component
 */
export const transformNeederMissionToStudentCard = (
  mission: NeederMissionResponse,
  options?: {
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onClick?: () => void;
    isHighlighted?: boolean;
  },
): StudentMissionCardProps => {
  return {
    id: mission.id,
    subject: mission.subject,
    description: mission.description,
    imageUrl:
      mission.imageUrl ||
      `https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80`,
    price: `CHF ${mission.price}/hr`,
    date: new Date(mission.date).toLocaleDateString(),
    time: mission.time,
    location: mission.location,
    status: mission.status,
    tags: mission.tags || [],
    userRole: "needer" as const,
    onEdit: options?.onEdit,
    onDelete: options?.onDelete,
    onClick: options?.onClick,
    applicantCount: mission.applicants?.length || 0,
    matchedHelper: mission.matchedHelper,
    isHighlighted: options?.isHighlighted || false,
  };
};

/**
 * Transform array of needer missions to StudentMissionCardProps for MissionCard components
 */
export const transformNeederMissionsToStudentCards = (
  missions: NeederMissionResponse[],
  options?: {
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onClick?: (mission: NeederMissionResponse) => void;
    highlightedMissionId?: string;
  },
): StudentMissionCardProps[] => {
  return missions.map((mission) =>
    transformNeederMissionToStudentCard(mission, {
      onEdit: options?.onEdit,
      onDelete: options?.onDelete,
      onClick: options?.onClick ? () => options.onClick!(mission) : undefined,
      isHighlighted: options?.highlightedMissionId === mission.id,
    }),
  );
};

/**
 * Get needer mission status display text
 */
export const getNeederMissionStatusText = (
  status: NeederMissionResponse["status"],
) => {
  const statusMap = {
    pending: "Pending",
    applied: "Applied",
    matched: "Matched",
    completed: "Completed",
    rejected: "Rejected",
  };

  return statusMap[status] || status;
};

/**
 * Check if needer mission can be edited
 */
export const canEditNeederMission = (mission: NeederMissionResponse) => {
  return mission.status === "pending" || mission.status === "applied";
};

/**
 * Check if needer mission can be deleted
 */
export const canDeleteNeederMission = (mission: NeederMissionResponse) => {
  return mission.status === "pending";
};

/**
 * Format price for needer mission display
 */
export const formatNeederMissionPrice = (mission: NeederMissionResponse) => {
  return `${mission.price}/hr`;
};

/**
 * Get status color classes for needer missions
 */
export const getNeederMissionStatusClasses = (
  status: NeederMissionResponse["status"],
) => {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    applied: "bg-purple-100 text-purple-800",
    matched: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

/**
 * Get status badge text for student mission cards
 */
export const getStudentMissionStatusBadgeText = (
  status: StudentMissionCardProps["status"],
  applicantCount?: number,
) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "applied":
      return applicantCount && applicantCount > 0
        ? `${applicantCount} Helper${applicantCount > 1 ? "s" : ""} Applied`
        : "Applied";
    case "matched":
      return "Matched";
    case "completed":
      return "Completed";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
};

/**
 * Get status color classes for student mission cards
 */
export const getStudentMissionStatusClasses = (
  status: StudentMissionCardProps["status"],
) => {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    applied: "bg-purple-100 text-purple-800",
    matched: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

// Base API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Paginated response structure
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Mission related types
export interface MissionResponse {
  id: string;
  title: string;
  description: string;
  subject: string;
  neederId: string;
  neederName: string;
  price: number;
  status: "pending" | "applied" | "matched" | "completed" | "rejected";
  createdAt: string;
  updatedAt: string;
  scheduledTime?: string;
  location?: string;
}

// Enhanced Mission interface for helper feed
export interface HelperMissionResponse {
  id: string;
  subject: string;
  description: string;
  imageUrl?: string;
  neederName: string;
  neederImage: string;
  neederRating: number;
  price: string;
  date: string;
  time: string;
  location: string;
  status: "pending" | "applied" | "matched" | "completed" | "rejected";
  tags?: string[];
  needer: {
    id: string;
    name: string;
    image: string;
    rating: number;
    age: number;
    languages: string[];
    location: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Enhanced Mission interface for needer view
export interface NeederMissionResponse {
  id: string;
  subject: string;
  description: string;
  imageUrl?: string;
  price: number;
  date: string;
  time: string;
  location: string;
  status: "pending" | "applied" | "matched" | "completed" | "rejected";
  tags?: string[];
  neederId: string;
  createdAt: string;
  updatedAt: string;
  applicants?: {
    id: string;
    helperId: string;
    helperName: string;
    helperImage: string;
    helperRating: number;
    message?: string;
    appliedAt: string;
  }[];
  matchedHelper?: {
    id: string;
    name: string;
    image: string;
    rating: number;
    contactInfo?: string;
  };
}

// Student Mission Card Props - specific interface for MissionCard when displaying student-created missions
export interface StudentMissionCardProps {
  id: string;
  subject: string;
  description: string;
  imageUrl?: string;
  price: string;
  date: string;
  time: string;
  location: string;
  status: "pending" | "applied" | "matched" | "completed" | "rejected";
  tags?: string[];
  userRole: "needer";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  applicantCount?: number;
  matchedHelper?: {
    id: string;
    name: string;
    image: string;
    rating: number;
    contactInfo?: string;
  };
  isHighlighted?: boolean;
}

// Request to apply for a mission (helper helping)
export interface ApplyToMissionRequest {
  missionId: string;
  helperId: string;
  message?: string;
}

// Response when helper applies to help
export interface ApplyToMissionResponse {
  success: boolean;
  applicationId: string;
  message: string;
}

// User related types
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: "needer" | "helper";
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

// Helper specific response
export interface HelperResponse extends UserResponse {
  subjects: string[];
  hourlyRate: number;
  rating: number;
  totalSessions: number;
  bio?: string;
  availability?: string[];
}

// Needer specific response
export interface NeederResponse extends UserResponse {
  grade?: string;
  school?: string;
}

// Authentication responses
export interface LoginResponse {
  user: UserResponse;
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: UserResponse;
  message: string;
}

// Error response structure
export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}

// Request types
export interface CreateMissionRequest {
  title: string;
  description: string;
  subject: string;
  price: number;
  scheduledTime?: string;
  location?: string;
}

export interface UpdateMissionRequest extends Partial<CreateMissionRequest> {
  status?: MissionResponse["status"];
}

// Needer mission management requests
export interface AcceptHelperRequest {
  missionId: string;
  helperId: string;
  neederId: string;
}

export interface RejectHelperRequest {
  missionId: string;
  helperId: string;
  neederId: string;
}

export interface CompleteMissionRequest {
  missionId: string;
  userId: string;
  role: "needer" | "helper";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "needer" | "helper";
}

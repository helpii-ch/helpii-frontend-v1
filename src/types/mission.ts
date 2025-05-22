/**
 * Mission interface representing a tutoring mission
 */

export interface Mission {
  id: string;
  subject: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  isMatched?: boolean;
  studentName: string;
  studentImage: string;
  studentRating: number;
  price: string;
  date: Date;
  time: string;
  location: string;
  status?:
    | "pending"
    | "matched"
    | "completed"
    | "new_match"
    | "applied"
    | "student_completed"
    | "tutor_completed";
  student: {
    name: string;
    image: string;
    rating: number;
    age: number;
    languages: string[];
    location: string;
  };
}

/**
 * Paged response interface for API responses that return paginated data
 */
export interface PagedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

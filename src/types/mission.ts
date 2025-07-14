/**
 * Mission interface representing a tutoring mission
 */

import type { MissionStatus } from "./helpMissionResponseDto";

export interface Mission {
  id: string;
  subject: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  isMatched?: boolean;
  neederName?: string;
  neederImage?: string;
  neederRating?: number;
  price: string;
  helperPrice: string;
  date: Date;
  time: string;
  location: string;
  status?: string;
  needer: {
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

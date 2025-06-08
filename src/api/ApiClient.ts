/**
 * ApiClient for handling HTTP requests
 * Uses environment variables for base URL configuration
 */
import { Mission, PagedResponse } from "../types/mission";
import {
  ApiResponse,
  PaginatedResponse,
  HelperMissionResponse,
  NeederMissionResponse,
  ApplyToMissionRequest,
  ApplyToMissionResponse,
  CreateMissionRequest,
  UpdateMissionRequest,
  AcceptHelperRequest,
  RejectHelperRequest,
  CompleteMissionRequest,
} from "../types/api";

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
};

class ApiClient {
  private baseUrl: string;

  constructor() {
    // Use the appropriate URL based on the environment
    this.baseUrl =
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_API_URL_PRODUCTION
        : import.meta.env.VITE_API_URL_DEVELOPMENT;
  }

  // Helper method to build URL with query parameters
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  // GET request
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }

  // POST request
  async post<T>(
    endpoint: string,
    data: any,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data: any,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }

  // DELETE request
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }

  // Fetch help missions with optional pagination parameters
  async getHelpMissions(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PagedResponse<Mission>> {
    return this.get<PagedResponse<Mission>>("/help-missions", {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }

  // Fetch missions for helper feed
  async getHelperMissions(
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      subject?: string;
      location?: string;
      priceMin?: number;
      priceMax?: number;
      status?: string;
    },
  ): Promise<ApiResponse<PaginatedResponse<HelperMissionResponse>>> {
    const params: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params[key] = value.toString();
        }
      });
    }

    return this.get<ApiResponse<PaginatedResponse<HelperMissionResponse>>>(
      "/helper/missions",
      {
        params,
      },
    );
  }

  // Apply to help with a mission
  async applyToMission(
    data: ApplyToMissionRequest,
  ): Promise<ApiResponse<ApplyToMissionResponse>> {
    return this.post<ApiResponse<ApplyToMissionResponse>>(
      "/helper/apply",
      data,
    );
  }

  // Get helper's applied missions
  async getHelperAppliedMissions(
    helperId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<HelperMissionResponse>>> {
    return this.get<ApiResponse<PaginatedResponse<HelperMissionResponse>>>(
      `/helper/${helperId}/applied-missions`,
      {
        params: {
          page: page.toString(),
          pageSize: pageSize.toString(),
        },
      },
    );
  }

  // Get helper's matched missions
  async getHelperMatchedMissions(
    helperId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<HelperMissionResponse>>> {
    return this.get<ApiResponse<PaginatedResponse<HelperMissionResponse>>>(
      `/helper/${helperId}/matched-missions`,
      {
        params: {
          page: page.toString(),
          pageSize: pageSize.toString(),
        },
      },
    );
  }

  // Needer mission management methods

  // Get needer's missions
  async getNeederMissions(
    neederId: string,
    page: number = 1,
    pageSize: number = 10,
    status?: string,
  ): Promise<ApiResponse<PaginatedResponse<NeederMissionResponse>>> {
    const params: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    if (status) {
      params.status = status;
    }

    return this.get<ApiResponse<PaginatedResponse<NeederMissionResponse>>>(
      `/needer/${neederId}/missions`,
      {
        params,
      },
    );
  }

  // Create a new mission
  async createMission(
    data: CreateMissionRequest,
  ): Promise<ApiResponse<NeederMissionResponse>> {
    return this.post<ApiResponse<NeederMissionResponse>>(
      "/needer/missions",
      data,
    );
  }

  // Update a mission
  async updateMission(
    missionId: string,
    data: UpdateMissionRequest,
  ): Promise<ApiResponse<NeederMissionResponse>> {
    return this.put<ApiResponse<NeederMissionResponse>>(
      `/needer/missions/${missionId}`,
      data,
    );
  }

  // Delete a mission
  async deleteMission(
    missionId: string,
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.delete<ApiResponse<{ success: boolean }>>(
      `/needer/missions/${missionId}`,
    );
  }

  // Accept a helper's application
  async acceptHelper(
    data: AcceptHelperRequest,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.post<ApiResponse<{ success: boolean; message: string }>>(
      "/needer/accept-helper",
      data,
    );
  }

  // Reject a helper's application
  async rejectHelper(
    data: RejectHelperRequest,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.post<ApiResponse<{ success: boolean; message: string }>>(
      "/needer/reject-helper",
      data,
    );
  }

  // Mark mission as completed
  async completeMission(
    data: CompleteMissionRequest,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.post<ApiResponse<{ success: boolean; message: string }>>(
      "/missions/complete",
      data,
    );
  }

  // Get mission applicants (for needers to see who applied)
  async getMissionApplicants(
    missionId: string,
  ): Promise<ApiResponse<NeederMissionResponse["applicants"]>> {
    return this.get<ApiResponse<NeederMissionResponse["applicants"]>>(
      `/needer/missions/${missionId}/applicants`,
    );
  }
}

// Export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Also export the class for testing or custom instances
export { ApiClient };

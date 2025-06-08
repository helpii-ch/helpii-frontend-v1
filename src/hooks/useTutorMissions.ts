import { useState, useEffect } from "react";
import apiClient from "@/api";
import {
  HelperMissionResponse,
  ApiResponse,
  PaginatedResponse,
} from "@/types/api";

interface UseHelperMissionsOptions {
  page?: number;
  pageSize?: number;
  filters?: {
    subject?: string;
    location?: string;
    priceMin?: number;
    priceMax?: number;
    status?: string;
  };
  autoFetch?: boolean;
}

interface UseHelperMissionsReturn {
  missions: HelperMissionResponse[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  refetch: () => Promise<void>;
  applyToMission: (
    missionId: string,
    helperId: string,
    message?: string,
  ) => Promise<boolean>;
}

export const useHelperMissions = ({
  page = 1,
  pageSize = 10,
  filters,
  autoFetch = true,
}: UseHelperMissionsOptions = {}): UseHelperMissionsReturn => {
  const [missions, setMissions] = useState<HelperMissionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getHelperMissions(
        currentPage,
        pageSize,
        filters,
      );

      if (response.success) {
        setMissions(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError(response.error || "Failed to fetch missions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const applyToMission = async (
    missionId: string,
    helperId: string,
    message?: string,
  ): Promise<boolean> => {
    try {
      const response = await apiClient.applyToMission({
        missionId,
        helperId,
        message,
      });

      if (response.success) {
        // Refresh missions to update status
        await fetchMissions();
        return true;
      } else {
        setError(response.error || "Failed to apply to mission");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to apply to mission",
      );
      return false;
    }
  };

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  useEffect(() => {
    if (autoFetch) {
      fetchMissions();
    }
  }, [currentPage, pageSize, filters, autoFetch]);

  return {
    missions,
    loading,
    error,
    totalPages,
    currentPage,
    refetch: fetchMissions,
    applyToMission,
  };
};

export default useHelperMissions;

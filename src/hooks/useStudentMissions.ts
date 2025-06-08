import { useState, useEffect, useCallback } from "react";
import apiClient from "@/api/ApiClient";
import {
  NeederMissionResponse,
  CreateMissionRequest,
  UpdateMissionRequest,
  AcceptHelperRequest,
  RejectHelperRequest,
  CompleteMissionRequest,
  StudentMissionCardProps,
} from "@/types/api";
import {
  transformNeederMissionsForCards,
  transformNeederMissionsToStudentCards,
} from "@/utils/missionTransformers";

interface UseNeederMissionsOptions {
  neederId: string;
  status?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseNeederMissionsReturn {
  missions: ReturnType<typeof transformNeederMissionsForCards>;
  studentMissionCards: StudentMissionCardProps[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null;
  // Actions
  fetchMissions: (page?: number, pageSize?: number) => Promise<void>;
  createMission: (
    data: CreateMissionRequest,
  ) => Promise<NeederMissionResponse | null>;
  updateMission: (
    missionId: string,
    data: UpdateMissionRequest,
  ) => Promise<NeederMissionResponse | null>;
  deleteMission: (missionId: string) => Promise<boolean>;
  acceptHelper: (missionId: string, helperId: string) => Promise<boolean>;
  rejectHelper: (missionId: string, helperId: string) => Promise<boolean>;
  completeMission: (missionId: string) => Promise<boolean>;
  refreshMissions: () => Promise<void>;
  // Student card specific actions
  setHighlightedMission: (missionId: string | null) => void;
  highlightedMissionId: string | null;
}

export const useNeederMissions = ({
  neederId,
  status,
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}: UseNeederMissionsOptions): UseNeederMissionsReturn => {
  const [missions, setMissions] = useState<
    ReturnType<typeof transformNeederMissionsForCards>
  >([]);
  const [rawMissions, setRawMissions] = useState<NeederMissionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightedMissionId, setHighlightedMission] = useState<string | null>(
    null,
  );
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const fetchMissions = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.getNeederMissions(
          neederId,
          page,
          pageSize,
          status,
        );

        if (response.success) {
          const transformedMissions = transformNeederMissionsForCards(
            response.data.data,
          );
          setMissions(transformedMissions);
          setRawMissions(response.data.data);
          setPagination(response.data.pagination);
        } else {
          setError(response.error || "Failed to fetch missions");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [neederId, status],
  );

  const createMission = useCallback(
    async (
      data: CreateMissionRequest,
    ): Promise<NeederMissionResponse | null> => {
      try {
        setError(null);
        const response = await apiClient.createMission(data);

        if (response.success) {
          // Refresh missions to include the new one
          await fetchMissions();
          // Highlight the newly created mission
          setHighlightedMission(response.data.id);
          // Remove highlight after 3 seconds
          setTimeout(() => setHighlightedMission(null), 3000);
          return response.data;
        } else {
          setError(response.error || "Failed to create mission");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      }
    },
    [fetchMissions],
  );

  const updateMission = useCallback(
    async (
      missionId: string,
      data: UpdateMissionRequest,
    ): Promise<NeederMissionResponse | null> => {
      try {
        setError(null);
        const response = await apiClient.updateMission(missionId, data);

        if (response.success) {
          // Update the mission in the local state
          setMissions((prev) =>
            prev.map((mission) =>
              mission.id === missionId
                ? {
                    ...mission,
                    ...data,
                    date: data.scheduledTime
                      ? new Date(data.scheduledTime)
                      : mission.date,
                  }
                : mission,
            ),
          );
          // Update raw missions as well
          setRawMissions((prev) =>
            prev.map((mission) =>
              mission.id === missionId ? { ...mission, ...data } : mission,
            ),
          );
          return response.data;
        } else {
          setError(response.error || "Failed to update mission");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      }
    },
    [],
  );

  const deleteMission = useCallback(
    async (missionId: string): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiClient.deleteMission(missionId);

        if (response.success) {
          // Remove the mission from local state
          setMissions((prev) =>
            prev.filter((mission) => mission.id !== missionId),
          );
          setRawMissions((prev) =>
            prev.filter((mission) => mission.id !== missionId),
          );
          return true;
        } else {
          setError(response.error || "Failed to delete mission");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      }
    },
    [],
  );

  const acceptHelper = useCallback(
    async (missionId: string, helperId: string): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiClient.acceptHelper({
          missionId,
          helperId,
          neederId,
        });

        if (response.success) {
          // Refresh missions to get updated status
          await fetchMissions();
          return true;
        } else {
          setError(response.error || "Failed to accept helper");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      }
    },
    [neederId, fetchMissions],
  );

  const rejectHelper = useCallback(
    async (missionId: string, helperId: string): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiClient.rejectHelper({
          missionId,
          helperId,
          neederId,
        });

        if (response.success) {
          // Refresh missions to get updated applicants
          await fetchMissions();
          return true;
        } else {
          setError(response.error || "Failed to reject helper");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      }
    },
    [neederId, fetchMissions],
  );

  const completeMission = useCallback(
    async (missionId: string): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiClient.completeMission({
          missionId,
          userId: neederId,
          role: "needer",
        });

        if (response.success) {
          // Update mission status in local state
          setMissions((prev) =>
            prev.map((mission) =>
              mission.id === missionId
                ? { ...mission, status: "completed" as const }
                : mission,
            ),
          );
          setRawMissions((prev) =>
            prev.map((mission) =>
              mission.id === missionId
                ? { ...mission, status: "completed" as const }
                : mission,
            ),
          );
          return true;
        } else {
          setError(response.error || "Failed to complete mission");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      }
    },
    [neederId],
  );

  const refreshMissions = useCallback(() => {
    return fetchMissions(pagination?.page || 1, pagination?.pageSize || 10);
  }, [fetchMissions, pagination]);

  // Transform raw missions to student mission cards
  const studentMissionCards = transformNeederMissionsToStudentCards(
    rawMissions,
    {
      onEdit: (id: string) => {
        // This would typically open an edit modal or navigate to edit page
        console.log("Edit mission:", id);
      },
      onDelete: deleteMission,
      onClick: (mission: NeederMissionResponse) => {
        // This would typically open a mission detail modal
        console.log("View mission details:", mission);
      },
      highlightedMissionId,
    },
  );

  // Initial fetch
  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshMissions();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshMissions]);

  return {
    missions,
    studentMissionCards,
    loading,
    error,
    pagination,
    fetchMissions,
    createMission,
    updateMission,
    deleteMission,
    acceptHelper,
    rejectHelper,
    completeMission,
    refreshMissions,
    setHighlightedMission,
    highlightedMissionId,
  };
};

export default useNeederMissions;

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import httpClient from "@/lib/HttpClient";
import { ApiResponse, MissionResponse, PaginatedResponse } from "@/types/api";

interface MissionListProps {
  userRole?: "needer" | "helper";
  status?: string;
}

export default function MissionList({
  userRole = "needer",
  status,
}: MissionListProps) {
  const [missions, setMissions] = useState<MissionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMissions = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: "10",
        ...(status && { status }),
        ...(userRole && { role: userRole }),
      });

      const response = await httpClient.get<
        ApiResponse<PaginatedResponse<MissionResponse>>
      >(`/missions?${queryParams.toString()}`);

      if (response.success) {
        setMissions(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setPage(pageNum);
      } else {
        setError(response.error || "Failed to fetch missions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleMissionAction = async (
    missionId: string,
    action: "apply" | "accept" | "reject",
  ) => {
    try {
      const response = await httpClient.post<ApiResponse<MissionResponse>>(
        `/missions/${missionId}/${action}`,
        {},
      );

      if (response.success) {
        // Refresh the missions list
        fetchMissions(page);
      } else {
        setError(response.error || `Failed to ${action} mission`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [userRole, status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "matched":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading missions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
        <Button
          onClick={() => fetchMissions(page)}
          variant="outline"
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Missions</h2>
        <Button onClick={() => fetchMissions(page)} variant="outline">
          Refresh
        </Button>
      </div>

      {missions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No missions found.</div>
      ) : (
        <>
          <div className="grid gap-4">
            {missions.map((mission) => (
              <Card
                key={mission.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{mission.title}</CardTitle>
                      <CardDescription>
                        {mission.subject} • {mission.neederName}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(mission.status)}>
                      {mission.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{mission.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p>Price: CHF {mission.price}</p>
                      {mission.scheduledTime && (
                        <p>
                          Scheduled:{" "}
                          {new Date(mission.scheduledTime).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="space-x-2">
                      {userRole === "helper" &&
                        mission.status === "pending" && (
                          <Button
                            onClick={() =>
                              handleMissionAction(mission.id, "apply")
                            }
                            size="sm"
                          >
                            Apply
                          </Button>
                        )}
                      {userRole === "needer" &&
                        mission.status === "applied" && (
                          <>
                            <Button
                              onClick={() =>
                                handleMissionAction(mission.id, "accept")
                              }
                              size="sm"
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() =>
                                handleMissionAction(mission.id, "reject")
                              }
                              variant="outline"
                              size="sm"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              <Button
                onClick={() => fetchMissions(page - 1)}
                disabled={page <= 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() => fetchMissions(page + 1)}
                disabled={page >= totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

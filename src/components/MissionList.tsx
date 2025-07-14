// src/components/MissionsList.tsx
import { useEffect } from 'react';
import { useMissions } from '../hooks/useMissions';
import { HelpMission } from '../generated/api';

export function MissionsList() {
  const { data, loading, error, fetchMissions } = useMissions();

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
      <div>
        {data?.content?.map((mission: HelpMission) => (
            <div key={mission.id}>
              {/* Render mission data */}
              <h3>{mission.title}</h3>
            </div>
        ))}
      </div>
  );
}
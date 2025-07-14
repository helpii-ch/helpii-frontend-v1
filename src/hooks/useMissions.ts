import { useCallback, useState } from 'react';
import { services } from '@/api/services';
import { Page, HelpMission } from '@/generated/api';

export function useMissions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<Page | null>(null);

    const fetchMissions = useCallback(async (page = 0, size = 10) => {
        try {
            setLoading(true);
            const response = await services.missions.getMissions(page, size);
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch missions'));
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchMissions };
}
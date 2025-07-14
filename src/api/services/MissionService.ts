import {CreateHelpMissionDto, DefaultApi} from '../../generated/api';
import { httpClient } from '../../lib/HttpClient';
import { createApiConfig } from '../../lib/api-config';

export class MissionService {
    private api: DefaultApi;

    constructor() {
        this.api = new DefaultApi(createApiConfig(httpClient.baseUrl));
    }

    async getMissions(page = 0, size = 10) {
        return this.api.helpMissionsGet({offset: page, limit: size});
    }

    async createMission(missionData: CreateHelpMissionDto) {
        try {
            return this.api.helpMissionsPost({createHelpMissionDto: missionData});
        } catch (error) {
            console.error('Error creating mission: ', error);
            throw error;
        }
    }

    async getCreatedMissions() {
        try {
            return await this.api.usersMeCreatedHelpMissionsGet();
        } catch (error) {
            console.error('Error fetching data ', error);
            throw error;
        }
    }

    async getAppliedHelpMissions() {
        try {
            return await this.api.usersMeAppliedHelpMissionsGet();
        } catch (error) {
            console.error('Error fetching data ', error);
            throw error;
        }
    }
}

export const missionService = new MissionService();


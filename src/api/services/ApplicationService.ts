import {DefaultApi} from "@/generated/api";
import {createApiConfig} from "@/lib/api-config.ts";
import {httpClient} from "@/lib/HttpClient.ts";

export class ApplicationService {
    private api: DefaultApi;

    constructor() {
        this.api = new DefaultApi(createApiConfig(httpClient.baseUrl));
    }

    async getAllApplicationsForNeeder(page = 0, size = 20) {
        try {
            const response = await this.api.applicationsGet();
            return response.content || [];
        } catch (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
    }

    // New method to create help mission application
    async createHelpMissionApplication(missionId: number) {
        try {
            const response = await this.api.helpMissionsIdApplicationsPost({ id: missionId });
            return response;
        } catch (error) {
            console.error("Error creating help mission application:", error);
            throw error;
        }
    }
}

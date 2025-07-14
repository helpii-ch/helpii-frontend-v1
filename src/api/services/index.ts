import { missionService } from './MissionService';
import { httpClient } from '../../lib/HttpClient';

export class ApiServices {
    public readonly missions = missionService;
    public readonly config = httpClient.createConfiguration();

    // Add other services as needed
}

export const services = new ApiServices();
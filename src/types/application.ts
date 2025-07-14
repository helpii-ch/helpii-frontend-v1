export interface Application {
    id: number;
    helpMissionId: number;
    helperId: string;
    helperName: string;
    whyChooseMe: string;
    completedMissions: number;
    languages: string[];
    rating: number;
    category: string;
    appliedAt: Date;
    status: string;
}
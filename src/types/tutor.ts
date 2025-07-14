export interface TutorBase {
    id: string;
    name: string;
    avatar: string;
    rating?: number;
}

export interface TutorRatingDetails {
    friendliness: number;
    reliability: number;
    skills: number;
    efficiency: number;
}

export interface TutorReview {
    id: string;
    studentName: string;
    rating: number;
    comment: string;
    date?: string;
}

export interface TutorProfile extends TutorBase {
    slogan: string;
    isHelpHero: boolean;
    helpMissions: number;
    languages: string[];
    ratingDetails: TutorRatingDetails;
    subjects: string[];
    location: string;
    radius: number;
    whyChooseMe: string;
    videoUrl?: string;
    joinDate: string;
    missionsCompleted: number;
    reviews: TutorReview[];
}

export type Tutor = TutorBase;
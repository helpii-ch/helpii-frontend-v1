import { Student } from "./student";

export type MissionStatus = "open" | "applied" | "matched" | "rejected" | "completed";

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface HelpMissionContent {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    offeredPrice: number;
    student: Student;
    status: MissionStatus;
    startTime: string;
    endTime: string;
}

export interface HelpMissionResponseDto {
    content: HelpMissionContent[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    empty: boolean;
}
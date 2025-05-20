import {Student} from "@/types/student.ts";

export interface Mission {
    id: string;
    subject: string;
    description: string;
    imageUrl?: string;
    tags: string[];
    price: string;
    hourly?: boolean;
    startTime?: string;
    endTime?: string;
    date: Date;
    time: string;
    location: string;
    student: Student;
    matchedTutor?: Tutor;
}


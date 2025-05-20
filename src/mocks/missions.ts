import {Mission} from "@/types/mission.ts";

export const mockMissions: Mission[] = [
    {
        id: "1",
        subject: "Mathematics",
        description:
            "Need help with calculus and differential equations for upcoming exam.",
        imageUrl:
            "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
        tags: ["Calculus", "University", "Exam Prep"],
        price: "$25/hr",
        date: new Date(),
        time: "3:00 PM - 5:00 PM",
        location: "Online",
        student: {
            name: "Alex Johnson",
            image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
            rating: 4.8,
            age: 19,
            languages: ["English", "Spanish"],
            location: "New York, NY",
        },
    },
    {
        id: "2",
        subject: "Physics",
        description:
            "Looking for assistance with mechanics and thermodynamics concepts.",
        imageUrl:
            "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80",
        tags: ["Mechanics", "High School", "Weekly"],
        price: "$30/hr",
        date: new Date(Date.now() + 86400000), // Tomorrow
        time: "4:00 PM - 6:00 PM",
        location: "Local Library",
        student: {
            name: "Emma Wilson",
            image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
            rating: 4.5,
            age: 17,
            languages: ["English"],
            location: "Boston, MA",
        },
    },
    {
        id: "3",
        subject: "Computer Science",
        description: "Need help understanding data structures and algorithms.",
        imageUrl:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        tags: ["Programming", "University", "Project"],
        price: "$35/hr",
        date: new Date(Date.now() + 172800000), // Day after tomorrow
        time: "6:00 PM - 8:00 PM",
        location: "Online",
        student: {
            name: "Michael Chen",
            image:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
            rating: 4.9,
            age: 21,
            languages: ["English", "Mandarin"],
            location: "San Francisco, CA",
        },
    },
    {
        id: "4",
        subject: "English Literature",
        description: "Looking for help analyzing Shakespeare and writing essays.",
        imageUrl:
            "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80",
        tags: ["Literature", "High School", "Essay Writing"],
        price: "$28/hr",
        date: new Date(Date.now() + 259200000), // 3 days from now
        time: "5:00 PM - 6:30 PM",
        location: "Coffee Shop",
        student: {
            name: "Sophia Martinez",
            image:
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
            rating: 4.7,
            age: 18,
            languages: ["English", "Spanish"],
            location: "Miami, FL",
        },
    },
    {
        id: "5",
        subject: "Chemistry",
        description:
            "Need assistance with organic chemistry reactions and mechanisms.",
        imageUrl:
            "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&q=80",
        tags: ["Organic Chemistry", "University", "Lab Work"],
        price: "$32/hr",
        date: new Date(Date.now() + 345600000), // 4 days from now
        time: "2:00 PM - 4:00 PM",
        location: "University Lab",
        student: {
            name: "James Wilson",
            image:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80",
            rating: 4.6,
            age: 20,
            languages: ["English"],
            location: "Chicago, IL",
        },
    },
    {
        id: "6",
        subject: "History",
        description: "Looking for help with world history research project.",
        imageUrl:
            "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80",
        tags: ["World History", "Research", "High School"],
        price: "$27/hr",
        date: new Date(Date.now() + 432000000), // 5 days from now
        time: "4:30 PM - 6:30 PM",
        location: "Public Library",
        student: {
            name: "Olivia Brown",
            image:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
            rating: 4.4,
            age: 16,
            languages: ["English", "French"],
            location: "Seattle, WA",
        },
    },
]
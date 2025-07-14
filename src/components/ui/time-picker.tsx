"use client";

import * as React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
    label?: string;
    required?: boolean;
    error?: string;
}

export function TimePicker({ value, onChange, label, required = false, error }: TimePickerProps) {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];

    const formatTime = (hour: string, minute: string) => {
        return `${hour}:${minute}`;
    };

    const getCurrentSelection = () => {
        if (!value) return { hour: '', minute: '' };
        const [hour, minute] = value.split(':');
        return { hour, minute };
    };

    const { hour, minute } = getCurrentSelection();

    return (
        <div className="grid gap-2">
            {label && (
                <Label className={error ? "text-red-500" : ""}>
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
            )}
            <div className="flex gap-2">
                <Select
                    value={hour}
                    onValueChange={(newHour) => {
                        if (minute) {
                            onChange(formatTime(newHour, minute));
                        } else {
                            onChange(formatTime(newHour, '00'));
                        }
                    }}
                >
                    <SelectTrigger className={`w-[110px] ${error ? "border-red-500" : ""}`}>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <SelectValue placeholder="Hour" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {hours.map((h) => (
                                <SelectItem key={h} value={h}>
                                    {h}:00
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select
                    value={minute}
                    onValueChange={(newMinute) => {
                        if (hour) {
                            onChange(formatTime(hour, newMinute));
                        }
                    }}
                >
                    <SelectTrigger className={`w-[110px] ${error ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {minutes.map((m) => (
                                <SelectItem key={m} value={m}>
                                    {m}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
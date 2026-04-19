<<<<<<< HEAD
// 1. Export the Types/Interfaces
export interface WeeklyData {
  day: string;
  active: number;
}

export interface MonthlyData {
  month: string;
  active: number;
  sessions: number;
}

export interface StudentData {
  name: string;
  sessions: number;
  wordsSpoken: number;
  streak: number;
}

// 2. Export the Data Arrays
export const weeklyActivity: WeeklyData[] = [
  { day: "Mon", active: 12 },
  { day: "Tue", active: 18 },
  { day: "Wed", active: 15 },
  { day: "Thu", active: 22 },
  { day: "Fri", active: 19 },
  { day: "Sat", active: 8 },
  { day: "Sun", active: 5 },
];

export const monthlyActivity: MonthlyData[] = [
  { month: "Jan", active: 40, sessions: 120 },
  { month: "Feb", active: 52, sessions: 145 },
  { month: "Mar", active: 48, sessions: 130 },
  { month: "Apr", active: 61, sessions: 172 },
  { month: "May", active: 55, sessions: 160 },
  { month: "Jun", active: 67, sessions: 195 },
];

export const topStudents: StudentData[] = [
  { name: "Maria Santos",   sessions: 34, wordsSpoken: 512, streak: 7  },
  { name: "Juan dela Cruz", sessions: 28, wordsSpoken: 430, streak: 5  },
  { name: "Andrea Reyes",   sessions: 25, wordsSpoken: 388, streak: 4  },
  { name: "Carlo Mendoza",  sessions: 21, wordsSpoken: 310, streak: 3  },
  { name: "Sofia Lim",      sessions: 17, wordsSpoken: 260, streak: 2  },
];
=======
import { Colors as C } from "../styles/tokens";
import type { Student, Messages, QuickReply, TranscriptLine } from "../types";

export const STUDENTS: Student[] = [
  { id: 1, name: "Rammel Chan",  status: "online",  lastMsg: "I want water ",        time: "10:32", bg: C.tealLight,   color: C.teal,   unread: 0 },
  { id: 2, name: "Mark kun",    status: "request", lastMsg: "I need help ",          time: "10:35", bg: C.amberLight,  color: C.amber,  unread: 2 },
  { id: 3, name: "Nick san",     status: "urgent",  lastMsg: "I feel sick ",         time: "10:38", bg: C.redLight,    color: C.red,    unread: 1 },
  { id: 4, name: "Marco sama",      status: "idle",    lastMsg: "I don't understand ",  time: "10:20", bg: C.purpleLight, color: C.purple, unread: 0 },
  { id: 5, name: "Carlos dono",  status: "online",  lastMsg: "I am done ",           time: "10:15", bg: C.blueLight,   color: C.blue,   unread: 0 },
  { id: 6, name: "Steve chan",      status: "online",  lastMsg: "Thank you ",           time: "10:10", bg: C.tealLight,   color: C.teal,   unread: 0 },
];

export const MESSAGES: Messages = {
  1: [
    { from: "student", text: "I want water ",       time: "10:32" },
    { from: "teacher", text: "OK — I'll get some.",   time: "10:33" },
    { from: "student", text: "Thank you ",           time: "10:34" },
  ],
  2: [
    { from: "student", text: "I need help ",         time: "10:35" },
    { from: "student", text: "I don't understand ", time: "10:36" },
  ],
  3: [
    { from: "student", text: "I feel sick ",        time: "10:38" },
  ],
  4: [
    { from: "student", text: "I don't understand ", time: "10:20" },
    { from: "teacher", text: "Wait — I'll explain again.", time: "10:21" },
  ],
  5: [
    { from: "student", text: "I am done ",          time: "10:15" },
    { from: "teacher", text: "Good job! ",           time: "10:16" },
  ],
  6: [
    { from: "student", text: "Thank you ",           time: "10:10" },
    { from: "teacher", text: "You're doing great!",   time: "10:11" },
  ],
};

export const QUICK_REPLIES: QuickReply[] = [
  { label: "OK",       bg: C.tealLight,   text: C.teal   },
  { label: "Wait",     bg: C.amberLight,  text: C.amber  },
  { label: "Good job", bg: C.blueLight,   text: C.blue   },
  { label: "Not now",  bg: C.redLight,    text: C.red    },
];

export const TRANSCRIPT_LINES: string[] = [
  "Open your book to page 12.",
  "Today we will discuss the parts of a plant.",
  "Please listen carefully to the instructions.",
];

export const CC_LOG: TranscriptLine[] = [
  { time: "10:05", speaker: "Teacher",        text: "Good morning everyone. Let us start our lesson for today.", isCC: true  },
  { time: "10:08", speaker: "Teacher",        text: "Please open your Science book to page 12.",                 isCC: true  },
  { time: "10:12", speaker: "Teacher",        text: "Today we will discuss the parts of a plant.",              isCC: true  },
  { time: "10:15", speaker: "Student",        text: "Juan sent: I want water ",                               isCC: false },
  { time: "10:16", speaker: "Teacher (reply)",text: "OK — I'll get some.",                                      isCC: false },
  { time: "10:20", speaker: "Teacher",        text: "Listen carefully. I will explain the root system.",        isCC: true  },
  { time: "10:25", speaker: "Student",        text: "Pedro sent: I need help ",                               isCC: false },
  { time: "10:26", speaker: "Teacher (reply)",text: "Wait — I'll come to you shortly.",                         isCC: false },
];

export const SESSION_INFO = {
  subject: "Science",
  section: "SNED-A",
  date:    "Apr 16, 2026",
  period:  "8:00 – 10:00 AM",
};
>>>>>>> 50a0724 (with login)

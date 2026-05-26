import { Colors as C } from "../styles/tokens";
import type { Student, QuickReply, TranscriptLine } from "../types";

export const STUDENTS: Student[] = [
  { id: 1, name: "Rammel Chan",  status: "online",  bg: C.tealLight,   color: C.teal   },
  { id: 2, name: "Mark kun",     status: "request", bg: C.amberLight,  color: C.amber  },
  { id: 3, name: "Nick san",     status: "urgent",  bg: C.redLight,    color: C.red    },
  { id: 4, name: "Marco sama",   status: "idle",    bg: C.purpleLight, color: C.purple },
  { id: 5, name: "Carlos dono",  status: "online",  bg: C.blueLight,   color: C.blue   },
  { id: 6, name: "Steve chan",    status: "online",  bg: C.tealLight,   color: C.teal   },
];

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
  { time: "10:15", speaker: "Student",  text: "Juan sent: I want water ",                               isCC: false },
  { time: "10:20", speaker: "Teacher",  text: "Listen carefully. I will explain the root system.",        isCC: true  },
  { time: "10:25", speaker: "Student",  text: "Pedro sent: I need help ",                               isCC: false },
];

export const SESSION_INFO = {
  subject: "Science",
  section: "SNED-A",
  date:    "Apr 16, 2026",
  period:  "8:00 – 10:00 AM",
};

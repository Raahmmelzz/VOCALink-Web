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
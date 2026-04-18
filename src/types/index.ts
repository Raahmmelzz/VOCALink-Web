export type StudentStatus = "online" | "idle" | "request" | "urgent";

export interface Student {
  id: number;
  name: string;
  status: StudentStatus;
  lastMsg: string;
  time: string;
  bg: string;
  color: string;
  unread: number;
}

export interface Message {
  from: "student" | "teacher";
  text: string;
  time: string;
}

export type Messages = Record<number, Message[]>;

export interface QuickReply {
  label: string;
  bg: string;
  text: string;
}

export type NavPage =
  | "dashboard"
  | "students"
  | "broadcast"
  | "messages"
  | "livecc";

export interface TranscriptLine {
  time: string;
  speaker: string;
  text: string;
  isCC: boolean;
}
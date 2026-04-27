import React from "react";
import { Colors as C } from "../../styles/tokens";

type IconName =
  | "home" | "users" | "mic" | "mic"| "eye-off" | "eye" | "msg" | "reply"
  | "bell" | "send"  | "cc"  | "check" | "stop"
  | "logout" | "settings" | "mic-off" | "chevron";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

const paths: Record<IconName, (color: string) => React.ReactElement> = {
  home: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <path d="M2 6.5L8 2l6 4.5V14H10v-3.5H6V14H2V6.5z" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  users: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5.5" r="2.5" stroke={c} strokeWidth="1.3"/>
      <path d="M1.5 14c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M10.5 4a2 2 0 1 1 0 4M14.5 14c0-2-1.5-3.5-4-3.5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  mic: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <rect x="5.5" y="2" width="5" height="8" rx="2.5" stroke={c} strokeWidth="1.3"/>
      <path d="M3 9a5 5 0 0 0 10 0" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="8" y1="14" x2="8" y2="11" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  "mic-off": (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <rect x="5.5" y="2" width="5" height="8" rx="2.5" fill={c}/>
      <line x1="2" y1="2" x2="14" y2="14" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "eye": (c: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  "eye-off": (c: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  msg: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2.5" width="13" height="9" rx="2" stroke={c} strokeWidth="1.3"/>
      <path d="M4.5 12.5l2 2 2-2" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  reply: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <path d="M6 4L2 8l4 4M2 8h8a4 4 0 0 1 0 8H8" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bell: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 2.5-1 3.5-1.5 4.5h12c-.5-1-1.5-2-1.5-4.5A4.5 4.5 0 0 0 8 1.5z" stroke={c} strokeWidth="1.3"/>
      <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" stroke={c} strokeWidth="1.3"/>
    </svg>
  ),
  send: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <path d="M14 2L2 7l5 2 2 5 5-12z" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  cc: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke={c} strokeWidth="1.3"/>
      <path d="M4.5 8.5h3M4.5 10.5h5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  check: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l4 4 6-7" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  stop: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <rect x="3.5" y="3.5" width="9" height="9" rx="1.5" fill={c}/>
    </svg>
  ),
  logout: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <path d="M10 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h7M11 5l3 3-3 3M14 8H6" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  settings: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" stroke={c} strokeWidth="1.3"/>
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M2.9 2.9l1.1 1.1M12 12l1.1 1.1M2.9 13.1L4 12M12 4l1.1-1.1" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  chevron: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const Icon: React.FC<IconProps> = ({ name, size = 16, color = C.text2 }) => (
  <div style={{ width: size, height: size, flexShrink: 0, display: "flex" }}>
    {paths[name]?.(color)}
  </div>
);

export default Icon;
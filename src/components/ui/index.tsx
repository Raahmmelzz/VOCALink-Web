import React from "react";
import { Colors as C, Radius, Shadow, FontSize } from "../../styles/tokens";

// ─── STATUS DOT ───────────────────────────────────────────────────────────────
type Status = "online" | "idle" | "request" | "urgent";
const STATUS_COLORS: Record<Status, string> = {
  online:  C.tealMid,
  idle:    C.gray3,
  request: C.amber,
  urgent:  C.redDark,
};

export const StatusDot: React.FC<{ status: Status; size?: number }> = ({ status, size = 8 }) => (
  <div style={{
    width: size, height: size,
    borderRadius: "50%",
    background: STATUS_COLORS[status] ?? C.gray3,
    flexShrink: 0,
  }} />
);

// ─── BADGE ────────────────────────────────────────────────────────────────────
type BadgeColor = "teal" | "amber" | "red" | "purple" | "blue" | "gray";
const BADGE_MAP: Record<BadgeColor, { bg: string; text: string }> = {
  teal:   { bg: C.tealLight,   text: C.teal   },
  amber:  { bg: C.amberLight,  text: C.amber  },
  red:    { bg: C.redLight,    text: C.red    },
  purple: { bg: C.purpleLight, text: C.purple },
  blue:   { bg: C.blueLight,   text: C.blue   },
  gray:   { bg: C.gray,        text: C.text3  },
};

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = "gray", style = {} }) => {
  const m = BADGE_MAP[color];
  return (
    <span style={{
      fontSize: FontSize.xs, fontWeight: 600,
      padding: "2px 8px", borderRadius: Radius.full,
      letterSpacing: "0.04em", display: "inline-block",
      background: m.bg, color: m.text,
      ...style,
    }}>
      {children}
    </span>
  );
};

// ─── AVATAR ───────────────────────────────────────────────────────────────────
interface AvatarProps {
  name: string;
  bg?: string;
  color?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  bg    = C.tealLight,
  color = C.teal,
  size  = 32,
}) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size,
      borderRadius: "50%",
      background: bg, color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.36), fontWeight: 600,
      flexShrink: 0, userSelect: "none",
    }}>
      {initials}
    </div>
  );
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, style = {} }) => (
  <div style={{
    background: C.white,
    border: `1px solid ${C.gray2}`,
    borderRadius: Radius.lg,
    padding: 16,
    boxShadow: Shadow.sm,
    ...style,
  }}>
    {children}
  </div>
);

// ─── CARD TITLE ───────────────────────────────────────────────────────────────
export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: FontSize.base, fontWeight: 600,
    color: C.text, marginBottom: 12, letterSpacing: "-0.1px",
  }}>
    {children}
  </div>
);

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export const ProgressBar: React.FC<{ value: number; color?: string }> = ({
  value,
  color = C.tealMid,
}) => (
  <div style={{ height: 5, borderRadius: 3, background: C.gray2, overflow: "hidden" }}>
    <div style={{ width: `${value}%`, height: "100%", borderRadius: 3, background: color, transition: "width 0.3s" }} />
  </div>
);

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
export const Divider: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <div style={{ height: 1, background: C.gray2, margin: "12px 0", ...style }} />
);

// ─── BUTTON ───────────────────────────────────────────────────────────────────
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
  style?: React.CSSProperties;
  disabled?: boolean;
}

const BUTTON_VARIANTS = {
  primary: { background: C.teal,  border: `1px solid ${C.teal}`,  color: C.white },
  outline: { background: C.white, border: `1px solid ${C.gray2}`, color: C.text  },
  ghost:   { background: "transparent", border: "none",           color: C.text2 },
};

const BUTTON_SIZES = {
  sm: { padding: "5px 12px", fontSize: FontSize.sm },
  md: { padding: "8px 16px", fontSize: FontSize.base },
};

export const Button: React.FC<ButtonProps> = ({
  children, onClick,
  variant = "outline",
  size    = "md",
  style   = {},
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      ...BUTTON_VARIANTS[variant],
      ...BUTTON_SIZES[size],
      borderRadius: Radius.md,
      fontWeight: 500, cursor: disabled ? "default" : "pointer",
      display: "inline-flex", alignItems: "center", gap: 6,
      opacity: disabled ? 0.5 : 1,
      transition: "opacity 0.15s",
      fontFamily: "inherit",
      ...style,
    }}
  >
    {children}
  </button>
);
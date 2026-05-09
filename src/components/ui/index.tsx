import React from "react";
import { Colors as C, Radius, Shadow, FontSize } from "../../styles/tokens";

// ─── STATUS DOT ───────────────────────────────────────────────────────────────
type Status = "online" | "idle" | "request" | "urgent";
const STATUS_COLORS: Record<Status, string> = {
  online:  "#22C55E",
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
    boxShadow: status === "online" ? "0 0 0 3px rgba(34,197,94,0.2)" : undefined,
  }} />
);

// ─── BADGE ────────────────────────────────────────────────────────────────────
type BadgeColor = "teal" | "amber" | "red" | "purple" | "blue" | "gray" | "green";
const BADGE_MAP: Record<BadgeColor, { bg: string; text: string; border: string }> = {
  teal:   { bg: C.tealLight,   text: C.tealDark,  border: C.tealBorder  },
  amber:  { bg: C.amberLight,  text: C.amber,     border: "#F0C070"     },
  red:    { bg: C.redLight,    text: C.red,       border: "#FCA5A5"     },
  purple: { bg: C.purpleLight, text: C.purple,    border: "#C4B5FD"     },
  blue:   { bg: C.blueLight,   text: C.blue,      border: "#93C5FD"     },
  gray:   { bg: C.gray,        text: C.text2,     border: C.gray2       },
  green:  { bg: C.greenLight,  text: C.green,     border: "#86EFAC"     },
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
      padding: "3px 10px", borderRadius: Radius.full,
      letterSpacing: "0.02em", display: "inline-flex", alignItems: "center",
      background: m.bg, color: m.text,
      border: `1px solid ${m.border}`,
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
  color = C.tealDark,
  size  = 36,
}) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size,
      borderRadius: "50%",
      background: bg, color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.36), fontWeight: 700,
      flexShrink: 0, userSelect: "none",
      boxShadow: `0 0 0 2px ${C.white}, 0 0 0 3px ${bg}`,
    }}>
      {initials}
    </div>
  );
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style = {}, accent = false }) => (
  <div style={{
    background: C.white,
    border: `1px solid ${C.gray2}`,
    borderRadius: Radius.lg,
    padding: 20,
    boxShadow: Shadow.sm,
    borderTop: accent ? `3px solid ${C.teal}` : undefined,
    transition: "box-shadow 0.2s",
    ...style,
  }}>
    {children}
  </div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
interface StatCardProps {
  value: number | string;
  label: string;
  color?: string;
  icon?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, color = C.teal }) => (
  <div style={{
    background: C.white,
    border: `1px solid ${C.gray2}`,
    borderRadius: Radius.lg,
    padding: "16px 20px",
    flex: 1,
    boxShadow: Shadow.sm,
    borderLeft: `4px solid ${color}`,
    transition: "box-shadow 0.2s",
  }}>
    <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1, letterSpacing: "-1px" }}>{value}</div>
    <div style={{ fontSize: FontSize.sm, color: C.text3, marginTop: 4, fontWeight: 500 }}>{label}</div>
  </div>
);

// ─── CARD TITLE ───────────────────────────────────────────────────────────────
export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: FontSize.md, fontWeight: 700,
    color: C.text, marginBottom: 14,
    letterSpacing: "-0.3px",
  }}>
    {children}
  </div>
);

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export const ProgressBar: React.FC<{ value: number; color?: string }> = ({
  value,
  color = C.teal,
}) => (
  <div style={{ height: 6, borderRadius: 999, background: C.gray2, overflow: "hidden" }}>
    <div style={{
      width: `${value}%`, height: "100%", borderRadius: 999,
      background: `linear-gradient(90deg, ${color}, ${C.tealMid})`,
      transition: "width 0.4s ease",
    }} />
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
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: "button" | "submit";
}

const BUTTON_VARIANTS = {
  primary: {
    background: C.tealGradient,
    border: "none",
    color: C.white,
    boxShadow: Shadow.teal,
  },
  outline: {
    background: C.white,
    border: `1.5px solid ${C.gray2}`,
    color: C.text,
    boxShadow: Shadow.sm,
  },
  ghost: {
    background: "transparent",
    border: "none",
    color: C.text2,
    boxShadow: "none",
  },
  danger: {
    background: C.redLight,
    border: `1.5px solid #FCA5A5`,
    color: C.redDark,
    boxShadow: "none",
  },
};

const BUTTON_SIZES = {
  sm: { padding: "5px 12px",  fontSize: FontSize.sm, borderRadius: Radius.sm  },
  md: { padding: "8px 16px",  fontSize: FontSize.base, borderRadius: Radius.md },
  lg: { padding: "12px 24px", fontSize: FontSize.md, borderRadius: Radius.md  },
};

export const Button: React.FC<ButtonProps> = ({
  children, onClick,
  variant  = "outline",
  size     = "md",
  style    = {},
  disabled = false,
  type     = "button",
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    style={{
      ...BUTTON_VARIANTS[variant],
      ...BUTTON_SIZES[size],
      fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", gap: 6,
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.15s",
      fontFamily: "inherit",
      letterSpacing: "-0.1px",
      ...style,
    }}
  >
    {children}
  </button>
);

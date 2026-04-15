export interface User {
  id: string;
  username: string;
  email: string;
  organization?: string; // New
  bio?: string;          // New
  specializations?: string[]; // New
}

export interface LoginPayload {
  identifier: string;
  password: string;
  remember: boolean;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export type StoredUser = {
  id: string;
  username: string;
  email: string;
  password: string;
};
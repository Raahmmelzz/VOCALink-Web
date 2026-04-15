// src/services/authService.ts
import type { User, LoginPayload, SignupPayload } from "../types/auth";

const USERS = "vocalink_users";
const SESSION = "vocalink_session";
const REMEMBER = "vocalink_remember";

interface StoredUser extends User {
  password: string;
}

const getUsers = (): StoredUser[] =>
  JSON.parse(localStorage.getItem(USERS) || "[]");

const saveUsers = (users: StoredUser[]) =>
  localStorage.setItem(USERS, JSON.stringify(users));

const authService = {
  signup({ username, email, password }: SignupPayload) {
    const users = getUsers();
    if (users.some(u => u.email === email || u.username === username)) {
      throw new Error("User already exists");
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      username,
      email,
      password,
      specializations: [],
    };

    users.push(newUser);
    saveUsers(users);
  },

  login({ identifier, password, remember }: LoginPayload): User {
    const users = getUsers();
    const user = users.find(
      u => u.email === identifier || u.username === identifier
    );

    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }

    const session: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      organization: user.organization, // Add this
      bio: user.bio,                   // Add this
      specializations: user.specializations,
    };

    if (remember) {
      localStorage.setItem(SESSION, JSON.stringify(session));
      localStorage.setItem(REMEMBER, "1");
    } else {
      sessionStorage.setItem(SESSION, JSON.stringify(session));
    }

    return session;
  },

  getSession(): User | null {
    const remember = localStorage.getItem(REMEMBER) === "1";
    const raw = remember
      ? localStorage.getItem(SESSION)
      : sessionStorage.getItem(SESSION);

    return raw ? JSON.parse(raw) : null;
  },

  logout() {
    localStorage.removeItem(SESSION);
    localStorage.removeItem(REMEMBER);
    sessionStorage.removeItem(SESSION);
  },

  // FIXED: Moved inside the object and added "database" update logic
  saveSession(updatedUser: User) {
    // 1. Update the active session
    const remember = localStorage.getItem(REMEMBER) === "1";
    if (remember) {
      localStorage.setItem(SESSION, JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem(SESSION, JSON.stringify(updatedUser));
    }

    // 2. Update the "Permanent" User List (the simulated database)
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    
    if (userIndex !== -1) {
      // Merge updated fields while keeping the password intact
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      saveUsers(users);
    }
  }
};

export default authService;
// FILE: src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "customer" | "receptionist" | "caregiver" | "manager";
export interface User { id: string; email: string; name: string; role: UserRole; phone?: string; createdAt: string; }
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // QUAN TRỌNG
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USERS_STORAGE_KEY = "petcare_users";
const CURRENT_USER_KEY = "petcare_current_user";

const DEFAULT_STAFF_ACCOUNTS = [
  { id: "staff-1", email: "letan@petfirst.vn", password: "letan123", name: "Nguyễn Thị Lan", role: "receptionist" as UserRole, phone: "0901234567", createdAt: new Date().toISOString() },
  { id: "staff-2", email: "bacsi@petfirst.vn", password: "bacsi123", name: "Bác Sĩ Nguyễn Văn An", role: "caregiver" as UserRole, phone: "0901234568", createdAt: new Date().toISOString() },
  { id: "staff-3", email: "quanly@petfirst.vn", password: "quanly123", name: "Trần Văn Quản Lý", role: "manager" as UserRole, phone: "0901234569", createdAt: new Date().toISOString() }
];

export function AuthProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Mặc định true

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) setUser(JSON.parse(savedUser));
    const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_STAFF_ACCOUNTS));
    setIsLoading(false); // Load xong
  }, []);

  const getUsersFromStorage = () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : DEFAULT_STAFF_ACCOUNTS;
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    const users = getUsersFromStorage();
    if (users.find((u: any) => u.email === email)) return { success: false, message: "Email đã tồn tại!" };
    const newUser = { id: `user-${Date.now()}`, email, password, name, role: "customer" as UserRole, phone, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return { success: true, message: "Đăng ký thành công!" };
  };

  const login = async (email: string, password: string) => {
    const users = getUsersFromStorage();
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    if (!foundUser) return { success: false, message: "Sai thông tin đăng nhập!" };
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return { success: true, message: "Đăng nhập thành công!" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.reload(); // Tải lại trang sạch sẽ
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
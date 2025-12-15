import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  petName: string;
  petType: string;
  date: string;
  slot: string;
  status: BookingStatus;
  doctorId?: string;
  note?: string;
  createdAt: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "createdAt" | "userId" | "userName" | "userPhone" | "status">) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  getUserBookings: () => Booking[];
  getAllBookings: () => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);
const BOOKING_KEY = "petcare_bookings_data";

export function BookingProvider({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(BOOKING_KEY);
    if (saved) {
      setBookings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));
    }
  }, [bookings]);

  const addBooking = (data: any) => {
    const newBooking: Booking = {
      ...data,
      id: `BK${Date.now()}`,
      userId: user?.id || "guest",
      userName: user?.name || "Khách vãng lai",
      userPhone: user?.phone || "Chưa cung cấp",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const getUserBookings = () => {
    if (!user) return [];
    return bookings.filter((b) => b.userId === user.id);
  };

  const getAllBookings = () => {
    return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus, getUserBookings, getAllBookings }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
}
// FILE: src/contexts/OrderContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CartItem } from "./CartContext";
import { useAuth } from "./AuthContext";

// 1. ĐỊNH NGHĨA TRẠNG THÁI ĐẦY ĐỦ
export type OrderStatus = "pending" | "confirmed" | "preparing" | "processing" | "shipping" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "bank_transfer" | "momo" | "zalopay" | "vnpay" | "credit_card";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  note?: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  isPaid: boolean;
  paidAt?: string;
  transactionId?: string;
}

export interface ShippingUpdate {
  status: OrderStatus;
  message: string;
  location: string;
  timestamp: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  userId: string;
  // Thêm customerName dự phòng ở cấp cao nhất để dễ tìm kiếm
  customerName: string; 
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  status: OrderStatus;
  totalAmount: number;
  shippingFee: number;
  discount: number;
  finalAmount: number;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  shipper?: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  shippingUpdates: ShippingUpdate[];
  note?: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (
    items: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    note?: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, message: string, location: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  getUserOrders: (userId: string) => Order[];
  getAllOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const ORDERS_STORAGE_KEY = "petcare_orders";

export function OrderProvider({ children }: { children?: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const createOrder = (
    items: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    note?: string
  ): Order => {
    const totalAmount = items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^\d]/g, ""));
      return sum + price * item.quantity;
    }, 0);

    const shippingFee = totalAmount >= 500000 ? 0 : 30000;
    const finalAmount = totalAmount + shippingFee;
    const now = new Date();

    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      userId: user?.id || "guest",
      customerName: shippingAddress.fullName, // Lưu tên ngay tại đây để dễ gọi
      items,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        isPaid: paymentMethod !== "cod",
        paidAt: paymentMethod !== "cod" ? now.toISOString() : undefined,
      },
      status: "pending",
      totalAmount,
      shippingFee,
      discount: 0,
      finalAmount,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      shippingUpdates: [
        {
          status: "pending",
          message: "Đơn hàng mới được tạo",
          location: "Hệ thống",
          timestamp: now.toISOString(),
          updatedBy: "Hệ thống",
        },
      ],
      note,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, message: string, location: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
            updatedAt: new Date().toISOString(),
            shippingUpdates: [
              ...order.shippingUpdates,
              { status, message, location, timestamp: new Date().toISOString(), updatedBy: user?.name || "Admin" }
            ],
          };
        }
        return order;
      })
    );
  };

  const cancelOrder = (orderId: string, reason: string) => {
    updateOrderStatus(orderId, "cancelled", `Đã hủy: ${reason}`, "Khách hàng");
  };

  const getUserOrders = (userId: string) => orders.filter((order) => order.userId === userId);
  const getAllOrders = () => orders;

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, cancelOrder, getUserOrders, getAllOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) throw new Error("useOrder must be used within an OrderProvider");
  return context;
}
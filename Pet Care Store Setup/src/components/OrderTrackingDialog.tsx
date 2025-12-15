// FILE: src/components/OrderTrackingDialog.tsx (ĐÃ FIX LỖI TOTALPRICE)

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Order, OrderStatus } from "../contexts/OrderContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle2, Clock, Package, Truck, XCircle, MapPin } from "lucide-react";

interface OrderTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

// Config trạng thái
const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Chờ xác nhận", color: "text-yellow-600", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "text-blue-600", icon: CheckCircle2 },
  preparing: { label: "Đang chuẩn bị", color: "text-purple-600", icon: Package },
  processing: { label: "Đang xử lý", color: "text-purple-600", icon: Package },
  shipping: { label: "Đang giao hàng", color: "text-orange-600", icon: Truck },
  shipped: { label: "Đang giao hàng", color: "text-orange-600", icon: Truck },
  delivered: { label: "Đã giao hàng", color: "text-green-600", icon: CheckCircle2 },
  cancelled: { label: "Đã hủy", color: "text-red-600", icon: XCircle },
};

export function OrderTrackingDialog({ open, onOpenChange, order }: OrderTrackingDialogProps) {
  if (!order) return null;

  // Lấy config trạng thái an toàn
  const currentStatus = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  // Helper xác định bước hiện tại
  const getStepStatus = (step: number) => {
    const statusOrder = ['pending', 'confirmed', 'preparing', 'shipping', 'delivered'];
    
    // Map các trạng thái tương đương
    let normalizedStatus = order.status;
    if (normalizedStatus === 'processing') normalizedStatus = 'preparing';
    if (normalizedStatus === 'shipped') normalizedStatus = 'shipping';
                                    
    const currentIndex = statusOrder.indexOf(normalizedStatus as string);
    
    if (order.status === 'cancelled') return 'error';
    if (currentIndex >= step) return 'completed';
    if (currentIndex === step - 1) return 'active';
    return 'pending';
  };

  // Xử lý hiển thị giá tiền an toàn (Hỗ trợ cả data cũ và mới)
  const displayPrice = () => {
    if (order.finalAmount) return order.finalAmount.toLocaleString("vi-VN") + "₫";
    if (order.totalAmount) return order.totalAmount.toLocaleString("vi-VN") + "₫";
    // @ts-ignore: Fallback cho dữ liệu mock cũ có field totalPrice
    return (order as any).totalPrice || "0₫";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-teal-900">
            <Truck className="w-6 h-6 text-orange-500" />
            Theo Dõi Đơn Hàng #{order.id}
          </DialogTitle>
          <DialogDescription>
            Cập nhật trạng thái chi tiết của đơn hàng
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 pb-6">
            {/* Trạng thái hiện tại */}
            <div className="bg-gray-50 p-4 rounded-lg border flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Trạng thái hiện tại</p>
                <div className={`flex items-center gap-2 font-bold text-lg ${currentStatus.color}`}>
                  <StatusIcon className="w-5 h-5" />
                  {currentStatus.label}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Thời gian đặt hàng</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Timeline Progress */}
            {order.status !== 'cancelled' && (
              <div className="relative flex justify-between px-4">
                <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10" />
                
                {['Đã đặt', 'Đã xác nhận', 'Đang xử lý', 'Đang giao', 'Đã giao'].map((label, idx) => {
                  const status = getStepStatus(idx);
                  const isCompleted = status === 'completed';
                  const isActive = status === 'active';
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                        ${isCompleted ? 'bg-teal-500 border-teal-500 text-white' : 
                          isActive ? 'bg-white border-teal-500 text-teal-500' : 
                          'bg-white border-gray-300 text-gray-300'}
                      `}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span className={`text-xs font-medium ${isCompleted || isActive ? 'text-teal-900' : 'text-gray-400'}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Thông tin vận chuyển */}
            <div className="space-y-4">
              <h3 className="font-bold text-teal-900 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Thông Tin Giao Hàng
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm bg-white border rounded-lg p-4">
                <div>
                  <p className="text-gray-500 mb-1">Người nhận</p>
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p className="text-gray-700">{order.shippingAddress.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Địa chỉ</p>
                  <p className="font-medium">{order.shippingAddress.address}</p>
                  <p className="text-gray-700">
                    {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Chi tiết sản phẩm */}
            <div className="space-y-4">
              <h3 className="font-bold text-teal-900 flex items-center gap-2">
                <Package className="w-5 h-5" /> Sản Phẩm ({order.items.length})
              </h3>
              <div className="border rounded-lg overflow-hidden">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border-b last:border-0 hover:bg-gray-50">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <ImageWithFallback 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Số lượng: x{item.quantity}</p>
                    </div>
                    <p className="font-bold text-orange-600">{item.price}</p>
                  </div>
                ))}
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <span className="font-medium text-gray-700">Tổng cộng</span>
                  <span className="font-bold text-xl text-teal-900">
                    {displayPrice()}
                  </span>
                </div>
              </div>
            </div>

            {/* Lịch sử cập nhật */}
            {order.shippingUpdates && order.shippingUpdates.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-teal-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Lịch Sử Cập Nhật
                </h3>
                <div className="border-l-2 border-gray-200 ml-2 pl-6 space-y-6">
                  {[...order.shippingUpdates].reverse().map((update, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm" />
                      <p className="font-medium text-gray-900">{update.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(update.timestamp).toLocaleString('vi-VN')} - {update.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
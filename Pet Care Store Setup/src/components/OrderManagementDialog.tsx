// FILE: src/components/OrderManagementDialog.tsx

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { useOrder, Order } from "../contexts/OrderContext";
import { useAuth } from "../contexts/AuthContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Package, Search, Clock, CheckCircle2, XCircle, Truck, Eye, Calendar, Stethoscope, User, AlertCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "./ui/alert-dialog";
import { toast } from "sonner";

interface OrderManagementDialogProps { open: boolean; onOpenChange: (open: boolean) => void; onViewOrder: (order: Order) => void; }

// Config màu sắc AN TOÀN
const statusConfig: Record<string, { label: string; color: string; icon: any; bgColor: string }> = {
  pending: { label: "Chờ xác nhận", color: "text-yellow-700", bgColor: "bg-yellow-100", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "text-blue-700", bgColor: "bg-blue-100", icon: CheckCircle2 },
  processing: { label: "Đang xử lý", color: "text-purple-700", bgColor: "bg-purple-100", icon: Package },
  preparing: { label: "Đang chuẩn bị", color: "text-purple-700", bgColor: "bg-purple-100", icon: Package },
  shipped: { label: "Đang giao", color: "text-orange-700", bgColor: "bg-orange-100", icon: Truck },
  shipping: { label: "Đang giao", color: "text-orange-700", bgColor: "bg-orange-100", icon: Truck },
  delivered: { label: "Đã giao hàng", color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle2 },
  cancelled: { label: "Đã hủy", color: "text-red-700", bgColor: "bg-red-100", icon: XCircle },
};
// Fallback nếu không tìm thấy status
const defaultConfig = { label: "Không xác định", color: "text-gray-700", bgColor: "bg-gray-100", icon: AlertCircle };

interface Booking { id: number; customerName: string; petName: string; serviceName: string; date: string; time: string; status: string; notes: string; doctorNotes: string; type: string; }

export function OrderManagementDialog({ open, onOpenChange, onViewOrder }: OrderManagementDialogProps) {
  const { getUserOrders, cancelOrder } = useOrder();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("orders");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (open && user) {
        try {
            const allBookings: Booking[] = JSON.parse(localStorage.getItem('petcare_bookings') || '[]');
            setMyBookings(allBookings.filter(b => b.customerName === user.name));
        } catch (e) { setMyBookings([]); }
    }
  }, [open, user]);

  const userOrders = user ? getUserOrders(user.id) : [];
  
  const filteredOrders = userOrders.filter(order => {
    if (!order) return false;
    const orderId = String(order.id || "").toLowerCase();
    
    // LẤY TÊN AN TOÀN TUYỆT ĐỐI
    // Ưu tiên shippingAddress.fullName -> customerName -> "Khách hàng"
    const nameRaw = order.shippingAddress?.fullName || order.customerName || "Khách hàng";
    const name = String(nameRaw).toLowerCase();
    
    const query = searchQuery.toLowerCase();
    return orderId.includes(query) || name.includes(query);
  });

  const handleCancelClick = (order: Order) => { setOrderToCancel(order); setCancelDialogOpen(true); };
  const handleConfirmCancel = () => {
    if (orderToCancel) {
      cancelOrder(orderToCancel.id, "Khách yêu cầu hủy");
      toast.success("Đã hủy đơn");
      setCancelDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
      try { return new Date(dateString).toLocaleString("vi-VN"); } catch { return "N/A"; }
  };

  const getBookingStatusBadge = (status: string) => {
      switch(status) {
          case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
          case 'confirmed': return <Badge className="bg-blue-100 text-blue-800">Đã xác nhận</Badge>;
          case 'completed': return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
          case 'cancelled': return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
          default: return <Badge variant="outline">{status}</Badge>;
      }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] h-[85vh] flex flex-col p-0 gap-0">
          <div className="p-6 pb-4 border-b">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl text-teal-900"><User className="w-6 h-6 text-orange-500" /> Hoạt Động Của Tôi</DialogTitle>
              <DialogDescription>Quản lý đơn hàng và lịch hẹn</DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex gap-2">
                <Button variant={activeTab === 'orders' ? 'default' : 'outline'} onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'bg-teal-900' : ''}><Package className="w-4 h-4 mr-2"/> Đơn Hàng ({filteredOrders.length})</Button>
                <Button variant={activeTab === 'bookings' ? 'default' : 'outline'} onClick={() => setActiveTab('bookings')} className={activeTab === 'bookings' ? 'bg-teal-900' : ''}><Calendar className="w-4 h-4 mr-2"/> Lịch Hẹn ({myBookings.length})</Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            {activeTab === 'orders' && (
                <div className="space-y-4">
                    <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Tìm đơn hàng..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-white" /></div>
                    
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Ông chưa có đơn hàng nào.</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
                            // --- HIỂN THỊ AN TOÀN ---
                            const statusInfo = statusConfig[order.status] || defaultConfig;
                            const StatusIcon = statusInfo.icon;
                            
                            // Lấy thông tin an toàn
                            const recipientName = order.shippingAddress?.fullName || order.customerName || "Khách hàng";
                            const totalPrice = order.finalAmount ? order.finalAmount.toLocaleString("vi-VN") + "₫" : (order.totalPrice || "0₫");

                            return (
                                <div key={order.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
                                        <div className="flex gap-3 text-sm">
                                            <span className="font-bold text-teal-900">#{order.id}</span>
                                            <span className="text-gray-500 text-xs mt-0.5">{formatDate(order.createdAt)}</span>
                                        </div>
                                        <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}><StatusIcon className="w-3 h-3 mr-1" /> {statusInfo.label}</Badge>
                                    </div>
                                    <div className="p-4">
                                        <div className="space-y-3 mb-4">
                                            {order.items && order.items.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                            <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div><p className="font-medium text-gray-900">{item.name}</p><p className="text-xs text-gray-500">x{item.quantity}</p></div>
                                                    </div>
                                                    <span className="font-medium text-orange-600">{item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator className="my-3"/>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">Người nhận: <b>{recipientName}</b></p>
                                                <p className="text-sm font-medium">Tổng: <span className="text-lg text-orange-600 font-bold ml-2">{totalPrice}</span></p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => onViewOrder(order)}><Eye className="w-4 h-4 mr-1"/> Chi tiết</Button>
                                                {(order.status === 'pending' || order.status === 'confirmed') && (<Button size="sm" variant="ghost" onClick={() => handleCancelClick(order)} className="text-red-500 hover:text-red-600 hover:bg-red-50">Hủy đơn</Button>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
            
            {activeTab === 'bookings' && (
                <div className="space-y-4">
                    {/* Phần Lịch hẹn giữ nguyên */}
                    {myBookings.length === 0 ? <div className="text-center py-12 text-gray-500"><Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>Ông chưa đặt lịch hẹn nào.</p></div> : 
                        myBookings.map((booking) => (
                            <div key={booking.id} className="bg-white border rounded-xl p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${booking.type === 'medical' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>{booking.type === 'medical' ? <Stethoscope className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}</div>
                                        <div><h4 className="font-bold text-teal-900">{booking.serviceName}</h4><p className="text-xs text-gray-500">Bé: {booking.petName}</p></div>
                                    </div>
                                    <Badge variant="outline">{booking.status}</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                                    <div className="flex items-center gap-2 text-gray-700"><Calendar className="w-4 h-4 text-teal-500"/> {booking.date}</div>
                                    <div className="flex items-center gap-2 text-gray-700"><Clock className="w-4 h-4 text-orange-500"/> {booking.time}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xác nhận hủy đơn</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Không</AlertDialogCancel><AlertDialogAction onClick={handleConfirmCancel} className="bg-red-500">Hủy</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
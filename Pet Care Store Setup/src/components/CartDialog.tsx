import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useCart } from "../contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ShoppingBag, ArrowLeft, MapPin, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
// Import bộ chọn địa chỉ xịn xò tui đã đưa ông lúc nãy
import { AddressSelector } from "./AddressSelector"; 

interface CartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckoutClick?: () => void; // Làm optional vì mình xử lý luôn ở đây
  onContinueShopping?: () => void;
}

export function CartDialog({ open, onOpenChange, onContinueShopping }: CartDialogProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  
  // State để chuyển đổi giữa xem Giỏ Hàng và Thanh Toán
  // 'cart': Xem giỏ hàng | 'checkout': Điền thông tin | 'success': Đặt thành công
  const [view, setView] = useState<'cart' | 'checkout' | 'success'>('cart');
  
  // Reset về view giỏ hàng mỗi khi mở lại dialog
  useEffect(() => {
    if (open) setView('cart');
  }, [open]);

  // 1. Xử lý "Tiếp tục mua sắm" -> Scroll xuống Shop
  const handleContinue = () => {
    onOpenChange(false);
    // Thêm delay nhỏ để dialog đóng xong mới cuộn, tránh giật lag
    setTimeout(() => {
      if (onContinueShopping) {
        onContinueShopping();
      } else {
        const shopElement = document.getElementById('shop');
        if (shopElement) shopElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  // 2. Xử lý Đặt Hàng (Demo)
  const handlePlaceOrder = () => {
    // Ở đây ông có thể gọi API đặt hàng
    // Tạm thời mình giả lập thành công
    clearCart();
    setView('success');
  };

  // --- RENDER MÀN HÌNH GIỎ HÀNG (List Item) ---
  const CartView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl text-teal-900">
          <ShoppingCart className="w-6 h-6" />
          Giỏ Hàng <span className="text-gray-500 text-base font-normal">({items.length} sản phẩm)</span>
        </DialogTitle>
        <DialogDescription>
          Xem lại và quản lý các sản phẩm trong giỏ hàng của bạn
        </DialogDescription>
      </DialogHeader>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-gray-500">
          <ShoppingCart className="w-16 h-16 opacity-20" />
          <p className="text-lg">Giỏ hàng của bạn đang trống</p>
          <Button onClick={handleContinue} variant="outline" className="mt-4 border-orange-500 text-orange-500 hover:bg-orange-50">
            Mua sắm ngay
          </Button>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-4 pt-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-white rounded-lg border hover:border-orange-200 transition-colors group">
                  <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">{item.name}</h4>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="font-semibold text-orange-600">{item.price}</div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border">
                        <button
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm disabled:opacity-50"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t pt-4 space-y-4 bg-white mt-auto">
            <div className="space-y-2">
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-lg text-gray-900">Tổng cộng:</span>
                <span className="font-bold text-xl text-orange-600">{totalPrice}₫</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={handleContinue}
                className="h-12 border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                 <ShoppingBag className="w-4 h-4 mr-2" /> Tiếp tục mua
              </Button>
              <Button 
                // Bấm nút này sẽ chuyển sang màn hình Checkout
                onClick={() => setView('checkout')}
                className="h-12 bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200 shadow-lg"
              >
                Thanh Toán <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );

  // --- RENDER MÀN HÌNH THANH TOÁN (Form Address) ---
  const CheckoutView = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" onClick={() => setView('cart')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <DialogTitle className="text-xl text-teal-900">Thanh Toán</DialogTitle>
        </div>
        <DialogDescription>
           Nhập thông tin giao hàng của ông
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="flex-1 pr-4 -mr-4">
        <div className="py-4 space-y-6">
           {/* Thông tin cá nhân */}
           <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-orange-600">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs">1</div>
                Thông tin người nhận
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Họ và tên *</Label>
                  <Input placeholder="Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại *</Label>
                  <Input placeholder="0901234567" />
                </div>
              </div>
           </div>

           <Separator />

           {/* Địa chỉ - DÙNG COMPONENT MỚI ĐỂ FIX LỖI DROPDOWN */}
           <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-orange-600">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs">2</div>
                Địa chỉ giao hàng
              </h3>
              
              {/* Đây là cái bộ chọn địa chỉ fix lỗi nè */}
              <AddressSelector 
                onChange={(addr) => console.log(addr)} 
              />

              <div className="space-y-2">
                <Label>Ghi chú (tùy chọn)</Label>
                <Textarea placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..." />
              </div>
           </div>
        </div>
      </ScrollArea>

      <div className="border-t pt-4 bg-white mt-auto">
        <div className="flex justify-between items-center mb-4 text-sm">
           <span className="text-gray-500">Tổng thanh toán:</span>
           <span className="font-bold text-xl text-orange-600">{totalPrice}₫</span>
        </div>
        <Button 
          onClick={handlePlaceOrder}
          className="w-full h-12 bg-teal-900 hover:bg-teal-800 text-white font-bold text-lg shadow-lg"
        >
          Xác Nhận Đặt Hàng
        </Button>
      </div>
    </>
  );

  // --- RENDER MÀN HÌNH THÀNH CÔNG ---
  const SuccessView = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 p-8 animate-in zoom-in-95">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-teal-900 mb-2">Đặt Hàng Thành Công!</h2>
        <p className="text-gray-600">Cảm ơn ông đã mua sắm tại Pet-First.</p>
        <p className="text-sm text-gray-500 mt-1">Chúng tôi sẽ liên hệ xác nhận sớm nhất.</p>
      </div>
      <Button onClick={handleContinue} className="bg-orange-500 hover:bg-orange-600 text-white w-full">
        Tiếp Tục Mua Sắm
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] flex flex-col h-[90vh]">
        {view === 'cart' && <CartView />}
        {view === 'checkout' && <CheckoutView />}
        {view === 'success' && <SuccessView />}
      </DialogContent>
    </Dialog>
  );
}
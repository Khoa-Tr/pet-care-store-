// FILE: src/components/CheckoutDialog.tsx (ĐÃ ĐỒNG BỘ VỚI ORDER CONTEXT)

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator"; 
import { useCart } from "../contexts/CartContext";
import { useOrder, PaymentMethod } from "../contexts/OrderContext";
import { useAuth } from "../contexts/AuthContext";
import { AddressSelect } from "./AddressSelect";
import { vietnamAddress, City, District } from "../data/vietnam-address";
import { ImageWithFallback } from "./figma/ImageWithFallback"; 
import { ShoppingBag, MapPin, CreditCard, Wallet, Building2, Smartphone, Truck, Package, CheckCircle2, User } from "lucide-react";
import { toast } from "sonner";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated?: (orderId: string) => void;
}

export function CheckoutDialog({ open, onOpenChange, onOrderCreated }: CheckoutDialogProps) {
  const { items, clearCart, totalPrice } = useCart();
  const { createOrder } = useOrder();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [addressNote, setAddressNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [orderNote, setOrderNote] = useState("");

  // Address Data
  const [selectedCityData, setSelectedCityData] = useState<City | null>(null);
  const [selectedDistrictData, setSelectedDistrictData] = useState<District | null>(null);
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
  const [availableWards, setAvailableWards] = useState<{ code: string; name: string }[]>([]);

  // AUTO-FILL
  useEffect(() => {
    if (open && user) {
        if (!fullName) setFullName(user.name || "");
        if (!phone) setPhone(user.phone || "");
    }
  }, [open, user]);

  const handleFillInfo = () => {
      if (user) {
          setFullName(user.name || "");
          setPhone(user.phone || "");
          toast.success("Đã điền thông tin từ tài khoản!");
      } else {
          toast.error("Vui lòng đăng nhập trước.");
      }
  };

  // Logic địa chỉ
  useEffect(() => {
    if (city) {
      const cityData = vietnamAddress.find((c) => c.name === city);
      setSelectedCityData(cityData || null);
      setAvailableDistricts(cityData?.districts || []);
      setDistrict(""); setWard(""); setAvailableWards([]);
    } else {
      setSelectedCityData(null); setAvailableDistricts([]);
    }
  }, [city]);

  useEffect(() => {
    if (district && selectedCityData) {
      const districtData = selectedCityData.districts.find((d) => d.name === district);
      setAvailableWards(districtData?.wards || []);
      setWard("");
    } else {
      setAvailableWards([]);
    }
  }, [district, selectedCityData]);

  const totalAmount = parseFloat(totalPrice.replace(/[^\d]/g, ""));
  const shippingFee = totalAmount >= 500000 ? 0 : 30000;
  const finalAmount = totalAmount + shippingFee;

  const handleNextStep = () => {
    if (step === 1) {
      if (!fullName || !phone || !address || !ward || !district || !city) {
        toast.error("Vui lòng điền đầy đủ thông tin giao hàng!");
        return;
      }
      setStep(2);
    } else if (step === 2) setStep(3);
  };

  const handlePreviousStep = () => { if (step > 1) setStep(step - 1); };

  const handlePlaceOrder = () => {
    if (!isAuthenticated) { toast.error("Vui lòng đăng nhập!"); return; }
    try {
      // GỌI HÀM CREATEORDER VỚI CẤU TRÚC ĐÚNG
      const order = createOrder(
        items,
        { fullName, phone, address, ward, district, city, note: addressNote }, // Object ShippingAddress
        paymentMethod,
        orderNote
      );
      clearCart();
      toast.success("Đặt hàng thành công!", { description: `Mã đơn: ${order.id}` });
      if (onOrderCreated) onOrderCreated(order.id);
      onOpenChange(false);
      
      // Reset form
      setStep(1); setAddress(""); setWard(""); setDistrict(""); setCity(""); setAddressNote(""); setOrderNote("");
    } catch (error) { toast.error("Lỗi khi đặt hàng!"); }
  };

  const paymentMethodOptions = [
    { value: "cod", label: "Thanh toán khi nhận hàng (COD)", icon: Package, description: "Tiền mặt" },
    { value: "bank_transfer", label: "Chuyển khoản ngân hàng", icon: Building2, description: "VietQR, MBBank..." },
    { value: "momo", label: "Ví MoMo", icon: Wallet, description: "Quét mã QR" },
    { value: "zalopay", label: "ZaloPay", icon: Smartphone, description: "Ví ZaloPay" },
    { value: "vnpay", label: "VNPay", icon: CreditCard, description: "Thanh toán qua cổng VNPay" },
    { value: "credit_card", label: "Thẻ tín dụng/Ghi nợ", icon: CreditCard, description: "Visa, MasterCard" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><ShoppingBag className="w-6 h-6 text-orange-500" /> Thanh Toán</DialogTitle>
          <DialogDescription>Hoàn tất thông tin để đặt hàng</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-6 px-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}`}>{step > s ? <CheckCircle2 className="w-5 h-5" /> : s}</div>
                    <span className={step >= s ? "text-orange-500 font-medium" : "text-gray-500"}>{s === 1 ? "Địa chỉ" : s === 2 ? "Thanh toán" : "Xác nhận"}</span>
                </div>
                {s < 3 && <div className="flex-1 h-0.5 bg-gray-200 mx-2"><div className="h-full bg-orange-500 transition-all" style={{ width: step > s ? "100%" : "0%" }} /></div>}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={handleFillInfo} className="text-teal-700 hover:bg-teal-50"><User className="w-4 h-4 mr-2"/> Sử dụng thông tin tài khoản</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Họ tên *</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A" /></div>
              <div className="space-y-2"><Label>SĐT *</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09..." /></div>
            </div>
            <div className="space-y-2"><Label>Địa chỉ *</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Số nhà, đường..." /></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Tỉnh/TP *</Label><AddressSelect options={vietnamAddress} value={city} onValueChange={setCity} placeholder="Chọn tỉnh/TP" /></div>
              <div className="space-y-2"><Label>Quận/Huyện *</Label><AddressSelect options={availableDistricts} value={district} onValueChange={setDistrict} placeholder="Chọn quận/huyện" disabled={!city} /></div>
              <div className="space-y-2"><Label>Phường/Xã *</Label><AddressSelect options={availableWards} value={ward} onValueChange={setWard} placeholder="Chọn phường/xã" disabled={!district} /></div>
            </div>
            <div className="space-y-2"><Label>Ghi chú</Label><Textarea value={addressNote} onChange={(e) => setAddressNote(e.target.value)} placeholder="Ghi chú giao hàng..." rows={2} /></div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as PaymentMethod)} className="grid gap-3">
              {paymentMethodOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <div key={opt.value} onClick={() => setPaymentMethod(opt.value as PaymentMethod)} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer ${paymentMethod === opt.value ? "border-orange-500 bg-orange-50" : "hover:bg-gray-50"}`}>
                    <RadioGroupItem value={opt.value} id={opt.value} />
                    <div className="flex-1"><div className="flex items-center gap-2 mb-1"><Icon className="w-5 h-5 text-teal-900" /><Label className="cursor-pointer font-medium">{opt.label}</Label></div><p className="text-sm text-gray-600">{opt.description}</p></div>
                  </div>
                );
              })}
            </RadioGroup>
            <div className="space-y-2 mt-4"><Label>Lời nhắn đơn hàng</Label><Textarea value={orderNote} onChange={(e) => setOrderNote(e.target.value)} placeholder="Lời nhắn..." rows={3} /></div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <div className="flex justify-between items-start">
                    <div><p className="font-semibold text-teal-900 flex items-center gap-2"><MapPin className="w-4 h-4"/> Nhận hàng</p><p>{fullName} | {phone}</p><p className="text-gray-600">{address}, {ward}, {district}, {city}</p></div>
                    <Button variant="link" onClick={() => setStep(1)} className="text-orange-500 h-auto p-0">Sửa</Button>
                </div>
                <Separator className="my-2"/>
                <div className="flex justify-between items-start">
                    <div><p className="font-semibold text-teal-900 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Thanh toán</p><p>{paymentMethodOptions.find(p => p.value === paymentMethod)?.label}</p></div>
                    <Button variant="link" onClick={() => setStep(2)} className="text-orange-500 h-auto p-0">Sửa</Button>
                </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 font-semibold text-teal-900 flex items-center gap-2"><Package className="w-4 h-4"/> Sản phẩm ({items.length})</div>
                <div className="divide-y max-h-48 overflow-y-auto">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-3 p-3 bg-white text-sm">
                            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0"><ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
                            <div className="flex-1 min-w-0"><p className="truncate font-medium">{item.name}</p><p className="text-gray-500">x{item.quantity}</p></div>
                            <p className="text-orange-600 font-medium">{item.price}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
            {step > 1 && <Button variant="outline" onClick={handlePreviousStep} className="flex-1">Quay lại</Button>}
            {step < 3 ? <Button onClick={handleNextStep} className="flex-1 bg-orange-500 hover:bg-orange-600">Tiếp tục</Button> : <Button onClick={handlePlaceOrder} className="flex-1 bg-teal-900 hover:bg-teal-800">Đặt hàng</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
import React from 'react'; // Thêm dòng này
// ... các dòng import khác

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Phone, Mail } from "lucide-react";

interface ServiceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    title: string;
    description: string;
    details: string;
    features: string[];
    price: string;
  } | null;
  onShopClick?: (type: 'pharmacy' | 'accessories') => void;
}

export function ServiceDetailDialog({ open, onOpenChange, service, onShopClick }: ServiceDetailDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [petName, setPetName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking:", { name, phone, email, petName, date, notes });
    alert("Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
    onOpenChange(false);
    // Reset form
    setName("");
    setPhone("");
    setEmail("");
    setPetName("");
    setNotes("");
  };

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-teal-900">{service.title}</DialogTitle>
          <DialogDescription>{service.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Details */}
          <div className="bg-teal-50 p-6 rounded-lg">
            <h3 className="text-teal-900 mb-3">Chi Tiết Dịch Vụ</h3>
            <p className="text-gray-700 mb-4">{service.details}</p>
            
            <div className="space-y-2">
              <h4 className="text-teal-900">Bao Gồm:</h4>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-teal-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Giá dịch vụ:</span>
                <span className="text-teal-900">{service.price}</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <h3 className="text-teal-900 mb-4">Đặt Lịch Hẹn</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và Tên</Label>
                  <Input
                    id="name"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pet-name">Tên Thú Cưng</Label>
                  <Input
                    id="pet-name"
                    placeholder="Milo"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số Điện Thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0901234567"
                      className="pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Chọn Ngày</Label>
                <div className="border rounded-lg p-3">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi Chú (Tùy chọn)</Label>
                <Textarea
                  id="notes"
                  placeholder="Có điều gì chúng tôi cần biết về thú cưng của bạn không?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-teal-900 hover:bg-teal-800"
                >
                  Xác Nhận Đặt Lịch
                </Button>
              </div>
            </form>
          </div>
          
          {/* Shop Button for Pharmacy and Accessories */}
          {service && (service.title === "Nhà Thuốc" || service.title === "Quần Áo & Phụ Kiện") && onShopClick && (
            <div className="mt-6 pt-6 border-t">
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  onOpenChange(false);
                  onShopClick(service.title === "Nhà Thuốc" ? 'pharmacy' : 'accessories');
                }}
              >
                Xem Danh Mục {service.title === "Nhà Thuốc" ? "Thuốc" : "Quần Áo & Phụ Kiện"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
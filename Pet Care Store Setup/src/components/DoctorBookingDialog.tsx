import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Award, Phone, Mail, Star, CheckCircle, Stethoscope, Scissors, ChevronRight, ChevronLeft, Calendar as CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";

interface DoctorBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 1. DANH SÁCH BÁC SĨ
const doctors = [
  {
    id: "doc-1",
    name: "BS. Nguyễn Văn An", // Rút gọn tên cho đỡ tốn chỗ
    specialty: "Nội Khoa",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
  },
  {
    id: "doc-2",
    name: "BS. Trần Thị Hoa",
    specialty: "Phẫu Thuật",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
  },
  {
    id: "doc-3",
    name: "BS. Lê Minh Tuấn",
    specialty: "Da Liễu",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
  },
  {
    id: "doc-4",
    name: "BS. Phạm Thu Hằng",
    specialty: "Tim Mạch",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
  }
];

// 2. DANH SÁCH DỊCH VỤ SPA
const GROOMING_STYLES = [
  { id: 'poodle-style', name: 'Cắt Tỉa Poodle', img: 'https://i.ytimg.com/vi/kPQNc33XdTU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAW7eoSeK1kLsApLav815fdGFFjPg' },
  { id: 'corgi-style', name: 'Cắt Tỉa Corgi', img: 'https://pbs.twimg.com/media/C1rszs5VQAE1vBw.jpg' },
  { id: 'pomeranian-style', name: 'Cắt Tỉa Phốc Sóc', img: 'https://cdn.shopify.com/s/files/1/0257/7412/9229/files/9_Totally_Cute_Pomeranian_Haircut_Styles_To_Satisfy_Your_Craving_For_Fluffiness_Today_480x480.png?v=1664354047' },
  { id: 'cat-grooming', name: 'Cạo Lông Mèo', img: 'https://file.hstatic.net/200000491469/article/dat-meo-nam-nghien-de-cao-long_304a273f54aa45aca43f0015fc7aa037.jpg' }
];

export function DoctorBookingDialog({ open, onOpenChange }: DoctorBookingDialogProps) {
  const [activeTab, setActiveTab] = useState("services");

  // - State
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedGrooming, setSelectedGrooming] = useState<string | null>(null);
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [ownerName, setOwnerName] = useState("");
  const [petName, setPetName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  // Logic chọn: Chọn cái này thì bỏ cái kia
  const handleSelectDoctor = (id: string) => {
    setSelectedDoctor(id);
    setSelectedGrooming(null);
  };

  const handleSelectGrooming = (id: string) => {
    setSelectedGrooming(id);
    setSelectedDoctor(null);
  };

  const handleNextStep = () => {
    if (selectedDoctor || selectedGrooming) {
      setActiveTab("details");
    } else {
      alert("Vui lòng chọn Bác sĩ hoặc Dịch vụ Spa trước!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeSlot || !date) { alert("Vui lòng chọn ngày giờ!"); return; }

    const newBooking = {
      id: Date.now(),
      type: selectedDoctor ? 'medical' : 'grooming',
      serviceName: selectedDoctor 
        ? `Khám: ${doctors.find(d => d.id === selectedDoctor)?.name}` 
        : `Spa: ${GROOMING_STYLES.find(g => g.id === selectedGrooming)?.name}`,
      date: date.toLocaleDateString('vi-VN'),
      time: timeSlot,
      customerName: ownerName,
      petName: petName,
      phone, email, notes: reason,
      status: 'pending'
    };

    const existingBookings = JSON.parse(localStorage.getItem('petcare_bookings') || '[]');
    localStorage.setItem('petcare_bookings', JSON.stringify([...existingBookings, newBooking]));
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onOpenChange(false);
    setSelectedDoctor(null); setSelectedGrooming(null); setActiveTab("services");
    setDate(new Date()); setTimeSlot("");
  };

  // Helper lấy tên dịch vụ đang chọn
  const getSelectedServiceName = () => {
    if (selectedDoctor) return `Khám Bệnh: ${doctors.find(d => d.id === selectedDoctor)?.name}`;
    if (selectedGrooming) return `Spa: ${GROOMING_STYLES.find(g => g.id === selectedGrooming)?.name}`;
    return "";
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[400px] text-center p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-teal-900">Đặt Lịch Thành Công!</h2>
            <p className="text-sm text-gray-600">Chúng tôi sẽ liên hệ sớm nhất.</p>
            <Button onClick={handleClose} className="w-full bg-orange-500 hover:bg-orange-600">Đóng</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 1. GIẢM CHIỀU CAO: Dùng max-h-[85vh] thay vì 90vh và sm:max-w-[900px] cho gọn ngang */}
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] p-0 flex flex-col overflow-hidden">
        
        {/* Header gọn hơn */}
        <DialogHeader className="px-6 py-3 border-b bg-white z-10 shrink-0">
          <DialogTitle className="text-xl text-teal-900">Đặt Lịch Dịch Vụ</DialogTitle>
          <DialogDescription className="text-xs">
            Bước {activeTab === 'services' ? '1/2: Chọn Dịch Vụ' : '2/2: Thông Tin & Lịch Hẹn'}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Header - Gọn lại */}
        <div className="px-6 pt-2 bg-gray-50/50 shrink-0">
          <div className="grid grid-cols-2 bg-gray-200 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('services')}
              className={`py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'services' ? 'bg-white text-teal-900 shadow-sm' : 'text-gray-500'}`}
            >
              1. Chọn Dịch Vụ
            </button>
            <button 
              disabled={!selectedDoctor && !selectedGrooming}
              onClick={() => setActiveTab('details')}
              className={`py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'details' ? 'bg-white text-teal-900 shadow-sm' : 'text-gray-500'}`}
            >
              2. Thông Tin & Lịch
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-4 bg-gray-50/30">
          <Tabs value={activeTab} className="w-full">
            
            {/* --- TAB 1: CHỌN DỊCH VỤ --- */}
            <TabsContent value="services" className="space-y-6 mt-0 animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Chọn Bác Sĩ */}
              <div className="space-y-2">
                <h3 className="font-bold text-base text-teal-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-orange-500" /> Chọn Bác Sĩ
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {doctors.map((doctor) => (
                    <Card
                      key={doctor.id}
                      onClick={() => handleSelectDoctor(doctor.id)}
                      className={`cursor-pointer transition-all border-2 relative overflow-hidden group ${
                        selectedDoctor === doctor.id 
                          ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600" 
                          : "border-white hover:border-teal-200"
                      } ${selectedGrooming ? "opacity-40 grayscale" : ""}`} 
                    >
                      {/* Giảm padding card */}
                      <CardContent className="p-3 flex gap-3 items-center">
                        <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-teal-900">{doctor.name}</h4>
                          <div className="flex items-center justify-between mt-1">
                             <Badge variant="secondary" className="text-[10px] px-1 h-5">{doctor.specialty}</Badge>
                             <div className="flex items-center gap-1 text-[10px] text-yellow-600">
                                <Star className="w-3 h-3 fill-current" /> {doctor.rating}
                             </div>
                          </div>
                        </div>
                        {selectedDoctor === doctor.id && (
                          <div className="bg-teal-600 text-white p-1 rounded-full animate-in zoom-in">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 my-1">
                 <div className="h-px bg-gray-300 flex-1"></div>
                 <span className="text-gray-400 text-xs font-medium">HOẶC</span>
                 <div className="h-px bg-gray-300 flex-1"></div>
              </div>

              {/* Chọn Spa - GIẢM CHIỀU CAO ẢNH */}
              <div className="space-y-2">
                <h3 className="font-bold text-base text-teal-900 flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-orange-500" /> Chọn Dịch Vụ Spa
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {GROOMING_STYLES.map((style) => (
                    <div 
                      key={style.id}
                      onClick={() => handleSelectGrooming(style.id)}
                      className={`
                        relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all bg-white
                        ${selectedGrooming === style.id ? 'border-orange-500 ring-1 ring-orange-500 shadow-md' : 'border-gray-100 hover:border-orange-200'}
                        ${selectedDoctor ? "opacity-40 grayscale" : ""}
                      `}
                    >
                      {/* SỬA LẠI CHIỀU CAO ẢNH: h-24 (96px) thay vì vuông, giúp tiết kiệm diện tích dọc */}
                      <div className="h-24 w-full overflow-hidden">
                        <img src={style.img} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2 text-center">
                        <h4 className="font-bold text-xs text-gray-800">{style.name}</h4>
                      </div>
                      {selectedGrooming === style.id && (
                        <div className="absolute top-1 right-1 bg-orange-500 text-white rounded-full p-0.5 shadow-md">
                          <CheckCircle className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="h-10"></div> 
            </TabsContent>

            {/* --- TAB 2: THÔNG TIN & LỊCH --- */}
            <TabsContent value="details" className="mt-0 h-full animate-in fade-in slide-in-from-right-8 duration-300">
              
              {/* THANH HIỂN THỊ DỊCH VỤ ĐÃ CHỌN (MỚI) */}
              <div className="bg-teal-100 border border-teal-200 p-2 rounded-md mb-4 flex items-center gap-2 text-teal-900 text-sm">
                <CheckCircle className="w-4 h-4 text-teal-700" />
                <span className="font-semibold">Đã chọn:</span> 
                <span>{getSelectedServiceName()}</span>
              </div>

              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                <div className="grid md:grid-cols-2 gap-6 flex-1">
                  {/* Cột Trái: Chọn Lịch */}
                  <div className="space-y-4">
                    <div className="border rounded-xl p-2 bg-white shadow-sm flex justify-center">
                      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md scale-90" />
                    </div>
                    <div>
                      <Label className="mb-2 block font-semibold text-gray-700 text-sm">Giờ Khám</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot} type="button" size="sm"
                            variant={timeSlot === slot ? "default" : "outline"}
                            onClick={() => setTimeSlot(slot)}
                            className={`text-xs h-8 ${timeSlot === slot ? "bg-orange-500 hover:bg-orange-600 border-none text-white" : "hover:bg-orange-50 text-gray-600"}`}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cột Phải: Form Thông Tin */}
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-fit">
                    <h3 className="font-bold text-teal-900 flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-orange-500" /> Thông Tin Của Bạn
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Tên Chủ *</Label>
                        <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required placeholder="Tên bạn" className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Thú Cưng *</Label>
                        <Input value={petName} onChange={(e) => setPetName(e.target.value)} required placeholder="Tên bé" className="h-8 text-sm" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Số Điện Thoại *</Label>
                      <div className="flex items-center h-8 w-full rounded-md border px-2 bg-white text-sm focus-within:ring-1 focus-within:ring-orange-500">
                        <Phone className="w-3 h-3 text-gray-400 mr-2" />
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="090..." className="flex-1 bg-transparent outline-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Email *</Label>
                       <div className="flex items-center h-8 w-full rounded-md border px-2 bg-white text-sm focus-within:ring-1 focus-within:ring-orange-500">
                        <Mail className="w-3 h-3 text-gray-400 mr-2" />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@..." type="email" className="flex-1 bg-transparent outline-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Ghi Chú</Label>
                      <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="..." rows={2} className="text-sm min-h-[50px]" />
                    </div>
                  </div>
                </div>
              </form>
              <div className="h-14"></div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        {/* FOOTER ĐIỀU HƯỚNG CỐ ĐỊNH - Gọn hơn */}
        <div className="px-6 py-3 border-t bg-white z-20 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0">
          {activeTab === 'details' ? (
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('services')} className="text-gray-500 hover:text-teal-900">
              <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Hủy</Button>
          )}

          {activeTab === 'services' ? (
            <Button 
              onClick={handleNextStep} 
              disabled={!selectedDoctor && !selectedGrooming}
              className="bg-teal-900 hover:bg-teal-800 px-6 h-10 shadow-lg"
            >
              Tiếp Theo <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              className="bg-orange-500 hover:bg-orange-600 px-6 h-10 shadow-lg font-bold text-white"
            >
              Xác Nhận Đặt Lịch
            </Button>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}
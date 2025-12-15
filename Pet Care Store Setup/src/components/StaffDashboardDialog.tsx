// FILE: src/components/StaffDashboardDialog.tsx

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext'; 
import { Calendar as CalendarIcon, Clock, Package, TrendingUp, CheckCircle, XCircle, ChevronLeft, ChevronRight, User, Stethoscope, ShoppingBag, DollarSign, Scissors, FileText, Pill, Activity, Heart, AlertCircle, Users, BarChart3, Award, Target } from 'lucide-react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

// --- Kiểu dữ liệu ---
interface Booking {
  id: number; customerName: string; petName: string; serviceName: string; date: string; time: string; 
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'; notes: string; doctorNotes: string; type: 'medical' | 'grooming';
  diagnosis?: string; prescription?: string; temperature?: string; weight?: string; nextVisit?: string;
  staffId?: number;
}

interface Staff {
  id: number;
  name: string;
  role: 'caregiver' | 'receptionist';
  stats: {
    completedBookings: number;
    rating: number;
    revenue: number;
  };
}

// Helper functions
const getTodayString = () => {
    const d = new Date();
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

// Mock data
const MOCK_BOOKINGS: Booking[] = [
    { id: 1, customerName: "Nguyễn Văn A", petName: "Mimi", serviceName: "Khám Nội Khoa", date: getTodayString(), time: "09:00", status: "confirmed", notes: "Sốt nhẹ, bỏ ăn", doctorNotes: "", type: 'medical', staffId: 1 },
    { id: 2, customerName: "Trần Thị B", petName: "Lu", serviceName: "Spa Cắt Tỉa", date: getTodayString(), time: "10:30", status: "confirmed", notes: "Cạo lông mùa hè", doctorNotes: "", type: 'grooming', staffId: 2 },
    { id: 3, customerName: "Lê Văn C", petName: "Kiki", serviceName: "Tiêm phòng", date: getTomorrowString(), time: "14:00", status: "pending", notes: "Mũi 2 dại", doctorNotes: "", type: 'medical', staffId: 1 },
    { id: 4, customerName: "Phạm Văn D", petName: "Bông", serviceName: "Tắm Vệ Sinh", date: getTodayString(), time: "15:30", status: "confirmed", notes: "Cần tắm kỹ", doctorNotes: "", type: 'grooming', staffId: 2 },
    { id: 5, customerName: "Hoàng Thị E", petName: "Mực", serviceName: "Khám Da Liễu", date: getTodayString(), time: "16:00", status: "completed", notes: "Bị nấm da", doctorNotes: "", type: 'medical', staffId: 1 },
];

const MOCK_STAFF: Staff[] = [
    { id: 1, name: "BS. Nguyễn Văn An", role: "caregiver", stats: { completedBookings: 45, rating: 4.8, revenue: 22500000 } },
    { id: 2, name: "BS. Trần Thị Bình", role: "caregiver", stats: { completedBookings: 38, rating: 4.9, revenue: 19000000 } },
    { id: 3, name: "LT. Lê Thị Cúc", role: "receptionist", stats: { completedBookings: 120, rating: 4.7, revenue: 0 } },
    { id: 4, name: "LT. Phạm Văn Dũng", role: "receptionist", stats: { completedBookings: 95, rating: 4.6, revenue: 0 } },
];

const OrderProgress = ({ status }: { status: string }) => {
    const steps = [
        { key: 'pending', label: 'Chờ duyệt', icon: Clock },
        { key: 'processing', label: 'Đang xử lý', icon: Package },
        { key: 'shipped', label: 'Đang giao', icon: ShoppingBag },
        { key: 'delivered', label: 'Hoàn tất', icon: CheckCircle },
    ];

    const currentIdx = steps.findIndex(s => s.key === status);
    const isCancelled = status === 'cancelled';

    if (isCancelled) return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center justify-center font-bold mb-6">
            <XCircle className="w-5 h-5 mr-2"/> Đơn hàng đã bị hủy
        </div>
    );

    return (
        <div className="mb-8 px-2">
            <div className="relative flex justify-between items-center">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 rounded-full transform -translate-y-1/2"></div>
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-teal-600 -z-0 rounded-full transform -translate-y-1/2 transition-all duration-500"
                    style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, idx) => {
                    const isActive = idx <= currentIdx;
                    const Icon = step.icon;
                    return (
                        <div key={step.key} className="relative z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-teal-600 border-teal-600 text-white scale-110 shadow-md' : 'bg-white border-gray-300 text-gray-400'}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`absolute top-12 text-xs font-bold whitespace-nowrap ${idx === currentIdx ? 'text-teal-800' : isActive ? 'text-teal-600' : 'text-gray-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export function StaffDashboardDialog({ open, onOpenChange }: Props) {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrder();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [staff] = useState<Staff[]>(MOCK_STAFF);
  const [activeTab, setActiveTab] = useState("bookings");
  const [managerTab, setManagerTab] = useState("overview");
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<string>(""); 
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  useEffect(() => {
      if (open) {
          const saved = localStorage.getItem('petcare_bookings');
          setBookings(saved ? JSON.parse(saved) : MOCK_BOOKINGS);
          setSelectedDate(getTodayString());
      }
  }, [open]);

  const saveBookings = (newData: Booking[]) => {
      setBookings(newData);
      localStorage.setItem('petcare_bookings', JSON.stringify(newData));
  };

  const updateBookingStatus = (id: number, status: Booking['status']) => {
      const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
      saveBookings(updated);
  };

  const updateBookingData = (id: number, data: Partial<Booking>) => {
      const updated = bookings.map(b => b.id === id ? { ...b, ...data } : b);
      setBookings(updated);
  };

  const saveBookingData = (id: number) => {
      localStorage.setItem('petcare_bookings', JSON.stringify(bookings));
      alert("Đã lưu hồ sơ thành công!");
  };

  const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay(); 
      const days: (Date | null)[] = [];
      for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
      for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
      return days;
  };

  const formatDateStr = (date: Date) => {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const changeMonth = (offset: number) => {
      const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
      setCurrentDate(new Date(newDate));
  };

  const StatusBadge = ({ status }: { status: string }) => {
      const config: any = {
          pending: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800" },
          confirmed: { label: "Đã duyệt", color: "bg-blue-100 text-blue-800" },
          completed: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
          cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
          processing: { label: "Đang xử lý", color: "bg-purple-100 text-purple-800" },
          shipped: { label: "Đang giao", color: "bg-orange-100 text-orange-800" },
          delivered: { label: "Đã giao", color: "bg-teal-100 text-teal-800" },
      };
      const style = config[status] || config.pending;
      return <Badge className={style.color}>{style.label}</Badge>;
  };

  // VIEW BÁC SĨ
  const CaregiverView = () => {
      const days = getDaysInMonth(currentDate);
      const selectedBookings = bookings.filter(b => b.date === selectedDate && b.status === 'confirmed');
      const todayStr = getTodayString();

      return (
          <div className="flex gap-6 h-full overflow-hidden">
              <div className="w-[320px] shrink-0 border rounded-xl p-4 bg-white shadow-sm h-fit">
                  <div className="flex justify-between items-center mb-4">
                      <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)}><ChevronLeft className="w-4 h-4"/></Button>
                      <span className="font-bold text-lg text-teal-900">Tháng {currentDate.getMonth() + 1}/{currentDate.getFullYear()}</span>
                      <Button variant="ghost" size="icon" onClick={() => changeMonth(1)}><ChevronRight className="w-4 h-4"/></Button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-x-1 text-center text-xs font-semibold text-gray-400 mb-3">
                      {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                          <div key={day} className="flex items-center justify-center h-10 w-full">{day}</div>
                      ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                      {days.map((date, idx) => {
                          if (!date) return <div key={idx} className="h-10 w-full"></div>;
                          const dateStr = formatDateStr(date);
                          const hasBooking = bookings.some(b => b.date === dateStr && b.status === 'confirmed');
                          const isSelected = dateStr === selectedDate;
                          const isToday = dateStr === todayStr;
                          
                          return (
                              <button
                                  key={idx}
                                  onClick={() => setSelectedDate(dateStr)}
                                  className={`h-10 w-full rounded-full flex items-center justify-center text-sm transition-all relative
                                      ${isSelected ? 'bg-teal-900 text-white shadow-lg scale-105' : hasBooking ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700'}
                                      ${isToday && !isSelected ? 'border-2 border-teal-900 font-bold' : ''}`}
                              >
                                  <span>{date.getDate()}</span>
                              </button>
                          );
                      })}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t text-xs text-gray-500 flex gap-4 justify-center">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Có lịch hẹn</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full border border-teal-900"></div> Hôm nay</div>
                  </div>
              </div>

              <div className="w-[280px] shrink-0 bg-gray-50 rounded-xl p-4 border flex flex-col overflow-hidden">
                  <h3 className="font-bold text-teal-900 mb-4 flex items-center gap-2 pb-2 border-b shrink-0">
                      <CalendarIcon className="w-5 h-5 text-blue-500"/> 
                      <span>Lịch ngày {selectedDate}</span>
                  </h3>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                      {selectedBookings.length === 0 ? (
                          <div className="text-center py-12 text-gray-400 flex flex-col items-center">
                              <Clock className="w-10 h-10 mb-2 opacity-20"/>
                              <p className="text-sm">Không có lịch hẹn</p>
                          </div>
                      ) : (
                          selectedBookings.map(b => (
                              <button
                                  key={b.id}
                                  onClick={() => setSelectedBooking(b)}
                                  className={`w-full text-left p-3 rounded-lg border transition-all ${selectedBooking?.id === b.id ? 'bg-teal-700 border-teal-800 shadow-lg' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                              >
                                  <div className="flex items-start gap-2">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedBooking?.id === b.id ? 'bg-white text-teal-700' : b.type === 'medical' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                          {b.type === 'medical' ? <Stethoscope className="w-4 h-4"/> : <Scissors className="w-4 h-4"/>}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <div className={`font-bold text-sm truncate ${selectedBooking?.id === b.id ? 'text-white' : 'text-gray-900'}`}>{b.petName}</div>
                                          <div className={`text-xs truncate ${selectedBooking?.id === b.id ? 'text-white/90' : 'text-gray-500'}`}>{b.customerName}</div>
                                          <div className={`text-xs font-medium mt-1 ${selectedBooking?.id === b.id ? 'text-white' : 'text-teal-600'}`}>{b.time}</div>
                                      </div>
                                      {b.status === 'completed' && (
                                          <CheckCircle className={`w-4 h-4 shrink-0 ${selectedBooking?.id === b.id ? 'text-white' : 'text-green-500'}`}/>
                                      )}
                                  </div>
                              </button>
                          ))
                      )}
                  </div>
              </div>

              <div className="flex-1 bg-white rounded-xl p-6 border overflow-hidden flex flex-col">
                  {!selectedBooking ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                          <FileText className="w-16 h-16 mb-3 opacity-20"/>
                          <p className="font-medium">Chọn bệnh nhân để bắt đầu</p>
                          <p className="text-sm">Nhấp vào lịch hẹn bên trái</p>
                      </div>
                  ) : (
                      <>
                          <div className="pb-4 border-b shrink-0">
                              <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedBooking.type === 'medical' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                          {selectedBooking.type === 'medical' ? <Stethoscope className="w-6 h-6"/> : <Scissors className="w-6 h-6"/>}
                                      </div>
                                      <div>
                                          <h3 className="text-xl font-bold text-gray-900">{selectedBooking.petName}</h3>
                                          <p className="text-sm text-gray-500">Chủ: {selectedBooking.customerName}</p>
                                      </div>
                                  </div>
                                  <StatusBadge status={selectedBooking.status} />
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1.5 text-gray-600">
                                      <Clock className="w-4 h-4 text-teal-600"/>
                                      <span className="font-medium">{selectedBooking.time}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-gray-600">
                                      <CalendarIcon className="w-4 h-4 text-teal-600"/>
                                      <span>{selectedBooking.date}</span>
                                  </div>
                                  <div className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold">
                                      {selectedBooking.serviceName}
                                  </div>
                              </div>
                              {selectedBooking.notes && (
                                  <div className="mt-3 flex items-start gap-2 p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                                      <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5"/>
                                      <div>
                                          <div className="text-xs font-bold text-yellow-800 mb-0.5">Lý do khám:</div>
                                          <div className="text-sm text-yellow-700">{selectedBooking.notes}</div>
                                      </div>
                                  </div>
                              )}
                          </div>

                          <div className="flex-1 overflow-y-auto custom-scrollbar mt-4 pr-2">
                              {selectedBooking.type === 'medical' ? (
                                  <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                          <div>
                                              <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                                  <Activity className="w-3.5 h-3.5 text-red-500"/> Nhiệt độ (°C)
                                              </label>
                                              <Input 
                                                  placeholder="VD: 38.5" 
                                                  value={selectedBooking.temperature || ''}
                                                  onChange={(e) => updateBookingData(selectedBooking.id, { temperature: e.target.value })}
                                                  disabled={selectedBooking.status === 'completed'}
                                              />
                                          </div>
                                          <div>
                                              <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                                  <Heart className="w-3.5 h-3.5 text-pink-500"/> Cân nặng (kg)
                                              </label>
                                              <Input 
                                                  placeholder="VD: 5.2" 
                                                  value={selectedBooking.weight || ''}
                                                  onChange={(e) => updateBookingData(selectedBooking.id, { weight: e.target.value })}
                                                  disabled={selectedBooking.status === 'completed'}
                                              />
                                          </div>
                                      </div>

                                      <div>
                                          <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                              <FileText className="w-3.5 h-3.5 text-blue-500"/> Chẩn đoán
                                          </label>
                                          <Textarea 
                                              placeholder="Nhập triệu chứng, bệnh lý phát hiện..." 
                                              className="min-h-[100px] resize-none"
                                              value={selectedBooking.diagnosis || ''}
                                              onChange={(e) => updateBookingData(selectedBooking.id, { diagnosis: e.target.value })}
                                              disabled={selectedBooking.status === 'completed'}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                              <Pill className="w-3.5 h-3.5 text-green-500"/> Đơn thuốc & Liều lượng
                                          </label>
                                          <Textarea 
                                              placeholder="Tên thuốc, liều dùng, tần suất..." 
                                              className="min-h-[120px] resize-none"
                                              value={selectedBooking.prescription || ''}
                                              onChange={(e) => updateBookingData(selectedBooking.id, { prescription: e.target.value })}
                                              disabled={selectedBooking.status === 'completed'}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                              <CalendarIcon className="w-3.5 h-3.5 text-purple-500"/> Lịch tái khám
                                          </label>
                                          <Input 
                                              type="date" 
                                              value={selectedBooking.nextVisit || ''}
                                              onChange={(e) => updateBookingData(selectedBooking.id, { nextVisit: e.target.value })}
                                              disabled={selectedBooking.status === 'completed'}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                              <FileText className="w-3.5 h-3.5 text-gray-500"/> Ghi chú thêm
                                          </label>
                                          <Textarea 
                                              placeholder="Lưu ý đặc biệt, theo dõi..." 
                                              className="min-h-[80px] resize-none"
                                              value={selectedBooking.doctorNotes || ''}
                                              onChange={(e) => updateBookingData(selectedBooking.id, { doctorNotes: e.target.value })}
                                              disabled={selectedBooking.status === 'completed'}
                                          />
                                      </div>
                                  </div>
                              ) : (
                                  <div className="space-y-4">
                                      <div>
                                          <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                              <Scissors className="w-3.5 h-3.5 text-pink-500"/> Dịch vụ đã thực hiện
                                          </label>
                                          <Textarea 
                                              placeholder="Tắm, cắt tỉa, vệ sinh tai, cắt móng..." 
                                              className="min-h-[100px] resize-none"
                                              value={selectedBooking.diagnosis || ''}
                                              onChange={(e) => updateBookingData(selectedBooking.id, { diagnosis: e.target.value })}
                                              disabled={selectedBooking.status === 'completed'}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                              <Heart className="w-3.5 h-3.5 text-pink-500"/> Tình trạng da, lông
                                          </label>
                                          <Textarea 
                                              placeholder="Ghi chú về tình trạng da, lông, phát hiện bất thường..." 
                                              className="min-h-[100px] resize-none"
                                              value={selectedBooking.prescription || ''}
                                              onChange={(e) => updateBookingData(selectedBooking.id, { prescription: e.target.value })}
                                              disabled={selectedBooking.status === 'completed'}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                              <CalendarIcon className="w-3.5 h-3.5 text-purple-500"/> Lịch hẹn tiếp theo
                                          </label>
                                          <Input 
                                              type="date" 
                                              value={selectedBooking.nextVisit || ''}
                                              onChange={(e) => updateBookingData(selectedBooking.id, { nextVisit: e.target.value })}
                                              disabled={selectedBooking.status === 'completed'}
                                          />
                                      </div>

                                      <div>
                                          <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                              <FileText className="w-3.5 h-3.5 text-gray-500"/> Ghi chú & Khuyến nghị
                                          </label>
                                          <Textarea 
                                              placeholder="Sản phẩm chăm sóc đề xuất, lưu ý cho chủ..." 
                                              className="min-h-[120px] resize-none"
                                              value={selectedBooking.doctorNotes || ''}
                                              onChange={(e) => updateBookingData(selectedBooking.id, { doctorNotes: e.target.value })}
                                              disabled={selectedBooking.status === 'completed'}
                                          />
                                      </div>
                                  </div>
                              )}
                          </div>

                          {selectedBooking.status !== 'completed' && (
                              <div className="pt-4 border-t mt-4 flex justify-end gap-3 shrink-0">
                                  <Button 
                                      variant="outline" 
                                      onClick={() => saveBookingData(selectedBooking.id)}
                                  >
                                      <FileText className="w-4 h-4 mr-2"/> Lưu Nháp
                                  </Button>
                                  <Button 
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => {
                                          updateBookingStatus(selectedBooking.id, 'completed');
                                          saveBookingData(selectedBooking.id);
                                          setSelectedBooking(null);
                                      }}
                                  >
                                      <CheckCircle className="w-4 h-4 mr-2"/> Hoàn Thành & Đóng
                                  </Button>
                              </div>
                          )}
                      </>
                  )}
              </div>
          </div>
      );
  };

  // VIEW LỄ TÂN
  const BookingView = () => {
      const days = getDaysInMonth(currentDate);
      const selectedBookings = bookings.filter(b => b.date === selectedDate);
      const todayStr = getTodayString();

      return (
          <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
              <div className="w-full md:w-[320px] shrink-0 border rounded-xl p-4 bg-white shadow-sm h-fit">
                  <div className="flex justify-between items-center mb-4">
                      <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)}><ChevronLeft className="w-4 h-4"/></Button>
                      <span className="font-bold text-lg text-teal-900">Tháng {currentDate.getMonth() + 1}/{currentDate.getFullYear()}</span>
                      <Button variant="ghost" size="icon" onClick={() => changeMonth(1)}><ChevronRight className="w-4 h-4"/></Button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-x-1 text-center text-xs font-semibold text-gray-400 mb-3">
                      <div className="flex items-center justify-center h-10 w-full">CN</div>
                      <div className="flex items-center justify-center h-10 w-full">T2</div>
                      <div className="flex items-center justify-center h-10 w-full">T3</div>
                      <div className="flex items-center justify-center h-10 w-full">T4</div>
                      <div className="flex items-center justify-center h-10 w-full">T5</div>
                      <div className="flex items-center justify-center h-10 w-full">T6</div>
                      <div className="flex items-center justify-center h-10 w-full">T7</div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                      {days.map((date, idx) => {
                          if (!date) return <div key={idx} className="h-10 w-full"></div>;
                          const dateStr = formatDateStr(date);
                          const hasBooking = bookings.some(b => b.date === dateStr && b.status !== 'cancelled');
                          const isSelected = dateStr === selectedDate;
                          const isToday = dateStr === todayStr;
                          
                          return (
                              <button
                                  key={idx}
                                  onClick={() => setSelectedDate(dateStr)}
                                  className={`
                                      h-10 w-full rounded-full flex items-center justify-center text-sm transition-all relative
                                      ${isSelected ? 'bg-teal-900 text-white shadow-lg scale-105' : hasBooking ? 'bg-orange-500 text-white' : 'hover:bg-gray-100 text-gray-700'}
                                      ${isToday && !isSelected ? 'border-2 border-teal-900 font-bold' : ''}
                                  `}
                              >
                                  <span>{date.getDate()}</span>
                              </button>
                          );
                      })}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t text-xs text-gray-500 flex gap-4 justify-center">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Có khách đặt</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full border border-teal-900"></div> Hôm nay</div>
                  </div>
              </div>

              <div className="flex-1 bg-gray-50 rounded-xl p-4 border flex flex-col h-full overflow-hidden">
                  <h3 className="font-bold text-teal-900 mb-4 flex items-center gap-2 pb-2 border-b shrink-0">
                      <CalendarIcon className="w-5 h-5 text-orange-500"/> 
                      <span>Lịch ngày {selectedDate}</span>
                      <Badge variant="secondary" className="ml-auto bg-white border">{selectedBookings.length} lịch hẹn</Badge>
                  </h3>
                  
                  <div className="flex-1 overflow-y-auto pr-2 pb-2 custom-scrollbar">
                      {selectedBookings.length === 0 ? (
                          <div className="text-center py-16 text-gray-400 flex flex-col items-center">
                              <Clock className="w-12 h-12 mb-2 opacity-20"/>
                              <p>Không có lịch hẹn nào.</p>
                          </div>
                      ) : (
                          <div className="space-y-3">
                              {selectedBookings.map(b => (
                                  <div key={b.id} className="bg-white p-4 rounded-xl border shadow-sm hover:border-teal-300 transition-colors group">
                                      <div className="flex justify-between items-start mb-3">
                                          <div className="flex items-center gap-3">
                                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${b.type === 'medical' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                                  {b.type === 'medical' ? <Stethoscope className="w-5 h-5"/> : <User className="w-5 h-5"/>}
                                              </div>
                                              <div>
                                                  <div className="flex items-center gap-2">
                                                      <span className="font-bold text-gray-900 text-lg">{b.petName}</span>
                                                      <span className="text-sm text-gray-500 font-normal">({b.customerName})</span>
                                                  </div>
                                                  <p className="text-xs font-medium text-teal-700 uppercase tracking-wide">{b.serviceName}</p>
                                              </div>
                                          </div>
                                          <StatusBadge status={b.status} />
                                      </div>
                                      
                                      <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg mb-3">
                                          <Clock className="w-4 h-4 text-orange-500"/> 
                                          <span className="font-bold">{b.time}</span>
                                          {b.notes && (
                                              <>
                                                  <span className="text-gray-300">|</span>
                                                  <span className="italic text-gray-600 truncate">{b.notes}</span>
                                              </>
                                          )}
                                      </div>

                                      {user?.role === 'receptionist' && b.status === 'pending' && (
                                          <div className="flex justify-end gap-3 mt-2 pt-3 border-t border-dashed">
                                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => updateBookingStatus(b.id, 'cancelled')}>
                                                  Từ chối
                                              </Button>
                                              <Button size="sm" className="!bg-teal-700 !text-white hover:!bg-teal-800 shadow-sm opacity-100" onClick={() => updateBookingStatus(b.id, 'confirmed')}>
                                                  <CheckCircle className="w-4 h-4 mr-2"/> Duyệt Lịch Ngay
                                              </Button>
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  const OrderView = () => {
      return (
          <div className="space-y-6 pb-6">
              {orders.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-dashed">
                      <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-3"/>
                      <p className="text-gray-500 font-medium">Chưa có đơn hàng nào.</p>
                  </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                              <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-1 rounded border border-teal-200">#{order.id}</span>
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                          </div>
                          <div className="font-bold text-lg text-orange-600">{(order as any).finalAmount?.toLocaleString('vi-VN') || 0}đ</div>
                      </div>

                      <div className="p-6">
                          <OrderProgress status={order.status} />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                              <div>
                                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                      <User className="w-4 h-4 text-teal-600" /> Khách hàng
                                  </h4>
                                  <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2 text-gray-700">
                                      <p><span className="font-medium">Họ tên:</span> {order.customerName || order.shippingAddress?.fullName || 'Khách vãng lai'}</p>
                                      <p><span className="font-medium">SĐT:</span> {order.shippingAddress?.phone || '---'}</p>
                                      <p className="truncate"><span className="font-medium">Địa chỉ:</span> {order.shippingAddress?.address || 'Tại cửa hàng'}</p>
                                  </div>
                              </div>

                              <div>
                                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                      <Package className="w-4 h-4 text-teal-600" /> Sản phẩm
                                  </h4>
                                  <div className="border rounded-lg overflow-hidden">
                                      <div className="bg-gray-100 p-2 text-xs font-bold text-gray-500 flex justify-between">
                                          <span>Tên sản phẩm</span> <span>Thành tiền</span>
                                      </div>
                                      <div className="p-3 bg-white text-sm space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                                          {(order as any).items && (order as any).items.length > 0 ? (
                                              (order as any).items.map((item: any, idx: number) => (
                                                  <div key={idx} className="flex justify-between border-b border-dashed border-gray-100 last:border-0 pb-1 last:pb-0">
                                                      <span>x{item.quantity} {item.name}</span>
                                                      <span className="font-medium">{item.price?.toLocaleString()}đ</span>
                                                  </div>
                                              ))
                                          ) : (
                                              <div className="flex justify-between text-gray-600 italic">
                                                  <span>Combo dịch vụ/Sản phẩm lẻ</span>
                                                  <span className="font-medium">{(order as any).finalAmount?.toLocaleString()}đ</span>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                          {user?.role === 'receptionist' && order.status === 'pending' && (
                              <Button className="!bg-purple-600 !text-white hover:!bg-purple-700 shadow-sm" onClick={() => updateOrderStatus(order.id, 'processing', 'Đã duyệt', 'Lễ tân')}>
                                  <CheckCircle className="w-4 h-4 mr-2"/> Duyệt Đơn Hàng
                              </Button>
                          )}
                          {user?.role === 'receptionist' && order.status === 'processing' && (
                              <Button className="!bg-orange-500 !text-white hover:!bg-orange-600 shadow-sm" onClick={() => updateOrderStatus(order.id, 'shipped', 'Giao Shipper', 'Kho')}>
                                  <ShoppingBag className="w-4 h-4 mr-2"/> Giao Cho Shipper
                              </Button>
                          )}
                          {user?.role === 'receptionist' && order.status === 'shipped' && (
                               <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50" onClick={() => updateOrderStatus(order.id, 'delivered', 'Hoàn tất', 'Hệ thống')}>
                                  <CheckCircle className="w-4 h-4 mr-2"/> Xác Nhận Đã Giao
                              </Button>
                          )}
                          {order.status === 'delivered' && (
                              <span className="text-sm font-bold text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Đã hoàn thành</span>
                          )}
                      </div>
                  </div>
                ))
              )}
          </div>
      );
  };

  // VIEW QUẢN LÝ - GIỐNG BÁC SĨ
  const ManagerView = () => {
      const completedBookings = bookings.filter(b => b.status === 'completed').length;
      const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
      const revenue = (completedBookings * 500000) + (deliveredOrders * 1500000);

      return (
          <div className="flex gap-6 h-full overflow-hidden">
              {/* DANH SÁCH NHÂN VIÊN */}
              <div className="w-[320px] shrink-0 bg-gray-50 rounded-xl p-4 border flex flex-col overflow-hidden">
                  <h3 className="font-bold text-teal-900 mb-4 flex items-center gap-2 pb-2 border-b shrink-0">
                      <Users className="w-5 h-5 text-blue-500"/> 
                      <span>Danh Sách Nhân Viên</span>
                  </h3>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                      {staff.map(s => {
                          const staffBookings = bookings.filter(b => b.staffId === s.id);
                          const completed = staffBookings.filter(b => b.status === 'completed').length;
                          
                          return (
                              <button
                                  key={s.id}
                                  onClick={() => setSelectedStaff(s)}
                                  className={`w-full text-left p-3 rounded-lg border transition-all ${selectedStaff?.id === s.id ? 'bg-teal-700 border-teal-800 shadow-lg' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                              >
                                  <div className="flex items-start gap-2">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedStaff?.id === s.id ? 'bg-white text-teal-700' : s.role === 'caregiver' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                          {s.role === 'caregiver' ? <Stethoscope className="w-4 h-4"/> : <User className="w-4 h-4"/>}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <div className={`font-bold text-sm truncate ${selectedStaff?.id === s.id ? 'text-white' : 'text-gray-900'}`}>{s.name}</div>
                                          <div className={`text-xs truncate ${selectedStaff?.id === s.id ? 'text-white/90' : 'text-gray-500'}`}>
                                              {s.role === 'caregiver' ? 'Bác sĩ' : 'Lễ tân'}
                                          </div>
                                          <div className={`text-xs font-medium mt-1 ${selectedStaff?.id === s.id ? 'text-white' : 'text-teal-600'}`}>
                                              {completed} ca hoàn thành
                                          </div>
                                      </div>
                                  </div>
                              </button>
                          );
                      })}
                  </div>
              </div>

              {/* CHI TIẾT NHÂN VIÊN */}
              <div className="flex-1 bg-white rounded-xl p-6 border overflow-hidden flex flex-col">
                  {!selectedStaff ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                          <Users className="w-16 h-16 mb-3 opacity-20"/>
                          <p className="font-medium">Chọn nhân viên để xem chi tiết</p>
                          <p className="text-sm">Nhấp vào tên nhân viên bên trái</p>
                      </div>
                  ) : (
                      <>
                          {/* HEADER NHÂN VIÊN */}
                          <div className="pb-4 border-b shrink-0">
                              <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedStaff.role === 'caregiver' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                          {selectedStaff.role === 'caregiver' ? <Stethoscope className="w-6 h-6"/> : <User className="w-6 h-6"/>}
                                      </div>
                                      <div>
                                          <h3 className="text-xl font-bold text-gray-900">{selectedStaff.name}</h3>
                                          <p className="text-sm text-gray-500">{selectedStaff.role === 'caregiver' ? 'Bác sĩ thú y' : 'Lễ tân'}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-1 text-sm">
                                      <Award className="w-4 h-4 text-yellow-500"/>
                                      <span className="font-bold">{selectedStaff.stats.rating.toFixed(1)}</span>
                                  </div>
                              </div>
                              
                              {/* THỐNG KÊ */}
                              <div className="grid grid-cols-3 gap-3 mt-4">
                                  <div className="p-3 bg-green-50 rounded-lg text-center">
                                      <div className="text-xl font-bold text-green-700">
                                          {bookings.filter(b => b.staffId === selectedStaff.id && b.status === 'completed').length}
                                      </div>
                                      <div className="text-xs text-green-600">Hoàn thành</div>
                                  </div>
                                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                                      <div className="text-xl font-bold text-blue-700">
                                          {bookings.filter(b => b.staffId === selectedStaff.id && b.status === 'confirmed').length}
                                      </div>
                                      <div className="text-xs text-blue-600">Đã duyệt</div>
                                  </div>
                                  <div className="p-3 bg-yellow-50 rounded-lg text-center">
                                      <div className="text-xl font-bold text-yellow-700">
                                          {bookings.filter(b => b.staffId === selectedStaff.id && b.status === 'pending').length}
                                      </div>
                                      <div className="text-xs text-yellow-600">Chờ duyệt</div>
                                  </div>
                              </div>
                          </div>

                          {/* LỊCH SỬ LÀM VIỆC */}
                          <div className="flex-1 overflow-y-auto custom-scrollbar mt-4 pr-2">
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                  <BarChart3 className="w-4 h-4 text-teal-600"/> Lịch sử làm việc
                              </h4>
                              
                              <div className="space-y-2">
                                  {bookings.filter(b => b.staffId === selectedStaff.id).map(b => (
                                      <div key={b.id} className="p-3 bg-gray-50 rounded-lg border hover:border-teal-300 transition-colors">
                                          <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${b.type === 'medical' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                                      {b.type === 'medical' ? <Stethoscope className="w-3 h-3"/> : <Scissors className="w-3 h-3"/>}
                                                  </div>
                                                  <span className="font-medium text-gray-900">{b.petName}</span>
                                              </div>
                                              <StatusBadge status={b.status} />
                                          </div>
                                          <div className="text-sm text-gray-600">
                                              <div className="flex items-center gap-2">
                                                  <span className="text-xs text-gray-500">Dịch vụ:</span>
                                                  <span>{b.serviceName}</span>
                                              </div>
                                              <div className="flex items-center gap-2 mt-1">
                                                  <Clock className="w-3 h-3 text-gray-400"/>
                                                  <span className="text-xs">{b.date} - {b.time}</span>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                                  
                                  {bookings.filter(b => b.staffId === selectedStaff.id).length === 0 && (
                                      <div className="text-center py-12 text-gray-400">
                                          <Target className="w-12 h-12 mx-auto mb-2 opacity-20"/>
                                          <p className="text-sm">Chưa có lịch hẹn nào</p>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </>
                  )}
              </div>

              {/* TỔNG QUAN BÊN PHẢI */}
              <div className="w-[280px] shrink-0 bg-gray-50 rounded-xl p-4 border">
                  <h3 className="font-bold text-teal-900 mb-4 pb-2 border-b">📊 Tổng Quan</h3>
                  
                  <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                          <DollarSign className="w-5 h-5 text-blue-600 mb-1" />
                          <div className="text-lg font-bold text-blue-800">{revenue.toLocaleString()}đ</div>
                          <div className="text-xs text-blue-600">Doanh Thu</div>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-lg">
                          <CalendarIcon className="w-5 h-5 text-purple-600 mb-1" />
                          <div className="text-lg font-bold text-purple-800">{bookings.length}</div>
                          <div className="text-xs text-purple-600">Lịch Hẹn</div>
                      </div>
                      
                      <div className="bg-orange-50 p-3 rounded-lg">
                          <ShoppingBag className="w-5 h-5 text-orange-600 mb-1" />
                          <div className="text-lg font-bold text-orange-800">{orders.length}</div>
                          <div className="text-xs text-orange-600">Đơn Hàng</div>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mb-1" />
                          <div className="text-lg font-bold text-green-800">{deliveredOrders + completedBookings}</div>
                          <div className="text-xs text-green-600">Hoàn Tất</div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <style>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.8) rgba(0, 0, 0, 0.1);
          }
          .custom-scrollbar::-webkit-scrollbar {
              width: 12px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.05);
              border-radius: 6px;
              margin: 4px 0;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(255, 255, 255, 0.7);
              border-radius: 6px;
              border: 3px solid transparent;
              background-clip: padding-box;
              box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(255, 255, 255, 0.9);
              box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:active {
              background-color: rgba(255, 255, 255, 1);
          }
      `}</style>

      <DialogContent className="sm:max-w-[1200px] h-[90vh] flex flex-col p-0 gap-0">
        <div className="p-6 pb-2 border-b bg-white rounded-t-lg shrink-0">
            <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-teal-900">
                {user?.role === 'manager' ? <TrendingUp className="w-6 h-6"/> : user?.role === 'caregiver' ? <Stethoscope className="w-6 h-6"/> : <User className="w-6 h-6"/>}
                Khu Vực {user?.role === 'manager' ? 'Quản Lý' : user?.role === 'receptionist' ? 'Lễ Tân' : 'Bác Sĩ'}
            </DialogTitle>
            <DialogDescription>
                Xin chào <b>{user?.name}</b>. Chúc một ngày làm việc tốt lành!
            </DialogDescription>
            </DialogHeader>
            
            {user?.role !== 'caregiver' && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="bookings">📅 Quản Lý Lịch Hẹn</TabsTrigger>
                        <TabsTrigger value="orders">📦 Quản Lý Đơn Hàng</TabsTrigger>
                    </TabsList>
                </Tabs>
            )}
        </div>

        <div className="flex-1 overflow-hidden p-6 bg-gray-50/50">
            {user?.role === 'caregiver' ? (
                <CaregiverView />
            ) : user?.role === 'manager' ? (
                <ManagerView />
            ) : activeTab === 'bookings' ? (
                <BookingView /> 
            ) : (
                <div className="h-full overflow-y-auto pr-4 pb-10 custom-scrollbar min-h-0">
                    <OrderView />
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
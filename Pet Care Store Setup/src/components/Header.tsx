// FILE: src/components/Header.tsx (PHIÊN BẢN MỚI - THIẾT KẾ ĐẸP HƠN)

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { 
  PawPrint, 
  ShoppingCart, 
  User, 
  LogOut, 
  ChevronDown, 
  Package, 
  LayoutDashboard,
  Settings,
  HelpCircle,
  CreditCard,
  Bell,
  Shield,
  Sparkles
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Badge } from "./ui/badge";

interface HeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onCartClick: () => void;
  onOrdersClick: () => void;
  onStaffDashboardClick?: () => void;
}

export function Header({ onLoginClick, onSignupClick, onCartClick, onOrdersClick, onStaffDashboardClick }: HeaderProps) {
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return <header className="sticky top-0 z-50 bg-white shadow-sm h-16"></header>;

  const shouldShowCart = !user || user.role === 'customer';

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "manager": return "bg-gradient-to-r from-purple-600 to-pink-500";
      case "caregiver": return "bg-gradient-to-r from-blue-600 to-cyan-500";
      case "receptionist": return "bg-gradient-to-r from-green-600 to-emerald-500";
      default: return "bg-gradient-to-r from-gray-600 to-slate-500";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "manager": return <Shield className="w-3 h-3" />;
      case "caregiver": return <Sparkles className="w-3 h-3" />;
      case "receptionist": return <User className="w-3 h-3" />;
      default: return <User className="w-3 h-3" />;
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case "manager": return "Quản Lý";
      case "caregiver": return "Bác Sĩ";
      case "receptionist": return "Lễ Tân";
      default: return "Khách Hàng";
    }
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout(); 
  };

  // Mock notifications
  const notifications = [
    { id: 1, title: "Đơn hàng mới", message: "Bạn có đơn hàng #1234 cần xử lý", time: "5 phút trước", unread: true },
    { id: 2, title: "Lịch hẹn", message: "Lịch hẹn với Nguyễn Văn A vào 14:00", time: "2 giờ trước", unread: true },
    { id: 3, title: "Cập nhật hệ thống", message: "Hệ thống đã được cập nhật phiên bản mới", time: "1 ngày trước", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => window.location.href = "/"}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <PawPrint className="relative w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-teal-900 font-bold text-xl tracking-tight">Pet-First</span>
              <div className="h-1 w-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mt-1"></div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["Dịch Vụ", "Giới Thiệu", "Cửa Hàng", "Liên Hệ"].map((item, index) => (
              <a 
                key={index}
                href={`#${item.toLowerCase().replace(/\s+/g, '')}`}
                className="text-gray-700 hover:text-orange-500 transition-colors font-medium group relative"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center gap-3">
            
            {/* Cart Button */}
            {shouldShowCart && (
              <Button 
                variant="ghost"
                size="icon"
                onClick={onCartClick}
                className="relative hover:bg-orange-50 text-teal-900 hover:text-orange-500 rounded-full"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                    {totalItems}
                  </span>
                )}
              </Button>
            )}
            
            {/* Notification Bell */}
            {isAuthenticated && user && user.role !== 'customer' && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`hover:bg-blue-50 rounded-full relative ${showNotifications ? 'text-blue-500 bg-blue-50' : 'text-gray-600'}`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Thông báo</h3>
                      <Badge variant="outline" className="text-xs">
                        {unreadCount} mới
                      </Badge>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${notif.unread ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                              <Bell className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-gray-900">{notif.title}</p>
                                {notif.unread && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
                        Xem tất cả
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`
                    flex items-center gap-2 pl-1 pr-3 py-1 
                    border border-gray-200 rounded-full 
                    hover:shadow-lg transition-all duration-300 
                    bg-white text-teal-900 group relative
                    ${isMenuOpen ? 'ring-2 ring-orange-200 border-orange-300 shadow-lg' : ''}
                  `}
                >
                  {/* Avatar Badge */}
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-100 to-orange-100 flex items-center justify-center group-hover:from-teal-200 group-hover:to-orange-200 transition-all">
                      <User className="w-5 h-5 text-teal-700 group-hover:text-orange-600" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 p-0.5 rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex flex-col items-start">
                    <span className="max-w-[120px] truncate hidden sm:inline font-bold text-sm text-gray-900">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      {user.email.split('@')[0]}
                    </span>
                  </div>
                  
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180 text-orange-500' : ''}`} 
                  />
                </button>

                {/* User Menu Dropdown */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[100] overflow-hidden">
                    {/* Header */}
                    <div className="px-5 py-4 bg-gradient-to-r from-teal-50 to-orange-50 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-200 to-orange-200 flex items-center justify-center">
                          <span className="font-bold text-teal-800 text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate text-sm">{user.name}</p>
                          <p className="text-xs text-gray-600 truncate mt-1">{user.email}</p>
                          <Badge className={`mt-2 ${getRoleBadgeColor(user.role)} text-white border-0 text-xs font-medium`}>
                            {getRoleName(user.role)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {/* Staff Dashboard Button */}
                      {user.role !== 'customer' && onStaffDashboardClick && (
                        <button 
                          onClick={() => { setIsMenuOpen(false); onStaffDashboardClick(); }}
                          className="w-full text-left px-5 py-3 text-sm text-teal-900 hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 flex items-center gap-3 font-medium transition-all group"
                        >
                          <div className="p-2 rounded-lg bg-teal-100 group-hover:bg-teal-200 transition-colors">
                            <LayoutDashboard className="w-4 h-4 text-teal-700" />
                          </div>
                          <div className="flex-1">
                            <span>Khu Vực Làm Việc</span>
                            <p className="text-xs text-gray-500 mt-0.5">Quản lý và theo dõi công việc</p>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400 rotate-90" />
                        </button>
                      )}

                      {/* Customer Orders */}
                      {user.role === 'customer' && (
                        <button 
                          onClick={() => { setIsMenuOpen(false); onOrdersClick(); }}
                          className="w-full text-left px-5 py-3 text-sm text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 flex items-center gap-3 font-medium transition-all group"
                        >
                          <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                            <Package className="w-4 h-4 text-blue-700" />
                          </div>
                          <div className="flex-1">
                            <span>Đơn Hàng Của Tôi</span>
                            <p className="text-xs text-gray-500 mt-0.5">Xem lịch sử và trạng thái</p>
                          </div>
                        </button>
                      )}

                      {/* Divider */}
                      <div className="mx-5 my-2 border-t border-gray-100"></div>

                      {/* Additional Menu Items */}
                      <button className="w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors rounded-lg mx-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span>Thanh toán & ví</span>
                      </button>

                      <button className="w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors rounded-lg mx-2">
                        <Settings className="w-4 h-4 text-gray-500" />
                        <span>Cài đặt tài khoản</span>
                      </button>

                      <button className="w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors rounded-lg mx-2">
                        <HelpCircle className="w-4 h-4 text-gray-500" />
                        <span>Trợ giúp & hỗ trợ</span>
                      </button>

                      {/* Divider */}
                      <div className="mx-5 my-2 border-t border-gray-100"></div>

                      {/* Logout Button */}
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 flex items-center gap-3 font-medium transition-all group mx-2 rounded-lg"
                      >
                        <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <span>Đăng Xuất</span>
                          <p className="text-xs text-red-500/70 mt-0.5">Thoát khỏi tài khoản</p>
                        </div>
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>ID: {user.id?.slice(0, 8)}...</span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Login/Signup Buttons
              <>
                <Button 
                  variant="ghost" 
                  onClick={onLoginClick}
                  className="hidden sm:flex border-0 text-teal-900 hover:text-orange-500 hover:bg-orange-50 font-medium"
                >
                  Đăng Nhập
                </Button>
                <Button 
                  onClick={onSignupClick}
                  className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all font-medium"
                >
                  Đăng Ký
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
// FILE: src/App.tsx (ĐÃ TÍCH HỢP STAFF DASHBOARD DIALOG)

import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider, Order } from "./contexts/OrderContext";
import { BookingProvider } from "./contexts/BookingContext";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { StatsSection } from "./components/StatsSection";
import { ServicesSection } from "./components/ServicesSection";
import { ShopSection } from "./components/ShopSection";
import { AboutSection } from "./components/AboutSection";
import { TestimonialSection } from "./components/TestimonialSection";
import { NewsletterSection } from "./components/NewsletterSection";
import { Footer } from "./components/Footer";
import { AuthDialog } from "./components/AuthDialog";
import { ServiceDetailDialog } from "./components/ServiceDetailDialog";
import { ProductDetailDialog } from "./components/ProductDetailDialog";
import { CartDialog } from "./components/CartDialog";
import { CheckoutDialog } from "./components/CheckoutDialog";
import { OrderManagementDialog } from "./components/OrderManagementDialog";
import { OrderTrackingDialog } from "./components/OrderTrackingDialog";
import { PharmacyShopDialog } from "./components/PharmacyShopDialog";
import { AccessoriesShopDialog } from "./components/AccessoriesShopDialog";
import { AboutDetailDialog } from "./components/AboutDetailDialog";
import { DoctorBookingDialog } from "./components/DoctorBookingDialog";
import { Toaster } from "sonner";
import { StaffDashboardDialog } from "./components/StaffDashboardDialog"; // Import Dialog Mới

function MainContent() {
  const { user } = useAuth(); // Lấy user để kiểm tra role
  
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "signup">("login");
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [orderManagementOpen, setOrderManagementOpen] = useState(false);
  const [orderTrackingOpen, setOrderTrackingOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pharmacyShopOpen, setPharmacyShopOpen] = useState(false);
  const [accessoriesShopOpen, setAccessoriesShopOpen] = useState(false);
  const [aboutDetailOpen, setAboutDetailOpen] = useState(false);
  const [doctorBookingOpen, setDoctorBookingOpen] = useState(false);
  const [staffDashboardOpen, setStaffDashboardOpen] = useState(false); // State mới cho Staff Dashboard

  const handleLoginClick = () => { setAuthDefaultTab("login"); setAuthDialogOpen(true); };
  const handleSignupClick = () => { setAuthDefaultTab("signup"); setAuthDialogOpen(true); };
  const handleServiceClick = (service: any) => { setSelectedService(service); setServiceDialogOpen(true); };
  const handleProductClick = (product: any) => { setSelectedProduct(product); setProductDialogOpen(true); };
  const handleShopClick = (type: 'pharmacy' | 'accessories') => {
    if (type === 'pharmacy') { setPharmacyShopOpen(true); } else { setAccessoriesShopOpen(true); }
  };
  const handleCheckoutClick = () => { setCartDialogOpen(false); setCheckoutDialogOpen(true); };
  const handleOrderCreated = (orderId: string) => { /* Logic sau khi tạo đơn */ };
  const handleViewOrder = (order: Order) => { setSelectedOrder(order); setOrderManagementOpen(false); setOrderTrackingOpen(true); };

  const handleContinueShopping = () => {
    setCartDialogOpen(false);
    setTimeout(() => {
      const shopSection = document.getElementById("shop");
      if (shopSection) { shopSection.scrollIntoView({ behavior: "smooth" }); }
    }, 200);
  };
  
  return (
    <div className="min-h-screen">
      <Header 
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onCartClick={() => setCartDialogOpen(true)}
        onOrdersClick={() => setOrderManagementOpen(true)} // Dành cho Khách hàng
        onStaffDashboardClick={() => setStaffDashboardOpen(true)} // Dành cho Nhân viên (Mở StaffDashboardDialog)
      />
      
      {/* Nội dung Trang Chủ */}
      <Hero onLearnMoreClick={() => setAboutDetailOpen(true)} />
      <StatsSection />
      <ServicesSection onServiceClick={handleServiceClick} />
      <div id="shop"><ShopSection onProductClick={handleProductClick} /></div>
      <AboutSection onMeetDoctorClick={() => setDoctorBookingOpen(true)} />
      <TestimonialSection />
      <NewsletterSection />
      <Footer />
      
      {/* Các Dialogs Cũ */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} defaultTab={authDefaultTab} />
      <ServiceDetailDialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen} service={selectedService} onShopClick={handleShopClick} />
      <ProductDetailDialog open={productDialogOpen} onOpenChange={setProductDialogOpen} product={selectedProduct} />
      <CartDialog open={cartDialogOpen} onOpenChange={setCartDialogOpen} onCheckoutClick={handleCheckoutClick} onContinueShopping={handleContinueShopping} />
      <CheckoutDialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen} onOrderCreated={handleOrderCreated} />
      <OrderManagementDialog open={orderManagementOpen} onOpenChange={setOrderManagementOpen} onViewOrder={handleViewOrder} />
      <OrderTrackingDialog open={orderTrackingOpen} onOpenChange={setOrderTrackingOpen} order={selectedOrder} />
      <PharmacyShopDialog open={pharmacyShopOpen} onOpenChange={setPharmacyShopOpen} />
      <AccessoriesShopDialog open={accessoriesShopOpen} onOpenChange={setAccessoriesShopOpen} />
      <AboutDetailDialog open={aboutDetailOpen} onOpenChange={setAboutDetailOpen} />
      <DoctorBookingDialog open={doctorBookingOpen} onOpenChange={setDoctorBookingOpen} />
      
      {/* DIALOG MỚI: Staff Dashboard (Chỉ hiện nếu user là nhân viên) */}
      {user && user.role !== 'customer' && (
          <StaffDashboardDialog 
            open={staffDashboardOpen} 
            onOpenChange={setStaffDashboardOpen} 
          />
      )}

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <OrderProvider>
                    <BookingProvider>
                        <MainContent />
                    </BookingProvider>
                </OrderProvider>
            </CartProvider>
        </AuthProvider>
    );
}
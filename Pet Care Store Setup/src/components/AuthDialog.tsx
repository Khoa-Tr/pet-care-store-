import React from 'react'; // Thêm dòng này
// ... các dòng import khác

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
}

export function AuthDialog({ open, onOpenChange, defaultTab = "login" }: AuthDialogProps) {
  const { login, register } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(loginEmail, loginPassword);
    
    setIsLoading(false);
    
    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
      // Reset form
      setLoginEmail("");
      setLoginPassword("");
    } else {
      toast.error(result.message);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== signupConfirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    if (signupPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setIsLoading(true);

    const result = await register(signupEmail, signupPassword, signupName, signupPhone);
    
    setIsLoading(false);
    
    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
      // Reset form
      setSignupName("");
      setSignupEmail("");
      setSignupPhone("");
      setSignupPassword("");
      setSignupConfirmPassword("");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chào mừng đến với Pet-First</DialogTitle>
          <DialogDescription>
            Đăng nhập vào tài khoản của bạn hoặc tạo tài khoản mới để bắt đầu
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Đăng Nhập</TabsTrigger>
            <TabsTrigger value="signup">Đăng Ký</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="email@cua-ban.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Mật khẩu</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Nhập mật khẩu của bạn"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              
              {/* Staff Account Info */}
              <div className="bg-teal-50 p-3 rounded-lg text-sm">
                <p className="text-teal-900 mb-2">Tài khoản nhân viên mẫu:</p>
                <div className="space-y-1 text-gray-700">
                  <p>• Lễ tân: letan@petfirst.vn / letan123</p>
                  <p>• Bác sĩ: bacsi@petfirst.vn / bacsi123</p>
                  <p>• Quản lý: quanly@petfirst.vn / quanly123</p>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-teal-900 hover:bg-teal-800"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Họ và tên *</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email *</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="email@cua-ban.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-phone">Số điện thoại</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="0901234567"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Mật khẩu *</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Xác nhận mật khẩu *</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Xác nhận mật khẩu của bạn"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng Ký"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
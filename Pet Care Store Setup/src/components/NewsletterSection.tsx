import React from 'react'; // Thêm dòng này
import { useState } from 'react';
// ... các dòng import kháci

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Mail } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
    alert("Cảm ơn bạn đã đăng ký!");
  };

  return (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-yellow-500">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1609348490161-a879e4327ae9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MzczMzk1N3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Happy dog"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
          
          <div className="text-white space-y-6">
            <h2 className="text-white">Đăng Ký & Nhận Thông Tin Thú Cưng</h2>
            
            <p className="text-orange-50">
              Cập nhật mẹo chăm sóc thú cưng, ưu đãi đặc biệt và tin tức mới nhất từ Pet-First. Tham gia cùng hàng nghìn chủ nuôi thú cưng hạnh phúc!
            </p>
            
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white text-gray-900"
              />
              <Button 
                type="submit"
                size="lg"
                className="bg-teal-900 hover:bg-teal-800 text-white"
              >
                <Mail className="w-5 h-5 mr-2" />
                Đăng Ký
              </Button>
            </form>
            
            <p className="text-orange-50 text-sm">
              Bằng việc đăng ký, bạn đồng ý với Chính sách Bảo mật của chúng tôi và đồng ý nhận cập nhật từ công ty chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
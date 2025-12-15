import React from 'react'; // Thêm dòng này
import { useState } from 'react';
// ... các dòng import khác

import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AboutSectionProps {
  onMeetDoctorClick: () => void;
}

export function AboutSection({ onMeetDoctorClick }: AboutSectionProps) {
  const features = [
    "Chăm sóc thú y chuyên nghiệp",
    "Sản phẩm thú cưng chất lượng",
    "Dịch vụ khẩn cấp 24/7",
    "Kế hoạch chăm sóc cá nhân hóa",
  ];

  return (
    <section id="about" className="py-20 bg-teal-600">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1596645537590-06af92d8d487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHdpdGglMjBkb2clMjBoYXBweXxlbnwxfHx8fDE3NjM4MjA4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Woman with dog"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
          
          <div className="text-white space-y-6">
            <h2 className="text-white">Làm cho việc nuôi thú cưng trở nên dễ dàng cho mọi người</h2>
            
            <p className="text-teal-50">
              Mỗi ngày, chúng tôi giúp các chủ nuôi thú cưng với công việc lớn nhất của họ: sức khỏe và hạnh phúc của thú cưng. Kế hoạch chăm sóc chuyên nghiệp, sản phẩm chất lượng và đội ngũ tận tâm giúp bạn dễ dàng mang đến tình yêu và sự chăm sóc mà thú cưng của bạn xứng đáng.
            </p>
            
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-yellow-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8"
              onClick={onMeetDoctorClick}
            >
              Gặp Gỡ Bác Sĩ
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
import React from 'react'; // Thêm dòng này
import { useState } from 'react';
// ... các dòng import khác

import { Card, CardContent } from "./ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Nguyễn Thị Lan",
    text: "Khi chúng tôi tiếp tục làm việc, trải nghiệm tốt hơn là cuộc sống. Petfirst không chỉ giúp chú cún của chúng tôi cảm thấy được đối xử như gia đình. Bác sĩ thú y của chúng tôi đã chăm sóc cậu ấy qua từng giai đoạn phát triển.",
    rating: 5,
    image: "https://as2.ftcdn.net/jpg/03/86/24/29/1000_F_386242947_FyGjthiPSVE8vljSQqBO3h0KsWl6FKHK.jpg",
  },
  {
    name: "Trần Văn Minh",
    text: "Dịch vụ chăm sóc thú cưng tốt nhất mà tôi từng sử dụng. Nhân viên cực kỳ hiểu biết và quan tâm. Họ thực sự đặt thú cưng của chúng tôi lên hàng đầu và đối xử như của riêng họ.",
    rating: 5,
    image: "https://thumbs.dreamstime.com/b/smiling-vietnamese-man-portrait-glasses-looking-camera-48304459.jpg",
  },
  {
    name: "Lê Thu Hà",
    text: "Trải nghiệm tuyệt vời! Các bác sĩ thú y chuyên nghiệp và đầy lòng trắc ẩn. Họ dành thời gian giải thích mọi thứ và đảm bảo con mèo của chúng tôi cảm thấy thoải mái.",
    rating: 5,
    image: "https://www.shutterstock.com/shutterstock/photos/1785335903/display_1500/stock-photo-close-up-headshot-portrait-of-smiling-vietnamese-young-woman-look-at-camera-talk-on-video-call-1785335903.jpg",
  },
];

export function TestimonialSection() {
  return (
    <section className="py-20 bg-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-teal-900 mb-4">Đánh Giá Khách Hàng</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Nghe những gì các chủ nuôi thú cưng nói về trải nghiệm của họ với Pet-First
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white flex flex-col">
              <CardContent className="pt-6 flex flex-col flex-1 space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic flex-1">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 mt-auto">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div>{testimonial.name}</div>
                    <div className="text-gray-500">Chủ Thú Cưng</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
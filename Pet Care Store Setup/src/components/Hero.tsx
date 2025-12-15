import React from 'react';
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroProps {
  onLearnMoreClick: () => void;
}

export function Hero({ onLearnMoreClick }: HeroProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-50 to-teal-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-teal-100 rounded-full">
              <span className="text-teal-900 font-medium text-sm">
                Có sẵn tại các tỉnh thành được chọn
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-teal-900 leading-tight">
              ĐẶT THÚ CƯNG
              <br />
              <span className="text-orange-500">LÊN HÀNG ĐẦU</span>
              <br />
              VÌ SỨC KHỎE
            </h1>
            
            <p className="text-gray-700 text-lg max-w-md leading-relaxed">
              Chúng tôi cung cấp dịch vụ chăm sóc thú cưng toàn diện và sản phẩm chất lượng cao để giữ cho những người bạn lông lá của bạn luôn vui vẻ và khỏe mạnh.
            </p>
            
            <Button 
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-6 text-lg transition-all shadow-lg hover:shadow-orange-200"
              onClick={onLearnMoreClick}
            >
              Tìm Hiểu Thêm
            </Button>
            
            {/* --- PHẦN ĐÃ SỬA: AVATAR GROUP --- */}
            <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-4">
                {/* Thay thế div vàng bằng ảnh thật từ pravatar.cc */}
                <img 
                  className="w-12 h-12 rounded-full border-2 border-white object-cover" 
                  src="https://i.pravatar.cc/150?img=32" 
                  alt="Khách hàng 1" 
                />
                <img 
                  className="w-12 h-12 rounded-full border-2 border-white object-cover" 
                  src="https://i.pravatar.cc/150?img=12" 
                  alt="Khách hàng 2" 
                />
                <img 
                  className="w-12 h-12 rounded-full border-2 border-white object-cover" 
                  src="https://i.pravatar.cc/150?img=59" 
                  alt="Khách hàng 3" 
                />
                <img 
                  className="w-12 h-12 rounded-full border-2 border-white object-cover" 
                  src="https://i.pravatar.cc/150?img=68" 
                  alt="Khách hàng 4" 
                />
              </div>
              {/* Thêm text chú thích cho uy tín */}
              <div className="text-sm">
                <p className="font-bold text-gray-900">200+ Khách hàng</p>
                <p className="text-gray-600">đã tin tưởng sử dụng</p>
              </div>
            </div>
            {/* ---------------------------------- */}
          </div>
          
          <div className="relative mt-8 md:mt-0">
            {/* Decor hình tròn nền */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-200/20 rounded-full blur-3xl -z-10" />
            
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1609348490161-a879e4327ae9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MzczMzk1N3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Happy dog"
              className="relative z-10 w-full h-auto rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
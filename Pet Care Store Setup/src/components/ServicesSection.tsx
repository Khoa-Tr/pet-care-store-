import React from 'react'; // Thêm dòng này
// ... các dòng import khác

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Stethoscope, Scissors, Pill, Heart, Syringe } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

const services = [
  {
    icon: Stethoscope,
    title: "Nhà Thuốc",
    description: "Chăm sóc toàn diện và tư vấn chuyên môn từ đội ngũ bác sĩ thú y giàu kinh nghiệm. Chúng tôi luôn sẵn sàng cho các lần khám định kỳ và trường hợp khẩn cấp.",
    color: "bg-yellow-400",
    hasDetail: true,
    details: "Dịch vụ nhà thuốc thú y của chúng tôi cung cấp đầy đủ các loại thuốc, vitamin và thực phẩm chức năng được chứng nhận cho thú cưng của bạn.",
    features: [
      "Tư vấn dược sĩ chuyên nghiệp",
      "Thuốc được nhập khẩu chính hãng",
      "Giao hàng tận nhà miễn phí",
      "Hỗ trợ 24/7 qua hotline",
      "Chương trình khách hàng thân thiết"
    ],
    price: "Từ 200.000₫"
  },
  {
    icon: Scissors,
    title: "Cắt Tỉa Theo Giống",
    description: "Dịch vụ cắt tỉa chuyên nghiệp phù hợp với giống thú cưng của bạn. Giữ cho thú cưng của bạn luôn đẹp và cảm thấy tuyệt vời nhất.",
    color: "bg-yellow-300",
    hasDetail: true,
    details: "Đội ngũ groomer chuyên nghiệp với nhiều năm kinh nghiệm, am hiểu đặc điểm từng giống chó mèo để tạo kiểu phù hợp nhất.",
    features: [
      "Cắt tỉa theo tiêu chuẩn giống",
      "Tắm spa với sản phẩm cao cấp",
      "Vệ sinh tai, cắt móng",
      "Massage thư giãn",
      "Phòng riêng biệt, thoải mái"
    ],
    price: "Từ 300.000₫"
  },
  {
    icon: Pill,
    title: "Quần Áo & Phụ Kiện",
    description: "Quần áo và phụ kiện thời trang, thoải mái cho mọi mùa. Từ áo khoác đến vòng cổ, chúng tôi có tất cả.",
    color: "bg-yellow-400",
    hasDetail: true,
    details: "Bộ sưu tập quần áo và phụ kiện đa dạng, thời trang cho thú cưng của bạn, từ những item hàng ngày đến trang phục dự tiệc.",
    features: [
      "Vải cotton cao cấp, thoáng mát",
      "Thiết kế đa dạng, nhiều size",
      "Vòng cổ, dây dắt thời trang",
      "Phụ kiện đi mưa, đi nắng",
      "Tư vấn chọn size miễn phí"
    ],
    price: "Từ 150.000₫"
  },
  {
    icon: Heart,
    title: "Chăm Sóc Sức Khỏe",
    description: "Chăm sóc phòng ngừa và chương trình chăm sóc sức khỏe để giữ cho thú cưng của bạn khỏe mạnh. Kiểm tra sức khỏe định kỳ và tiêm phòng.",
    color: "bg-orange-400",
    hasDetail: true,
    details: "Chương trình chăm sóc sức khỏe toàn diện với các gói khám định kỳ, tiêm phòng và theo dõi sức khỏe lâu dài.",
    features: [
      "Khám tổng quát định kỳ",
      "Tiêm phòng đầy đủ theo lịch",
      "Xét nghiệm máu, siêu âm",
      "Tư vấn dinh dưỡng",
      "Hồ sơ sức khỏe điện tử"
    ],
    price: "Từ 500.000₫"
  },
  {
    icon: Syringe,
    title: "Chăm Sóc Khẩn Cấp",
    description: "Dịch vụ thú y khẩn cấp 24/7 cho các tình huống cấp bách. Chúng tôi luôn ở đây khi bạn cần nhất.",
    color: "bg-red-400",
    hasDetail: true,
    details: "Phòng cấp cứu 24/7 với đội ngũ bác sĩ và trang thiết bị hiện đại, sẵn sàng xử lý các tình huống khẩn cấp.",
    features: [
      "Hoạt động 24/7 cả ngày lễ",
      "Đội ngũ bác sĩ trực ca",
      "Trang thiết bị cấp cứu hiện đại",
      "Xe cấp cứu sẵn sàng",
      "Hotline khẩn cấp: 1900 xxxx"
    ],
    price: "Liên hệ"
  },
];

interface ServicesSectionProps {
  onServiceClick?: (service: any) => void;
}

export function ServicesSection({ onServiceClick }: ServicesSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-teal-900 mb-4">Dịch Vụ Của Chúng Tôi</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Chúng tôi cung cấp đa dạng các dịch vụ chăm sóc thú cưng và sản phẩm để đáp ứng mọi nhu cầu của thú cưng bạn
          </p>
        </div>
        
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}

          {/* Services Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow flex-shrink-0 w-[350px]"
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700">
                    {service.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => onServiceClick && onServiceClick(service)}
                  >
                    Khám Phá
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
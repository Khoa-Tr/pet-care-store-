import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, ShoppingCart, Ban } from "lucide-react"; // Thêm icon Ban để hiển thị cấm
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";

// DANH SÁCH SẢN PHẨM GIỮ NGUYÊN
const products = [
  {
    name: "Thức Ăn Cao Cấp Cho Chó",
    price: "1.050.000₫",
    rating: 4.8,
    reviews: 234,
    image: "https://openfarmpet.com/cdn/shop/files/OFP-Dog-Dry-Food-Collection-All-Bowl-155x110.png?v=1741803381&width=1200",
    badge: "Bán Chạy",
    description: "Thức ăn cao cấp dành cho chó với công thức dinh dưỡng cân bằng, giúp tăng cường sức khỏe và hệ miễn dịch.",
    features: [
      "Protein từ thịt gà tươi 100%",
      "Không chất bảo quản, không màu nhân tạo",
      "Giàu Omega-3 và Omega-6",
      "Hỗ trợ tiêu hóa với men vi sinh",
      "Thích hợp cho mọi giống chó"
    ],
    specifications: [
      { label: "Trọng lượng", value: "15kg" },
      { label: "Độ tuổi", value: "Trưởng thành" },
      { label: "Xuất xứ", value: "Mỹ" },
      { label: "Hạn sử dụng", value: "18 tháng" }
    ]
  },
  {
    name: "Bộ Dụng Cụ Chải Lông Mèo",
    price: "685.000₫",
    rating: 4.6,
    reviews: 156,
    image: "http://www.aumuca.com/cdn/shop/articles/longhair_cat_use_aumuca_brush_aumuca-cat-grooming-kit-overview-complete-tools.jpg?v=1708585422",
    badge: "Mới",
    description: "Bộ dụng cụ chải lông chuyên nghiệp giúp loại bỏ lông rụng hiệu quả, giữ cho bộ lông mèo luôn mềm mượt.",
    features: [
      "Lược massage da đầu",
      "Chải gỡ rối không đau",
      "Găng tay chải lông silicon",
      "Dụng cụ cắt móng an toàn",
      "Túi đựng tiện lợi"
    ],
    specifications: [
      { label: "Số món", value: "5 món" },
      { label: "Chất liệu", value: "Thép không gỉ" },
      { label: "Màu sắc", value: "Xanh dương" },
      { label: "Bảo hành", value: "12 tháng" }
    ]
  },
  {
    name: "Gói Chăm Sóc Sức Khỏe",
    price: "2.060.000₫",
    rating: 4.9,
    reviews: 423,
    image: "https://m.media-amazon.com/images/I/917UM11jPHL._AC_UF1000,1000_QL80_.jpg",
    badge: "Phổ Biến",
    description: "Gói chăm sóc sức khỏe toàn diện bao gồm khám định kỳ, tiêm phòng và tư vấn dinh dưỡng.",
    features: [
      "Khám tổng quát 4 lần/năm",
      "Tiêm phòng đầy đủ",
      "Xét nghiệm máu miễn phí",
      "Tư vấn bác sĩ 24/7",
      "Giảm 20% các dịch vụ khác"
    ],
    specifications: [
      { label: "Thời hạn", value: "12 tháng" },
      { label: "Số lần khám", value: "4 lần" },
      { label: "Bảo hiểm", value: "Có" },
      { label: "Chuyển nhượng", value: "Không" }
    ]
  },
  {
    name: "Bánh Thưởng Hữu Cơ",
    price: "458.000₫",
    rating: 4.7,
    reviews: 189,
    image: "https://doggiebliss.net/wp-content/uploads/2020/11/Pumpkin-Ginger-Dog-Biscuits_EXPS_PCBZ18_227406_B04_26_1b.jpg",
    badge: "Hữu Cơ",
    description: "Bánh thưởng hữu cơ 100% từ thịt và rau củ tươi, không chất bảo quản, giúp thú cưng khỏe mạnh.",
    features: [
      "100% nguyên liệu hữu cơ",
      "Không gluten, không đậu nành",
      "Giàu protein và vitamin",
      "Nhiều hương vị khác nhau",
      "Đóng gói tiện lợi, giữ tươi lâu"
    ],
    specifications: [
      { label: "Trọng lượng", value: "500g" },
      { label: "Thành phần", value: "Thịt gà, khoai lang" },
      { label: "Chứng nhận", value: "USDA Organic" },
      { label: "Hạn sử dụng", value: "6 tháng" }
    ]
  },
  {
    name: "Bộ Dụng Cụ Chăm Sóc",
    price: "1.375.000₫",
    rating: 4.5,
    reviews: 312,
    image: "https://m.media-amazon.com/images/I/413o6RxzPZL._AC_UF350,350_QL80_.jpg",
    badge: "Giá Tốt",
    description: "Bộ dụng cụ chăm sóc đầy đủ cho thú cưng tại nhà, bao gồm các vật dụng cần thiết hàng ngày.",
    features: [
      "Bàn chải răng và kem đánh răng",
      "Dụng cụ vệ sinh tai",
      "Kéo cắt móng chuyên dụng",
      "Bông tăm và khăn lau",
      "Hướng dẫn sử dụng chi tiết"
    ],
    specifications: [
      { label: "Số món", value: "12 món" },
      { label: "Chất liệu", value: "Nhựa y tế" },
      { label: "Phù hợp", value: "Chó và mèo" },
      { label: "Bảo hành", value: "6 tháng" }
    ]
  },
  {
    name: "Giường Nằm Cao Cấp",
    price: "2.975.000₫",
    rating: 4.9,
    reviews: 267,
    image: "https://news.orvis.com/wp-content/uploads/2015/05/2AM75SDbrwt_lg.jpg",
    badge: "Cao Cấp",
    description: "Giường nằm sang trọng với nệm memory foam, mang lại sự thoải mái tối đa cho thú cưng của bạn.",
    features: [
      "Nệm memory foam chống ẩm",
      "Vỏ bọc có thể tháo giặt",
      "Chống trượt, chống nước",
      "Nhiều size và màu sắc",
      "Thiết kế sang trọng"
    ],
    specifications: [
      { label: "Kích thước", value: "Large (100x80cm)" },
      { label: "Chất liệu", value: "Memory foam + vải nhung" },
      { label: "Trọng lượng", value: "5kg" },
      { label: "Tải trọng", value: "Đến 40kg" }
    ]
  },
];

interface ShopSectionProps {
  onProductClick?: (product: any) => void;
}

export function ShopSection({ onProductClick }: ShopSectionProps) {
  const { user } = useAuth();
  
  // Kiểm tra: Nếu đã đăng nhập VÀ role không phải 'customer' thì là Nhân viên
  // Khách vãng lai (chưa login) vẫn được xem nút mua hàng
  const isStaff = user && user.role !== 'customer';

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-900 mb-4">Cửa Hàng Thú Cưng</h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Sản phẩm chất lượng cho thú cưng yêu quý của bạn. Từ dinh dưỡng đến sự thoải mái, chúng tôi có tất cả những gì bạn cần.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card 
              key={index} 
              className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-gray-100"
              onClick={() => onProductClick && onProductClick(product)}
            >
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-50">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 border-none px-3 py-1 shadow-md">
                    {product.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <CardTitle className="mb-2 text-xl line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </CardTitle>
                <div className="text-2xl font-bold text-teal-900 mb-3">{product.price}</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium text-gray-700">{product.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">({product.reviews} đánh giá)</span>
                </div>
              </CardContent>
              <CardFooter className="pb-6">
                {/* LOGIC ẨN/HIỆN NÚT MUA HÀNG */}
                {!isStaff ? (
                  <Button 
                    className="w-full bg-teal-900 hover:bg-teal-800 h-12 text-base font-medium shadow-sm hover:shadow-md transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick && onProductClick(product);
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Thêm Vào Giỏ
                  </Button>
                ) : (
                  // Nút bị vô hiệu hóa cho nhân viên
                  <Button 
                    disabled 
                    className="w-full bg-gray-100 text-gray-400 h-12 border border-gray-200 cursor-not-allowed"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Chỉ dành cho khách hàng
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from 'react'; // Thêm dòng này
// ... các dòng import khác

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart, Heart, Truck, Shield, Package } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";

interface ProductDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    name: string;
    price: string;
    rating: number;
    reviews: number;
    image: string;
    badge: string;
    description: string;
    features: string[];
    specifications: { label: string; value: string }[];
  } | null;
}

export function ProductDetailDialog({ open, onOpenChange, product }: ProductDetailDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    // Generate a unique ID based on product name
    const productId = `prod-${product.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    addItem({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      type: "product",
      quantity: quantity
    });
    
    alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto" aria-describedby="product-description">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div id="product-description" className="sr-only">
          Chi tiết sản phẩm {product.name}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-orange-500">
                {product.badge}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 bg-white"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-teal-900 mb-2">{product.name}</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-700">{product.rating}</span>
                </div>
                <span className="text-gray-500">({product.reviews} đánh giá)</span>
              </div>
              <div className="text-3xl text-teal-900 mb-4">{product.price}</div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-teal-900 mb-3">Mô Tả Sản Phẩm</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-teal-900 mb-3">Đặc Điểm Nổi Bật</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-teal-900 mb-3">Thông Số Kỹ Thuật</h3>
              <div className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between text-gray-700">
                    <span className="font-medium">{spec.label}:</span>
                    <span>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Số lượng:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                className="w-full bg-teal-900 hover:bg-teal-800"
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Thêm Vào Giỏ Hàng
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-teal-600" />
                <span className="text-sm text-gray-700">Miễn phí vận chuyển</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="w-6 h-6 text-teal-600" />
                <span className="text-sm text-gray-700">Bảo hành 12 tháng</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Package className="w-6 h-6 text-teal-600" />
                <span className="text-sm text-gray-700">Đổi trả trong 7 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
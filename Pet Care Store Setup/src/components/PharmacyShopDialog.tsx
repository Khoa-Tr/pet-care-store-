import React from 'react'; // Thêm dòng này
import { useState } from 'react';
// ... các dòng import khác

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ShoppingCart, Plus } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface PharmacyShopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pharmacyProducts = {
  "Thuốc Trị Bệnh": [
    {
      id: "med-1",
      name: "Thuốc Tiêu Chảy Cho Chó",
      price: "125.000₫",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
      description: "Điều trị tiêu chảy, đau bụng",
      usage: "2 viên/ngày"
    },
    {
      id: "med-2",
      name: "Thuốc Tẩy Giun",
      price: "95.000₫",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400",
      description: "Tẩy giun cho chó mèo",
      usage: "3 tháng/lần"
    },
    {
      id: "med-3",
      name: "Thuốc Nhỏ Mắt",
      price: "85.000₫",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
      description: "Điều trị viêm mắt, khô mắt",
      usage: "2 lần/ngày"
    },
    {
      id: "med-4",
      name: "Thuốc Xịt Tai",
      price: "145.000₫",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400",
      description: "Vệ sinh và điều trị viêm tai",
      usage: "Tuần 2-3 lần"
    }
  ],
  "Vitamin & Thực Phẩm Chức Năng": [
    {
      id: "vit-1",
      name: "Vitamin Tổng Hợp",
      price: "285.000₫",
      image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400",
      description: "Bổ sung vitamin A, D, E, K",
      usage: "1 viên/ngày"
    },
    {
      id: "vit-2",
      name: "Canxi + D3",
      price: "195.000₫",
      image: "https://images.unsplash.com/photo-1550350675-84938e5a8b96?w=400",
      description: "Tăng cường xương khớp",
      usage: "1 viên/ngày"
    },
    {
      id: "vit-3",
      name: "Omega 3-6-9",
      price: "325.000₫",
      image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400",
      description: "Tốt cho tim mạch, da lông",
      usage: "1 viên/ngày"
    },
    {
      id: "vit-4",
      name: "Men Vi Sinh",
      price: "175.000₫",
      image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400",
      description: "Hỗ trợ tiêu hóa",
      usage: "1 gói/ngày"
    }
  ],
  "Thuốc Ngoài Da": [
    {
      id: "top-1",
      name: "Kem Trị Nấm",
      price: "165.000₫",
      image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400",
      description: "Điều trị nấm da, ghẻ",
      usage: "Bôi 2 lần/ngày"
    },
    {
      id: "top-2",
      name: "Xịt Chống Ve Rận",
      price: "215.000₫",
      image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400",
      description: "Phòng và diệt ve rận",
      usage: "Tuần 1 lần"
    },
    {
      id: "top-3",
      name: "Gel Làm Lành Vết Thương",
      price: "135.000₫",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400",
      description: "Hỗ trợ lành vết thương",
      usage: "Bôi 3 lần/ngày"
    },
    {
      id: "top-4",
      name: "Dầu Gội Trị Viêm Da",
      price: "245.000₫",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      description: "Giảm ngứa, kháng khuẩn",
      usage: "Tuần 2-3 lần"
    }
  ],
  "Dụng Cụ Y Tế": [
    {
      id: "tool-1",
      name: "Nhiệt Kế Điện Tử",
      price: "185.000₫",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400",
      description: "Đo nhiệt độ nhanh chóng",
      usage: "Thiết bị điện tử"
    },
    {
      id: "tool-2",
      name: "Bơm Thuốc & Kim Tiêm",
      price: "45.000₫",
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
      description: "Dùng một lần, vô trùng",
      usage: "Hộp 10 cái"
    },
    {
      id: "tool-3",
      name: "Băng Gạc Y Tế",
      price: "65.000₫",
      image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400",
      description: "Băng vết thương",
      usage: "Cuộn 5m"
    },
    {
      id: "tool-4",
      name: "Bộ Sơ Cứu Thú Cưng",
      price: "385.000₫",
      image: "https://images.unsplash.com/photo-1603891501908-aee49c55eaaa?w=400",
      description: "Đầy đủ dụng cụ cấp cứu",
      usage: "Bộ 25 món"
    }
  ]
};

export function PharmacyShopDialog({ open, onOpenChange }: PharmacyShopDialogProps) {
  const { addItem } = useCart();

  const handleAddToCart = (product: any, category: string) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: "pharmacy"
    });
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-teal-900">Nhà Thuốc Thú Y</DialogTitle>
          <DialogDescription>
            Chọn loại thuốc và sản phẩm y tế cho thú cưng của bạn
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="Thuốc Trị Bệnh" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="Thuốc Trị Bệnh">Thuốc Trị Bệnh</TabsTrigger>
            <TabsTrigger value="Vitamin & Thực Phẩm Chức Năng">Vitamin</TabsTrigger>
            <TabsTrigger value="Thuốc Ngoài Da">Thuốc Ngoài Da</TabsTrigger>
            <TabsTrigger value="Dụng Cụ Y Tế">Dụng Cụ</TabsTrigger>
          </TabsList>

          {Object.entries(pharmacyProducts).map(([category, products]) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-teal-900 mb-1">{product.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">{product.description}</p>
                          <Badge variant="outline" className="mb-2">
                            {product.usage}
                          </Badge>
                          <div className="flex items-center justify-between">
                            <span className="text-orange-500">{product.price}</span>
                            <Button
                              size="sm"
                              className="bg-teal-900 hover:bg-teal-800"
                              onClick={() => handleAddToCart(product, category)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Thêm
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
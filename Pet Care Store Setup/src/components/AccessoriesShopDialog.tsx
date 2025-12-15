import React from 'react'; // Thêm dòng này
import { useState } from 'react';
// ... các dòng import khác

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Plus } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AccessoriesShopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const accessoriesProducts = {
  "Quần Áo": [
    {
      id: "cloth-1",
      name: "Áo Hoodie Thú Cưng",
      price: "185.000₫",
      image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400",
      description: "Chất liệu cotton mềm mại",
      sizes: "S, M, L, XL"
    },
    {
      id: "cloth-2",
      name: "Áo Mưa Phản Quang",
      price: "165.000₫",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
      description: "Chống thấm nước tốt",
      sizes: "M, L, XL"
    },
    {
      id: "cloth-3",
      name: "Áo Len Mùa Đông",
      price: "225.000₫",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400",
      description: "Giữ ấm, thời trang",
      sizes: "S, M, L"
    },
    {
      id: "cloth-4",
      name: "Áo Thun Họa Tiết",
      price: "125.000₫",
      image: "https://images.unsplash.com/photo-1618255563866-0b16e2b8cb50?w=400",
      description: "Thoáng mát, nhiều màu",
      sizes: "S, M, L, XL"
    }
  ],
  "Vòng Cổ & Dây Dắt": [
    {
      id: "leash-1",
      name: "Vòng Cổ Da Cao Cấp",
      price: "285.000₫",
      image: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=400",
      description: "Da thật, khóa inox",
      sizes: "S, M, L"
    },
    {
      id: "leash-2",
      name: "Dây Dắt Tự Động",
      price: "395.000₫",
      image: "https://images.unsplash.com/photo-1544568104-5b7eb8189dd4?w=400",
      description: "Kéo dài 5m, chắc chắn",
      sizes: "3m, 5m"
    },
    {
      id: "leash-3",
      name: "Bộ Vòng Cổ + Dây Dắt",
      price: "245.000₫",
      image: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400",
      description: "Họa tiết thời trang",
      sizes: "S/M, L/XL"
    },
    {
      id: "leash-4",
      name: "Vòng Cổ Phát Sáng",
      price: "195.000₫",
      image: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=400",
      description: "An toàn ban đêm",
      sizes: "M, L"
    }
  ],
  "Giày & Tất": [
    {
      id: "shoe-1",
      name: "Giày Thể Thao",
      price: "325.000₫",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
      description: "Chống trơn, thoáng khí",
      sizes: "4 Size"
    },
    {
      id: "shoe-2",
      name: "Tất Chống Trượt",
      price: "85.000₫",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
      description: "4 chiếc/bộ",
      sizes: "S, M, L"
    },
    {
      id: "shoe-3",
      name: "Giày Đi Mưa",
      price: "265.000₫",
      image: "https://images.unsplash.com/photo-1573865526739-10c1deaeec60?w=400",
      description: "Chống nước 100%",
      sizes: "4 Size"
    },
    {
      id: "shoe-4",
      name: "Bao Chân Bảo Vệ",
      price: "125.000₫",
      image: "https://images.unsplash.com/photo-1615789591457-74a63395c990?w=400",
      description: "Bảo vệ vết thương",
      sizes: "Universal"
    }
  ],
  "Phụ Kiện Khác": [
    {
      id: "acc-1",
      name: "Nơ Cài Tóc",
      price: "45.000₫",
      image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=400",
      description: "Nhiều màu sắc",
      sizes: "Bộ 10 cái"
    },
    {
      id: "acc-2",
      name: "Kính Mát Pet",
      price: "165.000₫",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400",
      description: "Chống UV, thời trang",
      sizes: "S, M, L"
    },
    {
      id: "acc-3",
      name: "Túi Đeo Lưng",
      price: "285.000₫",
      image: "https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=400",
      description: "Đựng đồ tiện lợi",
      sizes: "M, L"
    },
    {
      id: "acc-4",
      name: "Mũ Che Nắng",
      price: "135.000₫",
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400",
      description: "Vải thoáng khí",
      sizes: "S, M, L"
    }
  ]
};

export function AccessoriesShopDialog({ open, onOpenChange }: AccessoriesShopDialogProps) {
  const { addItem } = useCart();

  const handleAddToCart = (product: any, category: string) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: "accessory"
    });
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-teal-900">Quần Áo & Phụ Kiện</DialogTitle>
          <DialogDescription>
            Chọn trang phục và phụ kiện thời trang cho thú cưng của bạn
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="Quần Áo" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="Quần Áo">Quần Áo</TabsTrigger>
            <TabsTrigger value="Vòng Cổ & Dây Dắt">Vòng Cổ</TabsTrigger>
            <TabsTrigger value="Giày & Tất">Giày & Tất</TabsTrigger>
            <TabsTrigger value="Phụ Kiện Khác">Phụ Kiện</TabsTrigger>
          </TabsList>

          {Object.entries(accessoriesProducts).map(([category, products]) => (
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
                            Size: {product.sizes}
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
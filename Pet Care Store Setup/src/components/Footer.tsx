import React from 'react'; // Thêm dòng này
import { useState } from 'react';
// ... các dòng import khác

import { PawPrint, Facebook, Twitter, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-teal-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <PawPrint className="w-8 h-8 text-orange-500" />
              <span>Pet-First</span>
            </div>
            <p className="text-teal-200">
              Đối tác tin cậy của bạn trong chăm sóc và sức khỏe thú cưng. Cung cấp dịch vụ và sản phẩm chất lượng từ năm 1978.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4">Dịch Vụ</h3>
            <ul className="space-y-2 text-teal-200">
              <li><a href="#" className="hover:text-white transition-colors">Chăm Sóc Thú Y</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cắt Tỉa Thú Cưng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Lưu Trú Thú Cưng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chăm Sóc Khẩn Cấp</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4">Công Ty</h3>
            <ul className="space-y-2 text-teal-200">
              <li><a href="#" className="hover:text-white transition-colors">Về Chúng Tôi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Đội Ngũ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tuyển Dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên Hệ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4">Kết Nối</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-teal-200 mt-4">
              Email: info@petfirst.com<br />
              Điện thoại: (028) 123-4567
            </p>
          </div>
        </div>
        
        <div className="border-t border-teal-800 pt-8 text-center text-teal-200">
          <p>&copy; 2024 Pet-First. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
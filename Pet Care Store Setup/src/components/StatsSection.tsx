import React from 'react';
import { Heart, Users, Award } from "lucide-react";

export function StatsSection() {
  return (
    // 1. Đưa style màu nền ra thẻ section ngoài cùng -> Tràn viền màn hình 100%
    // 2. Bỏ rounded-3xl đi (vì tràn viền thì không cần bo góc nữa)
    <section 
      className="py-16 shadow-lg"
      style={{ backgroundColor: '#ea580c' }} // Màu cam chuẩn (#f97316/orange-600)
    >
      <div className="container mx-auto px-4">
        
        {/* Dùng Grid chia 3 cột đều nhau tăm tắp */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white divide-y md:divide-y-0 md:divide-x divide-orange-400/50">
          
          {/* CỘT 1 */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="mb-4 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Heart className="w-10 h-10 text-orange-600" fill="currentColor" />
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-1 drop-shadow-md">45+</div>
              <p className="font-bold uppercase tracking-wider text-sm opacity-90">Năm Kinh Nghiệm</p>
            </div>
          </div>
          
          {/* CỘT 2 */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="mb-4 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Users className="w-10 h-10 text-orange-600" />
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-1 drop-shadow-md">10K+</div>
              <p className="font-bold uppercase tracking-wider text-sm opacity-90">Khách Hàng Hài Lòng</p>
            </div>
          </div>
          
          {/* CỘT 3 */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="mb-4 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Award className="w-10 h-10 text-orange-600" />
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-1 drop-shadow-md">50+</div>
              <p className="font-bold uppercase tracking-wider text-sm opacity-90">Bác Sĩ Chuyên Nghiệp</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
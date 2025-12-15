import React from 'react'; // Thêm dòng này
import { useState } from 'react';
// ... các dòng import khác

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Heart, Users, Award, Shield, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface AboutDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutDetailDialog({ open, onOpenChange }: AboutDetailDialogProps) {
  const values = [
    {
      icon: Heart,
      title: "Tận Tâm Chăm Sóc",
      description: "Chúng tôi đối xử với mỗi thú cưng như thành viên trong gia đình"
    },
    {
      icon: Shield,
      title: "An Toàn Tuyệt Đối",
      description: "Môi trường và thiết bị được kiểm soát nghiêm ngặt"
    },
    {
      icon: Award,
      title: "Chuyên Nghiệp",
      description: "Đội ngũ bác sĩ và nhân viên được đào tạo bài bản"
    },
    {
      icon: Clock,
      title: "Sẵn Sàng 24/7",
      description: "Luôn có mặt khi bạn cần, kể cả ngày lễ"
    }
  ];

  const milestones = [
    { year: "1978", title: "Thành Lập", description: "Khởi đầu với phòng khám nhỏ tại TP.HCM" },
    { year: "1995", title: "Mở Rộng", description: "Khai trương 5 chi nhánh trên cả nước" },
    { year: "2010", title: "Hiện Đại Hóa", description: "Đầu tư trang thiết bị y tế hiện đại" },
    { year: "2020", title: "Dẫn Đầu", description: "Trở thành chuỗi chăm sóc thú cưng lớn nhất" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-teal-900">Về Chúng Tôi</DialogTitle>
          <DialogDescription>
            Tìm hiểu thêm về hành trình và sứ mệnh của chúng tôi trong việc chăm sóc thú cưng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Story */}
          <div className="space-y-4">
            <h3 className="text-teal-900">Câu Chuyện Của Chúng Tôi</h3>
            <p className="text-gray-700 leading-relaxed">
              Pet-First được thành lập từ năm 1978 bởi Bác sĩ thú y Nguyễn Văn An với tâm huyết 
              mang đến dịch vụ chăm sóc thú cưng tốt nhất tại Việt Nam. Từ một phòng khám nhỏ, 
              chúng tôi đã phát triển thành chuỗi trung tâm chăm sóc thú cưng hàng đầu với hơn 
              50 bác sĩ thú y chuyên nghiệp và 20 chi nhánh trên toàn quốc.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Sứ mệnh của chúng tôi là đặt sức khỏe và hạnh phúc của thú cưng lên hàng đầu, 
              đồng thời hỗ trợ các chủ nuôi với kiến thức và dịch vụ chất lượng cao nhất. 
              Chúng tôi không ngừng đầu tư vào trang thiết bị hiện đại và đào tạo đội ngũ 
              để mang đến trải nghiệm tốt nhất cho khách hàng.
            </p>
          </div>

          {/* Values */}
          <div>
            <h3 className="text-teal-900 mb-4">Giá Trị Cốt Lõi</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {values.map((value, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-teal-900 mb-1">{value.title}</h4>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h3 className="text-teal-900 mb-4">Hành Trình Phát Triển</h3>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
                      {milestone.year.slice(-2)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-teal-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="text-teal-900 mb-1">{milestone.title}</div>
                    <div className="text-sm text-gray-500 mb-1">{milestone.year}</div>
                    <p className="text-gray-700">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="bg-gradient-to-r from-teal-50 to-orange-50 p-6 rounded-lg">
            <h3 className="text-teal-900 mb-3">Đội Ngũ Của Chúng Tôi</h3>
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div className="text-center">
                <div className="text-3xl text-teal-900 mb-1">50+</div>
                <div className="text-sm text-gray-600">Bác Sĩ Thú Y</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-teal-900 mb-1">120+</div>
                <div className="text-sm text-gray-600">Nhân Viên</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-teal-900 mb-1">20</div>
                <div className="text-sm text-gray-600">Chi Nhánh</div>
              </div>
            </div>
            <p className="text-gray-700 text-center">
              Đội ngũ chuyên nghiệp, tận tâm và giàu kinh nghiệm sẵn sàng phục vụ bạn
            </p>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-teal-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Hệ Thống Chi Nhánh
            </h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                TP. Hồ Chí Minh: 8 chi nhánh
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Hà Nội: 5 chi nhánh
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Đà Nẵng: 3 chi nhánh
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Cần Thơ: 2 chi nhánh
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Nha Trang: 1 chi nhánh
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Vũng Tàu: 1 chi nhánh
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Đóng
            </Button>
            <Button
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={() => {
                onOpenChange(false);
                const contactSection = document.querySelector("#contact");
                contactSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Liên Hệ Ngay
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
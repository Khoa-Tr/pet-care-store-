import React, { useState, useEffect } from 'react';

// DỮ LIỆU ĐỊA CHÍNH VIỆT NAM (Đã bổ sung theo hệ thống chi nhánh)
const LOCATIONS = {
  "TP. Hồ Chí Minh": {
    "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Đa Kao", "Phường Tân Định"],
    "Quận 3": ["Phường Võ Thị Sáu", "Phường 5", "Phường 9", "Phường 14"],
    "Quận 7": ["Phường Tân Phong", "Phường Tân Phú", "Phường Bình Thuận"],
    "TP. Thủ Đức": ["Phường Thảo Điền", "Phường An Phú", "Phường Hiệp Bình Chánh"],
    "Quận Bình Thạnh": ["Phường 25", "Phường 19", "Phường 1"]
  },
  "Hà Nội": {
    "Quận Hoàn Kiếm": ["Phường Hàng Bài", "Phường Tràng Tiền", "Phường Hàng Bạc"],
    "Quận Ba Đình": ["Phường Kim Mã", "Phường Điện Biên", "Phường Quán Thánh"],
    "Quận Cầu Giấy": ["Phường Dịch Vọng", "Phường Yên Hòa", "Phường Mai Dịch"],
    "Quận Đống Đa": ["Phường Láng Hạ", "Phường Ô Chợ Dừa"]
  },
  "Đà Nẵng": {
    "Quận Hải Châu": ["Phường Thạch Thang", "Phường Hải Châu I", "Phường Hòa Cường Bắc"],
    "Quận Sơn Trà": ["Phường An Hải Bắc", "Phường Phước Mỹ", "Phường Mân Thái"],
    "Quận Thanh Khê": ["Phường Vĩnh Trung", "Phường Tân Chính"]
  },
  "TP. Cần Thơ": { // Chi nhánh Cần Thơ
    "Quận Ninh Kiều": ["Phường Tân An", "Phường An Phú", "Phường Xuân Khánh", "Phường Hưng Lợi"],
    "Quận Cái Răng": ["Phường Hưng Phú", "Phường Lê Bình"],
    "Quận Bình Thủy": ["Phường Bình Thủy", "Phường Trà An"]
  },
  "Tỉnh Khánh Hòa": { // Chứa TP. Nha Trang
    "TP. Nha Trang": ["Phường Lộc Thọ", "Phường Phước Tiến", "Phường Vĩnh Nguyên", "Phường Vĩnh Hải"],
    "TP. Cam Ranh": ["Phường Cam Nghĩa", "Phường Cam Phúc Bắc"]
  },
  "Tỉnh Bà Rịa - Vũng Tàu": { // Chứa TP. Vũng Tàu
    "TP. Vũng Tàu": ["Phường 1", "Phường 2", "Phường Thắng Tam", "Phường Rạch Dừa"],
    "TP. Bà Rịa": ["Phường Phước Hưng", "Phường Phước Trung"]
  }
};

interface AddressSelectorProps {
  // Hàm này sẽ trả về địa chỉ full text cho form cha
  onChange: (fullAddress: string) => void;
}

export function AddressSelector({ onChange }: AddressSelectorProps) {
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");

  // Tự động gộp địa chỉ mỗi khi người dùng chọn xong
  useEffect(() => {
    const parts = [street, ward, district, city].filter(Boolean);
    onChange(parts.join(", "));
  }, [city, district, ward, street, onChange]);

  // Style chung cho thẻ select để đẹp đồng bộ
  const selectClass = "w-full p-2.5 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none cursor-pointer hover:border-teal-400 transition-colors";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Tỉnh / Thành phố */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Tỉnh/Thành phố *</label>
          <select 
            className={selectClass}
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setDistrict(""); // Reset quận khi đổi phố
              setWard("");     // Reset phường
            }}
          >
            <option value="">-- Chọn Tỉnh/Thành --</option>
            {Object.keys(LOCATIONS).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* 2. Quận / Huyện */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Quận/Huyện *</label>
          <select 
            className={`${selectClass} ${!city ? 'bg-gray-100 cursor-not-allowed text-gray-400' : ''}`}
            value={district}
            disabled={!city}
            onChange={(e) => {
              setDistrict(e.target.value);
              setWard(""); // Reset phường khi đổi quận
            }}
          >
            <option value="">-- Chọn Quận/Huyện --</option>
            {city && Object.keys(LOCATIONS[city as keyof typeof LOCATIONS]).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* 3. Phường / Xã */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Phường/Xã *</label>
          <select 
             className={`${selectClass} ${!district ? 'bg-gray-100 cursor-not-allowed text-gray-400' : ''}`}
            value={ward}
            disabled={!district}
            onChange={(e) => setWard(e.target.value)}
          >
            <option value="">-- Chọn Phường/Xã --</option>
            {city && district && (LOCATIONS[city as keyof typeof LOCATIONS] as any)[district]?.map((w: string) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Số nhà / Tên đường */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-700">Địa chỉ cụ thể *</label>
        <input
          type="text"
          placeholder="Số nhà, tên đường..."
          className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 outline-none"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
      </div>
    </div>
  );
}
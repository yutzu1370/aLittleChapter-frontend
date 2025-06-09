"use client"

import { useState } from "react";
import MuiDatePicker from "@/components/ui/MuiDatePicker";

export default function TestMuiCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    console.log("選擇的日期:", date);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          MUI 日曆組件測試
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            選擇的日期: {selectedDate ? selectedDate.toLocaleDateString('zh-TW') : '尚未選擇'}
          </h2>
        </div>

        <div className="flex justify-center">
          <div className="w-fit">
            <MuiDatePicker
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
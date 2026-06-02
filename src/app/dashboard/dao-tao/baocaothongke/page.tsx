"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ThongKeData {
  thang: string;
  hocVienMoi: number;
  camKetMoi: number;
}

export default function BaoCaoThongKePage() {
  const [data, setData] = useState<ThongKeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nam, setNam] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/dao-tao/baocaothongke?nam=${nam}`);
        if (!res.ok) {
          throw new Error("Không thể tải dữ liệu báo cáo thống kê");
        }
        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nam]);

  // Tính toán số liệu tổng quan tháng này vs tháng trước
  const currentMonthIdx = new Date().getMonth(); // Tháng hiện tại (0-11)
  const prevMonthIdx = currentMonthIdx === 0 ? 11 : currentMonthIdx - 1;

  const hienTaiDangKy = data[currentMonthIdx]?.hocVienMoi || 0;
  const hienTaiCamKet = data[currentMonthIdx]?.camKetMoi || 0;

  const thangTruocDangKy = data[prevMonthIdx]?.hocVienMoi || 0;
  const thangTruocCamKet = data[prevMonthIdx]?.camKetMoi || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Báo Cáo & Thống Kê Đào Tạo
          </h1>
          <p className="text-black text-gray-500">
            Thống kê tổng quan số lượng học viên đăng ký mới và lập cam kết theo thời gian.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="namSelect" className="text-black font-medium text-gray-700">
            Chọn năm:
          </label>
          <select
            id="namSelect"
            value={nam}
            onChange={(e) => setNam(parseInt(e.target.value, 10))}
            className="rounded-md border border-gray-300 p-2 text-black bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[...Array(5)].map((_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return (
                <option key={year} value={year}>
                  Năm {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Widget Chỉ số Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <p className="text-black font-medium text-gray-500">Học viên mới (Tháng này)</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{hienTaiDangKy}</p>
          <p className="text-xs text-gray-400 mt-2">Tháng trước: {thangTruocDangKy}</p>
        </div>

        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <p className="text-black font-medium text-gray-500">Học viên lập cam kết (Tháng này)</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{hienTaiCamKet}</p>
          <p className="text-xs text-gray-400 mt-2">Tháng trước: {thangTruocCamKet}</p>
        </div>
      </div>

      {/* Vùng Biểu đồ đồ họa */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Biểu Đồ Xu Hướng Đăng Ký & Ký Cam Kết Năm {nam}
        </h2>

        {loading && (
          <div className="h-80 flex items-center justify-center text-gray-500 text-black">
            Đang tải dữ liệu biểu đồ...
          </div>
        )}

        {error && (
          <div className="h-80 flex items-center justify-center text-red-500 text-black">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="thang" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line
                  name="Học viên đăng ký mới"
                  type="monotone"
                  dataKey="hocVienMoi"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  activeDot={{ r: 6 }}
                />
                <Line
                  name="Học viên lập cam kết"
                  type="monotone"
                  dataKey="camKetMoi"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
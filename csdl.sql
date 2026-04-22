--
-- PostgreSQL database dump
--

\restrict orAuyE9HNgmMuzWlhSecIxqMa1qk5svRsDBKDgfbGXZVwggtckOdh0FquweoOPv

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-21 16:37:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5260 (class 0 OID 32844)
-- Dependencies: 232
-- Data for Name: BangCap; Type: TABLE DATA; Schema: public; Owner: -
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public."BangCap" DISABLE TRIGGER ALL;



ALTER TABLE public."BangCap" ENABLE TRIGGER ALL;

--
-- TOC entry 5268 (class 0 OID 32901)
-- Dependencies: 240
-- Data for Name: BangLuong; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."BangLuong" DISABLE TRIGGER ALL;



ALTER TABLE public."BangLuong" ENABLE TRIGGER ALL;

--
-- TOC entry 5286 (class 0 OID 33018)
-- Dependencies: 258
-- Data for Name: HocVien; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."HocVien" DISABLE TRIGGER ALL;

INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi) VALUES (1, 'Trần Thị Thu Hà', '2005-05-20 00:00:00', NULL, '0912345678', 'thuha@gmail.com', NULL);
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi) VALUES (2, 'Lê Văn Nam', '2004-10-15 00:00:00', NULL, '0988776655', 'vannam.le@gmail.com', NULL);
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi) VALUES (3, 'Nguyễn Minh Anh', '2005-08-12 00:00:00', 'Nữ', NULL, NULL, NULL);
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi) VALUES (4, 'Phạm Hoàng Long', '2006-03-22 00:00:00', 'Nam', NULL, NULL, NULL);
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi) VALUES (5, 'Đỗ Thùy Chi', '2004-12-05 00:00:00', 'Nữ', NULL, NULL, NULL);
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi) VALUES (6, 'Bùi Văn Mạnh', '2005-01-30 00:00:00', 'Nam', NULL, NULL, NULL);


ALTER TABLE public."HocVien" ENABLE TRIGGER ALL;

--
-- TOC entry 5290 (class 0 OID 33043)
-- Dependencies: 262
-- Data for Name: CamKet; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."CamKet" DISABLE TRIGGER ALL;

INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (4, '2026-04-03 00:00:00', '2026-07-30 00:00:00', 'Cam kết của học viên về việc tuân thủ nội quy học bán trú cùng người nước ngoài', 'Đã hủy bỏ', 4);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (1, '2026-04-16 00:00:00', '2026-10-16 00:00:00', 'Cam kết đầu ra chứng chỉ IELTS 6.0, hoàn trả 100% học phí nếu không đạt.', 'Đang hiệu lực', 1);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (5, '2026-04-05 00:00:00', '2026-09-30 00:00:00', 'Cam kết tuân thủ nội quy và làm đầu đủ btvn', 'Đang hiệu lực', 3);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (8, '2026-01-20 00:00:00', '2026-03-20 00:00:00', 'Cam kết tiếng anh', 'Đã hết hạn', 5);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (2, '2026-04-18 00:00:00', '2026-09-20 00:00:00', 'Cam kết học viên tuân thủ nội quy trung tâm và hoàn thành đủ bài tập về nhà.', 'Đã hết hạn', 2);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (10, '2026-04-08 00:00:00', '2026-09-30 00:00:00', 'Cam kết', 'Đã hủy bỏ', 2);


ALTER TABLE public."CamKet" ENABLE TRIGGER ALL;

--
-- TOC entry 5256 (class 0 OID 32820)
-- Dependencies: 228
-- Data for Name: ChucVu; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."ChucVu" DISABLE TRIGGER ALL;

INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (3, 'Quản lý đào tạo', 'Lập kế hoạch giảng dạy, kiểm soát chất lượng giáo viên và chương trình học.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (6, 'Trợ giảng (Tutor)', 'Hỗ trợ giáo viên trong lớp, kèm cặp học viên yếu và chấm bài tập.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (7, 'Nhân viên Tư vấn (Sales)', 'Tìm kiếm học viên mới, tư vấn khóa học và ký kết hợp đồng.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (8, 'Nhân viên Marketing', 'Chạy quảng cáo, quản lý Fanpage và tổ chức sự kiện ngoại khóa.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (9, 'Kế toán', 'Quản lý thu chi, lập phiếu thu học phí và tính lương nhân sự.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (10, 'Lễ tân', 'Đón tiếp khách, hướng dẫn học viên và trực điện thoại hotline.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (1, 'Quản trị viên', 'Quản lý toàn bộ hệ thống');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (4, 'Giáo viên nước ngoài', 'Giảng dạy trực tiếp, tập trung vào kỹ năng nghe - nói.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (2, 'Giáo viên bản ngữ', 'Chịu trách nhiệm về giáo trình và chất lượng giảng dạy.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (5, 'Giáo viên Việt', 'Giảng dạy ngữ pháp, luyện thi IELTS/TOEIC và hỗ trợ học viên.');


ALTER TABLE public."ChucVu" ENABLE TRIGGER ALL;

--
-- TOC entry 5278 (class 0 OID 32968)
-- Dependencies: 250
-- Data for Name: ChuongTrinhHoc; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."ChuongTrinhHoc" DISABLE TRIGGER ALL;



ALTER TABLE public."ChuongTrinhHoc" ENABLE TRIGGER ALL;

--
-- TOC entry 5298 (class 0 OID 33090)
-- Dependencies: 270
-- Data for Name: ChuongTrinhKhuyenMai; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."ChuongTrinhKhuyenMai" DISABLE TRIGGER ALL;



ALTER TABLE public."ChuongTrinhKhuyenMai" ENABLE TRIGGER ALL;

--
-- TOC entry 5280 (class 0 OID 32979)
-- Dependencies: 252
-- Data for Name: KhoaHoc; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."KhoaHoc" DISABLE TRIGGER ALL;



ALTER TABLE public."KhoaHoc" ENABLE TRIGGER ALL;

--
-- TOC entry 5294 (class 0 OID 33067)
-- Dependencies: 266
-- Data for Name: ChuongTrinhMarketing; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."ChuongTrinhMarketing" DISABLE TRIGGER ALL;



ALTER TABLE public."ChuongTrinhMarketing" ENABLE TRIGGER ALL;

--
-- TOC entry 5276 (class 0 OID 32955)
-- Dependencies: 248
-- Data for Name: CongNo; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."CongNo" DISABLE TRIGGER ALL;



ALTER TABLE public."CongNo" ENABLE TRIGGER ALL;

--
-- TOC entry 5254 (class 0 OID 32809)
-- Dependencies: 226
-- Data for Name: PhongBan; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."PhongBan" DISABLE TRIGGER ALL;

INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (1, 'Ban Quản Trị', 'Điều hành toàn bộ hệ thống HP English Homestay', '2026-04-10 22:47:10.979');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (2, 'Phòng Đào tạo', 'Quản lý giáo viên, chương trình giảng dạy và chất lượng học viên.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (3, 'Phòng Tuyển sinh', 'Tư vấn khóa học, tìm kiếm học viên và chăm sóc khách hàng.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (5, 'Phòng Marketing', 'Truyền thông, quảng bá hình ảnh và tổ chức sự kiện ngoại khóa.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (4, 'Phòng Kế toán', 'Quản lý thu chi học phí, quỹ homestay và bảng lương nhân sự công ty.', '2026-04-10 00:00:00');


ALTER TABLE public."PhongBan" ENABLE TRIGGER ALL;

--
-- TOC entry 5258 (class 0 OID 32831)
-- Dependencies: 230
-- Data for Name: NhanSu; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."NhanSu" DISABLE TRIGGER ALL;

INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (1, 'Nguyễn Văn Trường', NULL, NULL, '0987654321', NULL, 1, 1);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (2, 'Lê Văn Nam', '1995-05-10 00:00:00', 'Nam', '0912334455', 'Ngô Quyền, Hải Phòng', 3, 2);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (3, 'Trần Thị Thu Hà', '1998-11-20 00:00:00', 'Nữ', '0988776655', 'Lê Chân, Hải Phòng', 6, 3);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (4, 'Phạm Minh Đức', '1990-03-15 00:00:00', 'Nam', '0904556677', 'Hồng Bàng, Hải Phòng', 2, 1);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (5, 'Đỗ Thùy Linh', '2000-07-25 00:00:00', 'Nữ', '0936112233', 'Thủy Nguyên, Hải Phòng', 8, 4);


ALTER TABLE public."NhanSu" ENABLE TRIGGER ALL;

--
-- TOC entry 5262 (class 0 OID 32855)
-- Dependencies: 234
-- Data for Name: HoSoBangCap; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."HoSoBangCap" DISABLE TRIGGER ALL;



ALTER TABLE public."HoSoBangCap" ENABLE TRIGGER ALL;

--
-- TOC entry 5300 (class 0 OID 33102)
-- Dependencies: 272
-- Data for Name: HoatDongNgoaiKhoa; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."HoatDongNgoaiKhoa" DISABLE TRIGGER ALL;



ALTER TABLE public."HoatDongNgoaiKhoa" ENABLE TRIGGER ALL;

--
-- TOC entry 5264 (class 0 OID 32867)
-- Dependencies: 236
-- Data for Name: HopDongLaoDong; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."HopDongLaoDong" DISABLE TRIGGER ALL;



ALTER TABLE public."HopDongLaoDong" ENABLE TRIGGER ALL;

--
-- TOC entry 5292 (class 0 OID 33055)
-- Dependencies: 264
-- Data for Name: KeHoachGiangDay; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."KeHoachGiangDay" DISABLE TRIGGER ALL;



ALTER TABLE public."KeHoachGiangDay" ENABLE TRIGGER ALL;

--
-- TOC entry 5282 (class 0 OID 32993)
-- Dependencies: 254
-- Data for Name: PhongHoc; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."PhongHoc" DISABLE TRIGGER ALL;



ALTER TABLE public."PhongHoc" ENABLE TRIGGER ALL;

--
-- TOC entry 5284 (class 0 OID 33004)
-- Dependencies: 256
-- Data for Name: LopHoc; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."LopHoc" DISABLE TRIGGER ALL;



ALTER TABLE public."LopHoc" ENABLE TRIGGER ALL;

--
-- TOC entry 5304 (class 0 OID 33124)
-- Dependencies: 276
-- Data for Name: PhanCongHoatDong; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."PhanCongHoatDong" DISABLE TRIGGER ALL;



ALTER TABLE public."PhanCongHoatDong" ENABLE TRIGGER ALL;

--
-- TOC entry 5296 (class 0 OID 33078)
-- Dependencies: 268
-- Data for Name: PhanCongMarketing; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."PhanCongMarketing" DISABLE TRIGGER ALL;



ALTER TABLE public."PhanCongMarketing" ENABLE TRIGGER ALL;

--
-- TOC entry 5248 (class 0 OID 32774)
-- Dependencies: 220
-- Data for Name: Quyen; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Quyen" DISABLE TRIGGER ALL;

INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (1, 'ADMIN', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (2, 'GIAO_VIEN', 'Hoạt động');


ALTER TABLE public."Quyen" ENABLE TRIGGER ALL;

--
-- TOC entry 5250 (class 0 OID 32785)
-- Dependencies: 222
-- Data for Name: TaiKhoan; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."TaiKhoan" DISABLE TRIGGER ALL;

INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, email, trang_thai, ma_nhan_su) VALUES (1, 'admin', '123456', 'admin@hp-homestay.edu.vn', 'Hoạt động', 1);


ALTER TABLE public."TaiKhoan" ENABLE TRIGGER ALL;

--
-- TOC entry 5252 (class 0 OID 32799)
-- Dependencies: 224
-- Data for Name: PhanQuyen; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."PhanQuyen" DISABLE TRIGGER ALL;

INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (1, 1, 1);


ALTER TABLE public."PhanQuyen" ENABLE TRIGGER ALL;

--
-- TOC entry 5274 (class 0 OID 32941)
-- Dependencies: 246
-- Data for Name: PhieuChi; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."PhieuChi" DISABLE TRIGGER ALL;



ALTER TABLE public."PhieuChi" ENABLE TRIGGER ALL;

--
-- TOC entry 5266 (class 0 OID 32880)
-- Dependencies: 238
-- Data for Name: PhieuLuong; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."PhieuLuong" DISABLE TRIGGER ALL;



ALTER TABLE public."PhieuLuong" ENABLE TRIGGER ALL;

--
-- TOC entry 5272 (class 0 OID 32926)
-- Dependencies: 244
-- Data for Name: PhieuThu; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."PhieuThu" DISABLE TRIGGER ALL;

INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (1, 1500000.000000000000000000000000000000, '2026-04-10 00:00:00', 'Thu học phí khóa IELTS cơ bản - Tháng 04/2026', 1, 1, NULL, NULL);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (2, 2000000.000000000000000000000000000000, '2026-04-10 23:32:08.962', 'Học phí khóa Giao tiếp cấp tốc', 2, 1, NULL, NULL);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (3, 2000000.000000000000000000000000000000, '2026-04-15 00:00:00', 'Thu học phí khóa TOEIC nâng cao', 1, 1, NULL, NULL);


ALTER TABLE public."PhieuThu" ENABLE TRIGGER ALL;

--
-- TOC entry 5270 (class 0 OID 32912)
-- Dependencies: 242
-- Data for Name: PhieuThuong; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."PhieuThuong" DISABLE TRIGGER ALL;



ALTER TABLE public."PhieuThuong" ENABLE TRIGGER ALL;

--
-- TOC entry 5288 (class 0 OID 33029)
-- Dependencies: 260
-- Data for Name: ThamGiaLop; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."ThamGiaLop" DISABLE TRIGGER ALL;



ALTER TABLE public."ThamGiaLop" ENABLE TRIGGER ALL;

--
-- TOC entry 5302 (class 0 OID 33114)
-- Dependencies: 274
-- Data for Name: ThamGiaNgoaiKhoa; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."ThamGiaNgoaiKhoa" DISABLE TRIGGER ALL;



ALTER TABLE public."ThamGiaNgoaiKhoa" ENABLE TRIGGER ALL;

--
-- TOC entry 5310 (class 0 OID 0)
-- Dependencies: 231
-- Name: BangCap_ma_bang_cap_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BangCap_ma_bang_cap_seq"', 1, false);


--
-- TOC entry 5311 (class 0 OID 0)
-- Dependencies: 239
-- Name: BangLuong_ma_bang_luong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BangLuong_ma_bang_luong_seq"', 1, false);


--
-- TOC entry 5312 (class 0 OID 0)
-- Dependencies: 261
-- Name: CamKet_ma_cam_ket_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."CamKet_ma_cam_ket_seq"', 10, true);


--
-- TOC entry 5313 (class 0 OID 0)
-- Dependencies: 227
-- Name: ChucVu_ma_chuc_vu_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ChucVu_ma_chuc_vu_seq"', 1, false);


--
-- TOC entry 5314 (class 0 OID 0)
-- Dependencies: 249
-- Name: ChuongTrinhHoc_ma_chuong_trinh_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ChuongTrinhHoc_ma_chuong_trinh_seq"', 1, false);


--
-- TOC entry 5315 (class 0 OID 0)
-- Dependencies: 269
-- Name: ChuongTrinhKhuyenMai_ma_khuyen_mai_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"', 1, false);


--
-- TOC entry 5316 (class 0 OID 0)
-- Dependencies: 265
-- Name: ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq"', 1, false);


--
-- TOC entry 5317 (class 0 OID 0)
-- Dependencies: 247
-- Name: CongNo_ma_cong_no_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."CongNo_ma_cong_no_seq"', 1, false);


--
-- TOC entry 5318 (class 0 OID 0)
-- Dependencies: 233
-- Name: HoSoBangCap_ma_ho_so_bang_cap_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HoSoBangCap_ma_ho_so_bang_cap_seq"', 1, false);


--
-- TOC entry 5319 (class 0 OID 0)
-- Dependencies: 271
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq"', 1, false);


--
-- TOC entry 5320 (class 0 OID 0)
-- Dependencies: 257
-- Name: HocVien_ma_hoc_vien_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HocVien_ma_hoc_vien_seq"', 1, false);


--
-- TOC entry 5321 (class 0 OID 0)
-- Dependencies: 235
-- Name: HopDongLaoDong_ma_hop_dong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HopDongLaoDong_ma_hop_dong_seq"', 1, false);


--
-- TOC entry 5322 (class 0 OID 0)
-- Dependencies: 263
-- Name: KeHoachGiangDay_ma_ke_hoach_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."KeHoachGiangDay_ma_ke_hoach_seq"', 1, false);


--
-- TOC entry 5323 (class 0 OID 0)
-- Dependencies: 251
-- Name: KhoaHoc_ma_khoa_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."KhoaHoc_ma_khoa_hoc_seq"', 1, false);


--
-- TOC entry 5324 (class 0 OID 0)
-- Dependencies: 255
-- Name: LopHoc_ma_lop_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."LopHoc_ma_lop_hoc_seq"', 1, false);


--
-- TOC entry 5325 (class 0 OID 0)
-- Dependencies: 229
-- Name: NhanSu_ma_nhan_su_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."NhanSu_ma_nhan_su_seq"', 1, false);


--
-- TOC entry 5326 (class 0 OID 0)
-- Dependencies: 275
-- Name: PhanCongHoatDong_ma_phan_cong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhanCongHoatDong_ma_phan_cong_seq"', 1, false);


--
-- TOC entry 5327 (class 0 OID 0)
-- Dependencies: 267
-- Name: PhanCongMarketing_ma_phan_cong_marketing_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhanCongMarketing_ma_phan_cong_marketing_seq"', 1, false);


--
-- TOC entry 5328 (class 0 OID 0)
-- Dependencies: 223
-- Name: PhanQuyen_ma_phan_quyen_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhanQuyen_ma_phan_quyen_seq"', 1, false);


--
-- TOC entry 5329 (class 0 OID 0)
-- Dependencies: 245
-- Name: PhieuChi_ma_phieu_chi_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuChi_ma_phieu_chi_seq"', 1, false);


--
-- TOC entry 5330 (class 0 OID 0)
-- Dependencies: 237
-- Name: PhieuLuong_ma_phieu_luong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuLuong_ma_phieu_luong_seq"', 1, false);


--
-- TOC entry 5331 (class 0 OID 0)
-- Dependencies: 243
-- Name: PhieuThu_ma_phieu_thu_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuThu_ma_phieu_thu_seq"', 3, true);


--
-- TOC entry 5332 (class 0 OID 0)
-- Dependencies: 241
-- Name: PhieuThuong_ma_phieu_thuong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuThuong_ma_phieu_thuong_seq"', 1, false);


--
-- TOC entry 5333 (class 0 OID 0)
-- Dependencies: 225
-- Name: PhongBan_ma_phong_ban_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhongBan_ma_phong_ban_seq"', 7, true);


--
-- TOC entry 5334 (class 0 OID 0)
-- Dependencies: 253
-- Name: PhongHoc_ma_phong_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhongHoc_ma_phong_hoc_seq"', 1, false);


--
-- TOC entry 5335 (class 0 OID 0)
-- Dependencies: 219
-- Name: Quyen_ma_quyen_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Quyen_ma_quyen_seq"', 1, false);


--
-- TOC entry 5336 (class 0 OID 0)
-- Dependencies: 221
-- Name: TaiKhoan_ma_tai_khoan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."TaiKhoan_ma_tai_khoan_seq"', 1, false);


--
-- TOC entry 5337 (class 0 OID 0)
-- Dependencies: 259
-- Name: ThamGiaLop_ma_tham_gia_lop_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ThamGiaLop_ma_tham_gia_lop_seq"', 1, false);


--
-- TOC entry 5338 (class 0 OID 0)
-- Dependencies: 273
-- Name: ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq"', 1, false);


-- Completed on 2026-04-21 16:37:34

--
-- PostgreSQL database dump complete
--

\unrestrict orAuyE9HNgmMuzWlhSecIxqMa1qk5svRsDBKDgfbGXZVwggtckOdh0FquweoOPv


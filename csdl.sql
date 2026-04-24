--
-- PostgreSQL database dump
--

\restrict RXXgpMrY1d3WBUF9p5Z0KXH0kxwRg7quqbYu2wnV2UD6WO8JaM880KkJ0jEvXca

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-24 22:05:27

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
-- TOC entry 5266 (class 0 OID 16884)
-- Dependencies: 231
-- Data for Name: BangCap; Type: TABLE DATA; Schema: public; Owner: postgres
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public."BangCap" DISABLE TRIGGER ALL;



ALTER TABLE public."BangCap" ENABLE TRIGGER ALL;

--
-- TOC entry 5274 (class 0 OID 16941)
-- Dependencies: 239
-- Data for Name: BangLuong; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."BangLuong" DISABLE TRIGGER ALL;



ALTER TABLE public."BangLuong" ENABLE TRIGGER ALL;

--
-- TOC entry 5292 (class 0 OID 17057)
-- Dependencies: 257
-- Data for Name: HocVien; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."HocVien" DISABLE TRIGGER ALL;

INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, trang_thai) VALUES (2, 'Lê Văn Nam', '2004-10-15 00:00:00', 'Nam', '0988776655', 'vannam.le@gmail.com', 'Hải Phòng', 'Nghỉ học');
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, trang_thai) VALUES (1, 'Trần Thị Thu Hà', '2005-05-20 00:00:00', 'Nam', '0912345678', 'thuha@gmail.com', '156 Trần Thành Ngọ, Kiến An, Hải Phòng', 'Đang học');
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, trang_thai) VALUES (6, 'Bùi Văn Mạnh', '2005-01-30 00:00:00', 'Nam', '0987654321', NULL, '484 Lạch Tray, Kênh Dương, Lê Chân, Hải Phòng', 'Đang học');
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, trang_thai) VALUES (5, 'Đỗ Thùy Chi', '2004-12-05 00:00:00', 'Nữ', '0345123789', NULL, '123 Lê Lợi, Gia Viên, Ngô Quyền, Hải Phòng', 'Đang học');
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, trang_thai) VALUES (4, 'Phạm Hoàng Long', '2006-03-22 00:00:00', 'Nam', '0888999888', NULL, '78 Nguyễn Đức Cảnh, An Biên, Lê Chân, Hải Phòng', 'Đang học');
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, trang_thai) VALUES (3, 'Nguyễn Minh Anh', '2005-08-18 00:00:00', 'Nữ', '0905444555', NULL, '25 Hoàng Văn Thụ, Phan Bội Châu, Hồng Bàng, Hải Phòng', 'Đang học');


ALTER TABLE public."HocVien" ENABLE TRIGGER ALL;

--
-- TOC entry 5296 (class 0 OID 17082)
-- Dependencies: 261
-- Data for Name: CamKet; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."CamKet" DISABLE TRIGGER ALL;

INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (2, '2026-04-15 14:30:00', '2026-07-15 14:30:00', 'Nội quy Homestay: Cam kết tuân thủ giờ giấc sinh hoạt, không gây ồn ào sau 23h và giữ gìn vệ sinh chung.', 'Đang hiệu lực', 2);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (3, '2025-10-01 08:00:00', '2026-04-01 08:00:00', 'Hợp đồng chuyên cần: Cam kết tham gia ít nhất 95% số buổi học bổ trợ buổi tối cùng giáo viên bản ngữ.', 'Đã hết hạn', 3);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (1, '2026-04-10 00:00:00', '2026-10-10 00:00:00', 'Cam kết đầu ra IELTS 8.0: Học viên đi học đầy đủ và làm bài tập sẽ đạt mục tiêu, nếu không sẽ được học lại miễn phí.', 'Đang hiệu lực', 1);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (4, '2026-04-21 00:00:00', '2026-04-21 00:00:00', 'Cam kết 1', 'Đang hiệu lực', 3);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (5, '2026-04-21 00:00:00', '2026-04-23 00:00:00', 'thêm cam kết', 'Đang hiệu lực', 1);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (6, '2026-04-21 00:00:00', '2026-10-22 00:00:00', 'Cam kết đạt mục tiêu IELTS 6.5 sau lộ trình 06 tháng. Học viên cam kết đi học đầy đủ ít nhất 95% số buổi, hoàn thành mọi bài tập về nhà và tham gia đầy đủ các bài kiểm tra định kỳ. Nếu không đạt điểm số mục tiêu, trung tâm hỗ trợ học lại miễn phí 01 khóa.', 'Đã hủy bỏ', 6);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (7, '2026-04-22 00:00:00', '2026-04-24 00:00:00', '1111d', 'Đang hiệu lực', 1);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (8, '2026-04-22 00:00:00', '2026-04-23 00:00:00', 'Cam kết đi khải giảng đúng khóa học', 'Đang hiệu lực', 4);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (9, '2026-04-22 00:00:00', NULL, 'Cam kết đi học đầy đủ', 'Đang hiệu lực', 1);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (10, '2026-04-22 00:00:00', NULL, 'Cam kết đi học đầy đủ', 'Đang hiệu lực', 5);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (11, '2026-04-22 00:00:00', NULL, '1', 'Đang hiệu lực', 1);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (12, '2026-04-22 00:00:00', '2026-04-24 00:00:00', '2', 'Đang hiệu lực', 1);


ALTER TABLE public."CamKet" ENABLE TRIGGER ALL;

--
-- TOC entry 5312 (class 0 OID 17469)
-- Dependencies: 277
-- Data for Name: ChucVu; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ChucVu" DISABLE TRIGGER ALL;

INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (5, 'Giáo viên Việt Nam', 'Giảng dạy ngữ pháp, luyện thi IELTS/TOEIC và hỗ trợ học viên.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (8, 'Nhân viên Marketing', 'Chạy quảng cáo, quản lý Fanpage và tổ chức sự kiện ngoại khóa.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (1, 'Quản trị viên', 'Quản lý toàn bộ hệ thống');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (2, 'Giáo viên bản ngữ', 'Chịu trách nhiệm về giáo trình và chất lượng giảng dạy.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (6, 'Trợ giảng', 'Hỗ trợ giáo viên trong lớp, kèm cặp học viên yếu và chấm bài tập.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (13, 'Nhân viên phòng kế toán', 'Quản lý hoạt động thu chi của trung tâm');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (7, 'Nhân viên phòng Sale', 'Tìm kiếm học viên mới, tư vấn khóa học và ký kết hợp đồng.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (3, 'Nhân viên phòng đào tạo', 'Lập kế hoạch giảng dạy, kiểm soát chất lượng giáo viên và chương trình học.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (14, 'Ban giám đốc', 'Xem toàn bộ báo cáo thống kê và đưa ra chiến lược');


ALTER TABLE public."ChucVu" ENABLE TRIGGER ALL;

--
-- TOC entry 5284 (class 0 OID 17008)
-- Dependencies: 249
-- Data for Name: ChuongTrinhHoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ChuongTrinhHoc" DISABLE TRIGGER ALL;



ALTER TABLE public."ChuongTrinhHoc" ENABLE TRIGGER ALL;

--
-- TOC entry 5300 (class 0 OID 17118)
-- Dependencies: 265
-- Data for Name: ChuongTrinhKhuyenMai; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ChuongTrinhKhuyenMai" DISABLE TRIGGER ALL;



ALTER TABLE public."ChuongTrinhKhuyenMai" ENABLE TRIGGER ALL;

--
-- TOC entry 5286 (class 0 OID 17019)
-- Dependencies: 251
-- Data for Name: KhoaHoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."KhoaHoc" DISABLE TRIGGER ALL;



ALTER TABLE public."KhoaHoc" ENABLE TRIGGER ALL;

--
-- TOC entry 5308 (class 0 OID 17419)
-- Dependencies: 273
-- Data for Name: ChuongTrinhMarketing; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ChuongTrinhMarketing" DISABLE TRIGGER ALL;



ALTER TABLE public."ChuongTrinhMarketing" ENABLE TRIGGER ALL;

--
-- TOC entry 5282 (class 0 OID 16995)
-- Dependencies: 247
-- Data for Name: CongNo; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."CongNo" DISABLE TRIGGER ALL;



ALTER TABLE public."CongNo" ENABLE TRIGGER ALL;

--
-- TOC entry 5262 (class 0 OID 16861)
-- Dependencies: 227
-- Data for Name: PhongBan; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."PhongBan" DISABLE TRIGGER ALL;

INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (2, 'Phòng Đào tạo', 'Quản lý giáo viên, chương trình giảng dạy và chất lượng học viên.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (3, 'Phòng Tuyển sinh', 'Tư vấn khóa học, tìm kiếm học viên và chăm sóc khách hàng.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (4, 'Phòng Kế toán', 'Quản lý thu chi học phí, quỹ homestay và bảng lương nhân sự.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (5, 'Phòng Marketing', 'Truyền thông, quảng bá hình ảnh và tổ chức sự kiện ngoại khóa.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (1, 'Ban Quản Trị', 'Điều hành toàn bộ hệ thống HP English Homestay 1', '2026-04-10 00:00:00');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (6, 'Phòng nhân sự', 'Phòng nhân sự', '2026-04-21 00:00:00');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (7, 'Phòng nhân sự 21', '1111', '2026-04-21 00:00:00');


ALTER TABLE public."PhongBan" ENABLE TRIGGER ALL;

--
-- TOC entry 5264 (class 0 OID 16872)
-- Dependencies: 229
-- Data for Name: NhanSu; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."NhanSu" DISABLE TRIGGER ALL;

INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_phong_ban, ma_chuc_vu) VALUES (1, 'Nguyễn Văn Trường', NULL, NULL, '0987654321', NULL, 1, 1);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_phong_ban, ma_chuc_vu) VALUES (5, 'Đỗ Thùy Linh', '2000-07-25 00:00:00', 'Nữ', '0936112233', 'Thủy Nguyên, Hải Phòng', 4, 8);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_phong_ban, ma_chuc_vu) VALUES (2, 'Lê Văn Nam', '1995-05-10 00:00:00', 'Nam', '0912334455', 'Ngô Quyền, Hải Phòng', 2, 13);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_phong_ban, ma_chuc_vu) VALUES (3, 'Trần Thị Thu Hà', '1998-11-20 00:00:00', 'Nữ', '0988776655', 'Lê Chân, Hải Phòng', 3, 7);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_phong_ban, ma_chuc_vu) VALUES (4, 'Phạm Minh Đức', '1990-03-15 00:00:00', 'Nam', '0904556677', 'Hồng Bàng, Hải Phòng', 1, 8);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_phong_ban, ma_chuc_vu) VALUES (6, 'Nguyễn Văn A', '1995-05-10 00:00:00', 'nam', '0987654321', 'Hải Phòng', 1, 14);


ALTER TABLE public."NhanSu" ENABLE TRIGGER ALL;

--
-- TOC entry 5268 (class 0 OID 16895)
-- Dependencies: 233
-- Data for Name: HoSoBangCap; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."HoSoBangCap" DISABLE TRIGGER ALL;



ALTER TABLE public."HoSoBangCap" ENABLE TRIGGER ALL;

--
-- TOC entry 5302 (class 0 OID 17130)
-- Dependencies: 267
-- Data for Name: HoatDongNgoaiKhoa; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."HoatDongNgoaiKhoa" DISABLE TRIGGER ALL;



ALTER TABLE public."HoatDongNgoaiKhoa" ENABLE TRIGGER ALL;

--
-- TOC entry 5270 (class 0 OID 16907)
-- Dependencies: 235
-- Data for Name: HopDongLaoDong; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."HopDongLaoDong" DISABLE TRIGGER ALL;



ALTER TABLE public."HopDongLaoDong" ENABLE TRIGGER ALL;

--
-- TOC entry 5298 (class 0 OID 17094)
-- Dependencies: 263
-- Data for Name: KeHoachGiangDay; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."KeHoachGiangDay" DISABLE TRIGGER ALL;



ALTER TABLE public."KeHoachGiangDay" ENABLE TRIGGER ALL;

--
-- TOC entry 5288 (class 0 OID 17032)
-- Dependencies: 253
-- Data for Name: PhongHoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."PhongHoc" DISABLE TRIGGER ALL;

INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (1, 'Phòng Lý Thuyết A101', 45);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (2, 'Phòng Thực Hành IT 01', 30);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (3, 'Hội Trường Lớn B2', 150);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (4, 'Phòng Học Nhóm G3', 15);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (6, 'Phòng đào tạo quốc tế', 50);


ALTER TABLE public."PhongHoc" ENABLE TRIGGER ALL;

--
-- TOC entry 5290 (class 0 OID 17043)
-- Dependencies: 255
-- Data for Name: LopHoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."LopHoc" DISABLE TRIGGER ALL;



ALTER TABLE public."LopHoc" ENABLE TRIGGER ALL;

--
-- TOC entry 5306 (class 0 OID 17152)
-- Dependencies: 271
-- Data for Name: PhanCongHoatDong; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."PhanCongHoatDong" DISABLE TRIGGER ALL;



ALTER TABLE public."PhanCongHoatDong" ENABLE TRIGGER ALL;

--
-- TOC entry 5310 (class 0 OID 17435)
-- Dependencies: 275
-- Data for Name: PhanCongMarketing; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."PhanCongMarketing" DISABLE TRIGGER ALL;



ALTER TABLE public."PhanCongMarketing" ENABLE TRIGGER ALL;

--
-- TOC entry 5256 (class 0 OID 16826)
-- Dependencies: 221
-- Data for Name: Quyen; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Quyen" DISABLE TRIGGER ALL;

INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (1, 'ADMIN', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (2, 'Quản lý tài khoản', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (4, 'Danh mục khóa học', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (5, 'Danh mục phòng ban', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (6, 'Danh mục chức vụ', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (8, 'Danh mục phòng học', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (9, 'Chương trình Marketing', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (10, 'Thông tin khóa học', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (11, 'Quản lý cam kết', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (12, 'Hoạt động ngoại khóa', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (13, 'Chương trình khuyến mãi', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (14, 'Kế hoạch giảng dạy', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (15, 'Quản lý chương trình học', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (16, 'Quản lý bằng cấp', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (17, 'Quản lý hợp đồng lao động', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (18, 'Hồ sơ học viên', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (19, 'Quản lý lớp học', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (20, 'Quản lý phiếu thu học phí', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (21, 'Quản lý bảng lương', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (22, 'Phiếu chi hoạt động', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (23, 'Quản lý thưởng', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (24, 'Quản lý công nợ', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (25, 'Báo cáo thống kê', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (7, 'Danh mục chương trình học', 'Hoạt động');


ALTER TABLE public."Quyen" ENABLE TRIGGER ALL;

--
-- TOC entry 5258 (class 0 OID 16837)
-- Dependencies: 223
-- Data for Name: TaiKhoan; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."TaiKhoan" DISABLE TRIGGER ALL;

INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, email, trang_thai, ma_nhan_su) VALUES (1, 'admin', '$2b$10$kAIaLB3cowYyEvwHa4qjtuyfX/rxAR9tgzsQKybG.J2iaAf5gjKnC', 'admin@hp-homestay.edu.vn', 'Hoạt động', 1);
INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, email, trang_thai, ma_nhan_su) VALUES (4, 'marketing', '$2b$10$FYp5tc.mJV8dfbTrf5y6Ge7IhLVPHI/iGiOVTDBerZ8bYnqee89hG', 'marketing@gmail.com', 'Hoạt động', 4);
INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, email, trang_thai, ma_nhan_su) VALUES (6, 'giamdoc', '$2b$10$WVKN3fU6kOGuFLVKZM.UtOYTbWKGkxxKvsyNNXbZL7BKOsh/DYapi', 'giamdoc@gmail.com', 'Hoạt động', 6);
INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, email, trang_thai, ma_nhan_su) VALUES (3, 'sale', '$2b$10$RMimuPJGELNwe7T4T9HzcukiRHvtrAL576PH0Eyi8vhaW2mqGKat6', 'sale@gmail.com', 'Hoạt động', 3);
INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, email, trang_thai, ma_nhan_su) VALUES (5, 'daotao', '$2b$10$ZgJk1xu.v.SiSjZDctKrSOg7pk.Hv6lSAKy72do7Y0T7j8v1elNBu', 'daotao@gmail.com', 'Hoạt động', 5);
INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, email, trang_thai, ma_nhan_su) VALUES (2, 'ketoan', '$2b$10$kYg.MyV3hIuOpWPOHFxLMuFt4D5hThRWWG.mSnS6ByVmdphIT5rGa', 'ketoan@gmail.com', 'Hoạt động', 2);


ALTER TABLE public."TaiKhoan" ENABLE TRIGGER ALL;

--
-- TOC entry 5260 (class 0 OID 16851)
-- Dependencies: 225
-- Data for Name: PhanQuyen; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."PhanQuyen" DISABLE TRIGGER ALL;

INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (18, 1, 1);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (32, 4, 9);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (33, 4, 13);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (34, 4, 12);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (35, 4, 10);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (49, 6, 25);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (50, 3, 11);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (51, 3, 10);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (52, 3, 7);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (53, 3, 18);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (54, 3, 4);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (74, 5, 14);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (75, 5, 19);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (76, 5, 15);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (77, 5, 8);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (78, 5, 18);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (79, 5, 17);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (80, 5, 5);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (81, 5, 7);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (82, 5, 6);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (83, 5, 10);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (84, 5, 16);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (85, 2, 20);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (86, 2, 11);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (87, 2, 21);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (88, 2, 22);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (89, 2, 23);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (90, 2, 24);


ALTER TABLE public."PhanQuyen" ENABLE TRIGGER ALL;

--
-- TOC entry 5280 (class 0 OID 16981)
-- Dependencies: 245
-- Data for Name: PhieuChi; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."PhieuChi" DISABLE TRIGGER ALL;



ALTER TABLE public."PhieuChi" ENABLE TRIGGER ALL;

--
-- TOC entry 5272 (class 0 OID 16920)
-- Dependencies: 237
-- Data for Name: PhieuLuong; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."PhieuLuong" DISABLE TRIGGER ALL;



ALTER TABLE public."PhieuLuong" ENABLE TRIGGER ALL;

--
-- TOC entry 5278 (class 0 OID 16966)
-- Dependencies: 243
-- Data for Name: PhieuThu; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."PhieuThu" DISABLE TRIGGER ALL;

INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (3, 2000000.000000000000000000000000000000, '2026-04-15 00:00:00', 'Thu học phí khóa TOEIC cơ bản', 1, 1, NULL, 1);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (2, 2000000.000000000000000000000000000000, '2026-04-10 00:00:00', 'Đóng học phí KTX', 2, 2, NULL, 2);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (11, 1200000.000000000000000000000000000000, '2026-04-21 00:00:00', 'Thu tiền đặt cọc giữ chỗ Homestay - Khóa mùa hè 2027', 4, 1, NULL, 8);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (1, 1500000.000000000000000000000000000000, '2026-04-10 00:00:00', 'Thu học phí khóa IELTS cơ bản - Tháng 04/2026', 1, 1, NULL, 9);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (6, 1000000.000000000000000000000000000000, '2026-04-07 00:00:00', 'Thu học phí khóa Toeic cơ bản', 5, 2, NULL, 10);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (7, 11111.000000000000000000000000000000, '2026-03-31 00:00:00', 'Thu học phí khóa Giao tiếp cấp tốc', 6, 5, NULL, 6);


ALTER TABLE public."PhieuThu" ENABLE TRIGGER ALL;

--
-- TOC entry 5276 (class 0 OID 16952)
-- Dependencies: 241
-- Data for Name: PhieuThuong; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."PhieuThuong" DISABLE TRIGGER ALL;



ALTER TABLE public."PhieuThuong" ENABLE TRIGGER ALL;

--
-- TOC entry 5294 (class 0 OID 17068)
-- Dependencies: 259
-- Data for Name: ThamGiaLop; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ThamGiaLop" DISABLE TRIGGER ALL;



ALTER TABLE public."ThamGiaLop" ENABLE TRIGGER ALL;

--
-- TOC entry 5304 (class 0 OID 17142)
-- Dependencies: 269
-- Data for Name: ThamGiaNgoaiKhoa; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ThamGiaNgoaiKhoa" DISABLE TRIGGER ALL;



ALTER TABLE public."ThamGiaNgoaiKhoa" ENABLE TRIGGER ALL;

--
-- TOC entry 5254 (class 0 OID 16810)
-- Dependencies: 219
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public._prisma_migrations DISABLE TRIGGER ALL;



ALTER TABLE public._prisma_migrations ENABLE TRIGGER ALL;

--
-- TOC entry 5318 (class 0 OID 0)
-- Dependencies: 230
-- Name: BangCap_ma_bang_cap_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BangCap_ma_bang_cap_seq"', 1, false);


--
-- TOC entry 5319 (class 0 OID 0)
-- Dependencies: 238
-- Name: BangLuong_ma_bang_luong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BangLuong_ma_bang_luong_seq"', 1, false);


--
-- TOC entry 5320 (class 0 OID 0)
-- Dependencies: 260
-- Name: CamKet_ma_cam_ket_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CamKet_ma_cam_ket_seq"', 12, true);


--
-- TOC entry 5321 (class 0 OID 0)
-- Dependencies: 276
-- Name: ChucVu_ma_chuc_vu_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChucVu_ma_chuc_vu_seq"', 15, true);


--
-- TOC entry 5322 (class 0 OID 0)
-- Dependencies: 248
-- Name: ChuongTrinhHoc_ma_chuong_trinh_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChuongTrinhHoc_ma_chuong_trinh_seq"', 1, false);


--
-- TOC entry 5323 (class 0 OID 0)
-- Dependencies: 264
-- Name: ChuongTrinhKhuyenMai_ma_khuyen_mai_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"', 1, false);


--
-- TOC entry 5324 (class 0 OID 0)
-- Dependencies: 272
-- Name: ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq"', 1, false);


--
-- TOC entry 5325 (class 0 OID 0)
-- Dependencies: 246
-- Name: CongNo_ma_cong_no_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CongNo_ma_cong_no_seq"', 1, false);


--
-- TOC entry 5326 (class 0 OID 0)
-- Dependencies: 232
-- Name: HoSoBangCap_ma_ho_so_bang_cap_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."HoSoBangCap_ma_ho_so_bang_cap_seq"', 1, false);


--
-- TOC entry 5327 (class 0 OID 0)
-- Dependencies: 266
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq"', 1, false);


--
-- TOC entry 5328 (class 0 OID 0)
-- Dependencies: 256
-- Name: HocVien_ma_hoc_vien_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."HocVien_ma_hoc_vien_seq"', 9, true);


--
-- TOC entry 5329 (class 0 OID 0)
-- Dependencies: 234
-- Name: HopDongLaoDong_ma_hop_dong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."HopDongLaoDong_ma_hop_dong_seq"', 1, false);


--
-- TOC entry 5330 (class 0 OID 0)
-- Dependencies: 262
-- Name: KeHoachGiangDay_ma_ke_hoach_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."KeHoachGiangDay_ma_ke_hoach_seq"', 1, false);


--
-- TOC entry 5331 (class 0 OID 0)
-- Dependencies: 250
-- Name: KhoaHoc_ma_khoa_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."KhoaHoc_ma_khoa_hoc_seq"', 1, false);


--
-- TOC entry 5332 (class 0 OID 0)
-- Dependencies: 254
-- Name: LopHoc_ma_lop_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LopHoc_ma_lop_hoc_seq"', 1, false);


--
-- TOC entry 5333 (class 0 OID 0)
-- Dependencies: 228
-- Name: NhanSu_ma_nhan_su_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."NhanSu_ma_nhan_su_seq"', 5, true);


--
-- TOC entry 5334 (class 0 OID 0)
-- Dependencies: 270
-- Name: PhanCongHoatDong_ma_phan_cong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhanCongHoatDong_ma_phan_cong_seq"', 1, false);


--
-- TOC entry 5335 (class 0 OID 0)
-- Dependencies: 274
-- Name: PhanCongMarketing_ma_phan_cong_marketing_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhanCongMarketing_ma_phan_cong_marketing_seq"', 1, false);


--
-- TOC entry 5336 (class 0 OID 0)
-- Dependencies: 224
-- Name: PhanQuyen_ma_phan_quyen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhanQuyen_ma_phan_quyen_seq"', 90, true);


--
-- TOC entry 5337 (class 0 OID 0)
-- Dependencies: 244
-- Name: PhieuChi_ma_phieu_chi_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhieuChi_ma_phieu_chi_seq"', 1, false);


--
-- TOC entry 5338 (class 0 OID 0)
-- Dependencies: 236
-- Name: PhieuLuong_ma_phieu_luong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhieuLuong_ma_phieu_luong_seq"', 1, false);


--
-- TOC entry 5339 (class 0 OID 0)
-- Dependencies: 242
-- Name: PhieuThu_ma_phieu_thu_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhieuThu_ma_phieu_thu_seq"', 22, true);


--
-- TOC entry 5340 (class 0 OID 0)
-- Dependencies: 240
-- Name: PhieuThuong_ma_phieu_thuong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhieuThuong_ma_phieu_thuong_seq"', 1, false);


--
-- TOC entry 5341 (class 0 OID 0)
-- Dependencies: 226
-- Name: PhongBan_ma_phong_ban_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhongBan_ma_phong_ban_seq"', 8, true);


--
-- TOC entry 5342 (class 0 OID 0)
-- Dependencies: 252
-- Name: PhongHoc_ma_phong_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhongHoc_ma_phong_hoc_seq"', 7, true);


--
-- TOC entry 5343 (class 0 OID 0)
-- Dependencies: 220
-- Name: Quyen_ma_quyen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Quyen_ma_quyen_seq"', 26, true);


--
-- TOC entry 5344 (class 0 OID 0)
-- Dependencies: 222
-- Name: TaiKhoan_ma_tai_khoan_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TaiKhoan_ma_tai_khoan_seq"', 6, true);


--
-- TOC entry 5345 (class 0 OID 0)
-- Dependencies: 258
-- Name: ThamGiaLop_ma_tham_gia_lop_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ThamGiaLop_ma_tham_gia_lop_seq"', 1, false);


--
-- TOC entry 5346 (class 0 OID 0)
-- Dependencies: 268
-- Name: ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq"', 1, false);


-- Completed on 2026-04-24 22:05:27

--
-- PostgreSQL database dump complete
--

\unrestrict RXXgpMrY1d3WBUF9p5Z0KXH0kxwRg7quqbYu2wnV2UD6WO8JaM880KkJ0jEvXca


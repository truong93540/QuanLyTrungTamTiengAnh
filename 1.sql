--
-- PostgreSQL database dump
--

\restrict 2ackOkLBxEy9uB2bE15XxWZ1q1qWMhEb3QWhuNIP50fzLlqg0lkPxqihKpkZJXO

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-17 16:44:37

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 288 (class 1259 OID 26130)
-- Name: BaiKiemTra; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BaiKiemTra" (
    ma_bai_kiem_tra integer NOT NULL,
    ten_bai_kiem_tra text NOT NULL,
    ngay_kiem_tra timestamp(3) without time zone NOT NULL,
    ma_khoa_hoc integer NOT NULL
);


--
-- TOC entry 287 (class 1259 OID 26129)
-- Name: BaiKiemTra_ma_bai_kiem_tra_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."BaiKiemTra_ma_bai_kiem_tra_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5537 (class 0 OID 0)
-- Dependencies: 287
-- Name: BaiKiemTra_ma_bai_kiem_tra_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."BaiKiemTra_ma_bai_kiem_tra_seq" OWNED BY public."BaiKiemTra".ma_bai_kiem_tra;


--
-- TOC entry 236 (class 1259 OID 25801)
-- Name: BangCap; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BangCap" (
    ma_bang_cap integer NOT NULL,
    ten_bang_cap text NOT NULL
);


--
-- TOC entry 235 (class 1259 OID 25800)
-- Name: BangCap_ma_bang_cap_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."BangCap_ma_bang_cap_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5538 (class 0 OID 0)
-- Dependencies: 235
-- Name: BangCap_ma_bang_cap_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."BangCap_ma_bang_cap_seq" OWNED BY public."BangCap".ma_bang_cap;


--
-- TOC entry 240 (class 1259 OID 25824)
-- Name: BangChamCong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BangChamCong" (
    ma_bang_cham_cong integer NOT NULL,
    ky_cham_cong text NOT NULL,
    trang_thai text
);


--
-- TOC entry 239 (class 1259 OID 25823)
-- Name: BangChamCong_ma_bang_cham_cong_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."BangChamCong_ma_bang_cham_cong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5539 (class 0 OID 0)
-- Dependencies: 239
-- Name: BangChamCong_ma_bang_cham_cong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."BangChamCong_ma_bang_cham_cong_seq" OWNED BY public."BangChamCong".ma_bang_cham_cong;


--
-- TOC entry 244 (class 1259 OID 25851)
-- Name: BangLuong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BangLuong" (
    ma_bang_luong integer NOT NULL,
    ky_luong text NOT NULL,
    tong_so_tien numeric(15,2) NOT NULL,
    ghi_chu text
);


--
-- TOC entry 243 (class 1259 OID 25850)
-- Name: BangLuong_ma_bang_luong_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."BangLuong_ma_bang_luong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5540 (class 0 OID 0)
-- Dependencies: 243
-- Name: BangLuong_ma_bang_luong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."BangLuong_ma_bang_luong_seq" OWNED BY public."BangLuong".ma_bang_luong;


--
-- TOC entry 298 (class 1259 OID 34002)
-- Name: BangThuong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BangThuong" (
    ma_bang_thuong integer NOT NULL,
    ki_thuong text,
    so_tien_thuong numeric(15,2)
);


--
-- TOC entry 297 (class 1259 OID 34001)
-- Name: BangThuong_ma_bang_thuong_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."BangThuong_ma_bang_thuong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5541 (class 0 OID 0)
-- Dependencies: 297
-- Name: BangThuong_ma_bang_thuong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."BangThuong_ma_bang_thuong_seq" OWNED BY public."BangThuong".ma_bang_thuong;


--
-- TOC entry 272 (class 1259 OID 26038)
-- Name: BuoiHoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BuoiHoc" (
    ma_buoi_hoc integer NOT NULL,
    ngay_hoc timestamp(3) without time zone NOT NULL,
    noi_dung_hoc text,
    ma_giao_vien integer NOT NULL,
    ma_lop_hoc integer NOT NULL
);


--
-- TOC entry 271 (class 1259 OID 26037)
-- Name: BuoiHoc_ma_buoi_hoc_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."BuoiHoc_ma_buoi_hoc_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5542 (class 0 OID 0)
-- Dependencies: 271
-- Name: BuoiHoc_ma_buoi_hoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."BuoiHoc_ma_buoi_hoc_seq" OWNED BY public."BuoiHoc".ma_buoi_hoc;


--
-- TOC entry 268 (class 1259 OID 26014)
-- Name: CamKet; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CamKet" (
    ma_cam_ket integer NOT NULL,
    ngay_ky timestamp(3) without time zone NOT NULL,
    ngay_het_han timestamp(3) without time zone,
    noi_dung_cam_ket text,
    trang_thai text,
    so_buoi_vang_cho_phep integer,
    tham_gia_thi_day_du boolean,
    so_buoi_di_muon integer,
    so_lan_thieu_bai_tap integer,
    ma_hoc_vien integer NOT NULL,
    ma_khoa_hoc integer NOT NULL,
    bi_vi_pham boolean DEFAULT false NOT NULL,
    da_bo_thi boolean DEFAULT false,
    ly_do_vi_pham text,
    so_buoi_di_muon_thuc_te integer DEFAULT 0,
    so_buoi_vang_thuc_te integer DEFAULT 0,
    so_lan_thieu_bai_tap_thuc_te integer DEFAULT 0
);


--
-- TOC entry 267 (class 1259 OID 26013)
-- Name: CamKet_ma_cam_ket_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."CamKet_ma_cam_ket_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5543 (class 0 OID 0)
-- Dependencies: 267
-- Name: CamKet_ma_cam_ket_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."CamKet_ma_cam_ket_seq" OWNED BY public."CamKet".ma_cam_ket;


--
-- TOC entry 242 (class 1259 OID 25837)
-- Name: ChiTietChamCong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ChiTietChamCong" (
    ma_chi_tiet_cham_cong integer NOT NULL,
    ma_nhan_su integer,
    ma_giao_vien integer,
    ngay date NOT NULL,
    gio_ra_1 text,
    gio_ra_2 text,
    gio_ra_3 text,
    gio_ra_4 text,
    gio_ra_5 text,
    gio_ra_6 text,
    gio_vao_1 text,
    gio_vao_2 text,
    gio_vao_3 text,
    gio_vao_4 text,
    gio_vao_5 text,
    gio_vao_6 text,
    ma_phieu_cham_cong integer NOT NULL
);


--
-- TOC entry 241 (class 1259 OID 25836)
-- Name: ChiTietChamCong_ma_chi_tiet_cham_cong_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ChiTietChamCong_ma_chi_tiet_cham_cong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5544 (class 0 OID 0)
-- Dependencies: 241
-- Name: ChiTietChamCong_ma_chi_tiet_cham_cong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ChiTietChamCong_ma_chi_tiet_cham_cong_seq" OWNED BY public."ChiTietChamCong".ma_chi_tiet_cham_cong;


--
-- TOC entry 228 (class 1259 OID 25753)
-- Name: ChucVu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ChucVu" (
    ma_chuc_vu integer NOT NULL,
    ten_chuc_vu text NOT NULL,
    mo_ta text
);


--
-- TOC entry 227 (class 1259 OID 25752)
-- Name: ChucVu_ma_chuc_vu_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ChucVu_ma_chuc_vu_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5545 (class 0 OID 0)
-- Dependencies: 227
-- Name: ChucVu_ma_chuc_vu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ChucVu_ma_chuc_vu_seq" OWNED BY public."ChucVu".ma_chuc_vu;


--
-- TOC entry 256 (class 1259 OID 25940)
-- Name: ChuongTrinhHoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ChuongTrinhHoc" (
    ma_chuong_trinh integer NOT NULL,
    ten_chuong_trinh text NOT NULL,
    mo_ta text,
    muc_tieu text
);


--
-- TOC entry 255 (class 1259 OID 25939)
-- Name: ChuongTrinhHoc_ma_chuong_trinh_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ChuongTrinhHoc_ma_chuong_trinh_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5546 (class 0 OID 0)
-- Dependencies: 255
-- Name: ChuongTrinhHoc_ma_chuong_trinh_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ChuongTrinhHoc_ma_chuong_trinh_seq" OWNED BY public."ChuongTrinhHoc".ma_chuong_trinh;


--
-- TOC entry 286 (class 1259 OID 26118)
-- Name: ChuongTrinhKhuyenMai; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ChuongTrinhKhuyenMai" (
    ma_khuyen_mai integer NOT NULL,
    ten_chuong_trinh text NOT NULL,
    mo_ta text,
    phan_tram_giam double precision,
    ngay_bat_dau timestamp(3) without time zone NOT NULL,
    ngay_ket_thuc timestamp(3) without time zone
);


--
-- TOC entry 285 (class 1259 OID 26117)
-- Name: ChuongTrinhKhuyenMai_ma_khuyen_mai_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5547 (class 0 OID 0)
-- Dependencies: 285
-- Name: ChuongTrinhKhuyenMai_ma_khuyen_mai_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq" OWNED BY public."ChuongTrinhKhuyenMai".ma_khuyen_mai;


--
-- TOC entry 276 (class 1259 OID 26063)
-- Name: ChuongTrinhMarketing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ChuongTrinhMarketing" (
    ma_chuong_trinh_marketing integer NOT NULL,
    ten_chuong_trinh_marketing text NOT NULL,
    noi_dung text,
    ngay_bat_dau timestamp(3) without time zone,
    ngay_ket_thuc timestamp(3) without time zone,
    ngan_sach numeric(15,2),
    ma_khoa_hoc integer
);


--
-- TOC entry 275 (class 1259 OID 26062)
-- Name: ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5548 (class 0 OID 0)
-- Dependencies: 275
-- Name: ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq" OWNED BY public."ChuongTrinhMarketing".ma_chuong_trinh_marketing;


--
-- TOC entry 254 (class 1259 OID 25926)
-- Name: CongNo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CongNo" (
    ma_cong_no integer NOT NULL,
    so_tien_no numeric(15,2) NOT NULL,
    ngay_phat_sinh timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    han_thanh_toan timestamp(3) without time zone,
    trang_thai text,
    ma_hoc_vien integer NOT NULL
);


--
-- TOC entry 253 (class 1259 OID 25925)
-- Name: CongNo_ma_cong_no_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."CongNo_ma_cong_no_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5549 (class 0 OID 0)
-- Dependencies: 253
-- Name: CongNo_ma_cong_no_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."CongNo_ma_cong_no_seq" OWNED BY public."CongNo".ma_cong_no;


--
-- TOC entry 274 (class 1259 OID 26051)
-- Name: DiemDanh; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DiemDanh" (
    ma_diem_danh integer NOT NULL,
    ma_buoi_hoc integer NOT NULL,
    ma_hoc_vien integer NOT NULL,
    trang_thai text,
    ghi_chu text
);


--
-- TOC entry 273 (class 1259 OID 26050)
-- Name: DiemDanh_ma_diem_danh_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."DiemDanh_ma_diem_danh_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5550 (class 0 OID 0)
-- Dependencies: 273
-- Name: DiemDanh_ma_diem_danh_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."DiemDanh_ma_diem_danh_seq" OWNED BY public."DiemDanh".ma_diem_danh;


--
-- TOC entry 232 (class 1259 OID 25777)
-- Name: GiaoVien; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GiaoVien" (
    ma_giao_vien integer NOT NULL,
    ho_ten text NOT NULL,
    ngay_sinh timestamp(3) without time zone,
    gioi_tinh text,
    so_dien_thoai text,
    email text,
    dia_chi text,
    ma_chuc_vu integer NOT NULL,
    ma_phong_ban integer NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 25776)
-- Name: GiaoVien_ma_giao_vien_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."GiaoVien_ma_giao_vien_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5551 (class 0 OID 0)
-- Dependencies: 231
-- Name: GiaoVien_ma_giao_vien_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."GiaoVien_ma_giao_vien_seq" OWNED BY public."GiaoVien".ma_giao_vien;


--
-- TOC entry 234 (class 1259 OID 25790)
-- Name: HoSoBangCap; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HoSoBangCap" (
    ma_ho_so_bang_cap integer NOT NULL,
    ma_nhan_su integer,
    ma_giao_vien integer,
    ma_bang_cap integer NOT NULL,
    ngay_cap timestamp(3) without time zone,
    noi_cap text
);


--
-- TOC entry 233 (class 1259 OID 25789)
-- Name: HoSoBangCap_ma_ho_so_bang_cap_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."HoSoBangCap_ma_ho_so_bang_cap_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5552 (class 0 OID 0)
-- Dependencies: 233
-- Name: HoSoBangCap_ma_ho_so_bang_cap_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."HoSoBangCap_ma_ho_so_bang_cap_seq" OWNED BY public."HoSoBangCap".ma_ho_so_bang_cap;


--
-- TOC entry 280 (class 1259 OID 26086)
-- Name: HoatDongNgoaiKhoa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HoatDongNgoaiKhoa" (
    ma_hoat_dong_ngoai_khoa integer NOT NULL,
    ten_hoat_dong text NOT NULL,
    mo_ta text,
    ngay_to_chuc timestamp(3) without time zone NOT NULL,
    dia_diem text,
    chi_phi numeric(15,2)
);


--
-- TOC entry 279 (class 1259 OID 26085)
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5553 (class 0 OID 0)
-- Dependencies: 279
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq" OWNED BY public."HoatDongNgoaiKhoa".ma_hoat_dong_ngoai_khoa;


--
-- TOC entry 264 (class 1259 OID 25989)
-- Name: HocVien; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HocVien" (
    ma_hoc_vien integer NOT NULL,
    ho_ten text NOT NULL,
    ngay_sinh timestamp(3) without time zone,
    gioi_tinh text,
    so_dien_thoai text,
    email text,
    dia_chi text,
    dau_ra_chung_chi text,
    trang_thai text DEFAULT 'Đang học'::text
);


--
-- TOC entry 263 (class 1259 OID 25988)
-- Name: HocVien_ma_hoc_vien_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."HocVien_ma_hoc_vien_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5554 (class 0 OID 0)
-- Dependencies: 263
-- Name: HocVien_ma_hoc_vien_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."HocVien_ma_hoc_vien_seq" OWNED BY public."HocVien".ma_hoc_vien;


--
-- TOC entry 238 (class 1259 OID 25812)
-- Name: HopDongLaoDong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HopDongLaoDong" (
    ma_hop_dong integer NOT NULL,
    ma_nhan_su integer,
    ma_giao_vien integer,
    so_hop_dong text NOT NULL,
    ngay_ky timestamp(3) without time zone,
    ten_cong_viec text,
    tg_thu_viec text,
    update_at timestamp(3) without time zone NOT NULL,
    chi_tiet_phu_cap jsonb,
    dong_bao_hiem boolean DEFAULT false,
    luong_co_ban numeric(15,2),
    phan_tram_hoa_hong double precision DEFAULT 0,
    tg_het_hop_dong timestamp(3) without time zone
);


--
-- TOC entry 237 (class 1259 OID 25811)
-- Name: HopDongLaoDong_ma_hop_dong_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."HopDongLaoDong_ma_hop_dong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5555 (class 0 OID 0)
-- Dependencies: 237
-- Name: HopDongLaoDong_ma_hop_dong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."HopDongLaoDong_ma_hop_dong_seq" OWNED BY public."HopDongLaoDong".ma_hop_dong;


--
-- TOC entry 270 (class 1259 OID 26026)
-- Name: KeHoachGiangDay; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."KeHoachGiangDay" (
    ma_ke_hoach_giang_day integer NOT NULL,
    noi_dung text,
    lich_day text,
    thoi_gian text,
    ma_giao_vien integer NOT NULL,
    ma_khoa_hoc integer NOT NULL
);


--
-- TOC entry 269 (class 1259 OID 26025)
-- Name: KeHoachGiangDay_ma_ke_hoach_giang_day_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."KeHoachGiangDay_ma_ke_hoach_giang_day_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5556 (class 0 OID 0)
-- Dependencies: 269
-- Name: KeHoachGiangDay_ma_ke_hoach_giang_day_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."KeHoachGiangDay_ma_ke_hoach_giang_day_seq" OWNED BY public."KeHoachGiangDay".ma_ke_hoach_giang_day;


--
-- TOC entry 290 (class 1259 OID 26143)
-- Name: KetQuaKiemTra; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."KetQuaKiemTra" (
    ma_ket_qua_kiem_tra integer NOT NULL,
    ma_bai_kiem_tra integer NOT NULL,
    ma_hoc_vien integer NOT NULL,
    diem_so double precision NOT NULL,
    trang_thai text,
    nhan_xet text
);


--
-- TOC entry 289 (class 1259 OID 26142)
-- Name: KetQuaKiemTra_ma_ket_qua_kiem_tra_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."KetQuaKiemTra_ma_ket_qua_kiem_tra_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5557 (class 0 OID 0)
-- Dependencies: 289
-- Name: KetQuaKiemTra_ma_ket_qua_kiem_tra_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."KetQuaKiemTra_ma_ket_qua_kiem_tra_seq" OWNED BY public."KetQuaKiemTra".ma_ket_qua_kiem_tra;


--
-- TOC entry 258 (class 1259 OID 25951)
-- Name: KhoaHoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."KhoaHoc" (
    ma_khoa_hoc integer NOT NULL,
    ten_khoa_hoc text NOT NULL,
    mo_ta text,
    thoi_luong text,
    hoc_phi numeric(15,2) NOT NULL,
    trinh_do text,
    trang_thai text,
    ma_chuong_trinh integer NOT NULL
);


--
-- TOC entry 257 (class 1259 OID 25950)
-- Name: KhoaHoc_ma_khoa_hoc_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."KhoaHoc_ma_khoa_hoc_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5558 (class 0 OID 0)
-- Dependencies: 257
-- Name: KhoaHoc_ma_khoa_hoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."KhoaHoc_ma_khoa_hoc_seq" OWNED BY public."KhoaHoc".ma_khoa_hoc;


--
-- TOC entry 260 (class 1259 OID 25964)
-- Name: LopHoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LopHoc" (
    ma_lop_hoc integer NOT NULL,
    ten_lop text NOT NULL,
    si_so_toi_da integer,
    ngay_khai_giang timestamp(3) without time zone,
    ngay_ket_thuc timestamp(3) without time zone,
    ma_phong_hoc integer NOT NULL,
    ma_khoa_hoc integer NOT NULL,
    lich_hoc jsonb
);


--
-- TOC entry 259 (class 1259 OID 25963)
-- Name: LopHoc_ma_lop_hoc_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."LopHoc_ma_lop_hoc_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5559 (class 0 OID 0)
-- Dependencies: 259
-- Name: LopHoc_ma_lop_hoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."LopHoc_ma_lop_hoc_seq" OWNED BY public."LopHoc".ma_lop_hoc;


--
-- TOC entry 230 (class 1259 OID 25764)
-- Name: NhanSu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."NhanSu" (
    ma_nhan_su integer CONSTRAINT "NhanVien_ma_nhan_vien_not_null" NOT NULL,
    ho_ten text CONSTRAINT "NhanVien_ho_ten_not_null" NOT NULL,
    ngay_sinh timestamp(3) without time zone,
    gioi_tinh text,
    so_dien_thoai text,
    dia_chi text,
    ma_chuc_vu integer CONSTRAINT "NhanVien_ma_chuc_vu_not_null" NOT NULL,
    ma_phong_ban integer CONSTRAINT "NhanVien_ma_phong_ban_not_null" NOT NULL,
    email text
);


--
-- TOC entry 229 (class 1259 OID 25763)
-- Name: NhanSu_ma_nhan_su_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."NhanSu_ma_nhan_su_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5560 (class 0 OID 0)
-- Dependencies: 229
-- Name: NhanSu_ma_nhan_su_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."NhanSu_ma_nhan_su_seq" OWNED BY public."NhanSu".ma_nhan_su;


--
-- TOC entry 292 (class 1259 OID 26156)
-- Name: NhanXet; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."NhanXet" (
    ma_nhan_xet integer NOT NULL,
    ma_hoc_vien integer NOT NULL,
    ma_buoi_hoc integer NOT NULL,
    da_lam_bai_tap boolean DEFAULT false,
    noi_dung_nhan_xet text,
    ngay_nhan_xet timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 291 (class 1259 OID 26155)
-- Name: NhanXet_ma_nhan_xet_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."NhanXet_ma_nhan_xet_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5561 (class 0 OID 0)
-- Dependencies: 291
-- Name: NhanXet_ma_nhan_xet_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."NhanXet_ma_nhan_xet_seq" OWNED BY public."NhanXet".ma_nhan_xet;


--
-- TOC entry 294 (class 1259 OID 33900)
-- Name: PhanCongGiangDay; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhanCongGiangDay" (
    ma_phan_cong_giang_day integer NOT NULL,
    ma_lop_hoc integer NOT NULL,
    ma_giao_vien integer NOT NULL
);


--
-- TOC entry 293 (class 1259 OID 33899)
-- Name: PhanCongGiangDay_ma_phan_cong_giang_day_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhanCongGiangDay_ma_phan_cong_giang_day_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5562 (class 0 OID 0)
-- Dependencies: 293
-- Name: PhanCongGiangDay_ma_phan_cong_giang_day_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhanCongGiangDay_ma_phan_cong_giang_day_seq" OWNED BY public."PhanCongGiangDay".ma_phan_cong_giang_day;


--
-- TOC entry 284 (class 1259 OID 26108)
-- Name: PhanCongHoatDong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhanCongHoatDong" (
    ma_phan_cong_hoat_dong integer NOT NULL,
    ma_hoat_dong_ngoai_khoa integer NOT NULL,
    ma_giao_vien integer NOT NULL
);


--
-- TOC entry 283 (class 1259 OID 26107)
-- Name: PhanCongHoatDong_ma_phan_cong_hoat_dong_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhanCongHoatDong_ma_phan_cong_hoat_dong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5563 (class 0 OID 0)
-- Dependencies: 283
-- Name: PhanCongHoatDong_ma_phan_cong_hoat_dong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhanCongHoatDong_ma_phan_cong_hoat_dong_seq" OWNED BY public."PhanCongHoatDong".ma_phan_cong_hoat_dong;


--
-- TOC entry 278 (class 1259 OID 26074)
-- Name: PhanCongMarketing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhanCongMarketing" (
    ma_phan_cong_marketing integer NOT NULL,
    ma_chuong_trinh_marketing integer NOT NULL,
    ma_nhan_su integer CONSTRAINT "PhanCongMarketing_ma_nhan_vien_not_null" NOT NULL,
    vai_tro text
);


--
-- TOC entry 277 (class 1259 OID 26073)
-- Name: PhanCongMarketing_ma_phan_cong_marketing_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhanCongMarketing_ma_phan_cong_marketing_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5564 (class 0 OID 0)
-- Dependencies: 277
-- Name: PhanCongMarketing_ma_phan_cong_marketing_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhanCongMarketing_ma_phan_cong_marketing_seq" OWNED BY public."PhanCongMarketing".ma_phan_cong_marketing;


--
-- TOC entry 224 (class 1259 OID 25732)
-- Name: PhanQuyen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhanQuyen" (
    ma_phan_quyen integer NOT NULL,
    ma_tai_khoan integer NOT NULL,
    ma_quyen integer NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 25731)
-- Name: PhanQuyen_ma_phan_quyen_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhanQuyen_ma_phan_quyen_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5565 (class 0 OID 0)
-- Dependencies: 223
-- Name: PhanQuyen_ma_phan_quyen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhanQuyen_ma_phan_quyen_seq" OWNED BY public."PhanQuyen".ma_phan_quyen;


--
-- TOC entry 296 (class 1259 OID 33923)
-- Name: PhieuChamCong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhieuChamCong" (
    ma_phieu_cham_cong integer NOT NULL,
    ma_bang_cham_cong integer NOT NULL,
    ma_nhan_su integer,
    ma_giao_vien integer,
    ho_ten text,
    ngay_1 double precision DEFAULT 0,
    ngay_2 double precision DEFAULT 0,
    ngay_3 double precision DEFAULT 0,
    ngay_4 double precision DEFAULT 0,
    ngay_5 double precision DEFAULT 0,
    ngay_6 double precision DEFAULT 0,
    ngay_7 double precision DEFAULT 0,
    ngay_8 double precision DEFAULT 0,
    ngay_9 double precision DEFAULT 0,
    ngay_10 double precision DEFAULT 0,
    ngay_11 double precision DEFAULT 0,
    ngay_12 double precision DEFAULT 0,
    ngay_13 double precision DEFAULT 0,
    ngay_14 double precision DEFAULT 0,
    ngay_15 double precision DEFAULT 0,
    ngay_16 double precision DEFAULT 0,
    ngay_17 double precision DEFAULT 0,
    ngay_18 double precision DEFAULT 0,
    ngay_19 double precision DEFAULT 0,
    ngay_20 double precision DEFAULT 0,
    ngay_21 double precision DEFAULT 0,
    ngay_22 double precision DEFAULT 0,
    ngay_23 double precision DEFAULT 0,
    ngay_24 double precision DEFAULT 0,
    ngay_25 double precision DEFAULT 0,
    ngay_26 double precision DEFAULT 0,
    ngay_27 double precision DEFAULT 0,
    ngay_28 double precision DEFAULT 0,
    ngay_29 double precision DEFAULT 0,
    ngay_30 double precision DEFAULT 0,
    ngay_31 double precision DEFAULT 0,
    tong_so_gio_lam_viec double precision DEFAULT 0,
    so_lan_di_muon integer DEFAULT 0,
    so_lan_ve_som integer DEFAULT 0,
    so_gio_lam_viec_thuong double precision DEFAULT 0,
    so_gio_tang_ca_ngay_thuong double precision DEFAULT 0,
    so_gio_lam_viec_thuong_ngay_nghi double precision DEFAULT 0,
    so_gio_tang_ca_ngay_nghi double precision DEFAULT 0
);


--
-- TOC entry 295 (class 1259 OID 33922)
-- Name: PhieuChamCong_ma_phieu_cham_cong_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhieuChamCong_ma_phieu_cham_cong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5566 (class 0 OID 0)
-- Dependencies: 295
-- Name: PhieuChamCong_ma_phieu_cham_cong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhieuChamCong_ma_phieu_cham_cong_seq" OWNED BY public."PhieuChamCong".ma_phieu_cham_cong;


--
-- TOC entry 252 (class 1259 OID 25913)
-- Name: PhieuChi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhieuChi" (
    ma_phieu_chi integer NOT NULL,
    loai_phieu_chi text NOT NULL,
    tong_tien numeric(15,2) NOT NULL,
    hinh_thuc_chi text,
    nguoi_nhan text,
    noi_dung text,
    trang_thai text,
    ma_bang_luong integer,
    ma_chuong_trinh_marketing integer,
    ma_nhan_su integer CONSTRAINT "PhieuChi_ma_nhan_vien_not_null" NOT NULL
);


--
-- TOC entry 251 (class 1259 OID 25912)
-- Name: PhieuChi_ma_phieu_chi_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhieuChi_ma_phieu_chi_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5567 (class 0 OID 0)
-- Dependencies: 251
-- Name: PhieuChi_ma_phieu_chi_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhieuChi_ma_phieu_chi_seq" OWNED BY public."PhieuChi".ma_phieu_chi;


--
-- TOC entry 246 (class 1259 OID 25863)
-- Name: PhieuLuong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhieuLuong" (
    ma_phieu_luong integer NOT NULL,
    ma_nhan_su integer,
    ma_giao_vien integer,
    ma_bang_luong integer NOT NULL,
    luong_co_ban numeric(15,2) NOT NULL,
    tang_ca numeric(65,30) DEFAULT 0,
    tong_thuong numeric(65,30) DEFAULT 0,
    thuc_linh numeric(15,2) NOT NULL,
    ghi_chu text,
    trang_thai text,
    ma_phieu_cham_cong integer NOT NULL,
    bao_hiem_xa_hoi numeric(15,2) DEFAULT 0,
    chi_tiet_phu_cap jsonb,
    tien_hoa_hong numeric(15,2) DEFAULT 0
);


--
-- TOC entry 245 (class 1259 OID 25862)
-- Name: PhieuLuong_ma_phieu_luong_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhieuLuong_ma_phieu_luong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5568 (class 0 OID 0)
-- Dependencies: 245
-- Name: PhieuLuong_ma_phieu_luong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhieuLuong_ma_phieu_luong_seq" OWNED BY public."PhieuLuong".ma_phieu_luong;


--
-- TOC entry 250 (class 1259 OID 25897)
-- Name: PhieuThu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhieuThu" (
    ma_phieu_thu integer NOT NULL,
    so_tien numeric(15,2) NOT NULL,
    ngay_thu timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    noi_dung text,
    ma_hoc_vien integer NOT NULL,
    ma_nhan_su integer CONSTRAINT "PhieuThu_ma_nhan_vien_not_null" NOT NULL,
    ma_khuyen_mai integer,
    ma_khoa_hoc integer NOT NULL
);


--
-- TOC entry 249 (class 1259 OID 25896)
-- Name: PhieuThu_ma_phieu_thu_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhieuThu_ma_phieu_thu_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5569 (class 0 OID 0)
-- Dependencies: 249
-- Name: PhieuThu_ma_phieu_thu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhieuThu_ma_phieu_thu_seq" OWNED BY public."PhieuThu".ma_phieu_thu;


--
-- TOC entry 248 (class 1259 OID 25885)
-- Name: PhieuThuong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhieuThuong" (
    ma_phieu_thuong integer NOT NULL,
    ma_nhan_su integer,
    ma_phieu_luong integer,
    loai_thuong text NOT NULL,
    so_tien numeric(15,2) NOT NULL,
    noi_dung text,
    ma_bang_thuong integer,
    ma_giao_vien integer
);


--
-- TOC entry 247 (class 1259 OID 25884)
-- Name: PhieuThuong_ma_phieu_thuong_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhieuThuong_ma_phieu_thuong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5570 (class 0 OID 0)
-- Dependencies: 247
-- Name: PhieuThuong_ma_phieu_thuong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhieuThuong_ma_phieu_thuong_seq" OWNED BY public."PhieuThuong".ma_phieu_thuong;


--
-- TOC entry 226 (class 1259 OID 25742)
-- Name: PhongBan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhongBan" (
    ma_phong_ban integer NOT NULL,
    ten_phong_ban text NOT NULL,
    mo_ta text,
    ngay_thanh_lap timestamp(3) without time zone
);


--
-- TOC entry 225 (class 1259 OID 25741)
-- Name: PhongBan_ma_phong_ban_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhongBan_ma_phong_ban_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5571 (class 0 OID 0)
-- Dependencies: 225
-- Name: PhongBan_ma_phong_ban_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhongBan_ma_phong_ban_seq" OWNED BY public."PhongBan".ma_phong_ban;


--
-- TOC entry 262 (class 1259 OID 25978)
-- Name: PhongHoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhongHoc" (
    ma_phong_hoc integer NOT NULL,
    ten_phong_hoc text NOT NULL,
    suc_chua integer
);


--
-- TOC entry 261 (class 1259 OID 25977)
-- Name: PhongHoc_ma_phong_hoc_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhongHoc_ma_phong_hoc_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5572 (class 0 OID 0)
-- Dependencies: 261
-- Name: PhongHoc_ma_phong_hoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhongHoc_ma_phong_hoc_seq" OWNED BY public."PhongHoc".ma_phong_hoc;


--
-- TOC entry 220 (class 1259 OID 25708)
-- Name: Quyen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Quyen" (
    ma_quyen integer NOT NULL,
    ten_quyen text NOT NULL,
    trang_thai text
);


--
-- TOC entry 219 (class 1259 OID 25707)
-- Name: Quyen_ma_quyen_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Quyen_ma_quyen_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5573 (class 0 OID 0)
-- Dependencies: 219
-- Name: Quyen_ma_quyen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Quyen_ma_quyen_seq" OWNED BY public."Quyen".ma_quyen;


--
-- TOC entry 222 (class 1259 OID 25719)
-- Name: TaiKhoan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TaiKhoan" (
    ma_tai_khoan integer NOT NULL,
    ten_dang_nhap text NOT NULL,
    mat_khau text NOT NULL,
    trang_thai text,
    ma_nhan_su integer,
    ma_giao_vien integer
);


--
-- TOC entry 221 (class 1259 OID 25718)
-- Name: TaiKhoan_ma_tai_khoan_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."TaiKhoan_ma_tai_khoan_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5574 (class 0 OID 0)
-- Dependencies: 221
-- Name: TaiKhoan_ma_tai_khoan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."TaiKhoan_ma_tai_khoan_seq" OWNED BY public."TaiKhoan".ma_tai_khoan;


--
-- TOC entry 266 (class 1259 OID 26000)
-- Name: ThamGiaLop; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ThamGiaLop" (
    ma_tham_gia_lop integer NOT NULL,
    ma_hoc_vien integer NOT NULL,
    ma_lop_hoc integer NOT NULL,
    ngay_dang_ky timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    trang_thai text
);


--
-- TOC entry 265 (class 1259 OID 25999)
-- Name: ThamGiaLop_ma_tham_gia_lop_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ThamGiaLop_ma_tham_gia_lop_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5575 (class 0 OID 0)
-- Dependencies: 265
-- Name: ThamGiaLop_ma_tham_gia_lop_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ThamGiaLop_ma_tham_gia_lop_seq" OWNED BY public."ThamGiaLop".ma_tham_gia_lop;


--
-- TOC entry 282 (class 1259 OID 26098)
-- Name: ThamGiaNgoaiKhoa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ThamGiaNgoaiKhoa" (
    ma_tham_gia_ngoai_khoa integer NOT NULL,
    ma_hoc_vien integer NOT NULL,
    ma_hoat_dong_ngoai_khoa integer NOT NULL
);


--
-- TOC entry 281 (class 1259 OID 26097)
-- Name: ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5576 (class 0 OID 0)
-- Dependencies: 281
-- Name: ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq" OWNED BY public."ThamGiaNgoaiKhoa".ma_tham_gia_ngoai_khoa;


--
-- TOC entry 5100 (class 2604 OID 26133)
-- Name: BaiKiemTra ma_bai_kiem_tra; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BaiKiemTra" ALTER COLUMN ma_bai_kiem_tra SET DEFAULT nextval('public."BaiKiemTra_ma_bai_kiem_tra_seq"'::regclass);


--
-- TOC entry 5059 (class 2604 OID 25804)
-- Name: BangCap ma_bang_cap; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BangCap" ALTER COLUMN ma_bang_cap SET DEFAULT nextval('public."BangCap_ma_bang_cap_seq"'::regclass);


--
-- TOC entry 5063 (class 2604 OID 25827)
-- Name: BangChamCong ma_bang_cham_cong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BangChamCong" ALTER COLUMN ma_bang_cham_cong SET DEFAULT nextval('public."BangChamCong_ma_bang_cham_cong_seq"'::regclass);


--
-- TOC entry 5065 (class 2604 OID 25854)
-- Name: BangLuong ma_bang_luong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BangLuong" ALTER COLUMN ma_bang_luong SET DEFAULT nextval('public."BangLuong_ma_bang_luong_seq"'::regclass);


--
-- TOC entry 5145 (class 2604 OID 34005)
-- Name: BangThuong ma_bang_thuong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BangThuong" ALTER COLUMN ma_bang_thuong SET DEFAULT nextval('public."BangThuong_ma_bang_thuong_seq"'::regclass);


--
-- TOC entry 5092 (class 2604 OID 26041)
-- Name: BuoiHoc ma_buoi_hoc; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BuoiHoc" ALTER COLUMN ma_buoi_hoc SET DEFAULT nextval('public."BuoiHoc_ma_buoi_hoc_seq"'::regclass);


--
-- TOC entry 5085 (class 2604 OID 26017)
-- Name: CamKet ma_cam_ket; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CamKet" ALTER COLUMN ma_cam_ket SET DEFAULT nextval('public."CamKet_ma_cam_ket_seq"'::regclass);


--
-- TOC entry 5064 (class 2604 OID 25840)
-- Name: ChiTietChamCong ma_chi_tiet_cham_cong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChiTietChamCong" ALTER COLUMN ma_chi_tiet_cham_cong SET DEFAULT nextval('public."ChiTietChamCong_ma_chi_tiet_cham_cong_seq"'::regclass);


--
-- TOC entry 5055 (class 2604 OID 25756)
-- Name: ChucVu ma_chuc_vu; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChucVu" ALTER COLUMN ma_chuc_vu SET DEFAULT nextval('public."ChucVu_ma_chuc_vu_seq"'::regclass);


--
-- TOC entry 5077 (class 2604 OID 25943)
-- Name: ChuongTrinhHoc ma_chuong_trinh; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhHoc" ALTER COLUMN ma_chuong_trinh SET DEFAULT nextval('public."ChuongTrinhHoc_ma_chuong_trinh_seq"'::regclass);


--
-- TOC entry 5099 (class 2604 OID 26121)
-- Name: ChuongTrinhKhuyenMai ma_khuyen_mai; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhKhuyenMai" ALTER COLUMN ma_khuyen_mai SET DEFAULT nextval('public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"'::regclass);


--
-- TOC entry 5094 (class 2604 OID 26066)
-- Name: ChuongTrinhMarketing ma_chuong_trinh_marketing; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhMarketing" ALTER COLUMN ma_chuong_trinh_marketing SET DEFAULT nextval('public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq"'::regclass);


--
-- TOC entry 5075 (class 2604 OID 25929)
-- Name: CongNo ma_cong_no; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CongNo" ALTER COLUMN ma_cong_no SET DEFAULT nextval('public."CongNo_ma_cong_no_seq"'::regclass);


--
-- TOC entry 5093 (class 2604 OID 26054)
-- Name: DiemDanh ma_diem_danh; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DiemDanh" ALTER COLUMN ma_diem_danh SET DEFAULT nextval('public."DiemDanh_ma_diem_danh_seq"'::regclass);


--
-- TOC entry 5057 (class 2604 OID 25780)
-- Name: GiaoVien ma_giao_vien; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GiaoVien" ALTER COLUMN ma_giao_vien SET DEFAULT nextval('public."GiaoVien_ma_giao_vien_seq"'::regclass);


--
-- TOC entry 5058 (class 2604 OID 25793)
-- Name: HoSoBangCap ma_ho_so_bang_cap; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoSoBangCap" ALTER COLUMN ma_ho_so_bang_cap SET DEFAULT nextval('public."HoSoBangCap_ma_ho_so_bang_cap_seq"'::regclass);


--
-- TOC entry 5096 (class 2604 OID 26089)
-- Name: HoatDongNgoaiKhoa ma_hoat_dong_ngoai_khoa; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoatDongNgoaiKhoa" ALTER COLUMN ma_hoat_dong_ngoai_khoa SET DEFAULT nextval('public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq"'::regclass);


--
-- TOC entry 5081 (class 2604 OID 25992)
-- Name: HocVien ma_hoc_vien; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HocVien" ALTER COLUMN ma_hoc_vien SET DEFAULT nextval('public."HocVien_ma_hoc_vien_seq"'::regclass);


--
-- TOC entry 5060 (class 2604 OID 25815)
-- Name: HopDongLaoDong ma_hop_dong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HopDongLaoDong" ALTER COLUMN ma_hop_dong SET DEFAULT nextval('public."HopDongLaoDong_ma_hop_dong_seq"'::regclass);


--
-- TOC entry 5091 (class 2604 OID 26029)
-- Name: KeHoachGiangDay ma_ke_hoach_giang_day; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KeHoachGiangDay" ALTER COLUMN ma_ke_hoach_giang_day SET DEFAULT nextval('public."KeHoachGiangDay_ma_ke_hoach_giang_day_seq"'::regclass);


--
-- TOC entry 5101 (class 2604 OID 26146)
-- Name: KetQuaKiemTra ma_ket_qua_kiem_tra; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KetQuaKiemTra" ALTER COLUMN ma_ket_qua_kiem_tra SET DEFAULT nextval('public."KetQuaKiemTra_ma_ket_qua_kiem_tra_seq"'::regclass);


--
-- TOC entry 5078 (class 2604 OID 25954)
-- Name: KhoaHoc ma_khoa_hoc; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KhoaHoc" ALTER COLUMN ma_khoa_hoc SET DEFAULT nextval('public."KhoaHoc_ma_khoa_hoc_seq"'::regclass);


--
-- TOC entry 5079 (class 2604 OID 25967)
-- Name: LopHoc ma_lop_hoc; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LopHoc" ALTER COLUMN ma_lop_hoc SET DEFAULT nextval('public."LopHoc_ma_lop_hoc_seq"'::regclass);


--
-- TOC entry 5056 (class 2604 OID 25767)
-- Name: NhanSu ma_nhan_su; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NhanSu" ALTER COLUMN ma_nhan_su SET DEFAULT nextval('public."NhanSu_ma_nhan_su_seq"'::regclass);


--
-- TOC entry 5102 (class 2604 OID 26159)
-- Name: NhanXet ma_nhan_xet; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NhanXet" ALTER COLUMN ma_nhan_xet SET DEFAULT nextval('public."NhanXet_ma_nhan_xet_seq"'::regclass);


--
-- TOC entry 5105 (class 2604 OID 33903)
-- Name: PhanCongGiangDay ma_phan_cong_giang_day; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongGiangDay" ALTER COLUMN ma_phan_cong_giang_day SET DEFAULT nextval('public."PhanCongGiangDay_ma_phan_cong_giang_day_seq"'::regclass);


--
-- TOC entry 5098 (class 2604 OID 26111)
-- Name: PhanCongHoatDong ma_phan_cong_hoat_dong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongHoatDong" ALTER COLUMN ma_phan_cong_hoat_dong SET DEFAULT nextval('public."PhanCongHoatDong_ma_phan_cong_hoat_dong_seq"'::regclass);


--
-- TOC entry 5095 (class 2604 OID 26077)
-- Name: PhanCongMarketing ma_phan_cong_marketing; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongMarketing" ALTER COLUMN ma_phan_cong_marketing SET DEFAULT nextval('public."PhanCongMarketing_ma_phan_cong_marketing_seq"'::regclass);


--
-- TOC entry 5053 (class 2604 OID 25735)
-- Name: PhanQuyen ma_phan_quyen; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanQuyen" ALTER COLUMN ma_phan_quyen SET DEFAULT nextval('public."PhanQuyen_ma_phan_quyen_seq"'::regclass);


--
-- TOC entry 5106 (class 2604 OID 33926)
-- Name: PhieuChamCong ma_phieu_cham_cong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChamCong" ALTER COLUMN ma_phieu_cham_cong SET DEFAULT nextval('public."PhieuChamCong_ma_phieu_cham_cong_seq"'::regclass);


--
-- TOC entry 5074 (class 2604 OID 25916)
-- Name: PhieuChi ma_phieu_chi; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChi" ALTER COLUMN ma_phieu_chi SET DEFAULT nextval('public."PhieuChi_ma_phieu_chi_seq"'::regclass);


--
-- TOC entry 5066 (class 2604 OID 25866)
-- Name: PhieuLuong ma_phieu_luong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuLuong" ALTER COLUMN ma_phieu_luong SET DEFAULT nextval('public."PhieuLuong_ma_phieu_luong_seq"'::regclass);


--
-- TOC entry 5072 (class 2604 OID 25900)
-- Name: PhieuThu ma_phieu_thu; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThu" ALTER COLUMN ma_phieu_thu SET DEFAULT nextval('public."PhieuThu_ma_phieu_thu_seq"'::regclass);


--
-- TOC entry 5071 (class 2604 OID 25888)
-- Name: PhieuThuong ma_phieu_thuong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThuong" ALTER COLUMN ma_phieu_thuong SET DEFAULT nextval('public."PhieuThuong_ma_phieu_thuong_seq"'::regclass);


--
-- TOC entry 5054 (class 2604 OID 25745)
-- Name: PhongBan ma_phong_ban; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhongBan" ALTER COLUMN ma_phong_ban SET DEFAULT nextval('public."PhongBan_ma_phong_ban_seq"'::regclass);


--
-- TOC entry 5080 (class 2604 OID 25981)
-- Name: PhongHoc ma_phong_hoc; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhongHoc" ALTER COLUMN ma_phong_hoc SET DEFAULT nextval('public."PhongHoc_ma_phong_hoc_seq"'::regclass);


--
-- TOC entry 5051 (class 2604 OID 25711)
-- Name: Quyen ma_quyen; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quyen" ALTER COLUMN ma_quyen SET DEFAULT nextval('public."Quyen_ma_quyen_seq"'::regclass);


--
-- TOC entry 5052 (class 2604 OID 25722)
-- Name: TaiKhoan ma_tai_khoan; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TaiKhoan" ALTER COLUMN ma_tai_khoan SET DEFAULT nextval('public."TaiKhoan_ma_tai_khoan_seq"'::regclass);


--
-- TOC entry 5083 (class 2604 OID 26003)
-- Name: ThamGiaLop ma_tham_gia_lop; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaLop" ALTER COLUMN ma_tham_gia_lop SET DEFAULT nextval('public."ThamGiaLop_ma_tham_gia_lop_seq"'::regclass);


--
-- TOC entry 5097 (class 2604 OID 26101)
-- Name: ThamGiaNgoaiKhoa ma_tham_gia_ngoai_khoa; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaNgoaiKhoa" ALTER COLUMN ma_tham_gia_ngoai_khoa SET DEFAULT nextval('public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq"'::regclass);


--
-- TOC entry 5521 (class 0 OID 26130)
-- Dependencies: 288
-- Data for Name: BaiKiemTra; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5469 (class 0 OID 25801)
-- Dependencies: 236
-- Data for Name: BangCap; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5473 (class 0 OID 25824)
-- Dependencies: 240
-- Data for Name: BangChamCong; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."BangChamCong" (ma_bang_cham_cong, ky_cham_cong, trang_thai) VALUES (3, 'T04-2026', 'Đang mở');


--
-- TOC entry 5477 (class 0 OID 25851)
-- Dependencies: 244
-- Data for Name: BangLuong; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5531 (class 0 OID 34002)
-- Dependencies: 298
-- Data for Name: BangThuong; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."BangThuong" (ma_bang_thuong, ki_thuong, so_tien_thuong) VALUES (1, '4/2026', 6265100.00);


--
-- TOC entry 5505 (class 0 OID 26038)
-- Dependencies: 272
-- Data for Name: BuoiHoc; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."BuoiHoc" (ma_buoi_hoc, ngay_hoc, noi_dung_hoc, ma_giao_vien, ma_lop_hoc) VALUES (1, '2026-05-11 18:00:00', 'Unit 1: Introductions and Greetings. Thực hành phản xạ chào hỏi và giới thiệu bản thân cơ bản.', 1, 1);
INSERT INTO public."BuoiHoc" (ma_buoi_hoc, ngay_hoc, noi_dung_hoc, ma_giao_vien, ma_lop_hoc) VALUES (2, '2026-05-13 18:00:00', 'Unit 2: Daily Routines. Ôn tập ngữ pháp Hiện tại đơn và từ vựng về hoạt động hằng ngày.', 1, 1);
INSERT INTO public."BuoiHoc" (ma_buoi_hoc, ngay_hoc, noi_dung_hoc, ma_giao_vien, ma_lop_hoc) VALUES (3, '2026-05-15 18:00:00', 'Unit 3: Hobbies and Interests. Làm việc nhóm, thuyết trình ngắn về sở thích cá nhân.', 1, 1);
INSERT INTO public."BuoiHoc" (ma_buoi_hoc, ngay_hoc, noi_dung_hoc, ma_giao_vien, ma_lop_hoc) VALUES (4, '2026-05-12 19:30:00', 'IELTS Writing Task 1: Phân tích biểu đồ đường (Line graph) và biểu đồ cột (Bar chart).', 2, 2);
INSERT INTO public."BuoiHoc" (ma_buoi_hoc, ngay_hoc, noi_dung_hoc, ma_giao_vien, ma_lop_hoc) VALUES (5, '2026-05-14 19:30:00', 'IELTS Speaking Part 1 & 2: Thực hành trả lời các câu hỏi về chủ đề Travel và Hometown.', 2, 2);


--
-- TOC entry 5501 (class 0 OID 26014)
-- Dependencies: 268
-- Data for Name: CamKet; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, so_buoi_vang_cho_phep, tham_gia_thi_day_du, so_buoi_di_muon, so_lan_thieu_bai_tap, ma_hoc_vien, ma_khoa_hoc, bi_vi_pham, da_bo_thi, ly_do_vi_pham, so_buoi_di_muon_thuc_te, so_buoi_vang_thuc_te, so_lan_thieu_bai_tap_thuc_te) VALUES (1, '2026-01-10 00:00:00', '2026-07-10 00:00:00', 'Cam kết đầu ra đầu ra, hoàn trả 100% học phí nếu thi không đạt điều kiện.', 'Đang hiệu lực', 3, true, 3, 3, 1, 1, false, false, NULL, 0, 0, 0);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, so_buoi_vang_cho_phep, tham_gia_thi_day_du, so_buoi_di_muon, so_lan_thieu_bai_tap, ma_hoc_vien, ma_khoa_hoc, bi_vi_pham, da_bo_thi, ly_do_vi_pham, so_buoi_di_muon_thuc_te, so_buoi_vang_thuc_te, so_lan_thieu_bai_tap_thuc_te) VALUES (2, '2026-02-15 00:00:00', '2026-08-15 00:00:00', 'Cam kết đầu ra. Yêu cầu không nghỉ quá 3 buổi.', 'Đã vi phạm', 3, true, 3, 5, 2, 2, false, false, NULL, 0, 0, 0);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, so_buoi_vang_cho_phep, tham_gia_thi_day_du, so_buoi_di_muon, so_lan_thieu_bai_tap, ma_hoc_vien, ma_khoa_hoc, bi_vi_pham, da_bo_thi, ly_do_vi_pham, so_buoi_di_muon_thuc_te, so_buoi_vang_thuc_te, so_lan_thieu_bai_tap_thuc_te) VALUES (3, '2026-03-01 00:00:00', '2026-09-01 00:00:00', 'Cam kết lớp Giao tiếp. Bắt buộc nộp đủ bài tập về nhà.', 'Đã vi phạm', 4, true, 4, 3, 3, 1, false, false, NULL, 0, 0, 0);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, so_buoi_vang_cho_phep, tham_gia_thi_day_du, so_buoi_di_muon, so_lan_thieu_bai_tap, ma_hoc_vien, ma_khoa_hoc, bi_vi_pham, da_bo_thi, ly_do_vi_pham, so_buoi_di_muon_thuc_te, so_buoi_vang_thuc_te, so_lan_thieu_bai_tap_thuc_te) VALUES (4, '2026-01-20 00:00:00', '2026-05-20 00:00:00', 'Cam kết đầu ra. Bắt buộc tham gia kỳ thi kiểm tra cuối khóa.', 'Đã vi phạm', 3, true, 2, 2, 4, 1, false, false, NULL, 0, 0, 1);


--
-- TOC entry 5475 (class 0 OID 25837)
-- Dependencies: 242
-- Data for Name: ChiTietChamCong; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (526, 2, NULL, '2026-04-01', '17:30', NULL, NULL, NULL, NULL, NULL, '07:59', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (527, 2, NULL, '2026-04-02', '17:30', NULL, NULL, NULL, NULL, NULL, '07:58', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (528, 2, NULL, '2026-04-03', '17:30', NULL, NULL, NULL, NULL, NULL, '07:57', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (529, 2, NULL, '2026-04-04', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (530, 2, NULL, '2026-04-06', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (531, 2, NULL, '2026-04-07', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (532, 2, NULL, '2026-04-08', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (533, 2, NULL, '2026-04-09', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (534, 2, NULL, '2026-04-10', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (535, 2, NULL, '2026-04-11', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (536, 2, NULL, '2026-04-13', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (537, 2, NULL, '2026-04-14', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (538, 2, NULL, '2026-04-15', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (539, 2, NULL, '2026-04-16', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (540, 2, NULL, '2026-04-17', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (541, 2, NULL, '2026-04-18', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (542, 2, NULL, '2026-04-20', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (543, 2, NULL, '2026-04-21', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (544, 2, NULL, '2026-04-22', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (545, 2, NULL, '2026-04-23', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (546, 2, NULL, '2026-04-24', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (547, 2, NULL, '2026-04-25', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (548, 2, NULL, '2026-04-27', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (549, 2, NULL, '2026-04-28', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (550, 2, NULL, '2026-04-29', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (551, 2, NULL, '2026-04-30', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 33);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (552, 10, NULL, '2026-04-04', '12:05', '19:30', NULL, NULL, NULL, NULL, '08:00', '13:30', NULL, NULL, NULL, NULL, 40);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (553, 10, NULL, '2026-04-14', NULL, NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 40);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (554, NULL, 3, '2026-04-07', '11:20', '11:20', NULL, NULL, NULL, NULL, '09:20', '09:20', NULL, NULL, NULL, NULL, 31);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (555, NULL, 3, '2026-04-09', '11:20', '11:20', NULL, NULL, NULL, NULL, '09:10', '09:10', NULL, NULL, NULL, NULL, 31);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (556, NULL, 3, '2026-04-11', '11:00', '11:00', '20:00', NULL, '20:00', NULL, '07:00', '07:00', '18:00', NULL, '18:00', NULL, 31);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (557, NULL, 4, '2026-04-12', '09:00', '15:00', NULL, NULL, NULL, NULL, '07:00', '13:00', NULL, NULL, NULL, NULL, 34);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (558, 1, NULL, '2026-04-13', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 32);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (559, 5, NULL, '2026-04-14', '17:30', NULL, NULL, NULL, NULL, NULL, '08:00', NULL, NULL, NULL, NULL, NULL, 35);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (560, 6, NULL, '2026-04-14', '17:45', NULL, NULL, NULL, NULL, NULL, '09:00', NULL, NULL, NULL, NULL, NULL, 36);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (561, NULL, 7, '2026-04-14', '09:30', '15:30', '19:30', NULL, NULL, NULL, '07:30', '13:30', '17:30', NULL, NULL, NULL, 37);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (562, NULL, 8, '2026-04-14', '21:00', NULL, NULL, NULL, NULL, NULL, '17:00', NULL, NULL, NULL, NULL, NULL, 38);
INSERT INTO public."ChiTietChamCong" (ma_chi_tiet_cham_cong, ma_nhan_su, ma_giao_vien, ngay, gio_ra_1, gio_ra_2, gio_ra_3, gio_ra_4, gio_ra_5, gio_ra_6, gio_vao_1, gio_vao_2, gio_vao_3, gio_vao_4, gio_vao_5, gio_vao_6, ma_phieu_cham_cong) VALUES (563, NULL, 9, '2026-04-14', '11:00', '20:00', NULL, NULL, NULL, NULL, '09:00', '18:00', NULL, NULL, NULL, NULL, 39);


--
-- TOC entry 5461 (class 0 OID 25753)
-- Dependencies: 228
-- Data for Name: ChucVu; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, mo_ta) VALUES (1, 'Quản trị viên', 'Quản lý toàn bộ hệ thống');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, mo_ta) VALUES (6, 'Giám đốc', 'Xem toàn bộ báo cáo thống kê và đưa ra chiến lược');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, mo_ta) VALUES (7, 'Giáo viên', 'Giảng dạy học sinh');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, mo_ta) VALUES (8, 'Trợ giảng', 'Hỗ trợ học viên và giáo viên trước và sau buổi học');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, mo_ta) VALUES (4, 'Quản lý', 'Quản lý 1 đội nhóm');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, mo_ta) VALUES (5, 'Trưởng phòng', 'Trưởng phòng của một phòng ban');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, mo_ta) VALUES (2, 'Nhân sự thử việc', 'Thử việc trong thời gian đầu tùy từng vị trí công việc');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, mo_ta) VALUES (3, 'Nhân sự chính thức', 'Tìm kiếm học viên mới, tư vấn khóa học và ký kết hợp đồng.');


--
-- TOC entry 5489 (class 0 OID 25940)
-- Dependencies: 256
-- Data for Name: ChuongTrinhHoc; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."ChuongTrinhHoc" (ma_chuong_trinh, ten_chuong_trinh, mo_ta, muc_tieu) VALUES (1, 'Tiếng Anh Chứng chỉ Quốc gia', 'Chương trình tập trung luyện thi các chứng chỉ tiếng Anh như VSTEP, TOEIC phục vụ cho sinh viên và người đi làm.', 'Học viên đạt chuẩn đầu ra B1, B2, C1 hoặc TOEIC theo đúng lộ trình.');
INSERT INTO public."ChuongTrinhHoc" (ma_chuong_trinh, ten_chuong_trinh, mo_ta, muc_tieu) VALUES (2, 'Tiếng Anh Quốc tế & Giao tiếp', 'Chương trình luyện thi IELTS và tiếng Anh giao tiếp thực chiến áp dụng vào môi trường công sở.', 'Đạt điểm IELTS mục tiêu và tự tin giao tiếp, phản xạ trôi chảy.');
INSERT INTO public."ChuongTrinhHoc" (ma_chuong_trinh, ten_chuong_trinh, mo_ta, muc_tieu) VALUES (3, 'Tiếng Anh Nền tảng (Mất gốc)', 'Chương trình hệ thống lại toàn bộ ngữ pháp, từ vựng và cách phát âm cơ bản cho người mới bắt đầu.', 'Xây dựng lại gốc rễ tiếng Anh vững chắc, làm bàn đạp học lên các khóa chuyên sâu.');


--
-- TOC entry 5519 (class 0 OID 26118)
-- Dependencies: 286
-- Data for Name: ChuongTrinhKhuyenMai; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."ChuongTrinhKhuyenMai" (ma_khuyen_mai, ten_chuong_trinh, mo_ta, phan_tram_giam, ngay_bat_dau, ngay_ket_thuc) VALUES (1, 'Chào hè sôi động', 'Giảm giá đặc biệt cho học viên đăng ký các khóa học tăng cường trong dịp hè.', 20, '2026-05-15 00:00:00', '2026-07-15 23:59:59');
INSERT INTO public."ChuongTrinhKhuyenMai" (ma_khuyen_mai, ten_chuong_trinh, mo_ta, phan_tram_giam, ngay_bat_dau, ngay_ket_thuc) VALUES (2, 'Đăng ký theo nhóm', 'Ưu đãi dành cho nhóm từ 3 học viên trở lên cùng đăng ký một khóa học.', 15.5, '2026-01-01 00:00:00', '2026-12-31 23:59:59');
INSERT INTO public."ChuongTrinhKhuyenMai" (ma_khuyen_mai, ten_chuong_trinh, mo_ta, phan_tram_giam, ngay_bat_dau, ngay_ket_thuc) VALUES (3, 'Tri ân học viên cũ', 'Giảm học phí cho các học viên đã từng học tại trung tâm và đăng ký học tiếp.', 10, '2026-01-01 00:00:00', '2026-12-31 23:59:59');
INSERT INTO public."ChuongTrinhKhuyenMai" (ma_khuyen_mai, ten_chuong_trinh, mo_ta, phan_tram_giam, ngay_bat_dau, ngay_ket_thuc) VALUES (4, 'Mừng ngày Nhà giáo VN 20/11', 'Chương trình khuyến mãi lớn nhất năm nhân dịp tri ân các thầy cô giáo.', 30, '2026-11-01 00:00:00', '2026-11-30 23:59:59');
INSERT INTO public."ChuongTrinhKhuyenMai" (ma_khuyen_mai, ten_chuong_trinh, mo_ta, phan_tram_giam, ngay_bat_dau, ngay_ket_thuc) VALUES (5, 'Flash Sale cuối tuần', 'Khuyến mãi chớp nhoáng chỉ áp dụng khi học viên hoàn thành học phí vào Thứ 7 và Chủ Nhật tuần này.', 25, '2026-05-16 00:00:00', '2026-05-17 23:59:59');


--
-- TOC entry 5509 (class 0 OID 26063)
-- Dependencies: 276
-- Data for Name: ChuongTrinhMarketing; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."ChuongTrinhMarketing" (ma_chuong_trinh_marketing, ten_chuong_trinh_marketing, noi_dung, ngay_bat_dau, ngay_ket_thuc, ngan_sach, ma_khoa_hoc) VALUES (1, 'Chào hè rực rỡ - Khai mở tiếng Anh 2026', 'Chạy quảng cáo Facebook và phát tờ rơi tại các trường Đại học để tuyển sinh các lớp giao tiếp và TOEIC dịp hè.', '2026-05-20 00:00:00', '2026-06-30 00:00:00', 15000000.00, 1);
INSERT INTO public."ChuongTrinhMarketing" (ma_chuong_trinh_marketing, ten_chuong_trinh_marketing, noi_dung, ngay_bat_dau, ngay_ket_thuc, ngan_sach, ma_khoa_hoc) VALUES (2, 'Workshop: Bí kíp chinh phục IELTS 6.5+ trong 3 tháng', 'Tổ chức sự kiện chia sẻ kinh nghiệm học thuật, mời diễn giả là giáo viên 8.0 IELTS. Tặng voucher cho học viên đăng ký tại sự kiện.', '2026-06-10 00:00:00', '2026-06-15 00:00:00', 8500000.00, 2);
INSERT INTO public."ChuongTrinhMarketing" (ma_chuong_trinh_marketing, ten_chuong_trinh_marketing, noi_dung, ngay_bat_dau, ngay_ket_thuc, ngan_sach, ma_khoa_hoc) VALUES (3, 'Back to School - Tựu trường rộn ràng', 'Chạy chiến dịch giảm giá 15% học phí cho sinh viên năm nhất khi mang thẻ sinh viên đến đăng ký bất kỳ khóa học nào.', '2026-08-15 00:00:00', '2026-09-30 00:00:00', 25000000.00, NULL);
INSERT INTO public."ChuongTrinhMarketing" (ma_chuong_trinh_marketing, ten_chuong_trinh_marketing, noi_dung, ngay_bat_dau, ngay_ket_thuc, ngan_sach, ma_khoa_hoc) VALUES (4, 'Học nhóm siêu vui - Khui ngay quà khủng', 'Học viên rủ thêm bạn đăng ký học cùng sẽ được hoàn tiền mặt 500k/người và tặng giáo trình miễn phí.', '2026-07-01 00:00:00', '2026-08-31 00:00:00', 10000000.00, 1);


--
-- TOC entry 5487 (class 0 OID 25926)
-- Dependencies: 254
-- Data for Name: CongNo; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5507 (class 0 OID 26051)
-- Dependencies: 274
-- Data for Name: DiemDanh; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (1, 1, 1, 'Có mặt', NULL);
INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (2, 1, 2, 'Có mặt', NULL);
INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (3, 1, 3, 'Có mặt', NULL);
INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (4, 2, 1, 'Có mặt', NULL);
INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (5, 2, 2, 'Vắng', 'Xin phép nghỉ ốm, đã gọi điện cho giáo viên');
INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (6, 2, 3, 'Có mặt', NULL);
INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (7, 3, 1, 'Có mặt', NULL);
INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (8, 3, 2, 'Có mặt', 'Đi trễ 15 phút do hỏng xe');
INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (9, 3, 3, 'Có mặt', NULL);
INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (10, 4, 4, 'Có mặt', NULL);
INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (11, 4, 5, 'Vắng', 'Không phép, trung tâm đã gọi phụ huynh nhưng không nghe máy');
INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (12, 5, 4, 'Có mặt', NULL);
INSERT INTO public."DiemDanh" (ma_diem_danh, ma_buoi_hoc, ma_hoc_vien, trang_thai, ghi_chu) VALUES (13, 5, 5, 'Có mặt', 'Có mặt muộn 5 phút');


--
-- TOC entry 5465 (class 0 OID 25777)
-- Dependencies: 232
-- Data for Name: GiaoVien; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."GiaoVien" (ma_giao_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (1, 'Nguyễn Hoàng Anh', '1990-05-15 00:00:00', 'Nam', '0912345678', 'hoanganh.nguyen@gmail.com', 'Lê Chân, Hải Phòng', 7, 5);
INSERT INTO public."GiaoVien" (ma_giao_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (5, 'Lê Văn Đạt', '1993-09-05 00:00:00', 'Nam', '0901234567', 'vandat.le@gmail.com', 'Thủy Nguyên, Hải Phòng', 7, 5);
INSERT INTO public."GiaoVien" (ma_giao_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (2, 'Trần Thu Hà', '1992-08-22 00:00:00', 'Nữ', '0987654321', 'thuha.tran@gmail.com', 'Ngô Quyền, Hải Phòng', 8, 5);
INSERT INTO public."GiaoVien" (ma_giao_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (3, 'David Smith', '1988-11-10 00:00:00', 'Nam', '0933222111', 'david.smith@gmail.com', 'Hải An, Hải Phòng', 7, 5);
INSERT INTO public."GiaoVien" (ma_giao_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (4, 'Phạm Mai Phương', '1996-02-28 00:00:00', 'Nữ', '0977888999', 'maiphuong.pham@gmail.com', 'Kiến An, Hải Phòng', 8, 5);
INSERT INTO public."GiaoVien" (ma_giao_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (6, 'Nguyễn Thị Mai', '1992-05-15 00:00:00', 'Nữ', '0911222333', 'mai.nguyen@hpenglish.vn', 'Lê Chân, Hải Phòng', 7, 5);
INSERT INTO public."GiaoVien" (ma_giao_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (7, 'John Smith', '1988-10-20 00:00:00', 'Nam', '0922333444', 'john.smith@hpenglish.vn', 'Ngô Quyền, Hải Phòng', 7, 5);
INSERT INTO public."GiaoVien" (ma_giao_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (8, 'Hoàng Anh Tú', '2004-02-18 00:00:00', 'Nam', '0933444555', 'tu.hoang@hpenglish.vn', 'Ký túc xá ĐH Hàng Hải, Hải Phòng', 8, 5);
INSERT INTO public."GiaoVien" (ma_giao_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (9, 'Vũ Yến Nhi', '2005-07-22 00:00:00', 'Nữ', '0944555666', 'nhi.vu@hpenglish.vn', 'Hải An, Hải Phòng', 8, 5);


--
-- TOC entry 5467 (class 0 OID 25790)
-- Dependencies: 234
-- Data for Name: HoSoBangCap; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5513 (class 0 OID 26086)
-- Dependencies: 280
-- Data for Name: HoatDongNgoaiKhoa; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."HoatDongNgoaiKhoa" (ma_hoat_dong_ngoai_khoa, ten_hoat_dong, mo_ta, ngay_to_chuc, dia_diem, chi_phi) VALUES (1, 'English Speaking Club: Summer Vibes', 'Giao lưu chém gió tiếng Anh chủ đề mùa hè cùng giáo viên bản ngữ. Tặng kèm đồ uống.', '2026-06-20 14:00:00', 'Khu sinh hoạt chung Tầng 1', 0.00);
INSERT INTO public."HoatDongNgoaiKhoa" (ma_hoat_dong_ngoai_khoa, ten_hoat_dong, mo_ta, ngay_to_chuc, dia_diem, chi_phi) VALUES (2, 'Chuyến dã ngoại: English Summer Camp 2026', 'Vừa học tiếng Anh vừa chơi team-building ngoài trời. Chi phí đã bao gồm xe đưa đón và ăn trưa.', '2026-07-15 07:00:00', 'Khu du lịch sinh thái Cát Bà', 550000.00);
INSERT INTO public."HoatDongNgoaiKhoa" (ma_hoat_dong_ngoai_khoa, ten_hoat_dong, mo_ta, ngay_to_chuc, dia_diem, chi_phi) VALUES (3, 'Movie Night: Xem phim song ngữ', 'Xem phim chiếu rạp với phụ đề tiếng Anh, thảo luận từ vựng sau buổi chiếu. Đã kèm bắp nước.', '2026-08-05 18:30:00', 'Phòng Lab Tầng 3', 50000.00);


--
-- TOC entry 5497 (class 0 OID 25989)
-- Dependencies: 264
-- Data for Name: HocVien; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, dau_ra_chung_chi, trang_thai) VALUES (1, 'Trần Văn An', '2004-05-12 00:00:00', 'Nam', '0987111222', 'an.tran@gmail.com', 'Lê Chân, Hải Phòng', 'VSTEP B2', 'Đang học');
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, dau_ra_chung_chi, trang_thai) VALUES (2, 'Nguyễn Thị Bích', '2005-08-20 00:00:00', 'Nữ', '0987222333', 'bich.nguyen@gmail.com', 'Ngô Quyền, Hải Phòng', 'TOEIC 650', 'Đang học');
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, dau_ra_chung_chi, trang_thai) VALUES (3, 'Lê Hoàng Minh', '2003-11-05 00:00:00', 'Nam', '0987333444', 'minh.le@gmail.com', 'Kiến An, Hải Phòng', 'IELTS 6.5', 'Nghỉ học');
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, dau_ra_chung_chi, trang_thai) VALUES (4, 'Phạm Thu Trà', '2006-02-14 00:00:00', 'Nữ', '0987444555', 'tra.pham@gmail.com', 'Hải An, Hải Phòng', 'VSTEP C1', 'Bảo lưu');
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, dau_ra_chung_chi, trang_thai) VALUES (5, 'Đinh Tuấn Kiệt', '2004-09-30 00:00:00', 'Nam', '0987555666', 'kiet.dinh@gmail.com', 'Thủy Nguyên, Hải Phòng', 'TOEIC 800', 'Đang học');


--
-- TOC entry 5471 (class 0 OID 25812)
-- Dependencies: 238
-- Data for Name: HopDongLaoDong; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."HopDongLaoDong" (ma_hop_dong, ma_nhan_su, ma_giao_vien, so_hop_dong, ngay_ky, ten_cong_viec, tg_thu_viec, update_at, chi_tiet_phu_cap, dong_bao_hiem, luong_co_ban, phan_tram_hoa_hong, tg_het_hop_dong) VALUES (1, 1, NULL, 'HD-NS-2026-001', '2026-01-01 00:00:00', 'Nhân viên Tư vấn Tuyển sinh', '2 tháng', '2026-05-14 17:58:53.65', '[{"ten": "Đi lại", "soTien": 500000}, {"ten": "Chuyên cần", "soTien": 300000}, {"ten": "Ăn trưa", "soTien": 730000}]', true, 7000000.00, 5, '2027-01-01 00:00:00');
INSERT INTO public."HopDongLaoDong" (ma_hop_dong, ma_nhan_su, ma_giao_vien, so_hop_dong, ngay_ky, ten_cong_viec, tg_thu_viec, update_at, chi_tiet_phu_cap, dong_bao_hiem, luong_co_ban, phan_tram_hoa_hong, tg_het_hop_dong) VALUES (2, NULL, 1, 'HD-GV-2026-001', '2025-06-01 00:00:00', 'Giáo viên Tiếng Anh', 'Không', '2026-05-14 17:58:53.65', '[{"ten": "Ăn trưa", "soTien": 730000}, {"ten": "Trách nhiệm", "soTien": 1500000}]', true, 15000000.00, 10, '2027-06-01 00:00:00');
INSERT INTO public."HopDongLaoDong" (ma_hop_dong, ma_nhan_su, ma_giao_vien, so_hop_dong, ngay_ky, ten_cong_viec, tg_thu_viec, update_at, chi_tiet_phu_cap, dong_bao_hiem, luong_co_ban, phan_tram_hoa_hong, tg_het_hop_dong) VALUES (4, 3, NULL, 'HD-NS-2026-003', '2026-02-01 00:00:00', 'Kế toán viên', 'Không', '2026-05-16 21:21:37.799', '[{"ten": "Chuyên cần", "soTien": 400000}, {"ten": "Ăn trưa", "soTien": 600000}]', true, 8000000.00, 0, '2028-02-01 00:00:00');
INSERT INTO public."HopDongLaoDong" (ma_hop_dong, ma_nhan_su, ma_giao_vien, so_hop_dong, ngay_ky, ten_cong_viec, tg_thu_viec, update_at, chi_tiet_phu_cap, dong_bao_hiem, luong_co_ban, phan_tram_hoa_hong, tg_het_hop_dong) VALUES (5, 4, NULL, 'HD-NS-2026-004', '2026-01-01 00:00:00', 'Quản lý cơ sở', 'Không', '2026-05-16 21:21:37.799', '[{"ten": "Chuyên cần", "soTien": 500000}, {"ten": "Trách nhiệm", "soTien": 1000000}]', true, 12000000.00, 2.5, '2029-01-01 00:00:00');
INSERT INTO public."HopDongLaoDong" (ma_hop_dong, ma_nhan_su, ma_giao_vien, so_hop_dong, ngay_ky, ten_cong_viec, tg_thu_viec, update_at, chi_tiet_phu_cap, dong_bao_hiem, luong_co_ban, phan_tram_hoa_hong, tg_het_hop_dong) VALUES (6, 5, NULL, 'HD-NS-2026-005', '2026-03-01 00:00:00', 'Nhân viên Tư vấn Tuyển sinh', '2 tháng', '2026-05-16 21:21:37.799', '[{"ten": "Chuyên cần", "soTien": 300000}, {"ten": "Đi lại", "soTien": 400000}]', false, 5500000.00, 5, '2027-03-01 00:00:00');
INSERT INTO public."HopDongLaoDong" (ma_hop_dong, ma_nhan_su, ma_giao_vien, so_hop_dong, ngay_ky, ten_cong_viec, tg_thu_viec, update_at, chi_tiet_phu_cap, dong_bao_hiem, luong_co_ban, phan_tram_hoa_hong, tg_het_hop_dong) VALUES (7, 6, NULL, 'HD-NS-2026-006', '2026-03-15 00:00:00', 'Nhân viên Hành chính', '1 tháng', '2026-05-16 21:21:37.799', '[{"ten": "Chuyên cần", "soTien": 300000}, {"ten": "Đi lại", "soTien": 300000}]', true, 6000000.00, 0, '2027-03-15 00:00:00');
INSERT INTO public."HopDongLaoDong" (ma_hop_dong, ma_nhan_su, ma_giao_vien, so_hop_dong, ngay_ky, ten_cong_viec, tg_thu_viec, update_at, chi_tiet_phu_cap, dong_bao_hiem, luong_co_ban, phan_tram_hoa_hong, tg_het_hop_dong) VALUES (9, 8, NULL, 'HD-NS-2026-008', '2026-04-15 00:00:00', 'Chuyên viên Content SEO', '2 tháng', '2026-05-16 21:21:37.799', '[{"ten": "Chuyên cần", "soTien": 300000}, {"ten": "Ăn trưa", "soTien": 500000}]', false, 7000000.00, 1, '2027-04-15 00:00:00');
INSERT INTO public."HopDongLaoDong" (ma_hop_dong, ma_nhan_su, ma_giao_vien, so_hop_dong, ngay_ky, ten_cong_viec, tg_thu_viec, update_at, chi_tiet_phu_cap, dong_bao_hiem, luong_co_ban, phan_tram_hoa_hong, tg_het_hop_dong) VALUES (11, 10, NULL, 'HD-NS-2026-010', '2026-05-10 00:00:00', 'Nhân viên Chăm sóc khách hàng', '2 tháng', '2026-05-16 21:21:37.799', '[{"ten": "Chuyên cần", "soTien": 300000}, {"ten": "Trang phục", "soTien": 200000}]', false, 5800000.00, 3, '2027-05-10 00:00:00');
INSERT INTO public."HopDongLaoDong" (ma_hop_dong, ma_nhan_su, ma_giao_vien, so_hop_dong, ngay_ky, ten_cong_viec, tg_thu_viec, update_at, chi_tiet_phu_cap, dong_bao_hiem, luong_co_ban, phan_tram_hoa_hong, tg_het_hop_dong) VALUES (12, 11, NULL, 'HD-NS-2026-011', '2026-05-15 00:00:00', 'Nhân viên Tuyển dụng', '2 tháng', '2026-05-16 21:24:37.827', '[{"ten": "Chuyên cần", "soTien": 300000}, {"ten": "Điện thoại", "soTien": 200000}]', true, 6200000.00, 2, '2027-05-15 00:00:00');
INSERT INTO public."HopDongLaoDong" (ma_hop_dong, ma_nhan_su, ma_giao_vien, so_hop_dong, ngay_ky, ten_cong_viec, tg_thu_viec, update_at, chi_tiet_phu_cap, dong_bao_hiem, luong_co_ban, phan_tram_hoa_hong, tg_het_hop_dong) VALUES (8, 7, NULL, 'HD-NS-2026-007', '2026-04-01 00:00:00', 'Nhân viên IT Support', 'Không', '2026-05-16 21:21:37.799', '[{"ten": "Chuyên cần", "soTien": 300000}, {"ten": "Điện thoại", "soTien": 200000}]', true, 7500000.00, 10, '2027-04-01 00:00:00');
INSERT INTO public."HopDongLaoDong" (ma_hop_dong, ma_nhan_su, ma_giao_vien, so_hop_dong, ngay_ky, ten_cong_viec, tg_thu_viec, update_at, chi_tiet_phu_cap, dong_bao_hiem, luong_co_ban, phan_tram_hoa_hong, tg_het_hop_dong) VALUES (10, 9, NULL, 'HD-NS-2026-009', '2026-05-01 00:00:00', 'Nhân viên Thiết kế đồ họa', 'Không', '2026-05-16 21:21:37.799', '[{"ten": "Chuyên cần", "soTien": 400000}, {"ten": "Đi lại", "soTien": 300000}]', true, 8500000.00, 8, '2028-05-01 00:00:00');
INSERT INTO public."HopDongLaoDong" (ma_hop_dong, ma_nhan_su, ma_giao_vien, so_hop_dong, ngay_ky, ten_cong_viec, tg_thu_viec, update_at, chi_tiet_phu_cap, dong_bao_hiem, luong_co_ban, phan_tram_hoa_hong, tg_het_hop_dong) VALUES (3, 2, NULL, 'HD-NS-2026-002', '2026-01-15 00:00:00', 'Chuyên viên Marketing', '2 tháng', '2026-05-16 21:21:37.799', '[{"ten": "Chuyên cần", "soTien": 250000}, {"ten": "Đi lại", "soTien": 300000}]', false, 6500000.00, 10, '2027-01-15 00:00:00');


--
-- TOC entry 5503 (class 0 OID 26026)
-- Dependencies: 270
-- Data for Name: KeHoachGiangDay; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5523 (class 0 OID 26143)
-- Dependencies: 290
-- Data for Name: KetQuaKiemTra; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5491 (class 0 OID 25951)
-- Dependencies: 258
-- Data for Name: KhoaHoc; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."KhoaHoc" (ma_khoa_hoc, ten_khoa_hoc, mo_ta, thoi_luong, hoc_phi, trinh_do, trang_thai, ma_chuong_trinh) VALUES (1, 'Luyện thi VSTEP B1-B2', 'Khóa học thiết kế riêng để đạt chuẩn B2 VSTEP, tập trung rèn luyện 4 kỹ năng Nghe, Nói, Đọc, Viết.', '3 tháng', 4500000.00, 'Trung cấp', 'Đang hoạt động', 1);
INSERT INTO public."KhoaHoc" (ma_khoa_hoc, ten_khoa_hoc, mo_ta, thoi_luong, hoc_phi, trinh_do, trang_thai, ma_chuong_trinh) VALUES (2, 'Luyện thi TOEIC 450 - 650+', 'Luyện đề và củng cố ngữ pháp, từ vựng nền tảng để đạt mục tiêu TOEIC trong thời gian ngắn.', '2.5 tháng', 3500000.00, 'Cơ bản', 'Đang hoạt động', 1);
INSERT INTO public."KhoaHoc" (ma_khoa_hoc, ten_khoa_hoc, mo_ta, thoi_luong, hoc_phi, trinh_do, trang_thai, ma_chuong_trinh) VALUES (3, 'Tiếng Anh Giao tiếp Công sở', 'Nâng cao khả năng phản xạ và giao tiếp chuyên nghiệp phục vụ công việc.', '2 tháng', 3000000.00, 'Mọi trình độ', 'Sắp khai giảng', 2);
INSERT INTO public."KhoaHoc" (ma_khoa_hoc, ten_khoa_hoc, mo_ta, thoi_luong, hoc_phi, trinh_do, trang_thai, ma_chuong_trinh) VALUES (4, 'Luyện thi IELTS 6.5+', 'Chương trình luyện thi chuyên sâu với giáo viên bản ngữ, cam kết đầu ra.', '6 tháng', 12500000.00, 'Nâng cao', 'Đang hoạt động', 2);
INSERT INTO public."KhoaHoc" (ma_khoa_hoc, ten_khoa_hoc, mo_ta, thoi_luong, hoc_phi, trinh_do, trang_thai, ma_chuong_trinh) VALUES (5, 'Ngữ pháp tiếng Anh toàn diện', 'Hệ thống lại toàn bộ cấu trúc ngữ pháp từ cơ bản đến nâng cao.', '1.5 tháng', 2000000.00, 'Cơ bản', 'Tạm dừng', 3);


--
-- TOC entry 5493 (class 0 OID 25964)
-- Dependencies: 260
-- Data for Name: LopHoc; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."LopHoc" (ma_lop_hoc, ten_lop, si_so_toi_da, ngay_khai_giang, ngay_ket_thuc, ma_phong_hoc, ma_khoa_hoc, lich_hoc) VALUES (1, 'Giao tiếp cơ bản K01', 15, '2026-06-01 00:00:00', '2026-08-01 00:00:00', 1, 1, '[{"ca": 3, "thu": 2}, {"ca": 3, "thu": 4}, {"ca": 3, "thu": 6}]');
INSERT INTO public."LopHoc" (ma_lop_hoc, ten_lop, si_so_toi_da, ngay_khai_giang, ngay_ket_thuc, ma_phong_hoc, ma_khoa_hoc, lich_hoc) VALUES (2, 'TOEIC 650 K05', 20, '2026-06-15 00:00:00', '2026-09-15 00:00:00', 2, 1, '[{"ca": 2, "thu": 3}, {"ca": 2, "thu": 5}, {"ca": 2, "thu": 7}]');
INSERT INTO public."LopHoc" (ma_lop_hoc, ten_lop, si_so_toi_da, ngay_khai_giang, ngay_ket_thuc, ma_phong_hoc, ma_khoa_hoc, lich_hoc) VALUES (3, 'IELTS Cấp tốc', 10, '2026-07-01 00:00:00', '2026-08-31 00:00:00', 1, 2, '[{"ca": 1, "thu": 7}, {"ca": 1, "thu": 8}]');
INSERT INTO public."LopHoc" (ma_lop_hoc, ten_lop, si_so_toi_da, ngay_khai_giang, ngay_ket_thuc, ma_phong_hoc, ma_khoa_hoc, lich_hoc) VALUES (5, 'Giao tiếp Business nâng cao', 10, '2026-06-16 00:00:00', '2026-09-16 00:00:00', 1, 2, '[{"ca": 3, "thu": 3}, {"ca": 3, "thu": 5}]');
INSERT INTO public."LopHoc" (ma_lop_hoc, ten_lop, si_so_toi_da, ngay_khai_giang, ngay_ket_thuc, ma_phong_hoc, ma_khoa_hoc, lich_hoc) VALUES (6, 'Lấy gốc Tiếng Anh Cấp tốc', 15, '2026-07-01 00:00:00', '2026-08-01 00:00:00', 2, 1, '[{"ca": 2, "thu": 2}, {"ca": 2, "thu": 3}, {"ca": 2, "thu": 4}, {"ca": 2, "thu": 5}, {"ca": 2, "thu": 6}]');
INSERT INTO public."LopHoc" (ma_lop_hoc, ten_lop, si_so_toi_da, ngay_khai_giang, ngay_ket_thuc, ma_phong_hoc, ma_khoa_hoc, lich_hoc) VALUES (4, 'Phát âm chuẩn American K02', 12, '2026-06-06 00:00:00', '2026-07-26 00:00:00', 2, 1, '[{"ca": 5, "thu": 7}, {"ca": 1, "thu": 8}]');


--
-- TOC entry 5463 (class 0 OID 25764)
-- Dependencies: 230
-- Data for Name: NhanSu; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban, email) VALUES (8, 'Lê Văn Đạt', '1999-08-20 00:00:00', 'Nam', '0912345678', 'Lê Chân, Hải Phòng', 3, 2, 'dat.le@hpenglish.vn');
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban, email) VALUES (9, 'Phạm Thu Thủy', '1995-11-05 00:00:00', 'Nữ', '0909112233', 'Hồng Bàng, Hải Phòng', 4, 3, 'thuy.pham@hpenglish.vn');
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban, email) VALUES (7, 'Trần Thị Lan', '1998-05-12 00:00:00', 'Nữ', '0987654321', 'Ngô Quyền, Hải Phòng', 2, 4, 'lan.tran@hpenglish.vn');
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban, email) VALUES (10, 'Đoàn Hải Phong', '1992-02-14 00:00:00', 'Nam', '0933445566', 'Hải An, Hải Phòng', 5, 2, 'phong.doan@hpenglish.vn');
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban, email) VALUES (11, 'Đinh Trọng Toàn', '2001-10-10 00:00:00', 'Nam', '0977889900', 'Thủy Nguyên, Hải Phòng', 2, 4, 'toan.dinh@hpenglish.vn');
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban, email) VALUES (1, 'Nguyễn Văn Quản', '1985-10-15 00:00:00', 'Nam', '0901111222', 'Ngô Quyền, Hải Phòng', 6, 1, 'quan@gmail.com');
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban, email) VALUES (2, 'Trần Thị Tuyết', '1995-05-20 00:00:00', 'Nữ', '0912222333', 'Lê Chân, Hải Phòng', 3, 2, 'tuyet@gmail.com');
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban, email) VALUES (3, 'Lê Hoàng Truyền', '1998-12-05 00:00:00', 'Nam', '0923333444', 'Hồng Bàng, Hải Phòng', 4, 3, 'truyen@gmail.com');
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban, email) VALUES (4, 'Phạm Thu Kế', '1990-08-25 00:00:00', 'Nữ', '0934444555', 'Kiến An, Hải Phòng', 5, 4, 'ke@gmail.com');
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban, email) VALUES (5, 'Vũ Văn Đào', '1996-03-10 00:00:00', 'Nam', '0945555666', 'Hải An, Hải Phòng', 2, 5, 'dao@gmail.com');
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban, email) VALUES (6, 'Nguyễn Quản Trị', '2000-01-01 00:00:00', 'Nam', '0999888777', 'Hệ thống Trung tâm', 1, 1, 'tri@gmail.com');


--
-- TOC entry 5525 (class 0 OID 26156)
-- Dependencies: 292
-- Data for Name: NhanXet; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."NhanXet" (ma_nhan_xet, ma_hoc_vien, ma_buoi_hoc, da_lam_bai_tap, noi_dung_nhan_xet, ngay_nhan_xet) VALUES (7, 1, 1, true, 'Học viên rất hăng hái phát biểu xây dựng bài. Phát âm tốt, tuy nhiên cần chú ý bật âm đuôi (ending sounds) rõ hơn.', '2026-05-10 20:30:00');
INSERT INTO public."NhanXet" (ma_nhan_xet, ma_hoc_vien, ma_buoi_hoc, da_lam_bai_tap, noi_dung_nhan_xet, ngay_nhan_xet) VALUES (8, 3, 1, true, 'Tiếp thu bài nhanh, làm bài tập về nhà đầy đủ và độ chính xác cao. Khuyến khích tham gia nhóm thảo luận nhiều hơn.', '2026-05-10 20:35:00');
INSERT INTO public."NhanXet" (ma_nhan_xet, ma_hoc_vien, ma_buoi_hoc, da_lam_bai_tap, noi_dung_nhan_xet, ngay_nhan_xet) VALUES (9, 2, 1, false, 'Chưa làm bài tập về nhà. Từ vựng trên lớp còn yếu, ít tương tác với các bạn trong giờ học speaking. Trợ giảng cần kèm cặp thêm.', '2026-05-10 20:40:00');
INSERT INTO public."NhanXet" (ma_nhan_xet, ma_hoc_vien, ma_buoi_hoc, da_lam_bai_tap, noi_dung_nhan_xet, ngay_nhan_xet) VALUES (10, 4, 2, false, 'Không nộp bài tập viết (Writing task 1). Trên lớp có dấu hiệu mất tập trung. Đã nhắc nhở trực tiếp.', '2026-05-12 21:00:00');
INSERT INTO public."NhanXet" (ma_nhan_xet, ma_hoc_vien, ma_buoi_hoc, da_lam_bai_tap, noi_dung_nhan_xet, ngay_nhan_xet) VALUES (11, 1, 2, true, 'Có sự tiến bộ rõ rệt về kỹ năng nghe (Listening) so với buổi trước. Cấu trúc câu điều kiện loại 2 đã nắm rất chắc.', '2026-05-12 21:05:00');
INSERT INTO public."NhanXet" (ma_nhan_xet, ma_hoc_vien, ma_buoi_hoc, da_lam_bai_tap, noi_dung_nhan_xet, ngay_nhan_xet) VALUES (12, 2, 2, true, 'Hôm nay đã nộp bài tập đầy đủ. Có cố gắng hơn trong phần thảo luận nhóm, cần duy trì phong độ này.', '2026-05-12 21:10:00');


--
-- TOC entry 5527 (class 0 OID 33900)
-- Dependencies: 294
-- Data for Name: PhanCongGiangDay; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PhanCongGiangDay" (ma_phan_cong_giang_day, ma_lop_hoc, ma_giao_vien) VALUES (1, 1, 1);
INSERT INTO public."PhanCongGiangDay" (ma_phan_cong_giang_day, ma_lop_hoc, ma_giao_vien) VALUES (2, 1, 2);
INSERT INTO public."PhanCongGiangDay" (ma_phan_cong_giang_day, ma_lop_hoc, ma_giao_vien) VALUES (3, 2, 3);
INSERT INTO public."PhanCongGiangDay" (ma_phan_cong_giang_day, ma_lop_hoc, ma_giao_vien) VALUES (4, 2, 4);
INSERT INTO public."PhanCongGiangDay" (ma_phan_cong_giang_day, ma_lop_hoc, ma_giao_vien) VALUES (5, 3, 3);
INSERT INTO public."PhanCongGiangDay" (ma_phan_cong_giang_day, ma_lop_hoc, ma_giao_vien) VALUES (6, 3, 2);
INSERT INTO public."PhanCongGiangDay" (ma_phan_cong_giang_day, ma_lop_hoc, ma_giao_vien) VALUES (7, 4, 3);
INSERT INTO public."PhanCongGiangDay" (ma_phan_cong_giang_day, ma_lop_hoc, ma_giao_vien) VALUES (8, 4, 4);


--
-- TOC entry 5517 (class 0 OID 26108)
-- Dependencies: 284
-- Data for Name: PhanCongHoatDong; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PhanCongHoatDong" (ma_phan_cong_hoat_dong, ma_hoat_dong_ngoai_khoa, ma_giao_vien) VALUES (1, 1, 1);
INSERT INTO public."PhanCongHoatDong" (ma_phan_cong_hoat_dong, ma_hoat_dong_ngoai_khoa, ma_giao_vien) VALUES (2, 1, 2);
INSERT INTO public."PhanCongHoatDong" (ma_phan_cong_hoat_dong, ma_hoat_dong_ngoai_khoa, ma_giao_vien) VALUES (3, 2, 2);
INSERT INTO public."PhanCongHoatDong" (ma_phan_cong_hoat_dong, ma_hoat_dong_ngoai_khoa, ma_giao_vien) VALUES (4, 2, 3);
INSERT INTO public."PhanCongHoatDong" (ma_phan_cong_hoat_dong, ma_hoat_dong_ngoai_khoa, ma_giao_vien) VALUES (5, 3, 1);


--
-- TOC entry 5511 (class 0 OID 26074)
-- Dependencies: 278
-- Data for Name: PhanCongMarketing; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PhanCongMarketing" (ma_phan_cong_marketing, ma_chuong_trinh_marketing, ma_nhan_su, vai_tro) VALUES (1, 1, 2, 'Trưởng nhóm chiến dịch - Tối ưu Ads Facebook');
INSERT INTO public."PhanCongMarketing" (ma_phan_cong_marketing, ma_chuong_trinh_marketing, ma_nhan_su, vai_tro) VALUES (2, 1, 8, 'Viết content landing page và kịch bản seeding');
INSERT INTO public."PhanCongMarketing" (ma_phan_cong_marketing, ma_chuong_trinh_marketing, ma_nhan_su, vai_tro) VALUES (3, 1, 9, 'Thiết kế banner, tờ rơi và các ấn phẩm in ấn');
INSERT INTO public."PhanCongMarketing" (ma_phan_cong_marketing, ma_chuong_trinh_marketing, ma_nhan_su, vai_tro) VALUES (4, 2, 4, 'Điều phối sự kiện, quản lý khách mời');
INSERT INTO public."PhanCongMarketing" (ma_phan_cong_marketing, ma_chuong_trinh_marketing, ma_nhan_su, vai_tro) VALUES (5, 2, 2, 'Chạy quảng cáo chuyển đổi đăng ký form Workshop');
INSERT INTO public."PhanCongMarketing" (ma_phan_cong_marketing, ma_chuong_trinh_marketing, ma_nhan_su, vai_tro) VALUES (6, 3, 2, 'Lên kế hoạch Media Booking và liên hệ các trường Đại học');
INSERT INTO public."PhanCongMarketing" (ma_phan_cong_marketing, ma_chuong_trinh_marketing, ma_nhan_su, vai_tro) VALUES (7, 3, 9, 'Quay dựng video phỏng vấn học viên viral trên TikTok');
INSERT INTO public."PhanCongMarketing" (ma_phan_cong_marketing, ma_chuong_trinh_marketing, ma_nhan_su, vai_tro) VALUES (8, 4, 5, 'Tư vấn và theo dõi danh sách học viên rủ thêm bạn');
INSERT INTO public."PhanCongMarketing" (ma_phan_cong_marketing, ma_chuong_trinh_marketing, ma_nhan_su, vai_tro) VALUES (9, 4, 10, 'Nhắn tin Zalo ZNS thông báo chương trình cho học viên cũ');


--
-- TOC entry 5457 (class 0 OID 25732)
-- Dependencies: 224
-- Data for Name: PhanQuyen; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (3, 1, 1);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (4, 4, 6);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (5, 4, 7);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (6, 4, 8);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (7, 4, 9);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (8, 4, 10);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (9, 5, 6);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (10, 5, 7);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (11, 5, 8);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (12, 5, 9);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (13, 5, 10);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (14, 6, 11);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (15, 6, 12);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (16, 6, 13);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (17, 6, 14);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (18, 6, 15);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (19, 6, 16);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (20, 7, 16);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (21, 7, 17);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (22, 7, 19);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (23, 7, 20);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (24, 7, 21);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (25, 8, 11);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (26, 8, 12);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (27, 8, 14);
INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (28, 8, 15);


--
-- TOC entry 5529 (class 0 OID 33923)
-- Dependencies: 296
-- Data for Name: PhieuChamCong; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PhieuChamCong" (ma_phieu_cham_cong, ma_bang_cham_cong, ma_nhan_su, ma_giao_vien, ho_ten, ngay_1, ngay_2, ngay_3, ngay_4, ngay_5, ngay_6, ngay_7, ngay_8, ngay_9, ngay_10, ngay_11, ngay_12, ngay_13, ngay_14, ngay_15, ngay_16, ngay_17, ngay_18, ngay_19, ngay_20, ngay_21, ngay_22, ngay_23, ngay_24, ngay_25, ngay_26, ngay_27, ngay_28, ngay_29, ngay_30, ngay_31, tong_so_gio_lam_viec, so_lan_di_muon, so_lan_ve_som, so_gio_lam_viec_thuong, so_gio_tang_ca_ngay_thuong, so_gio_lam_viec_thuong_ngay_nghi, so_gio_tang_ca_ngay_nghi) VALUES (33, 3, 2, NULL, 'Trần Thị Tuyết', 8, 8, 8, 8, 0, 8, 8, 8, 8, 8, 8, 0, 8, 8, 8, 8, 8, 8, 0, 8, 8, 8, 8, 8, 8, 0, 8, 8, 8, 8, 0, 208, 0, 0, 176, 0, 32, 0);
INSERT INTO public."PhieuChamCong" (ma_phieu_cham_cong, ma_bang_cham_cong, ma_nhan_su, ma_giao_vien, ho_ten, ngay_1, ngay_2, ngay_3, ngay_4, ngay_5, ngay_6, ngay_7, ngay_8, ngay_9, ngay_10, ngay_11, ngay_12, ngay_13, ngay_14, ngay_15, ngay_16, ngay_17, ngay_18, ngay_19, ngay_20, ngay_21, ngay_22, ngay_23, ngay_24, ngay_25, ngay_26, ngay_27, ngay_28, ngay_29, ngay_30, ngay_31, tong_so_gio_lam_viec, so_lan_di_muon, so_lan_ve_som, so_gio_lam_viec_thuong, so_gio_tang_ca_ngay_thuong, so_gio_lam_viec_thuong_ngay_nghi, so_gio_tang_ca_ngay_nghi) VALUES (40, 3, 10, NULL, 'Đoàn Hải Phong', 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 8, 2);
INSERT INTO public."PhieuChamCong" (ma_phieu_cham_cong, ma_bang_cham_cong, ma_nhan_su, ma_giao_vien, ho_ten, ngay_1, ngay_2, ngay_3, ngay_4, ngay_5, ngay_6, ngay_7, ngay_8, ngay_9, ngay_10, ngay_11, ngay_12, ngay_13, ngay_14, ngay_15, ngay_16, ngay_17, ngay_18, ngay_19, ngay_20, ngay_21, ngay_22, ngay_23, ngay_24, ngay_25, ngay_26, ngay_27, ngay_28, ngay_29, ngay_30, ngay_31, tong_so_gio_lam_viec, so_lan_di_muon, so_lan_ve_som, so_gio_lam_viec_thuong, so_gio_tang_ca_ngay_thuong, so_gio_lam_viec_thuong_ngay_nghi, so_gio_tang_ca_ngay_nghi) VALUES (31, 3, NULL, 3, 'David Smith', 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 2, 1, 10, 0, 0, 0);
INSERT INTO public."PhieuChamCong" (ma_phieu_cham_cong, ma_bang_cham_cong, ma_nhan_su, ma_giao_vien, ho_ten, ngay_1, ngay_2, ngay_3, ngay_4, ngay_5, ngay_6, ngay_7, ngay_8, ngay_9, ngay_10, ngay_11, ngay_12, ngay_13, ngay_14, ngay_15, ngay_16, ngay_17, ngay_18, ngay_19, ngay_20, ngay_21, ngay_22, ngay_23, ngay_24, ngay_25, ngay_26, ngay_27, ngay_28, ngay_29, ngay_30, ngay_31, tong_so_gio_lam_viec, so_lan_di_muon, so_lan_ve_som, so_gio_lam_viec_thuong, so_gio_tang_ca_ngay_thuong, so_gio_lam_viec_thuong_ngay_nghi, so_gio_tang_ca_ngay_nghi) VALUES (34, 3, NULL, 4, 'Phạm Mai Phương', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0);
INSERT INTO public."PhieuChamCong" (ma_phieu_cham_cong, ma_bang_cham_cong, ma_nhan_su, ma_giao_vien, ho_ten, ngay_1, ngay_2, ngay_3, ngay_4, ngay_5, ngay_6, ngay_7, ngay_8, ngay_9, ngay_10, ngay_11, ngay_12, ngay_13, ngay_14, ngay_15, ngay_16, ngay_17, ngay_18, ngay_19, ngay_20, ngay_21, ngay_22, ngay_23, ngay_24, ngay_25, ngay_26, ngay_27, ngay_28, ngay_29, ngay_30, ngay_31, tong_so_gio_lam_viec, so_lan_di_muon, so_lan_ve_som, so_gio_lam_viec_thuong, so_gio_tang_ca_ngay_thuong, so_gio_lam_viec_thuong_ngay_nghi, so_gio_tang_ca_ngay_nghi) VALUES (32, 3, 1, NULL, 'Nguyễn Văn Quản', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 8, 0, 0, 0);
INSERT INTO public."PhieuChamCong" (ma_phieu_cham_cong, ma_bang_cham_cong, ma_nhan_su, ma_giao_vien, ho_ten, ngay_1, ngay_2, ngay_3, ngay_4, ngay_5, ngay_6, ngay_7, ngay_8, ngay_9, ngay_10, ngay_11, ngay_12, ngay_13, ngay_14, ngay_15, ngay_16, ngay_17, ngay_18, ngay_19, ngay_20, ngay_21, ngay_22, ngay_23, ngay_24, ngay_25, ngay_26, ngay_27, ngay_28, ngay_29, ngay_30, ngay_31, tong_so_gio_lam_viec, so_lan_di_muon, so_lan_ve_som, so_gio_lam_viec_thuong, so_gio_tang_ca_ngay_thuong, so_gio_lam_viec_thuong_ngay_nghi, so_gio_tang_ca_ngay_nghi) VALUES (35, 3, 5, NULL, 'Vũ Văn Đào', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 8, 0, 0, 0);
INSERT INTO public."PhieuChamCong" (ma_phieu_cham_cong, ma_bang_cham_cong, ma_nhan_su, ma_giao_vien, ho_ten, ngay_1, ngay_2, ngay_3, ngay_4, ngay_5, ngay_6, ngay_7, ngay_8, ngay_9, ngay_10, ngay_11, ngay_12, ngay_13, ngay_14, ngay_15, ngay_16, ngay_17, ngay_18, ngay_19, ngay_20, ngay_21, ngay_22, ngay_23, ngay_24, ngay_25, ngay_26, ngay_27, ngay_28, ngay_29, ngay_30, ngay_31, tong_so_gio_lam_viec, so_lan_di_muon, so_lan_ve_som, so_gio_lam_viec_thuong, so_gio_tang_ca_ngay_thuong, so_gio_lam_viec_thuong_ngay_nghi, so_gio_tang_ca_ngay_nghi) VALUES (36, 3, 6, NULL, 'Nguyễn Quản Trị', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 0, 7, 0, 0, 0);
INSERT INTO public."PhieuChamCong" (ma_phieu_cham_cong, ma_bang_cham_cong, ma_nhan_su, ma_giao_vien, ho_ten, ngay_1, ngay_2, ngay_3, ngay_4, ngay_5, ngay_6, ngay_7, ngay_8, ngay_9, ngay_10, ngay_11, ngay_12, ngay_13, ngay_14, ngay_15, ngay_16, ngay_17, ngay_18, ngay_19, ngay_20, ngay_21, ngay_22, ngay_23, ngay_24, ngay_25, ngay_26, ngay_27, ngay_28, ngay_29, ngay_30, ngay_31, tong_so_gio_lam_viec, so_lan_di_muon, so_lan_ve_som, so_gio_lam_viec_thuong, so_gio_tang_ca_ngay_thuong, so_gio_lam_viec_thuong_ngay_nghi, so_gio_tang_ca_ngay_nghi) VALUES (37, 3, NULL, 7, 'John Smith', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO public."PhieuChamCong" (ma_phieu_cham_cong, ma_bang_cham_cong, ma_nhan_su, ma_giao_vien, ho_ten, ngay_1, ngay_2, ngay_3, ngay_4, ngay_5, ngay_6, ngay_7, ngay_8, ngay_9, ngay_10, ngay_11, ngay_12, ngay_13, ngay_14, ngay_15, ngay_16, ngay_17, ngay_18, ngay_19, ngay_20, ngay_21, ngay_22, ngay_23, ngay_24, ngay_25, ngay_26, ngay_27, ngay_28, ngay_29, ngay_30, ngay_31, tong_so_gio_lam_viec, so_lan_di_muon, so_lan_ve_som, so_gio_lam_viec_thuong, so_gio_tang_ca_ngay_thuong, so_gio_lam_viec_thuong_ngay_nghi, so_gio_tang_ca_ngay_nghi) VALUES (38, 3, NULL, 8, 'Hoàng Anh Tú', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO public."PhieuChamCong" (ma_phieu_cham_cong, ma_bang_cham_cong, ma_nhan_su, ma_giao_vien, ho_ten, ngay_1, ngay_2, ngay_3, ngay_4, ngay_5, ngay_6, ngay_7, ngay_8, ngay_9, ngay_10, ngay_11, ngay_12, ngay_13, ngay_14, ngay_15, ngay_16, ngay_17, ngay_18, ngay_19, ngay_20, ngay_21, ngay_22, ngay_23, ngay_24, ngay_25, ngay_26, ngay_27, ngay_28, ngay_29, ngay_30, ngay_31, tong_so_gio_lam_viec, so_lan_di_muon, so_lan_ve_som, so_gio_lam_viec_thuong, so_gio_tang_ca_ngay_thuong, so_gio_lam_viec_thuong_ngay_nghi, so_gio_tang_ca_ngay_nghi) VALUES (39, 3, NULL, 9, 'Vũ Yến Nhi', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);


--
-- TOC entry 5485 (class 0 OID 25913)
-- Dependencies: 252
-- Data for Name: PhieuChi; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5479 (class 0 OID 25863)
-- Dependencies: 246
-- Data for Name: PhieuLuong; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5483 (class 0 OID 25897)
-- Dependencies: 250
-- Data for Name: PhieuThu; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_khoa_hoc) VALUES (9, 10562500.00, '2026-04-12 00:00:00', 'Thu học phí ielts', 2, 2, 2, 4);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_khoa_hoc) VALUES (4, 3802500.00, '2026-04-12 00:00:00', 'Thu học phí khóa Luyện thi VSTEP B1-B2 (Giảm 15.5% đăng ký nhóm).', 5, 2, 2, 1);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_khoa_hoc) VALUES (3, 12500000.00, '2026-04-12 00:00:00', 'Thu học phí khóa IELTS 6.5+.', 3, 7, NULL, 4);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_khoa_hoc) VALUES (5, 3802500.00, '2026-04-12 00:00:00', 'Thu học phí khóa Luyện thi TOEIC 450-650+ (Giảm 10% tri ân học viên cũ)', 4, 9, 2, 1);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_khoa_hoc) VALUES (2, 2957500.00, '2026-04-11 00:00:00', 'Thu học phí khóa Luyện thi TOEIC 450-650+ (Giảm 15.5% đăng ký nhóm)', 2, 9, 2, 2);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_khoa_hoc) VALUES (6, 1690000.00, '2026-04-11 00:00:00', 'nộp học phí', 3, 11, 2, 5);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_khoa_hoc) VALUES (1, 4050000.00, '2026-04-10 00:00:00', 'Thu học phí khóa Luyện thi VSTEP B1-B2 (Giảm 10% tri ân học viên cũ)', 1, 9, 3, 1);


--
-- TOC entry 5481 (class 0 OID 25885)
-- Dependencies: 248
-- Data for Name: PhieuThuong; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PhieuThuong" (ma_phieu_thuong, ma_nhan_su, ma_phieu_luong, loai_thuong, so_tien, noi_dung, ma_bang_thuong, ma_giao_vien) VALUES (26, 2, NULL, 'Thưởng nóng', 30000.00, 'Luôn luôn đi sớm nhất phòng', 1, NULL);
INSERT INTO public."PhieuThuong" (ma_phieu_thuong, ma_nhan_su, ma_phieu_luong, loai_thuong, so_tien, noi_dung, ma_bang_thuong, ma_giao_vien) VALUES (596, 9, NULL, 'Tiền hoa hồng', 864800.00, 'Hoa hồng doanh số tháng 4/2026', 1, NULL);
INSERT INTO public."PhieuThuong" (ma_phieu_thuong, ma_nhan_su, ma_phieu_luong, loai_thuong, so_tien, noi_dung, ma_bang_thuong, ma_giao_vien) VALUES (597, 7, NULL, 'Tiền hoa hồng', 1250000.00, 'Hoa hồng doanh số tháng 4/2026', 1, NULL);
INSERT INTO public."PhieuThuong" (ma_phieu_thuong, ma_nhan_su, ma_phieu_luong, loai_thuong, so_tien, noi_dung, ma_bang_thuong, ma_giao_vien) VALUES (598, 10, NULL, 'Chuyên cần', 300000.00, 'Thưởng chuyên cần tháng 4/2026', 1, NULL);
INSERT INTO public."PhieuThuong" (ma_phieu_thuong, ma_nhan_su, ma_phieu_luong, loai_thuong, so_tien, noi_dung, ma_bang_thuong, ma_giao_vien) VALUES (599, 11, NULL, 'Tiền hoa hồng', 33800.00, 'Hoa hồng doanh số tháng 4/2026', 1, NULL);
INSERT INTO public."PhieuThuong" (ma_phieu_thuong, ma_nhan_su, ma_phieu_luong, loai_thuong, so_tien, noi_dung, ma_bang_thuong, ma_giao_vien) VALUES (600, 1, NULL, 'Chuyên cần', 300000.00, 'Thưởng chuyên cần tháng 4/2026', 1, NULL);
INSERT INTO public."PhieuThuong" (ma_phieu_thuong, ma_nhan_su, ma_phieu_luong, loai_thuong, so_tien, noi_dung, ma_bang_thuong, ma_giao_vien) VALUES (601, 2, NULL, 'Tiền hoa hồng', 1436500.00, 'Hoa hồng doanh số tháng 4/2026', 1, NULL);
INSERT INTO public."PhieuThuong" (ma_phieu_thuong, ma_nhan_su, ma_phieu_luong, loai_thuong, so_tien, noi_dung, ma_bang_thuong, ma_giao_vien) VALUES (602, 2, NULL, 'Chuyên cần', 250000.00, 'Thưởng chuyên cần tháng 4/2026', 1, NULL);
INSERT INTO public."PhieuThuong" (ma_phieu_thuong, ma_nhan_su, ma_phieu_luong, loai_thuong, so_tien, noi_dung, ma_bang_thuong, ma_giao_vien) VALUES (17, 2, NULL, 'Thưởng nóng', 500000.00, 'Làm việc quá chăm chỉ', 1, NULL);
INSERT INTO public."PhieuThuong" (ma_phieu_thuong, ma_nhan_su, ma_phieu_luong, loai_thuong, so_tien, noi_dung, ma_bang_thuong, ma_giao_vien) VALUES (603, 5, NULL, 'Chuyên cần', 300000.00, 'Thưởng chuyên cần tháng 4/2026', 1, NULL);
INSERT INTO public."PhieuThuong" (ma_phieu_thuong, ma_nhan_su, ma_phieu_luong, loai_thuong, so_tien, noi_dung, ma_bang_thuong, ma_giao_vien) VALUES (35, NULL, NULL, 'Thưởng nóng', 1000000.00, 'Giáo viên có thành tích tốt nhất trung tâm', 1, 1);


--
-- TOC entry 5459 (class 0 OID 25742)
-- Dependencies: 226
-- Data for Name: PhongBan; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (1, 'Phòng Giám đốc', 'Quản lý, điều hành chung và đưa ra định hướng chiến lược cho trung tâm.', '2026-05-10 23:53:00.347');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (2, 'Phòng Sale', 'Tư vấn tuyển sinh, giải đáp thắc mắc và chăm sóc khách hàng tiềm năng.', '2026-05-10 23:53:00.347');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (3, 'Phòng Marketing', 'Quản lý các chiến dịch truyền thông, quảng cáo và tổ chức sự kiện ngoại khóa.', '2026-05-10 23:53:00.347');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (4, 'Phòng Kế toán', 'Quản lý tài chính, thu phí học viên, lập phiếu chi và tính lương nhân sự.', '2026-05-10 23:53:00.347');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (5, 'Phòng Đào tạo', 'Quản lý giáo viên, lên kế hoạch giảng dạy, xếp lớp và theo dõi chất lượng học viên.', '2026-05-10 23:53:00.347');


--
-- TOC entry 5495 (class 0 OID 25978)
-- Dependencies: 262
-- Data for Name: PhongHoc; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (1, '101', 50);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (2, '102', 30);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (3, '103', 40);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (4, '201', 30);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (5, '202', 40);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (6, '203', 60);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (7, '301', 50);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (8, '302', 40);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (9, '303', 50);


--
-- TOC entry 5453 (class 0 OID 25708)
-- Dependencies: 220
-- Data for Name: Quyen; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (1, 'ADMIN', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (2, 'Quản lý tài khoản', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (3, 'Danh mục chức vụ', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (4, 'Danh mục chương trình học', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (5, 'Danh mục phòng học', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (6, 'Chương trình Marketing', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (7, 'Thông tin khóa học', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (8, 'Hoạt động ngoại khóa', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (9, 'Chương trình khuyến mãi', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (10, 'Quản lý cam kết', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (11, 'Kế hoạch giảng dạy', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (12, 'Quản lý chương trình học', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (13, 'Quản lý nhân sự', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (14, 'Hồ sơ học viên', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (15, 'Quản lý lớp học', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (16, 'Quản lý phiếu thu học phí', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (17, 'Quản lý bảng lương', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (18, 'Phiếu chi hoạt động', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (19, 'Quản lý thưởng', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (20, 'Quản lý công nợ', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (21, 'Quản lý chấm công', 'Hoạt động');


--
-- TOC entry 5455 (class 0 OID 25719)
-- Dependencies: 222
-- Data for Name: TaiKhoan; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, trang_thai, ma_nhan_su, ma_giao_vien) VALUES (4, 'sale', '$2b$10$GtGe4K6fjpVh/F5M6pZpQujk0LrIEeWgWMzX7vMaad4kUFgRt6jeW', 'Hoạt động', 2, NULL);
INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, trang_thai, ma_nhan_su, ma_giao_vien) VALUES (5, 'marketing', '$2b$10$7Zn934s9sQ/FH12mTw8tKOdcSUiVlniLm6YqmaFyim6S2po4VNIoC', 'Hoạt động', 3, NULL);
INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, trang_thai, ma_nhan_su, ma_giao_vien) VALUES (6, 'daotao', '$2b$10$P/rbmpcr6//SmaypTNzqjeM/CRoo18t8YPHehHPGBY6yTJ.4IT4a2', 'Hoạt động', 5, NULL);
INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, trang_thai, ma_nhan_su, ma_giao_vien) VALUES (7, 'ketoan', '$2b$10$/WPo.b23EmKj6q4s4BNbsu6.RKkIZVJluj7/gWi7MDoaq9WnPMwqi', 'Hoạt động', 4, NULL);
INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, trang_thai, ma_nhan_su, ma_giao_vien) VALUES (8, 'giaovien', '$2b$10$4hkqzKQoVIc05uAUQo3yi.IXRMXNENOX7XR.TtQLo2O2Y0uT3H4m.', 'Hoạt động', NULL, 1);
INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, trang_thai, ma_nhan_su, ma_giao_vien) VALUES (1, 'admin', '$2b$10$sSM8Rnj3LQEI20KM.bkSDuLijWtJEX5XaSN3Pew.Q1SFjGJlf8c7q', 'Hoạt động', 6, NULL);


--
-- TOC entry 5499 (class 0 OID 26000)
-- Dependencies: 266
-- Data for Name: ThamGiaLop; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5515 (class 0 OID 26098)
-- Dependencies: 282
-- Data for Name: ThamGiaNgoaiKhoa; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."ThamGiaNgoaiKhoa" (ma_tham_gia_ngoai_khoa, ma_hoc_vien, ma_hoat_dong_ngoai_khoa) VALUES (1, 1, 1);
INSERT INTO public."ThamGiaNgoaiKhoa" (ma_tham_gia_ngoai_khoa, ma_hoc_vien, ma_hoat_dong_ngoai_khoa) VALUES (2, 2, 1);
INSERT INTO public."ThamGiaNgoaiKhoa" (ma_tham_gia_ngoai_khoa, ma_hoc_vien, ma_hoat_dong_ngoai_khoa) VALUES (3, 3, 1);
INSERT INTO public."ThamGiaNgoaiKhoa" (ma_tham_gia_ngoai_khoa, ma_hoc_vien, ma_hoat_dong_ngoai_khoa) VALUES (4, 2, 2);
INSERT INTO public."ThamGiaNgoaiKhoa" (ma_tham_gia_ngoai_khoa, ma_hoc_vien, ma_hoat_dong_ngoai_khoa) VALUES (5, 4, 2);
INSERT INTO public."ThamGiaNgoaiKhoa" (ma_tham_gia_ngoai_khoa, ma_hoc_vien, ma_hoat_dong_ngoai_khoa) VALUES (6, 5, 2);
INSERT INTO public."ThamGiaNgoaiKhoa" (ma_tham_gia_ngoai_khoa, ma_hoc_vien, ma_hoat_dong_ngoai_khoa) VALUES (7, 1, 3);
INSERT INTO public."ThamGiaNgoaiKhoa" (ma_tham_gia_ngoai_khoa, ma_hoc_vien, ma_hoat_dong_ngoai_khoa) VALUES (8, 5, 3);


--
-- TOC entry 5577 (class 0 OID 0)
-- Dependencies: 287
-- Name: BaiKiemTra_ma_bai_kiem_tra_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BaiKiemTra_ma_bai_kiem_tra_seq"', 1, false);


--
-- TOC entry 5578 (class 0 OID 0)
-- Dependencies: 235
-- Name: BangCap_ma_bang_cap_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BangCap_ma_bang_cap_seq"', 1, false);


--
-- TOC entry 5579 (class 0 OID 0)
-- Dependencies: 239
-- Name: BangChamCong_ma_bang_cham_cong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BangChamCong_ma_bang_cham_cong_seq"', 3, true);


--
-- TOC entry 5580 (class 0 OID 0)
-- Dependencies: 243
-- Name: BangLuong_ma_bang_luong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BangLuong_ma_bang_luong_seq"', 1, false);


--
-- TOC entry 5581 (class 0 OID 0)
-- Dependencies: 297
-- Name: BangThuong_ma_bang_thuong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BangThuong_ma_bang_thuong_seq"', 1, true);


--
-- TOC entry 5582 (class 0 OID 0)
-- Dependencies: 271
-- Name: BuoiHoc_ma_buoi_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BuoiHoc_ma_buoi_hoc_seq"', 5, true);


--
-- TOC entry 5583 (class 0 OID 0)
-- Dependencies: 267
-- Name: CamKet_ma_cam_ket_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."CamKet_ma_cam_ket_seq"', 4, true);


--
-- TOC entry 5584 (class 0 OID 0)
-- Dependencies: 241
-- Name: ChiTietChamCong_ma_chi_tiet_cham_cong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ChiTietChamCong_ma_chi_tiet_cham_cong_seq"', 563, true);


--
-- TOC entry 5585 (class 0 OID 0)
-- Dependencies: 227
-- Name: ChucVu_ma_chuc_vu_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ChucVu_ma_chuc_vu_seq"', 9, true);


--
-- TOC entry 5586 (class 0 OID 0)
-- Dependencies: 255
-- Name: ChuongTrinhHoc_ma_chuong_trinh_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ChuongTrinhHoc_ma_chuong_trinh_seq"', 3, true);


--
-- TOC entry 5587 (class 0 OID 0)
-- Dependencies: 285
-- Name: ChuongTrinhKhuyenMai_ma_khuyen_mai_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"', 5, true);


--
-- TOC entry 5588 (class 0 OID 0)
-- Dependencies: 275
-- Name: ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq"', 4, true);


--
-- TOC entry 5589 (class 0 OID 0)
-- Dependencies: 253
-- Name: CongNo_ma_cong_no_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."CongNo_ma_cong_no_seq"', 1, false);


--
-- TOC entry 5590 (class 0 OID 0)
-- Dependencies: 273
-- Name: DiemDanh_ma_diem_danh_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."DiemDanh_ma_diem_danh_seq"', 13, true);


--
-- TOC entry 5591 (class 0 OID 0)
-- Dependencies: 231
-- Name: GiaoVien_ma_giao_vien_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."GiaoVien_ma_giao_vien_seq"', 9, true);


--
-- TOC entry 5592 (class 0 OID 0)
-- Dependencies: 233
-- Name: HoSoBangCap_ma_ho_so_bang_cap_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HoSoBangCap_ma_ho_so_bang_cap_seq"', 1, false);


--
-- TOC entry 5593 (class 0 OID 0)
-- Dependencies: 279
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq"', 3, true);


--
-- TOC entry 5594 (class 0 OID 0)
-- Dependencies: 263
-- Name: HocVien_ma_hoc_vien_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HocVien_ma_hoc_vien_seq"', 5, true);


--
-- TOC entry 5595 (class 0 OID 0)
-- Dependencies: 237
-- Name: HopDongLaoDong_ma_hop_dong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HopDongLaoDong_ma_hop_dong_seq"', 12, true);


--
-- TOC entry 5596 (class 0 OID 0)
-- Dependencies: 269
-- Name: KeHoachGiangDay_ma_ke_hoach_giang_day_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."KeHoachGiangDay_ma_ke_hoach_giang_day_seq"', 1, false);


--
-- TOC entry 5597 (class 0 OID 0)
-- Dependencies: 289
-- Name: KetQuaKiemTra_ma_ket_qua_kiem_tra_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."KetQuaKiemTra_ma_ket_qua_kiem_tra_seq"', 1, false);


--
-- TOC entry 5598 (class 0 OID 0)
-- Dependencies: 257
-- Name: KhoaHoc_ma_khoa_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."KhoaHoc_ma_khoa_hoc_seq"', 5, true);


--
-- TOC entry 5599 (class 0 OID 0)
-- Dependencies: 259
-- Name: LopHoc_ma_lop_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."LopHoc_ma_lop_hoc_seq"', 6, true);


--
-- TOC entry 5600 (class 0 OID 0)
-- Dependencies: 229
-- Name: NhanSu_ma_nhan_su_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."NhanSu_ma_nhan_su_seq"', 11, true);


--
-- TOC entry 5601 (class 0 OID 0)
-- Dependencies: 291
-- Name: NhanXet_ma_nhan_xet_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."NhanXet_ma_nhan_xet_seq"', 12, true);


--
-- TOC entry 5602 (class 0 OID 0)
-- Dependencies: 293
-- Name: PhanCongGiangDay_ma_phan_cong_giang_day_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhanCongGiangDay_ma_phan_cong_giang_day_seq"', 8, true);


--
-- TOC entry 5603 (class 0 OID 0)
-- Dependencies: 283
-- Name: PhanCongHoatDong_ma_phan_cong_hoat_dong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhanCongHoatDong_ma_phan_cong_hoat_dong_seq"', 5, true);


--
-- TOC entry 5604 (class 0 OID 0)
-- Dependencies: 277
-- Name: PhanCongMarketing_ma_phan_cong_marketing_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhanCongMarketing_ma_phan_cong_marketing_seq"', 27, true);


--
-- TOC entry 5605 (class 0 OID 0)
-- Dependencies: 223
-- Name: PhanQuyen_ma_phan_quyen_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhanQuyen_ma_phan_quyen_seq"', 78, true);


--
-- TOC entry 5606 (class 0 OID 0)
-- Dependencies: 295
-- Name: PhieuChamCong_ma_phieu_cham_cong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuChamCong_ma_phieu_cham_cong_seq"', 40, true);


--
-- TOC entry 5607 (class 0 OID 0)
-- Dependencies: 251
-- Name: PhieuChi_ma_phieu_chi_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuChi_ma_phieu_chi_seq"', 1, false);


--
-- TOC entry 5608 (class 0 OID 0)
-- Dependencies: 245
-- Name: PhieuLuong_ma_phieu_luong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuLuong_ma_phieu_luong_seq"', 1, false);


--
-- TOC entry 5609 (class 0 OID 0)
-- Dependencies: 249
-- Name: PhieuThu_ma_phieu_thu_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuThu_ma_phieu_thu_seq"', 9, true);


--
-- TOC entry 5610 (class 0 OID 0)
-- Dependencies: 247
-- Name: PhieuThuong_ma_phieu_thuong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuThuong_ma_phieu_thuong_seq"', 603, true);


--
-- TOC entry 5611 (class 0 OID 0)
-- Dependencies: 225
-- Name: PhongBan_ma_phong_ban_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhongBan_ma_phong_ban_seq"', 5, true);


--
-- TOC entry 5612 (class 0 OID 0)
-- Dependencies: 261
-- Name: PhongHoc_ma_phong_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhongHoc_ma_phong_hoc_seq"', 1, false);


--
-- TOC entry 5613 (class 0 OID 0)
-- Dependencies: 219
-- Name: Quyen_ma_quyen_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Quyen_ma_quyen_seq"', 1, true);


--
-- TOC entry 5614 (class 0 OID 0)
-- Dependencies: 221
-- Name: TaiKhoan_ma_tai_khoan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."TaiKhoan_ma_tai_khoan_seq"', 9, true);


--
-- TOC entry 5615 (class 0 OID 0)
-- Dependencies: 265
-- Name: ThamGiaLop_ma_tham_gia_lop_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ThamGiaLop_ma_tham_gia_lop_seq"', 1, false);


--
-- TOC entry 5616 (class 0 OID 0)
-- Dependencies: 281
-- Name: ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq"', 8, true);


--
-- TOC entry 5231 (class 2606 OID 26141)
-- Name: BaiKiemTra BaiKiemTra_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BaiKiemTra"
    ADD CONSTRAINT "BaiKiemTra_pkey" PRIMARY KEY (ma_bai_kiem_tra);


--
-- TOC entry 5171 (class 2606 OID 25810)
-- Name: BangCap BangCap_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BangCap"
    ADD CONSTRAINT "BangCap_pkey" PRIMARY KEY (ma_bang_cap);


--
-- TOC entry 5177 (class 2606 OID 25835)
-- Name: BangChamCong BangChamCong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BangChamCong"
    ADD CONSTRAINT "BangChamCong_pkey" PRIMARY KEY (ma_bang_cham_cong);


--
-- TOC entry 5181 (class 2606 OID 25861)
-- Name: BangLuong BangLuong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BangLuong"
    ADD CONSTRAINT "BangLuong_pkey" PRIMARY KEY (ma_bang_luong);


--
-- TOC entry 5242 (class 2606 OID 34010)
-- Name: BangThuong BangThuong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BangThuong"
    ADD CONSTRAINT "BangThuong_pkey" PRIMARY KEY (ma_bang_thuong);


--
-- TOC entry 5214 (class 2606 OID 26049)
-- Name: BuoiHoc BuoiHoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BuoiHoc"
    ADD CONSTRAINT "BuoiHoc_pkey" PRIMARY KEY (ma_buoi_hoc);


--
-- TOC entry 5210 (class 2606 OID 26024)
-- Name: CamKet CamKet_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CamKet"
    ADD CONSTRAINT "CamKet_pkey" PRIMARY KEY (ma_cam_ket);


--
-- TOC entry 5179 (class 2606 OID 25849)
-- Name: ChiTietChamCong ChiTietChamCong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChiTietChamCong"
    ADD CONSTRAINT "ChiTietChamCong_pkey" PRIMARY KEY (ma_chi_tiet_cham_cong);


--
-- TOC entry 5160 (class 2606 OID 25762)
-- Name: ChucVu ChucVu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChucVu"
    ADD CONSTRAINT "ChucVu_pkey" PRIMARY KEY (ma_chuc_vu);


--
-- TOC entry 5195 (class 2606 OID 25949)
-- Name: ChuongTrinhHoc ChuongTrinhHoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhHoc"
    ADD CONSTRAINT "ChuongTrinhHoc_pkey" PRIMARY KEY (ma_chuong_trinh);


--
-- TOC entry 5229 (class 2606 OID 26128)
-- Name: ChuongTrinhKhuyenMai ChuongTrinhKhuyenMai_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhKhuyenMai"
    ADD CONSTRAINT "ChuongTrinhKhuyenMai_pkey" PRIMARY KEY (ma_khuyen_mai);


--
-- TOC entry 5218 (class 2606 OID 26072)
-- Name: ChuongTrinhMarketing ChuongTrinhMarketing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhMarketing"
    ADD CONSTRAINT "ChuongTrinhMarketing_pkey" PRIMARY KEY (ma_chuong_trinh_marketing);


--
-- TOC entry 5193 (class 2606 OID 25938)
-- Name: CongNo CongNo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CongNo"
    ADD CONSTRAINT "CongNo_pkey" PRIMARY KEY (ma_cong_no);


--
-- TOC entry 5216 (class 2606 OID 26061)
-- Name: DiemDanh DiemDanh_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DiemDanh"
    ADD CONSTRAINT "DiemDanh_pkey" PRIMARY KEY (ma_diem_danh);


--
-- TOC entry 5167 (class 2606 OID 25788)
-- Name: GiaoVien GiaoVien_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GiaoVien"
    ADD CONSTRAINT "GiaoVien_pkey" PRIMARY KEY (ma_giao_vien);


--
-- TOC entry 5169 (class 2606 OID 25799)
-- Name: HoSoBangCap HoSoBangCap_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoSoBangCap"
    ADD CONSTRAINT "HoSoBangCap_pkey" PRIMARY KEY (ma_ho_so_bang_cap);


--
-- TOC entry 5222 (class 2606 OID 26096)
-- Name: HoatDongNgoaiKhoa HoatDongNgoaiKhoa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoatDongNgoaiKhoa"
    ADD CONSTRAINT "HoatDongNgoaiKhoa_pkey" PRIMARY KEY (ma_hoat_dong_ngoai_khoa);


--
-- TOC entry 5205 (class 2606 OID 25998)
-- Name: HocVien HocVien_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HocVien"
    ADD CONSTRAINT "HocVien_pkey" PRIMARY KEY (ma_hoc_vien);


--
-- TOC entry 5174 (class 2606 OID 25822)
-- Name: HopDongLaoDong HopDongLaoDong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HopDongLaoDong"
    ADD CONSTRAINT "HopDongLaoDong_pkey" PRIMARY KEY (ma_hop_dong);


--
-- TOC entry 5212 (class 2606 OID 26036)
-- Name: KeHoachGiangDay KeHoachGiangDay_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KeHoachGiangDay"
    ADD CONSTRAINT "KeHoachGiangDay_pkey" PRIMARY KEY (ma_ke_hoach_giang_day);


--
-- TOC entry 5233 (class 2606 OID 26154)
-- Name: KetQuaKiemTra KetQuaKiemTra_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KetQuaKiemTra"
    ADD CONSTRAINT "KetQuaKiemTra_pkey" PRIMARY KEY (ma_ket_qua_kiem_tra);


--
-- TOC entry 5197 (class 2606 OID 25962)
-- Name: KhoaHoc KhoaHoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KhoaHoc"
    ADD CONSTRAINT "KhoaHoc_pkey" PRIMARY KEY (ma_khoa_hoc);


--
-- TOC entry 5199 (class 2606 OID 25976)
-- Name: LopHoc LopHoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LopHoc"
    ADD CONSTRAINT "LopHoc_pkey" PRIMARY KEY (ma_lop_hoc);


--
-- TOC entry 5164 (class 2606 OID 25775)
-- Name: NhanSu NhanSu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NhanSu"
    ADD CONSTRAINT "NhanSu_pkey" PRIMARY KEY (ma_nhan_su);


--
-- TOC entry 5235 (class 2606 OID 26169)
-- Name: NhanXet NhanXet_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NhanXet"
    ADD CONSTRAINT "NhanXet_pkey" PRIMARY KEY (ma_nhan_xet);


--
-- TOC entry 5238 (class 2606 OID 33908)
-- Name: PhanCongGiangDay PhanCongGiangDay_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongGiangDay"
    ADD CONSTRAINT "PhanCongGiangDay_pkey" PRIMARY KEY (ma_phan_cong_giang_day);


--
-- TOC entry 5227 (class 2606 OID 26116)
-- Name: PhanCongHoatDong PhanCongHoatDong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongHoatDong"
    ADD CONSTRAINT "PhanCongHoatDong_pkey" PRIMARY KEY (ma_phan_cong_hoat_dong);


--
-- TOC entry 5220 (class 2606 OID 26084)
-- Name: PhanCongMarketing PhanCongMarketing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongMarketing"
    ADD CONSTRAINT "PhanCongMarketing_pkey" PRIMARY KEY (ma_phan_cong_marketing);


--
-- TOC entry 5156 (class 2606 OID 25740)
-- Name: PhanQuyen PhanQuyen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanQuyen"
    ADD CONSTRAINT "PhanQuyen_pkey" PRIMARY KEY (ma_phan_quyen);


--
-- TOC entry 5240 (class 2606 OID 33970)
-- Name: PhieuChamCong PhieuChamCong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChamCong"
    ADD CONSTRAINT "PhieuChamCong_pkey" PRIMARY KEY (ma_phieu_cham_cong);


--
-- TOC entry 5191 (class 2606 OID 25924)
-- Name: PhieuChi PhieuChi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChi"
    ADD CONSTRAINT "PhieuChi_pkey" PRIMARY KEY (ma_phieu_chi);


--
-- TOC entry 5184 (class 2606 OID 25883)
-- Name: PhieuLuong PhieuLuong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuLuong"
    ADD CONSTRAINT "PhieuLuong_pkey" PRIMARY KEY (ma_phieu_luong);


--
-- TOC entry 5188 (class 2606 OID 25911)
-- Name: PhieuThu PhieuThu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_pkey" PRIMARY KEY (ma_phieu_thu);


--
-- TOC entry 5186 (class 2606 OID 25895)
-- Name: PhieuThuong PhieuThuong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThuong"
    ADD CONSTRAINT "PhieuThuong_pkey" PRIMARY KEY (ma_phieu_thuong);


--
-- TOC entry 5158 (class 2606 OID 25751)
-- Name: PhongBan PhongBan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhongBan"
    ADD CONSTRAINT "PhongBan_pkey" PRIMARY KEY (ma_phong_ban);


--
-- TOC entry 5201 (class 2606 OID 25987)
-- Name: PhongHoc PhongHoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhongHoc"
    ADD CONSTRAINT "PhongHoc_pkey" PRIMARY KEY (ma_phong_hoc);


--
-- TOC entry 5147 (class 2606 OID 25717)
-- Name: Quyen Quyen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quyen"
    ADD CONSTRAINT "Quyen_pkey" PRIMARY KEY (ma_quyen);


--
-- TOC entry 5152 (class 2606 OID 25730)
-- Name: TaiKhoan TaiKhoan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TaiKhoan"
    ADD CONSTRAINT "TaiKhoan_pkey" PRIMARY KEY (ma_tai_khoan);


--
-- TOC entry 5208 (class 2606 OID 26012)
-- Name: ThamGiaLop ThamGiaLop_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaLop"
    ADD CONSTRAINT "ThamGiaLop_pkey" PRIMARY KEY (ma_tham_gia_lop);


--
-- TOC entry 5225 (class 2606 OID 26106)
-- Name: ThamGiaNgoaiKhoa ThamGiaNgoaiKhoa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaNgoaiKhoa"
    ADD CONSTRAINT "ThamGiaNgoaiKhoa_pkey" PRIMARY KEY (ma_tham_gia_ngoai_khoa);


--
-- TOC entry 5172 (class 1259 OID 26178)
-- Name: BangCap_ten_bang_cap_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "BangCap_ten_bang_cap_key" ON public."BangCap" USING btree (ten_bang_cap);


--
-- TOC entry 5161 (class 1259 OID 26176)
-- Name: ChucVu_ten_chuc_vu_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ChucVu_ten_chuc_vu_key" ON public."ChucVu" USING btree (ten_chuc_vu);


--
-- TOC entry 5165 (class 1259 OID 26177)
-- Name: GiaoVien_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "GiaoVien_email_key" ON public."GiaoVien" USING btree (email);


--
-- TOC entry 5203 (class 1259 OID 26182)
-- Name: HocVien_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "HocVien_email_key" ON public."HocVien" USING btree (email);


--
-- TOC entry 5175 (class 1259 OID 26179)
-- Name: HopDongLaoDong_so_hop_dong_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "HopDongLaoDong_so_hop_dong_key" ON public."HopDongLaoDong" USING btree (so_hop_dong);


--
-- TOC entry 5162 (class 1259 OID 34011)
-- Name: NhanSu_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "NhanSu_email_key" ON public."NhanSu" USING btree (email);


--
-- TOC entry 5236 (class 1259 OID 33909)
-- Name: PhanCongGiangDay_ma_lop_hoc_ma_giao_vien_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PhanCongGiangDay_ma_lop_hoc_ma_giao_vien_key" ON public."PhanCongGiangDay" USING btree (ma_lop_hoc, ma_giao_vien);


--
-- TOC entry 5154 (class 1259 OID 26175)
-- Name: PhanQuyen_ma_tai_khoan_ma_quyen_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PhanQuyen_ma_tai_khoan_ma_quyen_key" ON public."PhanQuyen" USING btree (ma_tai_khoan, ma_quyen);


--
-- TOC entry 5189 (class 1259 OID 26180)
-- Name: PhieuChi_ma_bang_luong_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PhieuChi_ma_bang_luong_key" ON public."PhieuChi" USING btree (ma_bang_luong);


--
-- TOC entry 5182 (class 1259 OID 33971)
-- Name: PhieuLuong_ma_phieu_cham_cong_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PhieuLuong_ma_phieu_cham_cong_key" ON public."PhieuLuong" USING btree (ma_phieu_cham_cong);


--
-- TOC entry 5202 (class 1259 OID 26181)
-- Name: PhongHoc_ten_phong_hoc_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PhongHoc_ten_phong_hoc_key" ON public."PhongHoc" USING btree (ten_phong_hoc);


--
-- TOC entry 5148 (class 1259 OID 26170)
-- Name: Quyen_ten_quyen_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Quyen_ten_quyen_key" ON public."Quyen" USING btree (ten_quyen);


--
-- TOC entry 5149 (class 1259 OID 26174)
-- Name: TaiKhoan_ma_giao_vien_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TaiKhoan_ma_giao_vien_key" ON public."TaiKhoan" USING btree (ma_giao_vien);


--
-- TOC entry 5150 (class 1259 OID 26173)
-- Name: TaiKhoan_ma_nhan_su_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TaiKhoan_ma_nhan_su_key" ON public."TaiKhoan" USING btree (ma_nhan_su);


--
-- TOC entry 5153 (class 1259 OID 26171)
-- Name: TaiKhoan_ten_dang_nhap_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TaiKhoan_ten_dang_nhap_key" ON public."TaiKhoan" USING btree (ten_dang_nhap);


--
-- TOC entry 5206 (class 1259 OID 26183)
-- Name: ThamGiaLop_ma_hoc_vien_ma_lop_hoc_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ThamGiaLop_ma_hoc_vien_ma_lop_hoc_key" ON public."ThamGiaLop" USING btree (ma_hoc_vien, ma_lop_hoc);


--
-- TOC entry 5223 (class 1259 OID 26184)
-- Name: ThamGiaNgoaiKhoa_ma_hoc_vien_ma_hoat_dong_ngoai_khoa_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ThamGiaNgoaiKhoa_ma_hoc_vien_ma_hoat_dong_ngoai_khoa_key" ON public."ThamGiaNgoaiKhoa" USING btree (ma_hoc_vien, ma_hoat_dong_ngoai_khoa);


--
-- TOC entry 5295 (class 2606 OID 26435)
-- Name: BaiKiemTra BaiKiemTra_ma_khoa_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BaiKiemTra"
    ADD CONSTRAINT "BaiKiemTra_ma_khoa_hoc_fkey" FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5284 (class 2606 OID 26380)
-- Name: BuoiHoc BuoiHoc_ma_giao_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BuoiHoc"
    ADD CONSTRAINT "BuoiHoc_ma_giao_vien_fkey" FOREIGN KEY (ma_giao_vien) REFERENCES public."GiaoVien"(ma_giao_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5285 (class 2606 OID 26385)
-- Name: BuoiHoc BuoiHoc_ma_lop_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BuoiHoc"
    ADD CONSTRAINT "BuoiHoc_ma_lop_hoc_fkey" FOREIGN KEY (ma_lop_hoc) REFERENCES public."LopHoc"(ma_lop_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5280 (class 2606 OID 26365)
-- Name: CamKet CamKet_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CamKet"
    ADD CONSTRAINT "CamKet_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5281 (class 2606 OID 26462)
-- Name: CamKet CamKet_ma_khoa_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CamKet"
    ADD CONSTRAINT "CamKet_ma_khoa_hoc_fkey" FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5256 (class 2606 OID 26260)
-- Name: ChiTietChamCong ChiTietChamCong_ma_giao_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChiTietChamCong"
    ADD CONSTRAINT "ChiTietChamCong_ma_giao_vien_fkey" FOREIGN KEY (ma_giao_vien) REFERENCES public."GiaoVien"(ma_giao_vien) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5257 (class 2606 OID 26255)
-- Name: ChiTietChamCong ChiTietChamCong_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChiTietChamCong"
    ADD CONSTRAINT "ChiTietChamCong_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5258 (class 2606 OID 33987)
-- Name: ChiTietChamCong ChiTietChamCong_ma_phieu_cham_cong_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChiTietChamCong"
    ADD CONSTRAINT "ChiTietChamCong_ma_phieu_cham_cong_fkey" FOREIGN KEY (ma_phieu_cham_cong) REFERENCES public."PhieuChamCong"(ma_phieu_cham_cong) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5288 (class 2606 OID 26400)
-- Name: ChuongTrinhMarketing ChuongTrinhMarketing_ma_khoa_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhMarketing"
    ADD CONSTRAINT "ChuongTrinhMarketing_ma_khoa_hoc_fkey" FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5274 (class 2606 OID 26330)
-- Name: CongNo CongNo_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CongNo"
    ADD CONSTRAINT "CongNo_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5286 (class 2606 OID 26390)
-- Name: DiemDanh DiemDanh_ma_buoi_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DiemDanh"
    ADD CONSTRAINT "DiemDanh_ma_buoi_hoc_fkey" FOREIGN KEY (ma_buoi_hoc) REFERENCES public."BuoiHoc"(ma_buoi_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5287 (class 2606 OID 26395)
-- Name: DiemDanh DiemDanh_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DiemDanh"
    ADD CONSTRAINT "DiemDanh_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5249 (class 2606 OID 26215)
-- Name: GiaoVien GiaoVien_ma_chuc_vu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GiaoVien"
    ADD CONSTRAINT "GiaoVien_ma_chuc_vu_fkey" FOREIGN KEY (ma_chuc_vu) REFERENCES public."ChucVu"(ma_chuc_vu) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5250 (class 2606 OID 26220)
-- Name: GiaoVien GiaoVien_ma_phong_ban_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GiaoVien"
    ADD CONSTRAINT "GiaoVien_ma_phong_ban_fkey" FOREIGN KEY (ma_phong_ban) REFERENCES public."PhongBan"(ma_phong_ban) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5251 (class 2606 OID 26235)
-- Name: HoSoBangCap HoSoBangCap_ma_bang_cap_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoSoBangCap"
    ADD CONSTRAINT "HoSoBangCap_ma_bang_cap_fkey" FOREIGN KEY (ma_bang_cap) REFERENCES public."BangCap"(ma_bang_cap) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5252 (class 2606 OID 26230)
-- Name: HoSoBangCap HoSoBangCap_ma_giao_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoSoBangCap"
    ADD CONSTRAINT "HoSoBangCap_ma_giao_vien_fkey" FOREIGN KEY (ma_giao_vien) REFERENCES public."GiaoVien"(ma_giao_vien) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5253 (class 2606 OID 26225)
-- Name: HoSoBangCap HoSoBangCap_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoSoBangCap"
    ADD CONSTRAINT "HoSoBangCap_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5254 (class 2606 OID 26245)
-- Name: HopDongLaoDong HopDongLaoDong_ma_giao_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HopDongLaoDong"
    ADD CONSTRAINT "HopDongLaoDong_ma_giao_vien_fkey" FOREIGN KEY (ma_giao_vien) REFERENCES public."GiaoVien"(ma_giao_vien) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5255 (class 2606 OID 26240)
-- Name: HopDongLaoDong HopDongLaoDong_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HopDongLaoDong"
    ADD CONSTRAINT "HopDongLaoDong_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5282 (class 2606 OID 26370)
-- Name: KeHoachGiangDay KeHoachGiangDay_ma_giao_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KeHoachGiangDay"
    ADD CONSTRAINT "KeHoachGiangDay_ma_giao_vien_fkey" FOREIGN KEY (ma_giao_vien) REFERENCES public."GiaoVien"(ma_giao_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5283 (class 2606 OID 26375)
-- Name: KeHoachGiangDay KeHoachGiangDay_ma_khoa_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KeHoachGiangDay"
    ADD CONSTRAINT "KeHoachGiangDay_ma_khoa_hoc_fkey" FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5296 (class 2606 OID 26440)
-- Name: KetQuaKiemTra KetQuaKiemTra_ma_bai_kiem_tra_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KetQuaKiemTra"
    ADD CONSTRAINT "KetQuaKiemTra_ma_bai_kiem_tra_fkey" FOREIGN KEY (ma_bai_kiem_tra) REFERENCES public."BaiKiemTra"(ma_bai_kiem_tra) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5297 (class 2606 OID 26445)
-- Name: KetQuaKiemTra KetQuaKiemTra_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KetQuaKiemTra"
    ADD CONSTRAINT "KetQuaKiemTra_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5275 (class 2606 OID 26335)
-- Name: KhoaHoc KhoaHoc_ma_chuong_trinh_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KhoaHoc"
    ADD CONSTRAINT "KhoaHoc_ma_chuong_trinh_fkey" FOREIGN KEY (ma_chuong_trinh) REFERENCES public."ChuongTrinhHoc"(ma_chuong_trinh) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5276 (class 2606 OID 26345)
-- Name: LopHoc LopHoc_ma_khoa_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LopHoc"
    ADD CONSTRAINT "LopHoc_ma_khoa_hoc_fkey" FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5277 (class 2606 OID 26340)
-- Name: LopHoc LopHoc_ma_phong_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LopHoc"
    ADD CONSTRAINT "LopHoc_ma_phong_hoc_fkey" FOREIGN KEY (ma_phong_hoc) REFERENCES public."PhongHoc"(ma_phong_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5247 (class 2606 OID 26205)
-- Name: NhanSu NhanSu_ma_chuc_vu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NhanSu"
    ADD CONSTRAINT "NhanSu_ma_chuc_vu_fkey" FOREIGN KEY (ma_chuc_vu) REFERENCES public."ChucVu"(ma_chuc_vu) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5248 (class 2606 OID 26210)
-- Name: NhanSu NhanSu_ma_phong_ban_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NhanSu"
    ADD CONSTRAINT "NhanSu_ma_phong_ban_fkey" FOREIGN KEY (ma_phong_ban) REFERENCES public."PhongBan"(ma_phong_ban) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5298 (class 2606 OID 26455)
-- Name: NhanXet NhanXet_ma_buoi_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NhanXet"
    ADD CONSTRAINT "NhanXet_ma_buoi_hoc_fkey" FOREIGN KEY (ma_buoi_hoc) REFERENCES public."BuoiHoc"(ma_buoi_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5299 (class 2606 OID 26450)
-- Name: NhanXet NhanXet_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NhanXet"
    ADD CONSTRAINT "NhanXet_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5300 (class 2606 OID 33915)
-- Name: PhanCongGiangDay PhanCongGiangDay_ma_giao_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongGiangDay"
    ADD CONSTRAINT "PhanCongGiangDay_ma_giao_vien_fkey" FOREIGN KEY (ma_giao_vien) REFERENCES public."GiaoVien"(ma_giao_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5301 (class 2606 OID 33910)
-- Name: PhanCongGiangDay PhanCongGiangDay_ma_lop_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongGiangDay"
    ADD CONSTRAINT "PhanCongGiangDay_ma_lop_hoc_fkey" FOREIGN KEY (ma_lop_hoc) REFERENCES public."LopHoc"(ma_lop_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5293 (class 2606 OID 26430)
-- Name: PhanCongHoatDong PhanCongHoatDong_ma_giao_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongHoatDong"
    ADD CONSTRAINT "PhanCongHoatDong_ma_giao_vien_fkey" FOREIGN KEY (ma_giao_vien) REFERENCES public."GiaoVien"(ma_giao_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5294 (class 2606 OID 26425)
-- Name: PhanCongHoatDong PhanCongHoatDong_ma_hoat_dong_ngoai_khoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongHoatDong"
    ADD CONSTRAINT "PhanCongHoatDong_ma_hoat_dong_ngoai_khoa_fkey" FOREIGN KEY (ma_hoat_dong_ngoai_khoa) REFERENCES public."HoatDongNgoaiKhoa"(ma_hoat_dong_ngoai_khoa) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5289 (class 2606 OID 26405)
-- Name: PhanCongMarketing PhanCongMarketing_ma_chuong_trinh_marketing_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongMarketing"
    ADD CONSTRAINT "PhanCongMarketing_ma_chuong_trinh_marketing_fkey" FOREIGN KEY (ma_chuong_trinh_marketing) REFERENCES public."ChuongTrinhMarketing"(ma_chuong_trinh_marketing) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5290 (class 2606 OID 26410)
-- Name: PhanCongMarketing PhanCongMarketing_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongMarketing"
    ADD CONSTRAINT "PhanCongMarketing_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5245 (class 2606 OID 26200)
-- Name: PhanQuyen PhanQuyen_ma_quyen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanQuyen"
    ADD CONSTRAINT "PhanQuyen_ma_quyen_fkey" FOREIGN KEY (ma_quyen) REFERENCES public."Quyen"(ma_quyen) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5246 (class 2606 OID 26195)
-- Name: PhanQuyen PhanQuyen_ma_tai_khoan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanQuyen"
    ADD CONSTRAINT "PhanQuyen_ma_tai_khoan_fkey" FOREIGN KEY (ma_tai_khoan) REFERENCES public."TaiKhoan"(ma_tai_khoan) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5302 (class 2606 OID 33972)
-- Name: PhieuChamCong PhieuChamCong_ma_bang_cham_cong_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChamCong"
    ADD CONSTRAINT "PhieuChamCong_ma_bang_cham_cong_fkey" FOREIGN KEY (ma_bang_cham_cong) REFERENCES public."BangChamCong"(ma_bang_cham_cong) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5303 (class 2606 OID 33982)
-- Name: PhieuChamCong PhieuChamCong_ma_giao_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChamCong"
    ADD CONSTRAINT "PhieuChamCong_ma_giao_vien_fkey" FOREIGN KEY (ma_giao_vien) REFERENCES public."GiaoVien"(ma_giao_vien) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5304 (class 2606 OID 33977)
-- Name: PhieuChamCong PhieuChamCong_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChamCong"
    ADD CONSTRAINT "PhieuChamCong_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5271 (class 2606 OID 26320)
-- Name: PhieuChi PhieuChi_ma_bang_luong_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChi"
    ADD CONSTRAINT "PhieuChi_ma_bang_luong_fkey" FOREIGN KEY (ma_bang_luong) REFERENCES public."BangLuong"(ma_bang_luong) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5272 (class 2606 OID 26325)
-- Name: PhieuChi PhieuChi_ma_chuong_trinh_marketing_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChi"
    ADD CONSTRAINT "PhieuChi_ma_chuong_trinh_marketing_fkey" FOREIGN KEY (ma_chuong_trinh_marketing) REFERENCES public."ChuongTrinhMarketing"(ma_chuong_trinh_marketing) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5273 (class 2606 OID 26315)
-- Name: PhieuChi PhieuChi_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChi"
    ADD CONSTRAINT "PhieuChi_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5259 (class 2606 OID 26275)
-- Name: PhieuLuong PhieuLuong_ma_bang_luong_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuLuong"
    ADD CONSTRAINT "PhieuLuong_ma_bang_luong_fkey" FOREIGN KEY (ma_bang_luong) REFERENCES public."BangLuong"(ma_bang_luong) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5260 (class 2606 OID 26270)
-- Name: PhieuLuong PhieuLuong_ma_giao_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuLuong"
    ADD CONSTRAINT "PhieuLuong_ma_giao_vien_fkey" FOREIGN KEY (ma_giao_vien) REFERENCES public."GiaoVien"(ma_giao_vien) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5261 (class 2606 OID 26265)
-- Name: PhieuLuong PhieuLuong_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuLuong"
    ADD CONSTRAINT "PhieuLuong_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5262 (class 2606 OID 33992)
-- Name: PhieuLuong PhieuLuong_ma_phieu_cham_cong_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuLuong"
    ADD CONSTRAINT "PhieuLuong_ma_phieu_cham_cong_fkey" FOREIGN KEY (ma_phieu_cham_cong) REFERENCES public."PhieuChamCong"(ma_phieu_cham_cong) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5267 (class 2606 OID 26295)
-- Name: PhieuThu PhieuThu_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5268 (class 2606 OID 26310)
-- Name: PhieuThu PhieuThu_ma_khoa_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_ma_khoa_hoc_fkey" FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5269 (class 2606 OID 26305)
-- Name: PhieuThu PhieuThu_ma_khuyen_mai_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_ma_khuyen_mai_fkey" FOREIGN KEY (ma_khuyen_mai) REFERENCES public."ChuongTrinhKhuyenMai"(ma_khuyen_mai) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5270 (class 2606 OID 26300)
-- Name: PhieuThu PhieuThu_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5263 (class 2606 OID 34012)
-- Name: PhieuThuong PhieuThuong_ma_bang_thuong_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThuong"
    ADD CONSTRAINT "PhieuThuong_ma_bang_thuong_fkey" FOREIGN KEY (ma_bang_thuong) REFERENCES public."BangThuong"(ma_bang_thuong) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5264 (class 2606 OID 34017)
-- Name: PhieuThuong PhieuThuong_ma_giao_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThuong"
    ADD CONSTRAINT "PhieuThuong_ma_giao_vien_fkey" FOREIGN KEY (ma_giao_vien) REFERENCES public."GiaoVien"(ma_giao_vien) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5265 (class 2606 OID 26285)
-- Name: PhieuThuong PhieuThuong_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThuong"
    ADD CONSTRAINT "PhieuThuong_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5266 (class 2606 OID 26290)
-- Name: PhieuThuong PhieuThuong_ma_phieu_luong_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThuong"
    ADD CONSTRAINT "PhieuThuong_ma_phieu_luong_fkey" FOREIGN KEY (ma_phieu_luong) REFERENCES public."PhieuLuong"(ma_phieu_luong) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5243 (class 2606 OID 26190)
-- Name: TaiKhoan TaiKhoan_ma_giao_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TaiKhoan"
    ADD CONSTRAINT "TaiKhoan_ma_giao_vien_fkey" FOREIGN KEY (ma_giao_vien) REFERENCES public."GiaoVien"(ma_giao_vien) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5244 (class 2606 OID 26185)
-- Name: TaiKhoan TaiKhoan_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TaiKhoan"
    ADD CONSTRAINT "TaiKhoan_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5278 (class 2606 OID 26355)
-- Name: ThamGiaLop ThamGiaLop_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaLop"
    ADD CONSTRAINT "ThamGiaLop_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5279 (class 2606 OID 26360)
-- Name: ThamGiaLop ThamGiaLop_ma_lop_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaLop"
    ADD CONSTRAINT "ThamGiaLop_ma_lop_hoc_fkey" FOREIGN KEY (ma_lop_hoc) REFERENCES public."LopHoc"(ma_lop_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5291 (class 2606 OID 26420)
-- Name: ThamGiaNgoaiKhoa ThamGiaNgoaiKhoa_ma_hoat_dong_ngoai_khoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaNgoaiKhoa"
    ADD CONSTRAINT "ThamGiaNgoaiKhoa_ma_hoat_dong_ngoai_khoa_fkey" FOREIGN KEY (ma_hoat_dong_ngoai_khoa) REFERENCES public."HoatDongNgoaiKhoa"(ma_hoat_dong_ngoai_khoa) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5292 (class 2606 OID 26415)
-- Name: ThamGiaNgoaiKhoa ThamGiaNgoaiKhoa_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaNgoaiKhoa"
    ADD CONSTRAINT "ThamGiaNgoaiKhoa_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-05-17 16:44:38

--
-- PostgreSQL database dump complete
--

\unrestrict 2ackOkLBxEy9uB2bE15XxWZ1q1qWMhEb3QWhuNIP50fzLlqg0lkPxqihKpkZJXO


--
-- PostgreSQL database dump
--

\restrict ZcatKnaAKGfWu9h7m8xmYkPs9YPnBnQys7X0YXZDIkfl6uab0ZAwIcXavpTIvRv

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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

DROP DATABASE hp_english_homestay;
--
-- Name: hp_english_homestay; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE hp_english_homestay WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


\unrestrict ZcatKnaAKGfWu9h7m8xmYkPs9YPnBnQys7X0YXZDIkfl6uab0ZAwIcXavpTIvRv
\connect hp_english_homestay
\restrict ZcatKnaAKGfWu9h7m8xmYkPs9YPnBnQys7X0YXZDIkfl6uab0ZAwIcXavpTIvRv

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: BangCap; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BangCap" (
    ma_bang_cap integer NOT NULL,
    ten_bang_cap text NOT NULL
);


--
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
-- Name: BangCap_ma_bang_cap_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."BangCap_ma_bang_cap_seq" OWNED BY public."BangCap".ma_bang_cap;


--
-- Name: BangLuong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BangLuong" (
    ma_bang_luong integer NOT NULL,
    ky_luong text NOT NULL,
    ghi_chu text
);


--
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
-- Name: BangLuong_ma_bang_luong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."BangLuong_ma_bang_luong_seq" OWNED BY public."BangLuong".ma_bang_luong;


--
-- Name: CamKet; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CamKet" (
    ma_cam_ket integer NOT NULL,
    ngay_ky timestamp(3) without time zone NOT NULL,
    ngay_het_han timestamp(3) without time zone,
    noi_dung_cam_ket text,
    trang_thai text,
    ma_hoc_vien integer NOT NULL
);


--
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
-- Name: CamKet_ma_cam_ket_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."CamKet_ma_cam_ket_seq" OWNED BY public."CamKet".ma_cam_ket;


--
-- Name: ChuongTrinhHoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ChuongTrinhHoc" (
    ma_chuong_trinh integer NOT NULL,
    ten_chuong_trinh text NOT NULL,
    mo_ta text,
    muc_tieu text
);


--
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
-- Name: ChuongTrinhHoc_ma_chuong_trinh_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ChuongTrinhHoc_ma_chuong_trinh_seq" OWNED BY public."ChuongTrinhHoc".ma_chuong_trinh;


--
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
-- Name: ChuongTrinhKhuyenMai_ma_khuyen_mai_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq" OWNED BY public."ChuongTrinhKhuyenMai".ma_khuyen_mai;


--
-- Name: ChuongTrinhMarketing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ChuongTrinhMarketing" (
    ma_chuong_trinh_marketing integer NOT NULL,
    ten_chuong_trinh_marketing character varying(255) NOT NULL,
    ma_khoa_hoc integer,
    noi_dung text,
    ngay_bat_dau date,
    ngay_ket_thuc date,
    ngan_sach numeric(15,2)
);


--
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
-- Name: ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq" OWNED BY public."ChuongTrinhMarketing".ma_chuong_trinh_marketing;


--
-- Name: CongNo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CongNo" (
    ma_cong_no integer NOT NULL,
    so_tien_no numeric(65,30) NOT NULL,
    ngay_phat_sinh timestamp(3) without time zone NOT NULL,
    han_thanh_toan timestamp(3) without time zone,
    trang_thai text,
    ma_hoc_vien integer NOT NULL
);


--
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
-- Name: CongNo_ma_cong_no_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."CongNo_ma_cong_no_seq" OWNED BY public."CongNo".ma_cong_no;


--
-- Name: HoSoBangCap; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HoSoBangCap" (
    ma_ho_so_bang_cap integer NOT NULL,
    ma_nhan_su integer NOT NULL,
    ma_bang_cap integer NOT NULL,
    ngay_cap timestamp(3) without time zone,
    noi_cap text
);


--
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
-- Name: HoSoBangCap_ma_ho_so_bang_cap_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."HoSoBangCap_ma_ho_so_bang_cap_seq" OWNED BY public."HoSoBangCap".ma_ho_so_bang_cap;


--
-- Name: HoatDongNgoaiKhoa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HoatDongNgoaiKhoa" (
    ma_hoat_dong_ngoai_khoa integer NOT NULL,
    ten_hoat_dong text NOT NULL,
    mo_ta text,
    ngay_to_chuc timestamp(3) without time zone NOT NULL,
    dia_diem text,
    chi_phi numeric(65,30)
);


--
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
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq" OWNED BY public."HoatDongNgoaiKhoa".ma_hoat_dong_ngoai_khoa;


--
-- Name: HocVien; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HocVien" (
    ma_hoc_vien integer NOT NULL,
    ho_ten text NOT NULL,
    ngay_sinh timestamp(3) without time zone,
    gioi_tinh text,
    so_dien_thoai text,
    email text,
    dia_chi text
);


--
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
-- Name: HocVien_ma_hoc_vien_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."HocVien_ma_hoc_vien_seq" OWNED BY public."HocVien".ma_hoc_vien;


--
-- Name: HopDongLaoDong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HopDongLaoDong" (
    ma_hop_dong integer NOT NULL,
    so_hop_dong text NOT NULL,
    ngay_ky timestamp(3) without time zone,
    ten_cong_viec text,
    tg_thu_viec text,
    tg_nghi text,
    ma_nhan_su integer NOT NULL,
    update_at timestamp(3) without time zone NOT NULL
);


--
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
-- Name: HopDongLaoDong_ma_hop_dong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."HopDongLaoDong_ma_hop_dong_seq" OWNED BY public."HopDongLaoDong".ma_hop_dong;


--
-- Name: KeHoachGiangDay; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."KeHoachGiangDay" (
    ma_ke_hoach integer NOT NULL,
    noi_dung text,
    lich_day text,
    thoi_gian text,
    ma_khoa_hoc integer NOT NULL,
    ma_nhan_su integer NOT NULL
);


--
-- Name: KeHoachGiangDay_ma_ke_hoach_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."KeHoachGiangDay_ma_ke_hoach_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: KeHoachGiangDay_ma_ke_hoach_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."KeHoachGiangDay_ma_ke_hoach_seq" OWNED BY public."KeHoachGiangDay".ma_ke_hoach;


--
-- Name: KhoaHoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."KhoaHoc" (
    ma_khoa_hoc integer NOT NULL,
    ten_khoa_hoc text NOT NULL,
    mo_ta text,
    thoi_luong text,
    hoc_phi numeric(65,30) NOT NULL,
    trinh_do text,
    ma_chuong_trinh integer NOT NULL,
    trang_thai character varying(50) DEFAULT 'Hoạt động'::character varying
);


--
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
-- Name: KhoaHoc_ma_khoa_hoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."KhoaHoc_ma_khoa_hoc_seq" OWNED BY public."KhoaHoc".ma_khoa_hoc;


--
-- Name: LopHoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LopHoc" (
    ma_lop_hoc integer NOT NULL,
    ten_lop text NOT NULL,
    ma_nhan_su integer NOT NULL,
    si_so_toi_da integer,
    ngay_khai_giang timestamp(3) without time zone,
    ngay_ket_thuc timestamp(3) without time zone,
    ma_phong_hoc integer NOT NULL,
    ma_khoa_hoc integer NOT NULL
);


--
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
-- Name: LopHoc_ma_lop_hoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."LopHoc_ma_lop_hoc_seq" OWNED BY public."LopHoc".ma_lop_hoc;


--
-- Name: NhanSu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."NhanSu" (
    ma_nhan_su integer NOT NULL,
    ho_ten text NOT NULL,
    ngay_sinh timestamp(3) without time zone,
    gioi_tinh text,
    so_dien_thoai text,
    dia_chi text,
    chuc_vu text,
    ma_phong_ban integer NOT NULL
);


--
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
-- Name: NhanSu_ma_nhan_su_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."NhanSu_ma_nhan_su_seq" OWNED BY public."NhanSu".ma_nhan_su;


--
-- Name: PhanCongHoatDong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhanCongHoatDong" (
    ma_phan_cong integer NOT NULL,
    ma_nhan_su integer NOT NULL,
    ma_hoat_dong_ngoai_khoa integer NOT NULL
);


--
-- Name: PhanCongHoatDong_ma_phan_cong_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhanCongHoatDong_ma_phan_cong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: PhanCongHoatDong_ma_phan_cong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhanCongHoatDong_ma_phan_cong_seq" OWNED BY public."PhanCongHoatDong".ma_phan_cong;


--
-- Name: PhanCongMarketing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhanCongMarketing" (
    ma_phan_cong_marketing integer NOT NULL,
    ma_chuong_trinh_marketing integer NOT NULL,
    ma_nhan_su integer NOT NULL,
    vai_tro character varying(255)
);


--
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
-- Name: PhanCongMarketing_ma_phan_cong_marketing_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhanCongMarketing_ma_phan_cong_marketing_seq" OWNED BY public."PhanCongMarketing".ma_phan_cong_marketing;


--
-- Name: PhanQuyen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhanQuyen" (
    ma_phan_quyen integer NOT NULL,
    ma_tai_khoan integer NOT NULL,
    ma_quyen integer NOT NULL
);


--
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
-- Name: PhanQuyen_ma_phan_quyen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhanQuyen_ma_phan_quyen_seq" OWNED BY public."PhanQuyen".ma_phan_quyen;


--
-- Name: PhieuChi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhieuChi" (
    ma_phieu_chi integer NOT NULL,
    so_tien numeric(65,30) NOT NULL,
    ngay_chi timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    noi_dung text,
    ma_nhan_su integer NOT NULL
);


--
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
-- Name: PhieuChi_ma_phieu_chi_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhieuChi_ma_phieu_chi_seq" OWNED BY public."PhieuChi".ma_phieu_chi;


--
-- Name: PhieuLuong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhieuLuong" (
    ma_phieu_luong integer NOT NULL,
    ma_nhan_su integer NOT NULL,
    ky_luong text NOT NULL,
    luong_co_ban numeric(65,30) NOT NULL,
    so_cong_thuc_te double precision,
    ma_bang_luong integer NOT NULL,
    tang_ca numeric(65,30) DEFAULT 0,
    phu_cap numeric(65,30) DEFAULT 0,
    tong_thuong numeric(65,30) DEFAULT 0,
    thu_nhap_khac numeric(65,30) DEFAULT 0,
    ung_luong numeric(65,30) DEFAULT 0,
    khau_tru_khac numeric(65,30) DEFAULT 0,
    thuc_linh numeric(65,30) NOT NULL,
    ghi_chu text,
    trang_thai text
);


--
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
-- Name: PhieuLuong_ma_phieu_luong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhieuLuong_ma_phieu_luong_seq" OWNED BY public."PhieuLuong".ma_phieu_luong;


--
-- Name: PhieuThu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhieuThu" (
    ma_phieu_thu integer NOT NULL,
    so_tien numeric(65,30) NOT NULL,
    ngay_thu timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    noi_dung text,
    ma_hoc_vien integer NOT NULL,
    ma_nhan_su integer NOT NULL,
    ma_khuyen_mai integer,
    ma_cam_ket integer
);


--
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
-- Name: PhieuThu_ma_phieu_thu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhieuThu_ma_phieu_thu_seq" OWNED BY public."PhieuThu".ma_phieu_thu;


--
-- Name: PhieuThuong; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhieuThuong" (
    ma_phieu_thuong integer NOT NULL,
    ten_khoan_thuong text NOT NULL,
    so_tien numeric(65,30) NOT NULL,
    ngay_quyet_dinh timestamp(3) without time zone NOT NULL,
    ly_do text,
    trang_thai text,
    ma_nhan_su integer NOT NULL
);


--
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
-- Name: PhieuThuong_ma_phieu_thuong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhieuThuong_ma_phieu_thuong_seq" OWNED BY public."PhieuThuong".ma_phieu_thuong;


--
-- Name: PhongBan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhongBan" (
    ma_phong_ban integer NOT NULL,
    ten_phong_ban text NOT NULL,
    mo_ta text,
    ngay_thanh_lap timestamp(3) without time zone
);


--
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
-- Name: PhongBan_ma_phong_ban_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhongBan_ma_phong_ban_seq" OWNED BY public."PhongBan".ma_phong_ban;


--
-- Name: PhongHoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhongHoc" (
    ma_phong_hoc integer NOT NULL,
    ten_phong_hoc text NOT NULL,
    suc_chua integer
);


--
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
-- Name: PhongHoc_ma_phong_hoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhongHoc_ma_phong_hoc_seq" OWNED BY public."PhongHoc".ma_phong_hoc;


--
-- Name: Quyen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Quyen" (
    ma_quyen integer NOT NULL,
    ten_quyen text NOT NULL,
    trang_thai text
);


--
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
-- Name: Quyen_ma_quyen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Quyen_ma_quyen_seq" OWNED BY public."Quyen".ma_quyen;


--
-- Name: TaiKhoan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TaiKhoan" (
    ma_tai_khoan integer NOT NULL,
    ten_dang_nhap text NOT NULL,
    mat_khau text NOT NULL,
    email text NOT NULL,
    trang_thai text,
    ma_nhan_su integer NOT NULL
);


--
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
-- Name: TaiKhoan_ma_tai_khoan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."TaiKhoan_ma_tai_khoan_seq" OWNED BY public."TaiKhoan".ma_tai_khoan;


--
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
-- Name: ThamGiaLop_ma_tham_gia_lop_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ThamGiaLop_ma_tham_gia_lop_seq" OWNED BY public."ThamGiaLop".ma_tham_gia_lop;


--
-- Name: ThamGiaNgoaiKhoa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ThamGiaNgoaiKhoa" (
    ma_tham_gia_ngoai_khoa integer NOT NULL,
    ma_hoc_vien integer NOT NULL,
    ma_hoat_dong_ngoai_khoa integer NOT NULL
);


--
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
-- Name: ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq" OWNED BY public."ThamGiaNgoaiKhoa".ma_tham_gia_ngoai_khoa;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: BangCap ma_bang_cap; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BangCap" ALTER COLUMN ma_bang_cap SET DEFAULT nextval('public."BangCap_ma_bang_cap_seq"'::regclass);


--
-- Name: BangLuong ma_bang_luong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BangLuong" ALTER COLUMN ma_bang_luong SET DEFAULT nextval('public."BangLuong_ma_bang_luong_seq"'::regclass);


--
-- Name: CamKet ma_cam_ket; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CamKet" ALTER COLUMN ma_cam_ket SET DEFAULT nextval('public."CamKet_ma_cam_ket_seq"'::regclass);


--
-- Name: ChuongTrinhHoc ma_chuong_trinh; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhHoc" ALTER COLUMN ma_chuong_trinh SET DEFAULT nextval('public."ChuongTrinhHoc_ma_chuong_trinh_seq"'::regclass);


--
-- Name: ChuongTrinhKhuyenMai ma_khuyen_mai; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhKhuyenMai" ALTER COLUMN ma_khuyen_mai SET DEFAULT nextval('public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"'::regclass);


--
-- Name: ChuongTrinhMarketing ma_chuong_trinh_marketing; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhMarketing" ALTER COLUMN ma_chuong_trinh_marketing SET DEFAULT nextval('public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq"'::regclass);


--
-- Name: CongNo ma_cong_no; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CongNo" ALTER COLUMN ma_cong_no SET DEFAULT nextval('public."CongNo_ma_cong_no_seq"'::regclass);


--
-- Name: HoSoBangCap ma_ho_so_bang_cap; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoSoBangCap" ALTER COLUMN ma_ho_so_bang_cap SET DEFAULT nextval('public."HoSoBangCap_ma_ho_so_bang_cap_seq"'::regclass);


--
-- Name: HoatDongNgoaiKhoa ma_hoat_dong_ngoai_khoa; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoatDongNgoaiKhoa" ALTER COLUMN ma_hoat_dong_ngoai_khoa SET DEFAULT nextval('public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq"'::regclass);


--
-- Name: HocVien ma_hoc_vien; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HocVien" ALTER COLUMN ma_hoc_vien SET DEFAULT nextval('public."HocVien_ma_hoc_vien_seq"'::regclass);


--
-- Name: HopDongLaoDong ma_hop_dong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HopDongLaoDong" ALTER COLUMN ma_hop_dong SET DEFAULT nextval('public."HopDongLaoDong_ma_hop_dong_seq"'::regclass);


--
-- Name: KeHoachGiangDay ma_ke_hoach; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KeHoachGiangDay" ALTER COLUMN ma_ke_hoach SET DEFAULT nextval('public."KeHoachGiangDay_ma_ke_hoach_seq"'::regclass);


--
-- Name: KhoaHoc ma_khoa_hoc; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KhoaHoc" ALTER COLUMN ma_khoa_hoc SET DEFAULT nextval('public."KhoaHoc_ma_khoa_hoc_seq"'::regclass);


--
-- Name: LopHoc ma_lop_hoc; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LopHoc" ALTER COLUMN ma_lop_hoc SET DEFAULT nextval('public."LopHoc_ma_lop_hoc_seq"'::regclass);


--
-- Name: NhanSu ma_nhan_su; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NhanSu" ALTER COLUMN ma_nhan_su SET DEFAULT nextval('public."NhanSu_ma_nhan_su_seq"'::regclass);


--
-- Name: PhanCongHoatDong ma_phan_cong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongHoatDong" ALTER COLUMN ma_phan_cong SET DEFAULT nextval('public."PhanCongHoatDong_ma_phan_cong_seq"'::regclass);


--
-- Name: PhanCongMarketing ma_phan_cong_marketing; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongMarketing" ALTER COLUMN ma_phan_cong_marketing SET DEFAULT nextval('public."PhanCongMarketing_ma_phan_cong_marketing_seq"'::regclass);


--
-- Name: PhanQuyen ma_phan_quyen; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanQuyen" ALTER COLUMN ma_phan_quyen SET DEFAULT nextval('public."PhanQuyen_ma_phan_quyen_seq"'::regclass);


--
-- Name: PhieuChi ma_phieu_chi; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChi" ALTER COLUMN ma_phieu_chi SET DEFAULT nextval('public."PhieuChi_ma_phieu_chi_seq"'::regclass);


--
-- Name: PhieuLuong ma_phieu_luong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuLuong" ALTER COLUMN ma_phieu_luong SET DEFAULT nextval('public."PhieuLuong_ma_phieu_luong_seq"'::regclass);


--
-- Name: PhieuThu ma_phieu_thu; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThu" ALTER COLUMN ma_phieu_thu SET DEFAULT nextval('public."PhieuThu_ma_phieu_thu_seq"'::regclass);


--
-- Name: PhieuThuong ma_phieu_thuong; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThuong" ALTER COLUMN ma_phieu_thuong SET DEFAULT nextval('public."PhieuThuong_ma_phieu_thuong_seq"'::regclass);


--
-- Name: PhongBan ma_phong_ban; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhongBan" ALTER COLUMN ma_phong_ban SET DEFAULT nextval('public."PhongBan_ma_phong_ban_seq"'::regclass);


--
-- Name: PhongHoc ma_phong_hoc; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhongHoc" ALTER COLUMN ma_phong_hoc SET DEFAULT nextval('public."PhongHoc_ma_phong_hoc_seq"'::regclass);


--
-- Name: Quyen ma_quyen; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quyen" ALTER COLUMN ma_quyen SET DEFAULT nextval('public."Quyen_ma_quyen_seq"'::regclass);


--
-- Name: TaiKhoan ma_tai_khoan; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TaiKhoan" ALTER COLUMN ma_tai_khoan SET DEFAULT nextval('public."TaiKhoan_ma_tai_khoan_seq"'::regclass);


--
-- Name: ThamGiaLop ma_tham_gia_lop; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaLop" ALTER COLUMN ma_tham_gia_lop SET DEFAULT nextval('public."ThamGiaLop_ma_tham_gia_lop_seq"'::regclass);


--
-- Name: ThamGiaNgoaiKhoa ma_tham_gia_ngoai_khoa; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaNgoaiKhoa" ALTER COLUMN ma_tham_gia_ngoai_khoa SET DEFAULT nextval('public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq"'::regclass);


--
-- Data for Name: BangCap; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: BangLuong; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: CamKet; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: ChuongTrinhHoc; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: ChuongTrinhKhuyenMai; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: ChuongTrinhMarketing; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: CongNo; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: HoSoBangCap; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: HoatDongNgoaiKhoa; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: HocVien; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi) VALUES (1, 'Trần Thị Thu Hà', '2005-05-20 00:00:00', NULL, '0912345678', 'thuha@gmail.com', NULL);
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi) VALUES (2, 'Lê Văn Nam', '2004-10-15 00:00:00', NULL, '0988776655', 'vannam.le@gmail.com', NULL);


--
-- Data for Name: HopDongLaoDong; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: KeHoachGiangDay; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: KhoaHoc; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: LopHoc; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: NhanSu; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, chuc_vu, ma_phong_ban) VALUES (1, 'Nguyễn Văn Trường', NULL, NULL, '0987654321', NULL, 'Quản trị viên', 1);


--
-- Data for Name: PhanCongHoatDong; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: PhanCongMarketing; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: PhanQuyen; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (1, 1, 1);


--
-- Data for Name: PhieuChi; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: PhieuLuong; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: PhieuThu; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (2, 2000000.000000000000000000000000000000, '2026-04-10 23:32:08.962', 'Học phí khóa Giao tiếp cấp tốc', 2, 1, NULL, NULL);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (1, 1500000.000000000000000000000000000000, '2026-04-10 00:00:00', 'Thu học phí khóa IELTS cơ bản - Tháng 04/2026', 1, 1, NULL, NULL);


--
-- Data for Name: PhieuThuong; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: PhongBan; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (1, 'Ban Quản Trị', 'Điều hành toàn bộ hệ thống HP English Homestay', '2026-04-10 22:47:10.979');


--
-- Data for Name: PhongHoc; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Quyen; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (1, 'ADMIN', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (2, 'GIAO_VIEN', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (3, 'NHAN_VIEN', 'Hoạt động');


--
-- Data for Name: TaiKhoan; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, email, trang_thai, ma_nhan_su) VALUES (1, 'admin', '123456', 'admin@hp-homestay.edu.vn', 'Hoạt động', 1);


--
-- Data for Name: ThamGiaLop; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: ThamGiaNgoaiKhoa; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: BangCap_ma_bang_cap_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BangCap_ma_bang_cap_seq"', 1, false);


--
-- Name: BangLuong_ma_bang_luong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BangLuong_ma_bang_luong_seq"', 1, false);


--
-- Name: CamKet_ma_cam_ket_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."CamKet_ma_cam_ket_seq"', 1, false);


--
-- Name: ChuongTrinhHoc_ma_chuong_trinh_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ChuongTrinhHoc_ma_chuong_trinh_seq"', 1, false);


--
-- Name: ChuongTrinhKhuyenMai_ma_khuyen_mai_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"', 1, false);


--
-- Name: ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq"', 1, false);


--
-- Name: CongNo_ma_cong_no_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."CongNo_ma_cong_no_seq"', 1, false);


--
-- Name: HoSoBangCap_ma_ho_so_bang_cap_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HoSoBangCap_ma_ho_so_bang_cap_seq"', 1, false);


--
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq"', 1, false);


--
-- Name: HocVien_ma_hoc_vien_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HocVien_ma_hoc_vien_seq"', 2, true);


--
-- Name: HopDongLaoDong_ma_hop_dong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HopDongLaoDong_ma_hop_dong_seq"', 1, false);


--
-- Name: KeHoachGiangDay_ma_ke_hoach_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."KeHoachGiangDay_ma_ke_hoach_seq"', 1, false);


--
-- Name: KhoaHoc_ma_khoa_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."KhoaHoc_ma_khoa_hoc_seq"', 1, false);


--
-- Name: LopHoc_ma_lop_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."LopHoc_ma_lop_hoc_seq"', 1, false);


--
-- Name: NhanSu_ma_nhan_su_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."NhanSu_ma_nhan_su_seq"', 1, true);


--
-- Name: PhanCongHoatDong_ma_phan_cong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhanCongHoatDong_ma_phan_cong_seq"', 1, false);


--
-- Name: PhanCongMarketing_ma_phan_cong_marketing_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhanCongMarketing_ma_phan_cong_marketing_seq"', 1, false);


--
-- Name: PhanQuyen_ma_phan_quyen_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhanQuyen_ma_phan_quyen_seq"', 1, true);


--
-- Name: PhieuChi_ma_phieu_chi_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuChi_ma_phieu_chi_seq"', 1, false);


--
-- Name: PhieuLuong_ma_phieu_luong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuLuong_ma_phieu_luong_seq"', 1, false);


--
-- Name: PhieuThu_ma_phieu_thu_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuThu_ma_phieu_thu_seq"', 2, true);


--
-- Name: PhieuThuong_ma_phieu_thuong_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhieuThuong_ma_phieu_thuong_seq"', 1, false);


--
-- Name: PhongBan_ma_phong_ban_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhongBan_ma_phong_ban_seq"', 1, true);


--
-- Name: PhongHoc_ma_phong_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhongHoc_ma_phong_hoc_seq"', 1, false);


--
-- Name: Quyen_ma_quyen_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Quyen_ma_quyen_seq"', 3, true);


--
-- Name: TaiKhoan_ma_tai_khoan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."TaiKhoan_ma_tai_khoan_seq"', 1, true);


--
-- Name: ThamGiaLop_ma_tham_gia_lop_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ThamGiaLop_ma_tham_gia_lop_seq"', 1, false);


--
-- Name: ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq"', 1, false);


--
-- Name: BangCap BangCap_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BangCap"
    ADD CONSTRAINT "BangCap_pkey" PRIMARY KEY (ma_bang_cap);


--
-- Name: BangLuong BangLuong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BangLuong"
    ADD CONSTRAINT "BangLuong_pkey" PRIMARY KEY (ma_bang_luong);


--
-- Name: CamKet CamKet_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CamKet"
    ADD CONSTRAINT "CamKet_pkey" PRIMARY KEY (ma_cam_ket);


--
-- Name: ChuongTrinhHoc ChuongTrinhHoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhHoc"
    ADD CONSTRAINT "ChuongTrinhHoc_pkey" PRIMARY KEY (ma_chuong_trinh);


--
-- Name: ChuongTrinhKhuyenMai ChuongTrinhKhuyenMai_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhKhuyenMai"
    ADD CONSTRAINT "ChuongTrinhKhuyenMai_pkey" PRIMARY KEY (ma_khuyen_mai);


--
-- Name: ChuongTrinhMarketing ChuongTrinhMarketing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhMarketing"
    ADD CONSTRAINT "ChuongTrinhMarketing_pkey" PRIMARY KEY (ma_chuong_trinh_marketing);


--
-- Name: CongNo CongNo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CongNo"
    ADD CONSTRAINT "CongNo_pkey" PRIMARY KEY (ma_cong_no);


--
-- Name: HoSoBangCap HoSoBangCap_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoSoBangCap"
    ADD CONSTRAINT "HoSoBangCap_pkey" PRIMARY KEY (ma_ho_so_bang_cap);


--
-- Name: HoatDongNgoaiKhoa HoatDongNgoaiKhoa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoatDongNgoaiKhoa"
    ADD CONSTRAINT "HoatDongNgoaiKhoa_pkey" PRIMARY KEY (ma_hoat_dong_ngoai_khoa);


--
-- Name: HocVien HocVien_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HocVien"
    ADD CONSTRAINT "HocVien_pkey" PRIMARY KEY (ma_hoc_vien);


--
-- Name: HopDongLaoDong HopDongLaoDong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HopDongLaoDong"
    ADD CONSTRAINT "HopDongLaoDong_pkey" PRIMARY KEY (ma_hop_dong);


--
-- Name: KeHoachGiangDay KeHoachGiangDay_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KeHoachGiangDay"
    ADD CONSTRAINT "KeHoachGiangDay_pkey" PRIMARY KEY (ma_ke_hoach);


--
-- Name: KhoaHoc KhoaHoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KhoaHoc"
    ADD CONSTRAINT "KhoaHoc_pkey" PRIMARY KEY (ma_khoa_hoc);


--
-- Name: LopHoc LopHoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LopHoc"
    ADD CONSTRAINT "LopHoc_pkey" PRIMARY KEY (ma_lop_hoc);


--
-- Name: NhanSu NhanSu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NhanSu"
    ADD CONSTRAINT "NhanSu_pkey" PRIMARY KEY (ma_nhan_su);


--
-- Name: PhanCongHoatDong PhanCongHoatDong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongHoatDong"
    ADD CONSTRAINT "PhanCongHoatDong_pkey" PRIMARY KEY (ma_phan_cong);


--
-- Name: PhanCongMarketing PhanCongMarketing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongMarketing"
    ADD CONSTRAINT "PhanCongMarketing_pkey" PRIMARY KEY (ma_phan_cong_marketing);


--
-- Name: PhanQuyen PhanQuyen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanQuyen"
    ADD CONSTRAINT "PhanQuyen_pkey" PRIMARY KEY (ma_phan_quyen);


--
-- Name: PhieuChi PhieuChi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChi"
    ADD CONSTRAINT "PhieuChi_pkey" PRIMARY KEY (ma_phieu_chi);


--
-- Name: PhieuLuong PhieuLuong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuLuong"
    ADD CONSTRAINT "PhieuLuong_pkey" PRIMARY KEY (ma_phieu_luong);


--
-- Name: PhieuThu PhieuThu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_pkey" PRIMARY KEY (ma_phieu_thu);


--
-- Name: PhieuThuong PhieuThuong_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThuong"
    ADD CONSTRAINT "PhieuThuong_pkey" PRIMARY KEY (ma_phieu_thuong);


--
-- Name: PhongBan PhongBan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhongBan"
    ADD CONSTRAINT "PhongBan_pkey" PRIMARY KEY (ma_phong_ban);


--
-- Name: PhongHoc PhongHoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhongHoc"
    ADD CONSTRAINT "PhongHoc_pkey" PRIMARY KEY (ma_phong_hoc);


--
-- Name: Quyen Quyen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quyen"
    ADD CONSTRAINT "Quyen_pkey" PRIMARY KEY (ma_quyen);


--
-- Name: TaiKhoan TaiKhoan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TaiKhoan"
    ADD CONSTRAINT "TaiKhoan_pkey" PRIMARY KEY (ma_tai_khoan);


--
-- Name: ThamGiaLop ThamGiaLop_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaLop"
    ADD CONSTRAINT "ThamGiaLop_pkey" PRIMARY KEY (ma_tham_gia_lop);


--
-- Name: ThamGiaNgoaiKhoa ThamGiaNgoaiKhoa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaNgoaiKhoa"
    ADD CONSTRAINT "ThamGiaNgoaiKhoa_pkey" PRIMARY KEY (ma_tham_gia_ngoai_khoa);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: BangCap_ten_bang_cap_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "BangCap_ten_bang_cap_key" ON public."BangCap" USING btree (ten_bang_cap);


--
-- Name: HocVien_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "HocVien_email_key" ON public."HocVien" USING btree (email);


--
-- Name: HopDongLaoDong_so_hop_dong_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "HopDongLaoDong_so_hop_dong_key" ON public."HopDongLaoDong" USING btree (so_hop_dong);


--
-- Name: PhanCongHoatDong_ma_nhan_su_ma_hoat_dong_ngoai_khoa_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PhanCongHoatDong_ma_nhan_su_ma_hoat_dong_ngoai_khoa_key" ON public."PhanCongHoatDong" USING btree (ma_nhan_su, ma_hoat_dong_ngoai_khoa);


--
-- Name: PhanQuyen_ma_tai_khoan_ma_quyen_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PhanQuyen_ma_tai_khoan_ma_quyen_key" ON public."PhanQuyen" USING btree (ma_tai_khoan, ma_quyen);


--
-- Name: PhongHoc_ten_phong_hoc_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PhongHoc_ten_phong_hoc_key" ON public."PhongHoc" USING btree (ten_phong_hoc);


--
-- Name: Quyen_ten_quyen_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Quyen_ten_quyen_key" ON public."Quyen" USING btree (ten_quyen);


--
-- Name: TaiKhoan_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TaiKhoan_email_key" ON public."TaiKhoan" USING btree (email);


--
-- Name: TaiKhoan_ma_nhan_su_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TaiKhoan_ma_nhan_su_key" ON public."TaiKhoan" USING btree (ma_nhan_su);


--
-- Name: TaiKhoan_ten_dang_nhap_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TaiKhoan_ten_dang_nhap_key" ON public."TaiKhoan" USING btree (ten_dang_nhap);


--
-- Name: ThamGiaLop_ma_hoc_vien_ma_lop_hoc_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ThamGiaLop_ma_hoc_vien_ma_lop_hoc_key" ON public."ThamGiaLop" USING btree (ma_hoc_vien, ma_lop_hoc);


--
-- Name: ThamGiaNgoaiKhoa_ma_hoc_vien_ma_hoat_dong_ngoai_khoa_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ThamGiaNgoaiKhoa_ma_hoc_vien_ma_hoat_dong_ngoai_khoa_key" ON public."ThamGiaNgoaiKhoa" USING btree (ma_hoc_vien, ma_hoat_dong_ngoai_khoa);


--
-- Name: CamKet CamKet_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CamKet"
    ADD CONSTRAINT "CamKet_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CongNo CongNo_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CongNo"
    ADD CONSTRAINT "CongNo_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: HoSoBangCap HoSoBangCap_ma_bang_cap_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoSoBangCap"
    ADD CONSTRAINT "HoSoBangCap_ma_bang_cap_fkey" FOREIGN KEY (ma_bang_cap) REFERENCES public."BangCap"(ma_bang_cap) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: HoSoBangCap HoSoBangCap_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HoSoBangCap"
    ADD CONSTRAINT "HoSoBangCap_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: HopDongLaoDong HopDongLaoDong_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HopDongLaoDong"
    ADD CONSTRAINT "HopDongLaoDong_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: KeHoachGiangDay KeHoachGiangDay_ma_khoa_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KeHoachGiangDay"
    ADD CONSTRAINT "KeHoachGiangDay_ma_khoa_hoc_fkey" FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: KeHoachGiangDay KeHoachGiangDay_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KeHoachGiangDay"
    ADD CONSTRAINT "KeHoachGiangDay_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: KhoaHoc KhoaHoc_ma_chuong_trinh_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KhoaHoc"
    ADD CONSTRAINT "KhoaHoc_ma_chuong_trinh_fkey" FOREIGN KEY (ma_chuong_trinh) REFERENCES public."ChuongTrinhHoc"(ma_chuong_trinh) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LopHoc LopHoc_ma_khoa_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LopHoc"
    ADD CONSTRAINT "LopHoc_ma_khoa_hoc_fkey" FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LopHoc LopHoc_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LopHoc"
    ADD CONSTRAINT "LopHoc_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LopHoc LopHoc_ma_phong_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LopHoc"
    ADD CONSTRAINT "LopHoc_ma_phong_hoc_fkey" FOREIGN KEY (ma_phong_hoc) REFERENCES public."PhongHoc"(ma_phong_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: NhanSu NhanSu_ma_phong_ban_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NhanSu"
    ADD CONSTRAINT "NhanSu_ma_phong_ban_fkey" FOREIGN KEY (ma_phong_ban) REFERENCES public."PhongBan"(ma_phong_ban) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PhanCongHoatDong PhanCongHoatDong_ma_hoat_dong_ngoai_khoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongHoatDong"
    ADD CONSTRAINT "PhanCongHoatDong_ma_hoat_dong_ngoai_khoa_fkey" FOREIGN KEY (ma_hoat_dong_ngoai_khoa) REFERENCES public."HoatDongNgoaiKhoa"(ma_hoat_dong_ngoai_khoa) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PhanCongHoatDong PhanCongHoatDong_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongHoatDong"
    ADD CONSTRAINT "PhanCongHoatDong_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PhanQuyen PhanQuyen_ma_quyen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanQuyen"
    ADD CONSTRAINT "PhanQuyen_ma_quyen_fkey" FOREIGN KEY (ma_quyen) REFERENCES public."Quyen"(ma_quyen) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PhanQuyen PhanQuyen_ma_tai_khoan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanQuyen"
    ADD CONSTRAINT "PhanQuyen_ma_tai_khoan_fkey" FOREIGN KEY (ma_tai_khoan) REFERENCES public."TaiKhoan"(ma_tai_khoan) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PhieuChi PhieuChi_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuChi"
    ADD CONSTRAINT "PhieuChi_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PhieuLuong PhieuLuong_ma_bang_luong_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuLuong"
    ADD CONSTRAINT "PhieuLuong_ma_bang_luong_fkey" FOREIGN KEY (ma_bang_luong) REFERENCES public."BangLuong"(ma_bang_luong) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PhieuLuong PhieuLuong_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuLuong"
    ADD CONSTRAINT "PhieuLuong_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PhieuThu PhieuThu_ma_cam_ket_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_ma_cam_ket_fkey" FOREIGN KEY (ma_cam_ket) REFERENCES public."CamKet"(ma_cam_ket) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PhieuThu PhieuThu_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PhieuThu PhieuThu_ma_khuyen_mai_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_ma_khuyen_mai_fkey" FOREIGN KEY (ma_khuyen_mai) REFERENCES public."ChuongTrinhKhuyenMai"(ma_khuyen_mai) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PhieuThu PhieuThu_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PhieuThuong PhieuThuong_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhieuThuong"
    ADD CONSTRAINT "PhieuThuong_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TaiKhoan TaiKhoan_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TaiKhoan"
    ADD CONSTRAINT "TaiKhoan_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ThamGiaLop ThamGiaLop_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaLop"
    ADD CONSTRAINT "ThamGiaLop_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ThamGiaLop ThamGiaLop_ma_lop_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaLop"
    ADD CONSTRAINT "ThamGiaLop_ma_lop_hoc_fkey" FOREIGN KEY (ma_lop_hoc) REFERENCES public."LopHoc"(ma_lop_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ThamGiaNgoaiKhoa ThamGiaNgoaiKhoa_ma_hoat_dong_ngoai_khoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaNgoaiKhoa"
    ADD CONSTRAINT "ThamGiaNgoaiKhoa_ma_hoat_dong_ngoai_khoa_fkey" FOREIGN KEY (ma_hoat_dong_ngoai_khoa) REFERENCES public."HoatDongNgoaiKhoa"(ma_hoat_dong_ngoai_khoa) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ThamGiaNgoaiKhoa ThamGiaNgoaiKhoa_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ThamGiaNgoaiKhoa"
    ADD CONSTRAINT "ThamGiaNgoaiKhoa_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PhanCongMarketing fk_ct_marketing; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongMarketing"
    ADD CONSTRAINT fk_ct_marketing FOREIGN KEY (ma_chuong_trinh_marketing) REFERENCES public."ChuongTrinhMarketing"(ma_chuong_trinh_marketing) ON DELETE CASCADE;


--
-- Name: ChuongTrinhMarketing fk_khoa_hoc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChuongTrinhMarketing"
    ADD CONSTRAINT fk_khoa_hoc FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON DELETE SET NULL;


--
-- Name: PhanCongMarketing fk_nhan_su_marketing; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhanCongMarketing"
    ADD CONSTRAINT fk_nhan_su_marketing FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ZcatKnaAKGfWu9h7m8xmYkPs9YPnBnQys7X0YXZDIkfl6uab0ZAwIcXavpTIvRv


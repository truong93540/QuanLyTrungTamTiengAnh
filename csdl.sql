--
-- PostgreSQL database dump
--

\restrict bfYriwht6DCCUm3Vz2aIdrPxUgtR0xV51ieXIi2PYaCIfpdg8YBqVO3d6NRjWl8

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-07 11:42:50

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
-- TOC entry 224 (class 1259 OID 16481)
-- Name: BangCap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BangCap" (
    ma_bang_cap integer NOT NULL,
    ten_bang_cap text NOT NULL,
    noi_cap text,
    ngay_cap timestamp(3) without time zone
);


ALTER TABLE public."BangCap" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16480)
-- Name: BangCap_ma_bang_cap_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BangCap_ma_bang_cap_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BangCap_ma_bang_cap_seq" OWNER TO postgres;

--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 223
-- Name: BangCap_ma_bang_cap_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BangCap_ma_bang_cap_seq" OWNED BY public."BangCap".ma_bang_cap;


--
-- TOC entry 232 (class 1259 OID 16529)
-- Name: BangLuong; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BangLuong" (
    ma_bang_luong integer NOT NULL,
    thang integer NOT NULL,
    nam integer NOT NULL,
    luong_co_ban double precision NOT NULL,
    so_cong_thuc_te double precision NOT NULL,
    hinh_thuc_tinh text NOT NULL,
    tang_ca double precision,
    phu_cap double precision,
    tong_thuong double precision,
    thu_nhap_khac double precision,
    ung_luong double precision,
    khau_tru_khac double precision,
    thuc_linh double precision NOT NULL,
    ghi_chu text,
    trang_thai text,
    ma_nhan_su integer NOT NULL
);


ALTER TABLE public."BangLuong" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16528)
-- Name: BangLuong_ma_bang_luong_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BangLuong_ma_bang_luong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BangLuong_ma_bang_luong_seq" OWNER TO postgres;

--
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 231
-- Name: BangLuong_ma_bang_luong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BangLuong_ma_bang_luong_seq" OWNED BY public."BangLuong".ma_bang_luong;


--
-- TOC entry 234 (class 1259 OID 16546)
-- Name: BangThuong; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BangThuong" (
    ma_thuong integer NOT NULL,
    ten_khoan_thuong text NOT NULL,
    so_tien double precision NOT NULL,
    ngay_quyet_dinh timestamp(3) without time zone NOT NULL,
    ly_do text,
    trang_thai text,
    ma_nhan_su integer NOT NULL,
    ma_bang_luong integer
);


ALTER TABLE public."BangThuong" OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16545)
-- Name: BangThuong_ma_thuong_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BangThuong_ma_thuong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BangThuong_ma_thuong_seq" OWNER TO postgres;

--
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 233
-- Name: BangThuong_ma_thuong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BangThuong_ma_thuong_seq" OWNED BY public."BangThuong".ma_thuong;


--
-- TOC entry 256 (class 1259 OID 16692)
-- Name: CamKet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CamKet" (
    ma_cam_ket integer NOT NULL,
    ngay_ky timestamp(3) without time zone NOT NULL,
    ngay_het_han timestamp(3) without time zone,
    noi_dung_cam_ket text NOT NULL,
    trang_thai text,
    ma_hoc_vien integer NOT NULL
);


ALTER TABLE public."CamKet" OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 16691)
-- Name: CamKet_ma_cam_ket_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CamKet_ma_cam_ket_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CamKet_ma_cam_ket_seq" OWNER TO postgres;

--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 255
-- Name: CamKet_ma_cam_ket_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CamKet_ma_cam_ket_seq" OWNED BY public."CamKet".ma_cam_ket;


--
-- TOC entry 244 (class 1259 OID 16615)
-- Name: ChuongTrinhHoc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChuongTrinhHoc" (
    ma_chuong_trinh integer NOT NULL,
    ten_chuong_trinh text NOT NULL,
    mo_ta text,
    muc_tieu text
);


ALTER TABLE public."ChuongTrinhHoc" OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16614)
-- Name: ChuongTrinhHoc_ma_chuong_trinh_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ChuongTrinhHoc_ma_chuong_trinh_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChuongTrinhHoc_ma_chuong_trinh_seq" OWNER TO postgres;

--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 243
-- Name: ChuongTrinhHoc_ma_chuong_trinh_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ChuongTrinhHoc_ma_chuong_trinh_seq" OWNED BY public."ChuongTrinhHoc".ma_chuong_trinh;


--
-- TOC entry 252 (class 1259 OID 16664)
-- Name: ChuongTrinhKhuyenMai; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChuongTrinhKhuyenMai" (
    ma_khuyen_mai integer NOT NULL,
    ten_chuong_trinh text NOT NULL,
    mo_ta text,
    phan_tram_giam double precision NOT NULL,
    ngay_bat_dau timestamp(3) without time zone NOT NULL,
    ngay_ket_thuc timestamp(3) without time zone NOT NULL,
    ma_khoa_hoc integer NOT NULL
);


ALTER TABLE public."ChuongTrinhKhuyenMai" OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16663)
-- Name: ChuongTrinhKhuyenMai_ma_khuyen_mai_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq" OWNER TO postgres;

--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 251
-- Name: ChuongTrinhKhuyenMai_ma_khuyen_mai_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq" OWNED BY public."ChuongTrinhKhuyenMai".ma_khuyen_mai;


--
-- TOC entry 238 (class 1259 OID 16573)
-- Name: ChuongTrinhMarketing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChuongTrinhMarketing" (
    ma_marketing integer NOT NULL,
    ten_chuong_trinh text NOT NULL,
    noi_dung text,
    ngay_bat_dau timestamp(3) without time zone NOT NULL,
    ngay_ket_thuc timestamp(3) without time zone NOT NULL,
    ngan_sach double precision NOT NULL,
    ma_nhan_su integer NOT NULL
);


ALTER TABLE public."ChuongTrinhMarketing" OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16572)
-- Name: ChuongTrinhMarketing_ma_marketing_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ChuongTrinhMarketing_ma_marketing_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChuongTrinhMarketing_ma_marketing_seq" OWNER TO postgres;

--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 237
-- Name: ChuongTrinhMarketing_ma_marketing_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ChuongTrinhMarketing_ma_marketing_seq" OWNED BY public."ChuongTrinhMarketing".ma_marketing;


--
-- TOC entry 254 (class 1259 OID 16679)
-- Name: CongNo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CongNo" (
    ma_cong_no integer NOT NULL,
    so_tien_no double precision NOT NULL,
    ngay_phat_sinh timestamp(3) without time zone NOT NULL,
    han_thanh_toan timestamp(3) without time zone,
    trang_thai text,
    ma_hoc_vien integer NOT NULL
);


ALTER TABLE public."CongNo" OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 16678)
-- Name: CongNo_ma_cong_no_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CongNo_ma_cong_no_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CongNo_ma_cong_no_seq" OWNER TO postgres;

--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 253
-- Name: CongNo_ma_cong_no_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CongNo_ma_cong_no_seq" OWNED BY public."CongNo".ma_cong_no;


--
-- TOC entry 236 (class 1259 OID 16560)
-- Name: HoatDongNgoaiKhoa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."HoatDongNgoaiKhoa" (
    ma_hoat_dong integer NOT NULL,
    ten_hoat_dong text NOT NULL,
    mo_ta text,
    ngay_to_chuc timestamp(3) without time zone NOT NULL,
    dia_diem text,
    chi_phi double precision,
    ma_nhan_su integer NOT NULL
);


ALTER TABLE public."HoatDongNgoaiKhoa" OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16559)
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."HoatDongNgoaiKhoa_ma_hoat_dong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."HoatDongNgoaiKhoa_ma_hoat_dong_seq" OWNER TO postgres;

--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 235
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."HoatDongNgoaiKhoa_ma_hoat_dong_seq" OWNED BY public."HoatDongNgoaiKhoa".ma_hoat_dong;


--
-- TOC entry 248 (class 1259 OID 16639)
-- Name: HocVien; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."HocVien" (
    ma_hoc_vien integer NOT NULL,
    ho_ten text NOT NULL,
    ngay_sinh timestamp(3) without time zone,
    gioi_tinh text,
    so_dien_thoai text,
    email text,
    dia_chi text,
    ngay_dang_ky timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ma_khoa_hoc integer
);


ALTER TABLE public."HocVien" OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16638)
-- Name: HocVien_ma_hoc_vien_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."HocVien_ma_hoc_vien_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."HocVien_ma_hoc_vien_seq" OWNER TO postgres;

--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 247
-- Name: HocVien_ma_hoc_vien_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."HocVien_ma_hoc_vien_seq" OWNED BY public."HocVien".ma_hoc_vien;


--
-- TOC entry 230 (class 1259 OID 16514)
-- Name: HopDongLaoDong; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."HopDongLaoDong" (
    ma_hop_dong integer NOT NULL,
    so_hop_dong text NOT NULL,
    ngay_ky timestamp(3) without time zone NOT NULL,
    ten_cong_viec text NOT NULL,
    tg_thu_viec text,
    tg_nghi text,
    update_at timestamp(3) without time zone NOT NULL,
    ma_nhan_su integer NOT NULL,
    ma_phong_ban integer
);


ALTER TABLE public."HopDongLaoDong" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16513)
-- Name: HopDongLaoDong_ma_hop_dong_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."HopDongLaoDong_ma_hop_dong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."HopDongLaoDong_ma_hop_dong_seq" OWNER TO postgres;

--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 229
-- Name: HopDongLaoDong_ma_hop_dong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."HopDongLaoDong_ma_hop_dong_seq" OWNED BY public."HopDongLaoDong".ma_hop_dong;


--
-- TOC entry 250 (class 1259 OID 16652)
-- Name: KeHoachGiangDay; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KeHoachGiangDay" (
    ma_ke_hoach integer NOT NULL,
    noi_dung text NOT NULL,
    lich_day text,
    thoi_gian text,
    giao_vien text,
    ma_khoa_hoc integer NOT NULL
);


ALTER TABLE public."KeHoachGiangDay" OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16651)
-- Name: KeHoachGiangDay_ma_ke_hoach_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."KeHoachGiangDay_ma_ke_hoach_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."KeHoachGiangDay_ma_ke_hoach_seq" OWNER TO postgres;

--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 249
-- Name: KeHoachGiangDay_ma_ke_hoach_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."KeHoachGiangDay_ma_ke_hoach_seq" OWNED BY public."KeHoachGiangDay".ma_ke_hoach;


--
-- TOC entry 246 (class 1259 OID 16626)
-- Name: KhoaHoc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KhoaHoc" (
    ma_khoa_hoc integer NOT NULL,
    ten_khoa_hoc text NOT NULL,
    mo_ta text,
    thoi_luong integer,
    hoc_phi double precision NOT NULL,
    trinh_do text,
    ma_chuong_trinh integer NOT NULL
);


ALTER TABLE public."KhoaHoc" OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16625)
-- Name: KhoaHoc_ma_khoa_hoc_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."KhoaHoc_ma_khoa_hoc_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."KhoaHoc_ma_khoa_hoc_seq" OWNER TO postgres;

--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 245
-- Name: KhoaHoc_ma_khoa_hoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."KhoaHoc_ma_khoa_hoc_seq" OWNED BY public."KhoaHoc".ma_khoa_hoc;


--
-- TOC entry 226 (class 1259 OID 16492)
-- Name: NhanSu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NhanSu" (
    ma_nhan_su integer NOT NULL,
    ho_ten text NOT NULL,
    ngay_sinh timestamp(3) without time zone,
    gioi_tinh text,
    so_dien_thoai text,
    dia_chi text,
    chuc_vu text,
    ma_bang_cap integer
);


ALTER TABLE public."NhanSu" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16491)
-- Name: NhanSu_ma_nhan_su_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."NhanSu_ma_nhan_su_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."NhanSu_ma_nhan_su_seq" OWNER TO postgres;

--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 225
-- Name: NhanSu_ma_nhan_su_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."NhanSu_ma_nhan_su_seq" OWNED BY public."NhanSu".ma_nhan_su;


--
-- TOC entry 240 (class 1259 OID 16588)
-- Name: PhieuChi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PhieuChi" (
    ma_phieu_chi integer NOT NULL,
    so_tien double precision NOT NULL,
    ngay_chi timestamp(3) without time zone NOT NULL,
    noi_dung text,
    ma_phong_ban integer,
    ma_nhan_su integer NOT NULL
);


ALTER TABLE public."PhieuChi" OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16587)
-- Name: PhieuChi_ma_phieu_chi_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PhieuChi_ma_phieu_chi_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PhieuChi_ma_phieu_chi_seq" OWNER TO postgres;

--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 239
-- Name: PhieuChi_ma_phieu_chi_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhieuChi_ma_phieu_chi_seq" OWNED BY public."PhieuChi".ma_phieu_chi;


--
-- TOC entry 242 (class 1259 OID 16601)
-- Name: PhieuThu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PhieuThu" (
    ma_phieu_thu integer NOT NULL,
    so_tien double precision NOT NULL,
    ngay_thu timestamp(3) without time zone NOT NULL,
    noi_dung text,
    ma_hoc_vien integer NOT NULL,
    ma_nhan_su integer NOT NULL
);


ALTER TABLE public."PhieuThu" OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16600)
-- Name: PhieuThu_ma_phieu_thu_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PhieuThu_ma_phieu_thu_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PhieuThu_ma_phieu_thu_seq" OWNER TO postgres;

--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 241
-- Name: PhieuThu_ma_phieu_thu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhieuThu_ma_phieu_thu_seq" OWNED BY public."PhieuThu".ma_phieu_thu;


--
-- TOC entry 228 (class 1259 OID 16503)
-- Name: PhongBan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PhongBan" (
    ma_phong_ban integer NOT NULL,
    ten_phong_ban text NOT NULL,
    mo_ta text,
    ngay_thanh_lap timestamp(3) without time zone
);


ALTER TABLE public."PhongBan" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16502)
-- Name: PhongBan_ma_phong_ban_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PhongBan_ma_phong_ban_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PhongBan_ma_phong_ban_seq" OWNER TO postgres;

--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 227
-- Name: PhongBan_ma_phong_ban_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhongBan_ma_phong_ban_seq" OWNED BY public."PhongBan".ma_phong_ban;


--
-- TOC entry 220 (class 1259 OID 16443)
-- Name: Quyen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Quyen" (
    ma_quyen integer NOT NULL,
    ten_quyen text NOT NULL,
    trang_thai boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Quyen" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16442)
-- Name: Quyen_ma_quyen_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Quyen_ma_quyen_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Quyen_ma_quyen_seq" OWNER TO postgres;

--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 219
-- Name: Quyen_ma_quyen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Quyen_ma_quyen_seq" OWNED BY public."Quyen".ma_quyen;


--
-- TOC entry 222 (class 1259 OID 16456)
-- Name: TaiKhoan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TaiKhoan" (
    ma_tai_khoan integer NOT NULL,
    ten_dang_nhap text NOT NULL,
    mat_khau text NOT NULL,
    trang_thai boolean DEFAULT false NOT NULL,
    email text,
    ma_quyen integer NOT NULL,
    ma_nhan_su integer NOT NULL
);


ALTER TABLE public."TaiKhoan" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16455)
-- Name: TaiKhoan_ma_tai_khoan_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TaiKhoan_ma_tai_khoan_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TaiKhoan_ma_tai_khoan_seq" OWNER TO postgres;

--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 221
-- Name: TaiKhoan_ma_tai_khoan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TaiKhoan_ma_tai_khoan_seq" OWNED BY public."TaiKhoan".ma_tai_khoan;


--
-- TOC entry 4950 (class 2604 OID 16484)
-- Name: BangCap ma_bang_cap; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BangCap" ALTER COLUMN ma_bang_cap SET DEFAULT nextval('public."BangCap_ma_bang_cap_seq"'::regclass);


--
-- TOC entry 4954 (class 2604 OID 16532)
-- Name: BangLuong ma_bang_luong; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BangLuong" ALTER COLUMN ma_bang_luong SET DEFAULT nextval('public."BangLuong_ma_bang_luong_seq"'::regclass);


--
-- TOC entry 4955 (class 2604 OID 16549)
-- Name: BangThuong ma_thuong; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BangThuong" ALTER COLUMN ma_thuong SET DEFAULT nextval('public."BangThuong_ma_thuong_seq"'::regclass);


--
-- TOC entry 4967 (class 2604 OID 16695)
-- Name: CamKet ma_cam_ket; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CamKet" ALTER COLUMN ma_cam_ket SET DEFAULT nextval('public."CamKet_ma_cam_ket_seq"'::regclass);


--
-- TOC entry 4960 (class 2604 OID 16618)
-- Name: ChuongTrinhHoc ma_chuong_trinh; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChuongTrinhHoc" ALTER COLUMN ma_chuong_trinh SET DEFAULT nextval('public."ChuongTrinhHoc_ma_chuong_trinh_seq"'::regclass);


--
-- TOC entry 4965 (class 2604 OID 16667)
-- Name: ChuongTrinhKhuyenMai ma_khuyen_mai; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChuongTrinhKhuyenMai" ALTER COLUMN ma_khuyen_mai SET DEFAULT nextval('public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"'::regclass);


--
-- TOC entry 4957 (class 2604 OID 16576)
-- Name: ChuongTrinhMarketing ma_marketing; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChuongTrinhMarketing" ALTER COLUMN ma_marketing SET DEFAULT nextval('public."ChuongTrinhMarketing_ma_marketing_seq"'::regclass);


--
-- TOC entry 4966 (class 2604 OID 16682)
-- Name: CongNo ma_cong_no; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CongNo" ALTER COLUMN ma_cong_no SET DEFAULT nextval('public."CongNo_ma_cong_no_seq"'::regclass);


--
-- TOC entry 4956 (class 2604 OID 16563)
-- Name: HoatDongNgoaiKhoa ma_hoat_dong; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HoatDongNgoaiKhoa" ALTER COLUMN ma_hoat_dong SET DEFAULT nextval('public."HoatDongNgoaiKhoa_ma_hoat_dong_seq"'::regclass);


--
-- TOC entry 4962 (class 2604 OID 16642)
-- Name: HocVien ma_hoc_vien; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HocVien" ALTER COLUMN ma_hoc_vien SET DEFAULT nextval('public."HocVien_ma_hoc_vien_seq"'::regclass);


--
-- TOC entry 4953 (class 2604 OID 16517)
-- Name: HopDongLaoDong ma_hop_dong; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HopDongLaoDong" ALTER COLUMN ma_hop_dong SET DEFAULT nextval('public."HopDongLaoDong_ma_hop_dong_seq"'::regclass);


--
-- TOC entry 4964 (class 2604 OID 16655)
-- Name: KeHoachGiangDay ma_ke_hoach; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KeHoachGiangDay" ALTER COLUMN ma_ke_hoach SET DEFAULT nextval('public."KeHoachGiangDay_ma_ke_hoach_seq"'::regclass);


--
-- TOC entry 4961 (class 2604 OID 16629)
-- Name: KhoaHoc ma_khoa_hoc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KhoaHoc" ALTER COLUMN ma_khoa_hoc SET DEFAULT nextval('public."KhoaHoc_ma_khoa_hoc_seq"'::regclass);


--
-- TOC entry 4951 (class 2604 OID 16495)
-- Name: NhanSu ma_nhan_su; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NhanSu" ALTER COLUMN ma_nhan_su SET DEFAULT nextval('public."NhanSu_ma_nhan_su_seq"'::regclass);


--
-- TOC entry 4958 (class 2604 OID 16591)
-- Name: PhieuChi ma_phieu_chi; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhieuChi" ALTER COLUMN ma_phieu_chi SET DEFAULT nextval('public."PhieuChi_ma_phieu_chi_seq"'::regclass);


--
-- TOC entry 4959 (class 2604 OID 16604)
-- Name: PhieuThu ma_phieu_thu; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhieuThu" ALTER COLUMN ma_phieu_thu SET DEFAULT nextval('public."PhieuThu_ma_phieu_thu_seq"'::regclass);


--
-- TOC entry 4952 (class 2604 OID 16506)
-- Name: PhongBan ma_phong_ban; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhongBan" ALTER COLUMN ma_phong_ban SET DEFAULT nextval('public."PhongBan_ma_phong_ban_seq"'::regclass);


--
-- TOC entry 4946 (class 2604 OID 16446)
-- Name: Quyen ma_quyen; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quyen" ALTER COLUMN ma_quyen SET DEFAULT nextval('public."Quyen_ma_quyen_seq"'::regclass);


--
-- TOC entry 4948 (class 2604 OID 16459)
-- Name: TaiKhoan ma_tai_khoan; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaiKhoan" ALTER COLUMN ma_tai_khoan SET DEFAULT nextval('public."TaiKhoan_ma_tai_khoan_seq"'::regclass);


--
-- TOC entry 5183 (class 0 OID 16481)
-- Dependencies: 224
-- Data for Name: BangCap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5191 (class 0 OID 16529)
-- Dependencies: 232
-- Data for Name: BangLuong; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5193 (class 0 OID 16546)
-- Dependencies: 234
-- Data for Name: BangThuong; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5215 (class 0 OID 16692)
-- Dependencies: 256
-- Data for Name: CamKet; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5203 (class 0 OID 16615)
-- Dependencies: 244
-- Data for Name: ChuongTrinhHoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ChuongTrinhHoc" VALUES (1, 'Luyện thi IELTS Cao độ', 'Chương trình đào tạo chuẩn quốc tế với lộ trình cá nhân hóa, giúp học viên phát triển toàn diện 4 kỹ năng Nghe - Nói - Đọc - Viết.', 'Đạt chứng chỉ IELTS tối thiểu 6.5+');
INSERT INTO public."ChuongTrinhHoc" VALUES (2, 'Luyện thi TOEIC Thực chiến', 'Khóa học tập trung giải quyết các bẫy đề thi TOEIC, phù hợp cho sinh viên cần chuẩn đầu ra và người đi làm cần nâng cao nghiệp vụ.', 'Đạt chứng chỉ TOEIC 650 - 800+');
INSERT INTO public."ChuongTrinhHoc" VALUES (3, 'Tiếng Anh Giao tiếp (ESL)', 'Tập trung rèn luyện phản xạ nghe nói, chỉnh sửa phát âm chuẩn bản xứ và xây dựng sự tự tin khi giao tiếp trong môi trường quốc tế.', 'Giao tiếp trôi chảy, tự tin thuyết trình bằng tiếng Anh');
INSERT INTO public."ChuongTrinhHoc" VALUES (4, 'Tiếng Anh Trẻ em (Cambridge)', 'Xây dựng nền tảng tiếng Anh vững chắc cho trẻ từ 6-12 tuổi thông qua các phương pháp trực quan, trò chơi và các hoạt động tương tác.', 'Đạt các chứng chỉ Cambridge (Starters, Movers, Flyers)');


--
-- TOC entry 5211 (class 0 OID 16664)
-- Dependencies: 252
-- Data for Name: ChuongTrinhKhuyenMai; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5197 (class 0 OID 16573)
-- Dependencies: 238
-- Data for Name: ChuongTrinhMarketing; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5213 (class 0 OID 16679)
-- Dependencies: 254
-- Data for Name: CongNo; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5195 (class 0 OID 16560)
-- Dependencies: 236
-- Data for Name: HoatDongNgoaiKhoa; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5207 (class 0 OID 16639)
-- Dependencies: 248
-- Data for Name: HocVien; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."HocVien" VALUES (1, 'Lê Hoàng Anh', '2005-08-15 00:00:00', 'Nam', '0901111222', 'hoanganh.le@email.com', 'Lê Lợi, Hải Phòng', '2026-03-25 00:00:00', 1);
INSERT INTO public."HocVien" VALUES (2, 'Trần Thị Bích', '1998-05-20 00:00:00', 'Nữ', '0912333444', 'bich.tran@email.com', 'Ngô Quyền, Hải Phòng', '2026-03-26 00:00:00', 4);
INSERT INTO public."HocVien" VALUES (3, 'Vũ Hải Đăng', '2003-11-10 00:00:00', 'Nam', '0988555666', 'haidang.vu@email.com', 'Lê Chân, Hải Phòng', '2026-03-27 00:00:00', 3);
INSERT INTO public."HocVien" VALUES (4, 'Đặng Thu Thảo', '2004-02-28 00:00:00', 'Nữ', '0933777888', 'thuthao.dang@email.com', 'Hồng Bàng, Hải Phòng', '2026-03-28 00:00:00', 2);
INSERT INTO public."HocVien" VALUES (5, 'Nguyễn Văn Nam', '2015-09-05 00:00:00', 'Nam', '0909999000', 'phuhuynh.nam@email.com', 'Kiến An, Hải Phòng', '2026-03-29 00:00:00', 5);


--
-- TOC entry 5189 (class 0 OID 16514)
-- Dependencies: 230
-- Data for Name: HopDongLaoDong; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5209 (class 0 OID 16652)
-- Dependencies: 250
-- Data for Name: KeHoachGiangDay; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5205 (class 0 OID 16626)
-- Dependencies: 246
-- Data for Name: KhoaHoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."KhoaHoc" VALUES (1, 'IELTS Foundation', 'Xây dựng nền tảng từ vựng, ngữ pháp và làm quen format đề thi IELTS.', 24, 4500000, '4.0 - 5.0', 1);
INSERT INTO public."KhoaHoc" VALUES (2, 'IELTS Intensive 6.5+', 'Luyện đề thực chiến, tập trung chuyên sâu kĩ năng Writing và Speaking.', 36, 7500000, '6.5+', 1);
INSERT INTO public."KhoaHoc" VALUES (3, 'TOEIC 500+ Cơ bản', 'Nắm vững ngữ pháp trọng tâm và chiến thuật làm bài nghe (Part 1-4).', 24, 3000000, 'Mới bắt đầu', 2);
INSERT INTO public."KhoaHoc" VALUES (4, 'Giao tiếp Công sở', 'Thực hành các tình huống giao tiếp, viết email, thuyết trình trong công việc.', 30, 4200000, 'Trung cấp', 3);
INSERT INTO public."KhoaHoc" VALUES (5, 'Cambridge Movers', 'Tiếng Anh tương tác qua trò chơi, giúp trẻ phản xạ tự nhiên.', 48, 5500000, 'Movers (A1)', 4);


--
-- TOC entry 5185 (class 0 OID 16492)
-- Dependencies: 226
-- Data for Name: NhanSu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."NhanSu" VALUES (1, 'Nguyễn Văn Trường', NULL, NULL, '0901234567', NULL, NULL, NULL);
INSERT INTO public."NhanSu" VALUES (2, 'Trần Thị Tuyển Sinh', NULL, NULL, '0912345678', NULL, NULL, NULL);
INSERT INTO public."NhanSu" VALUES (3, 'Lê Hoàng Tài Chính', NULL, NULL, '0923456789', NULL, NULL, NULL);
INSERT INTO public."NhanSu" VALUES (4, 'Vũ Thị Lan', NULL, NULL, '0901234566', NULL, 'Giảng viên', NULL);
INSERT INTO public."NhanSu" VALUES (5, 'Bùi Thế Anh', NULL, NULL, '0901234567', NULL, 'Nhân viên Marketing', NULL);


--
-- TOC entry 5199 (class 0 OID 16588)
-- Dependencies: 240
-- Data for Name: PhieuChi; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5201 (class 0 OID 16601)
-- Dependencies: 242
-- Data for Name: PhieuThu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PhieuThu" VALUES (1, 5500000, '2026-03-28 00:00:00', 'Thu học phí đợt 1 khóa IELTS 6.5', 1, 5);
INSERT INTO public."PhieuThu" VALUES (2, 2000000, '2026-03-29 00:00:00', 'Đóng cọc giữ chỗ khóa Giao Tiếp', 2, 5);
INSERT INTO public."PhieuThu" VALUES (3, 7000000, '2026-03-29 00:00:00', 'Thu học phí toàn khóa TOEIC 700', 3, 4);
INSERT INTO public."PhieuThu" VALUES (4, 1500000, '2026-03-30 00:00:00', 'Thu phí thi thử IELTS tháng 4', 4, 5);
INSERT INTO public."PhieuThu" VALUES (5, 5500000, '2026-03-31 00:00:00', 'Thu học phí khóa Cambridge Movers', 5, 4);


--
-- TOC entry 5187 (class 0 OID 16503)
-- Dependencies: 228
-- Data for Name: PhongBan; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5179 (class 0 OID 16443)
-- Dependencies: 220
-- Data for Name: Quyen; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Quyen" VALUES (1, 'Admin', true);
INSERT INTO public."Quyen" VALUES (2, 'Quản lý tuyển sinh', true);
INSERT INTO public."Quyen" VALUES (3, 'Quản lý đào tạo', true);
INSERT INTO public."Quyen" VALUES (4, 'Quản lý tài chính', true);
INSERT INTO public."Quyen" VALUES (5, 'Xem báo cáo', true);


--
-- TOC entry 5181 (class 0 OID 16456)
-- Dependencies: 222
-- Data for Name: TaiKhoan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."TaiKhoan" VALUES (7, 'daotao_01', '123456', true, 'truong93540@gmail.com', 3, 3);
INSERT INTO public."TaiKhoan" VALUES (8, 'tuyensinh_01', '123456', true, 'tuyensinh@hpenglish.vn', 2, 2);
INSERT INTO public."TaiKhoan" VALUES (10, 'taichinh_01', '123456', true, 'taichinh01@gmail.com', 4, 4);
INSERT INTO public."TaiKhoan" VALUES (11, 'giamdoc_01', '123456', true, 'giamdoc_1@gmail.com', 5, 5);
INSERT INTO public."TaiKhoan" VALUES (9, 'admin_01', '$2a$12$ady3jrsG2ihJDoS7V3t3muPihoxaAMpQSaRhIcx68WQsFYDQqnKEy', true, 'admin_01@gmail.com', 1, 1);


--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 223
-- Name: BangCap_ma_bang_cap_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BangCap_ma_bang_cap_seq"', 1, false);


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 231
-- Name: BangLuong_ma_bang_luong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BangLuong_ma_bang_luong_seq"', 1, false);


--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 233
-- Name: BangThuong_ma_thuong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BangThuong_ma_thuong_seq"', 1, false);


--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 255
-- Name: CamKet_ma_cam_ket_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CamKet_ma_cam_ket_seq"', 1, false);


--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 243
-- Name: ChuongTrinhHoc_ma_chuong_trinh_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChuongTrinhHoc_ma_chuong_trinh_seq"', 4, true);


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 251
-- Name: ChuongTrinhKhuyenMai_ma_khuyen_mai_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"', 1, false);


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 237
-- Name: ChuongTrinhMarketing_ma_marketing_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChuongTrinhMarketing_ma_marketing_seq"', 1, false);


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 253
-- Name: CongNo_ma_cong_no_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CongNo_ma_cong_no_seq"', 1, false);


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 235
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."HoatDongNgoaiKhoa_ma_hoat_dong_seq"', 1, false);


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 247
-- Name: HocVien_ma_hoc_vien_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."HocVien_ma_hoc_vien_seq"', 5, true);


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 229
-- Name: HopDongLaoDong_ma_hop_dong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."HopDongLaoDong_ma_hop_dong_seq"', 1, false);


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 249
-- Name: KeHoachGiangDay_ma_ke_hoach_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."KeHoachGiangDay_ma_ke_hoach_seq"', 1, false);


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 245
-- Name: KhoaHoc_ma_khoa_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."KhoaHoc_ma_khoa_hoc_seq"', 5, true);


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 225
-- Name: NhanSu_ma_nhan_su_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."NhanSu_ma_nhan_su_seq"', 5, true);


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 239
-- Name: PhieuChi_ma_phieu_chi_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhieuChi_ma_phieu_chi_seq"', 1, false);


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 241
-- Name: PhieuThu_ma_phieu_thu_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhieuThu_ma_phieu_thu_seq"', 7, true);


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 227
-- Name: PhongBan_ma_phong_ban_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhongBan_ma_phong_ban_seq"', 1, false);


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 219
-- Name: Quyen_ma_quyen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Quyen_ma_quyen_seq"', 5, true);


--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 221
-- Name: TaiKhoan_ma_tai_khoan_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TaiKhoan_ma_tai_khoan_seq"', 11, true);


--
-- TOC entry 4976 (class 2606 OID 16490)
-- Name: BangCap BangCap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BangCap"
    ADD CONSTRAINT "BangCap_pkey" PRIMARY KEY (ma_bang_cap);


--
-- TOC entry 4985 (class 2606 OID 16544)
-- Name: BangLuong BangLuong_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BangLuong"
    ADD CONSTRAINT "BangLuong_pkey" PRIMARY KEY (ma_bang_luong);


--
-- TOC entry 4987 (class 2606 OID 16558)
-- Name: BangThuong BangThuong_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BangThuong"
    ADD CONSTRAINT "BangThuong_pkey" PRIMARY KEY (ma_thuong);


--
-- TOC entry 5010 (class 2606 OID 16703)
-- Name: CamKet CamKet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CamKet"
    ADD CONSTRAINT "CamKet_pkey" PRIMARY KEY (ma_cam_ket);


--
-- TOC entry 4997 (class 2606 OID 16624)
-- Name: ChuongTrinhHoc ChuongTrinhHoc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChuongTrinhHoc"
    ADD CONSTRAINT "ChuongTrinhHoc_pkey" PRIMARY KEY (ma_chuong_trinh);


--
-- TOC entry 5006 (class 2606 OID 16677)
-- Name: ChuongTrinhKhuyenMai ChuongTrinhKhuyenMai_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChuongTrinhKhuyenMai"
    ADD CONSTRAINT "ChuongTrinhKhuyenMai_pkey" PRIMARY KEY (ma_khuyen_mai);


--
-- TOC entry 4991 (class 2606 OID 16586)
-- Name: ChuongTrinhMarketing ChuongTrinhMarketing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChuongTrinhMarketing"
    ADD CONSTRAINT "ChuongTrinhMarketing_pkey" PRIMARY KEY (ma_marketing);


--
-- TOC entry 5008 (class 2606 OID 16690)
-- Name: CongNo CongNo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CongNo"
    ADD CONSTRAINT "CongNo_pkey" PRIMARY KEY (ma_cong_no);


--
-- TOC entry 4989 (class 2606 OID 16571)
-- Name: HoatDongNgoaiKhoa HoatDongNgoaiKhoa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HoatDongNgoaiKhoa"
    ADD CONSTRAINT "HoatDongNgoaiKhoa_pkey" PRIMARY KEY (ma_hoat_dong);


--
-- TOC entry 5002 (class 2606 OID 16650)
-- Name: HocVien HocVien_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HocVien"
    ADD CONSTRAINT "HocVien_pkey" PRIMARY KEY (ma_hoc_vien);


--
-- TOC entry 4982 (class 2606 OID 16527)
-- Name: HopDongLaoDong HopDongLaoDong_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HopDongLaoDong"
    ADD CONSTRAINT "HopDongLaoDong_pkey" PRIMARY KEY (ma_hop_dong);


--
-- TOC entry 5004 (class 2606 OID 16662)
-- Name: KeHoachGiangDay KeHoachGiangDay_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KeHoachGiangDay"
    ADD CONSTRAINT "KeHoachGiangDay_pkey" PRIMARY KEY (ma_ke_hoach);


--
-- TOC entry 4999 (class 2606 OID 16637)
-- Name: KhoaHoc KhoaHoc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KhoaHoc"
    ADD CONSTRAINT "KhoaHoc_pkey" PRIMARY KEY (ma_khoa_hoc);


--
-- TOC entry 4978 (class 2606 OID 16501)
-- Name: NhanSu NhanSu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NhanSu"
    ADD CONSTRAINT "NhanSu_pkey" PRIMARY KEY (ma_nhan_su);


--
-- TOC entry 4993 (class 2606 OID 16599)
-- Name: PhieuChi PhieuChi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhieuChi"
    ADD CONSTRAINT "PhieuChi_pkey" PRIMARY KEY (ma_phieu_chi);


--
-- TOC entry 4995 (class 2606 OID 16613)
-- Name: PhieuThu PhieuThu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_pkey" PRIMARY KEY (ma_phieu_thu);


--
-- TOC entry 4980 (class 2606 OID 16512)
-- Name: PhongBan PhongBan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhongBan"
    ADD CONSTRAINT "PhongBan_pkey" PRIMARY KEY (ma_phong_ban);


--
-- TOC entry 4969 (class 2606 OID 16454)
-- Name: Quyen Quyen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quyen"
    ADD CONSTRAINT "Quyen_pkey" PRIMARY KEY (ma_quyen);


--
-- TOC entry 4973 (class 2606 OID 16470)
-- Name: TaiKhoan TaiKhoan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaiKhoan"
    ADD CONSTRAINT "TaiKhoan_pkey" PRIMARY KEY (ma_tai_khoan);


--
-- TOC entry 5000 (class 1259 OID 16705)
-- Name: HocVien_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "HocVien_email_key" ON public."HocVien" USING btree (email);


--
-- TOC entry 4983 (class 1259 OID 16704)
-- Name: HopDongLaoDong_so_hop_dong_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "HopDongLaoDong_so_hop_dong_key" ON public."HopDongLaoDong" USING btree (so_hop_dong);


--
-- TOC entry 4970 (class 1259 OID 16471)
-- Name: Quyen_ten_quyen_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Quyen_ten_quyen_key" ON public."Quyen" USING btree (ten_quyen);


--
-- TOC entry 4971 (class 1259 OID 16473)
-- Name: TaiKhoan_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TaiKhoan_email_key" ON public."TaiKhoan" USING btree (email);


--
-- TOC entry 4974 (class 1259 OID 16472)
-- Name: TaiKhoan_ten_dang_nhap_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TaiKhoan_ten_dang_nhap_key" ON public."TaiKhoan" USING btree (ten_dang_nhap);


--
-- TOC entry 5016 (class 2606 OID 16726)
-- Name: BangLuong BangLuong_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BangLuong"
    ADD CONSTRAINT "BangLuong_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5017 (class 2606 OID 16736)
-- Name: BangThuong BangThuong_ma_bang_luong_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BangThuong"
    ADD CONSTRAINT "BangThuong_ma_bang_luong_fkey" FOREIGN KEY (ma_bang_luong) REFERENCES public."BangLuong"(ma_bang_luong) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5018 (class 2606 OID 16731)
-- Name: BangThuong BangThuong_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BangThuong"
    ADD CONSTRAINT "BangThuong_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5030 (class 2606 OID 16796)
-- Name: CamKet CamKet_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CamKet"
    ADD CONSTRAINT "CamKet_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5028 (class 2606 OID 16786)
-- Name: ChuongTrinhKhuyenMai ChuongTrinhKhuyenMai_ma_khoa_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChuongTrinhKhuyenMai"
    ADD CONSTRAINT "ChuongTrinhKhuyenMai_ma_khoa_hoc_fkey" FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5020 (class 2606 OID 16746)
-- Name: ChuongTrinhMarketing ChuongTrinhMarketing_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChuongTrinhMarketing"
    ADD CONSTRAINT "ChuongTrinhMarketing_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5029 (class 2606 OID 16791)
-- Name: CongNo CongNo_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CongNo"
    ADD CONSTRAINT "CongNo_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5019 (class 2606 OID 16741)
-- Name: HoatDongNgoaiKhoa HoatDongNgoaiKhoa_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HoatDongNgoaiKhoa"
    ADD CONSTRAINT "HoatDongNgoaiKhoa_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5026 (class 2606 OID 16776)
-- Name: HocVien HocVien_ma_khoa_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HocVien"
    ADD CONSTRAINT "HocVien_ma_khoa_hoc_fkey" FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5014 (class 2606 OID 16716)
-- Name: HopDongLaoDong HopDongLaoDong_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HopDongLaoDong"
    ADD CONSTRAINT "HopDongLaoDong_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5015 (class 2606 OID 16721)
-- Name: HopDongLaoDong HopDongLaoDong_ma_phong_ban_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HopDongLaoDong"
    ADD CONSTRAINT "HopDongLaoDong_ma_phong_ban_fkey" FOREIGN KEY (ma_phong_ban) REFERENCES public."PhongBan"(ma_phong_ban) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5027 (class 2606 OID 16781)
-- Name: KeHoachGiangDay KeHoachGiangDay_ma_khoa_hoc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KeHoachGiangDay"
    ADD CONSTRAINT "KeHoachGiangDay_ma_khoa_hoc_fkey" FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5025 (class 2606 OID 16771)
-- Name: KhoaHoc KhoaHoc_ma_chuong_trinh_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KhoaHoc"
    ADD CONSTRAINT "KhoaHoc_ma_chuong_trinh_fkey" FOREIGN KEY (ma_chuong_trinh) REFERENCES public."ChuongTrinhHoc"(ma_chuong_trinh) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5013 (class 2606 OID 16711)
-- Name: NhanSu NhanSu_ma_bang_cap_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NhanSu"
    ADD CONSTRAINT "NhanSu_ma_bang_cap_fkey" FOREIGN KEY (ma_bang_cap) REFERENCES public."BangCap"(ma_bang_cap) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5021 (class 2606 OID 16756)
-- Name: PhieuChi PhieuChi_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhieuChi"
    ADD CONSTRAINT "PhieuChi_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5022 (class 2606 OID 16751)
-- Name: PhieuChi PhieuChi_ma_phong_ban_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhieuChi"
    ADD CONSTRAINT "PhieuChi_ma_phong_ban_fkey" FOREIGN KEY (ma_phong_ban) REFERENCES public."PhongBan"(ma_phong_ban) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5023 (class 2606 OID 16761)
-- Name: PhieuThu PhieuThu_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_ma_hoc_vien_fkey" FOREIGN KEY (ma_hoc_vien) REFERENCES public."HocVien"(ma_hoc_vien) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5024 (class 2606 OID 16766)
-- Name: PhieuThu PhieuThu_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhieuThu"
    ADD CONSTRAINT "PhieuThu_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5011 (class 2606 OID 16706)
-- Name: TaiKhoan TaiKhoan_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaiKhoan"
    ADD CONSTRAINT "TaiKhoan_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5012 (class 2606 OID 16475)
-- Name: TaiKhoan TaiKhoan_ma_quyen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaiKhoan"
    ADD CONSTRAINT "TaiKhoan_ma_quyen_fkey" FOREIGN KEY (ma_quyen) REFERENCES public."Quyen"(ma_quyen) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-04-07 11:42:50

--
-- PostgreSQL database dump complete
--

\unrestrict bfYriwht6DCCUm3Vz2aIdrPxUgtR0xV51ieXIi2PYaCIfpdg8YBqVO3d6NRjWl8


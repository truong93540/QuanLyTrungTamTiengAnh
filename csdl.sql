--
-- PostgreSQL database dump
--



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

--

-- TOC entry 5 (class 2615 OID 16809)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5359 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 231 (class 1259 OID 16884)
-- Name: BangCap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BangCap" (
    ma_bang_cap integer NOT NULL,
    ten_bang_cap text NOT NULL
);


ALTER TABLE public."BangCap" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16883)
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
-- TOC entry 5361 (class 0 OID 0)
-- Dependencies: 230
-- Name: BangCap_ma_bang_cap_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BangCap_ma_bang_cap_seq" OWNED BY public."BangCap".ma_bang_cap;


--
-- TOC entry 239 (class 1259 OID 16941)
-- Name: BangLuong; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BangLuong" (
    ma_bang_luong integer NOT NULL,
    ky_luong text NOT NULL,
    ghi_chu text
);


ALTER TABLE public."BangLuong" OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16940)
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
-- TOC entry 5362 (class 0 OID 0)
-- Dependencies: 238
-- Name: BangLuong_ma_bang_luong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BangLuong_ma_bang_luong_seq" OWNED BY public."BangLuong".ma_bang_luong;


--
-- TOC entry 261 (class 1259 OID 17082)
-- Name: CamKet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CamKet" (
    ma_cam_ket integer NOT NULL,
    ngay_ky timestamp(3) without time zone NOT NULL,
    ngay_het_han timestamp(3) without time zone,
    noi_dung_cam_ket text,
    trang_thai text,
    ma_hoc_vien integer NOT NULL
);


ALTER TABLE public."CamKet" OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 17081)
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
-- TOC entry 5363 (class 0 OID 0)
-- Dependencies: 260
-- Name: CamKet_ma_cam_ket_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CamKet_ma_cam_ket_seq" OWNED BY public."CamKet".ma_cam_ket;


--
-- TOC entry 277 (class 1259 OID 17469)
-- Name: ChucVu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChucVu" (
    ma_chuc_vu integer NOT NULL,
    ten_chuc_vu text NOT NULL,
    ghi_chu text
);


ALTER TABLE public."ChucVu" OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 17468)
-- Name: ChucVu_ma_chuc_vu_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ChucVu_ma_chuc_vu_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChucVu_ma_chuc_vu_seq" OWNER TO postgres;

--
-- TOC entry 5364 (class 0 OID 0)
-- Dependencies: 276
-- Name: ChucVu_ma_chuc_vu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ChucVu_ma_chuc_vu_seq" OWNED BY public."ChucVu".ma_chuc_vu;


--
-- TOC entry 249 (class 1259 OID 17008)
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
-- TOC entry 248 (class 1259 OID 17007)
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
-- TOC entry 5365 (class 0 OID 0)
-- Dependencies: 248
-- Name: ChuongTrinhHoc_ma_chuong_trinh_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ChuongTrinhHoc_ma_chuong_trinh_seq" OWNED BY public."ChuongTrinhHoc".ma_chuong_trinh;


--
-- TOC entry 265 (class 1259 OID 17118)
-- Name: ChuongTrinhKhuyenMai; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChuongTrinhKhuyenMai" (
    ma_khuyen_mai integer NOT NULL,
    ten_chuong_trinh text NOT NULL,
    mo_ta text,
    phan_tram_giam double precision,
    ngay_bat_dau timestamp(3) without time zone NOT NULL,
    ngay_ket_thuc timestamp(3) without time zone
);


ALTER TABLE public."ChuongTrinhKhuyenMai" OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 17117)
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
-- TOC entry 5366 (class 0 OID 0)
-- Dependencies: 264
-- Name: ChuongTrinhKhuyenMai_ma_khuyen_mai_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq" OWNED BY public."ChuongTrinhKhuyenMai".ma_khuyen_mai;


--
-- TOC entry 273 (class 1259 OID 17419)
-- Name: ChuongTrinhMarketing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChuongTrinhMarketing" (
    ma_chuong_trinh_marketing integer NOT NULL,
    ten_chuong_trinh_marketing text NOT NULL,
    ma_khoa_hoc integer,
    noi_dung text,
    ngay_bat_dau date,
    ngay_ket_thuc date,
    ngan_sach numeric(15,2)
);


ALTER TABLE public."ChuongTrinhMarketing" OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 17418)
-- Name: ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq" OWNER TO postgres;

--
-- TOC entry 5367 (class 0 OID 0)
-- Dependencies: 272
-- Name: ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq" OWNED BY public."ChuongTrinhMarketing".ma_chuong_trinh_marketing;


--
-- TOC entry 247 (class 1259 OID 16995)
-- Name: CongNo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CongNo" (
    ma_cong_no integer NOT NULL,
    so_tien_no numeric(65,30) NOT NULL,
    ngay_phat_sinh timestamp(3) without time zone NOT NULL,
    han_thanh_toan timestamp(3) without time zone,
    trang_thai text,
    ma_hoc_vien integer NOT NULL
);


ALTER TABLE public."CongNo" OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 16994)
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
-- TOC entry 5368 (class 0 OID 0)
-- Dependencies: 246
-- Name: CongNo_ma_cong_no_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CongNo_ma_cong_no_seq" OWNED BY public."CongNo".ma_cong_no;


--
-- TOC entry 233 (class 1259 OID 16895)
-- Name: HoSoBangCap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."HoSoBangCap" (
    ma_ho_so_bang_cap integer NOT NULL,
    ma_nhan_su integer NOT NULL,
    ma_bang_cap integer NOT NULL,
    ngay_cap timestamp(3) without time zone,
    noi_cap text
);


ALTER TABLE public."HoSoBangCap" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16894)
-- Name: HoSoBangCap_ma_ho_so_bang_cap_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."HoSoBangCap_ma_ho_so_bang_cap_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."HoSoBangCap_ma_ho_so_bang_cap_seq" OWNER TO postgres;

--
-- TOC entry 5369 (class 0 OID 0)
-- Dependencies: 232
-- Name: HoSoBangCap_ma_ho_so_bang_cap_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."HoSoBangCap_ma_ho_so_bang_cap_seq" OWNED BY public."HoSoBangCap".ma_ho_so_bang_cap;


--
-- TOC entry 267 (class 1259 OID 17130)
-- Name: HoatDongNgoaiKhoa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."HoatDongNgoaiKhoa" (
    ma_hoat_dong_ngoai_khoa integer NOT NULL,
    ten_hoat_dong text NOT NULL,
    mo_ta text,
    ngay_to_chuc timestamp(3) without time zone NOT NULL,
    dia_diem text,
    chi_phi numeric(65,30)
);


ALTER TABLE public."HoatDongNgoaiKhoa" OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 17129)
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq" OWNER TO postgres;

--
-- TOC entry 5370 (class 0 OID 0)
-- Dependencies: 266
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq" OWNED BY public."HoatDongNgoaiKhoa".ma_hoat_dong_ngoai_khoa;


--
-- TOC entry 257 (class 1259 OID 17057)
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
    trang_thai text
);


ALTER TABLE public."HocVien" OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 17056)
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
-- TOC entry 5371 (class 0 OID 0)
-- Dependencies: 256
-- Name: HocVien_ma_hoc_vien_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."HocVien_ma_hoc_vien_seq" OWNED BY public."HocVien".ma_hoc_vien;


--
-- TOC entry 235 (class 1259 OID 16907)
-- Name: HopDongLaoDong; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."HopDongLaoDong" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16906)
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
-- TOC entry 5372 (class 0 OID 0)
-- Dependencies: 234
-- Name: HopDongLaoDong_ma_hop_dong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."HopDongLaoDong_ma_hop_dong_seq" OWNED BY public."HopDongLaoDong".ma_hop_dong;


--
-- TOC entry 263 (class 1259 OID 17094)
-- Name: KeHoachGiangDay; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KeHoachGiangDay" (
    ma_ke_hoach integer NOT NULL,
    noi_dung text,
    lich_day text,
    thoi_gian text,
    ma_khoa_hoc integer NOT NULL,
    ma_nhan_su integer NOT NULL
);


ALTER TABLE public."KeHoachGiangDay" OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 17093)
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
-- TOC entry 5373 (class 0 OID 0)
-- Dependencies: 262
-- Name: KeHoachGiangDay_ma_ke_hoach_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."KeHoachGiangDay_ma_ke_hoach_seq" OWNED BY public."KeHoachGiangDay".ma_ke_hoach;


--
-- TOC entry 251 (class 1259 OID 17019)
-- Name: KhoaHoc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KhoaHoc" (
    ma_khoa_hoc integer NOT NULL,
    ten_khoa_hoc text NOT NULL,
    mo_ta text,
    thoi_luong text,
    hoc_phi numeric(65,30) NOT NULL,
    trinh_do text,
    ma_chuong_trinh integer NOT NULL,
    trang_thai text DEFAULT 'Hoạt động'::character varying
);


ALTER TABLE public."KhoaHoc" OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 17018)
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
-- TOC entry 5374 (class 0 OID 0)
-- Dependencies: 250
-- Name: KhoaHoc_ma_khoa_hoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."KhoaHoc_ma_khoa_hoc_seq" OWNED BY public."KhoaHoc".ma_khoa_hoc;


--
-- TOC entry 255 (class 1259 OID 17043)
-- Name: LopHoc; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."LopHoc" OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 17042)
-- Name: LopHoc_ma_lop_hoc_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."LopHoc_ma_lop_hoc_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LopHoc_ma_lop_hoc_seq" OWNER TO postgres;

--
-- TOC entry 5375 (class 0 OID 0)
-- Dependencies: 254
-- Name: LopHoc_ma_lop_hoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."LopHoc_ma_lop_hoc_seq" OWNED BY public."LopHoc".ma_lop_hoc;


--
-- TOC entry 229 (class 1259 OID 16872)
-- Name: NhanSu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NhanSu" (
    ma_nhan_su integer NOT NULL,
    ho_ten text NOT NULL,
    ngay_sinh timestamp(3) without time zone,
    gioi_tinh text,
    so_dien_thoai text,
    dia_chi text,
    ma_phong_ban integer NOT NULL,
    ma_chuc_vu integer NOT NULL
);


ALTER TABLE public."NhanSu" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16871)
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
-- TOC entry 5376 (class 0 OID 0)
-- Dependencies: 228
-- Name: NhanSu_ma_nhan_su_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."NhanSu_ma_nhan_su_seq" OWNED BY public."NhanSu".ma_nhan_su;


--
-- TOC entry 271 (class 1259 OID 17152)
-- Name: PhanCongHoatDong; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PhanCongHoatDong" (
    ma_phan_cong integer NOT NULL,
    ma_nhan_su integer NOT NULL,
    ma_hoat_dong_ngoai_khoa integer NOT NULL
);


ALTER TABLE public."PhanCongHoatDong" OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 17151)
-- Name: PhanCongHoatDong_ma_phan_cong_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PhanCongHoatDong_ma_phan_cong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PhanCongHoatDong_ma_phan_cong_seq" OWNER TO postgres;

--
-- TOC entry 5377 (class 0 OID 0)
-- Dependencies: 270
-- Name: PhanCongHoatDong_ma_phan_cong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhanCongHoatDong_ma_phan_cong_seq" OWNED BY public."PhanCongHoatDong".ma_phan_cong;


--
-- TOC entry 275 (class 1259 OID 17435)
-- Name: PhanCongMarketing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PhanCongMarketing" (
    ma_phan_cong_marketing integer NOT NULL,
    ma_chuong_trinh_marketing integer NOT NULL,
    ma_nhan_su integer NOT NULL,
    vai_tro text
);


ALTER TABLE public."PhanCongMarketing" OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 17434)
-- Name: PhanCongMarketing_ma_phan_cong_marketing_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PhanCongMarketing_ma_phan_cong_marketing_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PhanCongMarketing_ma_phan_cong_marketing_seq" OWNER TO postgres;

--
-- TOC entry 5378 (class 0 OID 0)
-- Dependencies: 274
-- Name: PhanCongMarketing_ma_phan_cong_marketing_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhanCongMarketing_ma_phan_cong_marketing_seq" OWNED BY public."PhanCongMarketing".ma_phan_cong_marketing;


--
-- TOC entry 225 (class 1259 OID 16851)
-- Name: PhanQuyen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PhanQuyen" (
    ma_phan_quyen integer NOT NULL,
    ma_tai_khoan integer NOT NULL,
    ma_quyen integer NOT NULL
);


ALTER TABLE public."PhanQuyen" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16850)
-- Name: PhanQuyen_ma_phan_quyen_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PhanQuyen_ma_phan_quyen_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PhanQuyen_ma_phan_quyen_seq" OWNER TO postgres;

--
-- TOC entry 5379 (class 0 OID 0)
-- Dependencies: 224
-- Name: PhanQuyen_ma_phan_quyen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhanQuyen_ma_phan_quyen_seq" OWNED BY public."PhanQuyen".ma_phan_quyen;


--
-- TOC entry 245 (class 1259 OID 16981)
-- Name: PhieuChi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PhieuChi" (
    ma_phieu_chi integer NOT NULL,
    so_tien numeric(65,30) NOT NULL,
    ngay_chi timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    noi_dung text,
    ma_nhan_su integer NOT NULL
);


ALTER TABLE public."PhieuChi" OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16980)
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
-- TOC entry 5380 (class 0 OID 0)
-- Dependencies: 244
-- Name: PhieuChi_ma_phieu_chi_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhieuChi_ma_phieu_chi_seq" OWNED BY public."PhieuChi".ma_phieu_chi;


--
-- TOC entry 237 (class 1259 OID 16920)
-- Name: PhieuLuong; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."PhieuLuong" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16919)
-- Name: PhieuLuong_ma_phieu_luong_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PhieuLuong_ma_phieu_luong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PhieuLuong_ma_phieu_luong_seq" OWNER TO postgres;

--
-- TOC entry 5381 (class 0 OID 0)
-- Dependencies: 236
-- Name: PhieuLuong_ma_phieu_luong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhieuLuong_ma_phieu_luong_seq" OWNED BY public."PhieuLuong".ma_phieu_luong;


--
-- TOC entry 243 (class 1259 OID 16966)
-- Name: PhieuThu; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."PhieuThu" OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16965)
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
-- TOC entry 5382 (class 0 OID 0)
-- Dependencies: 242
-- Name: PhieuThu_ma_phieu_thu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhieuThu_ma_phieu_thu_seq" OWNED BY public."PhieuThu".ma_phieu_thu;


--
-- TOC entry 241 (class 1259 OID 16952)
-- Name: PhieuThuong; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."PhieuThuong" OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16951)
-- Name: PhieuThuong_ma_phieu_thuong_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PhieuThuong_ma_phieu_thuong_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PhieuThuong_ma_phieu_thuong_seq" OWNER TO postgres;

--
-- TOC entry 5383 (class 0 OID 0)
-- Dependencies: 240
-- Name: PhieuThuong_ma_phieu_thuong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhieuThuong_ma_phieu_thuong_seq" OWNED BY public."PhieuThuong".ma_phieu_thuong;


--
-- TOC entry 227 (class 1259 OID 16861)
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
-- TOC entry 226 (class 1259 OID 16860)
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
-- TOC entry 5384 (class 0 OID 0)
-- Dependencies: 226
-- Name: PhongBan_ma_phong_ban_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhongBan_ma_phong_ban_seq" OWNED BY public."PhongBan".ma_phong_ban;


--
-- TOC entry 253 (class 1259 OID 17032)
-- Name: PhongHoc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PhongHoc" (
    ma_phong_hoc integer NOT NULL,
    ten_phong_hoc text NOT NULL,
    suc_chua integer
);


ALTER TABLE public."PhongHoc" OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 17031)
-- Name: PhongHoc_ma_phong_hoc_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PhongHoc_ma_phong_hoc_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PhongHoc_ma_phong_hoc_seq" OWNER TO postgres;

--
-- TOC entry 5385 (class 0 OID 0)
-- Dependencies: 252
-- Name: PhongHoc_ma_phong_hoc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhongHoc_ma_phong_hoc_seq" OWNED BY public."PhongHoc".ma_phong_hoc;


--
-- TOC entry 221 (class 1259 OID 16826)
-- Name: Quyen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Quyen" (
    ma_quyen integer NOT NULL,
    ten_quyen text NOT NULL,
    trang_thai text
);


ALTER TABLE public."Quyen" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16825)
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
-- TOC entry 5386 (class 0 OID 0)
-- Dependencies: 220
-- Name: Quyen_ma_quyen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Quyen_ma_quyen_seq" OWNED BY public."Quyen".ma_quyen;


--
-- TOC entry 223 (class 1259 OID 16837)
-- Name: TaiKhoan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TaiKhoan" (
    ma_tai_khoan integer NOT NULL,
    ten_dang_nhap text NOT NULL,
    mat_khau text NOT NULL,
    email text NOT NULL,
    trang_thai text,
    ma_nhan_su integer NOT NULL
);


ALTER TABLE public."TaiKhoan" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16836)
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
-- TOC entry 5387 (class 0 OID 0)
-- Dependencies: 222
-- Name: TaiKhoan_ma_tai_khoan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TaiKhoan_ma_tai_khoan_seq" OWNED BY public."TaiKhoan".ma_tai_khoan;


--
-- TOC entry 259 (class 1259 OID 17068)
-- Name: ThamGiaLop; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ThamGiaLop" (
    ma_tham_gia_lop integer NOT NULL,
    ma_hoc_vien integer NOT NULL,
    ma_lop_hoc integer NOT NULL,
    ngay_dang_ky timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    trang_thai text
);


ALTER TABLE public."ThamGiaLop" OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 17067)
-- Name: ThamGiaLop_ma_tham_gia_lop_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ThamGiaLop_ma_tham_gia_lop_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ThamGiaLop_ma_tham_gia_lop_seq" OWNER TO postgres;

--
-- TOC entry 5388 (class 0 OID 0)
-- Dependencies: 258
-- Name: ThamGiaLop_ma_tham_gia_lop_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ThamGiaLop_ma_tham_gia_lop_seq" OWNED BY public."ThamGiaLop".ma_tham_gia_lop;


--
-- TOC entry 269 (class 1259 OID 17142)
-- Name: ThamGiaNgoaiKhoa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ThamGiaNgoaiKhoa" (
    ma_tham_gia_ngoai_khoa integer NOT NULL,
    ma_hoc_vien integer NOT NULL,
    ma_hoat_dong_ngoai_khoa integer NOT NULL
);


ALTER TABLE public."ThamGiaNgoaiKhoa" OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 17141)
-- Name: ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq" OWNER TO postgres;

--
-- TOC entry 5389 (class 0 OID 0)
-- Dependencies: 268
-- Name: ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq" OWNED BY public."ThamGiaNgoaiKhoa".ma_tham_gia_ngoai_khoa;


--
-- TOC entry 219 (class 1259 OID 16810)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 5007 (class 2604 OID 16887)
-- Name: BangCap ma_bang_cap; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BangCap" ALTER COLUMN ma_bang_cap SET DEFAULT nextval('public."BangCap_ma_bang_cap_seq"'::regclass);


--
-- TOC entry 5017 (class 2604 OID 16944)
-- Name: BangLuong ma_bang_luong; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BangLuong" ALTER COLUMN ma_bang_luong SET DEFAULT nextval('public."BangLuong_ma_bang_luong_seq"'::regclass);


--
-- TOC entry 5032 (class 2604 OID 17085)
-- Name: CamKet ma_cam_ket; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CamKet" ALTER COLUMN ma_cam_ket SET DEFAULT nextval('public."CamKet_ma_cam_ket_seq"'::regclass);


--
-- TOC entry 5040 (class 2604 OID 17472)
-- Name: ChucVu ma_chuc_vu; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChucVu" ALTER COLUMN ma_chuc_vu SET DEFAULT nextval('public."ChucVu_ma_chuc_vu_seq"'::regclass);


--
-- TOC entry 5024 (class 2604 OID 17011)
-- Name: ChuongTrinhHoc ma_chuong_trinh; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChuongTrinhHoc" ALTER COLUMN ma_chuong_trinh SET DEFAULT nextval('public."ChuongTrinhHoc_ma_chuong_trinh_seq"'::regclass);


--
-- TOC entry 5034 (class 2604 OID 17121)
-- Name: ChuongTrinhKhuyenMai ma_khuyen_mai; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChuongTrinhKhuyenMai" ALTER COLUMN ma_khuyen_mai SET DEFAULT nextval('public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"'::regclass);


--
-- TOC entry 5038 (class 2604 OID 17422)
-- Name: ChuongTrinhMarketing ma_chuong_trinh_marketing; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChuongTrinhMarketing" ALTER COLUMN ma_chuong_trinh_marketing SET DEFAULT nextval('public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq"'::regclass);


--
-- TOC entry 5023 (class 2604 OID 16998)
-- Name: CongNo ma_cong_no; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CongNo" ALTER COLUMN ma_cong_no SET DEFAULT nextval('public."CongNo_ma_cong_no_seq"'::regclass);


--
-- TOC entry 5008 (class 2604 OID 16898)
-- Name: HoSoBangCap ma_ho_so_bang_cap; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HoSoBangCap" ALTER COLUMN ma_ho_so_bang_cap SET DEFAULT nextval('public."HoSoBangCap_ma_ho_so_bang_cap_seq"'::regclass);


--
-- TOC entry 5035 (class 2604 OID 17133)
-- Name: HoatDongNgoaiKhoa ma_hoat_dong_ngoai_khoa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HoatDongNgoaiKhoa" ALTER COLUMN ma_hoat_dong_ngoai_khoa SET DEFAULT nextval('public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq"'::regclass);


--
-- TOC entry 5029 (class 2604 OID 17060)
-- Name: HocVien ma_hoc_vien; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HocVien" ALTER COLUMN ma_hoc_vien SET DEFAULT nextval('public."HocVien_ma_hoc_vien_seq"'::regclass);


--
-- TOC entry 5009 (class 2604 OID 16910)
-- Name: HopDongLaoDong ma_hop_dong; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HopDongLaoDong" ALTER COLUMN ma_hop_dong SET DEFAULT nextval('public."HopDongLaoDong_ma_hop_dong_seq"'::regclass);


--
-- TOC entry 5033 (class 2604 OID 17097)
-- Name: KeHoachGiangDay ma_ke_hoach; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KeHoachGiangDay" ALTER COLUMN ma_ke_hoach SET DEFAULT nextval('public."KeHoachGiangDay_ma_ke_hoach_seq"'::regclass);


--
-- TOC entry 5025 (class 2604 OID 17022)
-- Name: KhoaHoc ma_khoa_hoc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KhoaHoc" ALTER COLUMN ma_khoa_hoc SET DEFAULT nextval('public."KhoaHoc_ma_khoa_hoc_seq"'::regclass);


--
-- TOC entry 5028 (class 2604 OID 17046)
-- Name: LopHoc ma_lop_hoc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LopHoc" ALTER COLUMN ma_lop_hoc SET DEFAULT nextval('public."LopHoc_ma_lop_hoc_seq"'::regclass);


--
-- TOC entry 5006 (class 2604 OID 16875)
-- Name: NhanSu ma_nhan_su; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NhanSu" ALTER COLUMN ma_nhan_su SET DEFAULT nextval('public."NhanSu_ma_nhan_su_seq"'::regclass);


--
-- TOC entry 5037 (class 2604 OID 17155)
-- Name: PhanCongHoatDong ma_phan_cong; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhanCongHoatDong" ALTER COLUMN ma_phan_cong SET DEFAULT nextval('public."PhanCongHoatDong_ma_phan_cong_seq"'::regclass);


--
-- TOC entry 5039 (class 2604 OID 17438)
-- Name: PhanCongMarketing ma_phan_cong_marketing; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhanCongMarketing" ALTER COLUMN ma_phan_cong_marketing SET DEFAULT nextval('public."PhanCongMarketing_ma_phan_cong_marketing_seq"'::regclass);


--
-- TOC entry 5004 (class 2604 OID 16854)
-- Name: PhanQuyen ma_phan_quyen; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhanQuyen" ALTER COLUMN ma_phan_quyen SET DEFAULT nextval('public."PhanQuyen_ma_phan_quyen_seq"'::regclass);


--
-- TOC entry 5021 (class 2604 OID 16984)
-- Name: PhieuChi ma_phieu_chi; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhieuChi" ALTER COLUMN ma_phieu_chi SET DEFAULT nextval('public."PhieuChi_ma_phieu_chi_seq"'::regclass);


--
-- TOC entry 5010 (class 2604 OID 16923)
-- Name: PhieuLuong ma_phieu_luong; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhieuLuong" ALTER COLUMN ma_phieu_luong SET DEFAULT nextval('public."PhieuLuong_ma_phieu_luong_seq"'::regclass);


--
-- TOC entry 5019 (class 2604 OID 16969)
-- Name: PhieuThu ma_phieu_thu; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhieuThu" ALTER COLUMN ma_phieu_thu SET DEFAULT nextval('public."PhieuThu_ma_phieu_thu_seq"'::regclass);


--
-- TOC entry 5018 (class 2604 OID 16955)
-- Name: PhieuThuong ma_phieu_thuong; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhieuThuong" ALTER COLUMN ma_phieu_thuong SET DEFAULT nextval('public."PhieuThuong_ma_phieu_thuong_seq"'::regclass);


--
-- TOC entry 5005 (class 2604 OID 16864)
-- Name: PhongBan ma_phong_ban; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhongBan" ALTER COLUMN ma_phong_ban SET DEFAULT nextval('public."PhongBan_ma_phong_ban_seq"'::regclass);


--
-- TOC entry 5027 (class 2604 OID 17035)
-- Name: PhongHoc ma_phong_hoc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhongHoc" ALTER COLUMN ma_phong_hoc SET DEFAULT nextval('public."PhongHoc_ma_phong_hoc_seq"'::regclass);


--
-- TOC entry 5002 (class 2604 OID 16829)
-- Name: Quyen ma_quyen; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quyen" ALTER COLUMN ma_quyen SET DEFAULT nextval('public."Quyen_ma_quyen_seq"'::regclass);


--
-- TOC entry 5003 (class 2604 OID 16840)
-- Name: TaiKhoan ma_tai_khoan; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaiKhoan" ALTER COLUMN ma_tai_khoan SET DEFAULT nextval('public."TaiKhoan_ma_tai_khoan_seq"'::regclass);


--
-- TOC entry 5030 (class 2604 OID 17071)
-- Name: ThamGiaLop ma_tham_gia_lop; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ThamGiaLop" ALTER COLUMN ma_tham_gia_lop SET DEFAULT nextval('public."ThamGiaLop_ma_tham_gia_lop_seq"'::regclass);


--
-- TOC entry 5036 (class 2604 OID 17145)
-- Name: ThamGiaNgoaiKhoa ma_tham_gia_ngoai_khoa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ThamGiaNgoaiKhoa" ALTER COLUMN ma_tham_gia_ngoai_khoa SET DEFAULT nextval('public."ThamGiaNgoaiKhoa_ma_tham_gia_ngoai_khoa_seq"'::regclass);


--
-- TOC entry 5307 (class 0 OID 16884)
-- Dependencies: 231
-- Data for Name: BangCap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5315 (class 0 OID 16941)
-- Dependencies: 239
-- Data for Name: BangLuong; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5337 (class 0 OID 17082)
-- Dependencies: 261
-- Data for Name: CamKet; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (1, '2026-04-10 09:00:00', '2026-10-10 17:00:00', 'Cam kết đầu ra IELTS 6.5: Học viên đi học đầy đủ và làm bài tập sẽ đạt mục tiêu, nếu không sẽ được học lại miễn phí.', 'Đang hiệu lực', 1);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (2, '2026-04-15 14:30:00', '2026-07-15 14:30:00', 'Nội quy Homestay: Cam kết tuân thủ giờ giấc sinh hoạt, không gây ồn ào sau 23h và giữ gìn vệ sinh chung.', 'Đang hiệu lực', 2);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (3, '2025-10-01 08:00:00', '2026-04-01 08:00:00', 'Hợp đồng chuyên cần: Cam kết tham gia ít nhất 95% số buổi học bổ trợ buổi tối cùng giáo viên bản ngữ.', 'Đã hết hạn', 3);


--
-- TOC entry 5353 (class 0 OID 17469)
-- Dependencies: 277
-- Data for Name: ChucVu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (3, 'Quản lý đào tạo', 'Lập kế hoạch giảng dạy, kiểm soát chất lượng giáo viên và chương trình học.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (5, 'Giáo viên Việt Nam', 'Giảng dạy ngữ pháp, luyện thi IELTS/TOEIC và hỗ trợ học viên.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (6, 'Trợ giảng (Tutor)', 'Hỗ trợ giáo viên trong lớp, kèm cặp học viên yếu và chấm bài tập.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (7, 'Nhân viên Tư vấn (Sales)', 'Tìm kiếm học viên mới, tư vấn khóa học và ký kết hợp đồng.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (8, 'Nhân viên Marketing', 'Chạy quảng cáo, quản lý Fanpage và tổ chức sự kiện ngoại khóa.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (9, 'Kế toán', 'Quản lý thu chi, lập phiếu thu học phí và tính lương nhân sự.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (10, 'Lễ tân', 'Đón tiếp khách, hướng dẫn học viên và trực điện thoại hotline.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (1, 'Quản trị viên', 'Quản lý toàn bộ hệ thống');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (4, 'Giáo viên nước ngoài', 'Giảng dạy trực tiếp, tập trung vào kỹ năng nghe - nói.');
INSERT INTO public."ChucVu" (ma_chuc_vu, ten_chuc_vu, ghi_chu) VALUES (2, 'Giáo viên bản ngữ', 'Chịu trách nhiệm về giáo trình và chất lượng giảng dạy.');


--
-- TOC entry 5325 (class 0 OID 17008)
-- Dependencies: 249
-- Data for Name: ChuongTrinhHoc; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5341 (class 0 OID 17118)
-- Dependencies: 265
-- Data for Name: ChuongTrinhKhuyenMai; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5349 (class 0 OID 17419)
-- Dependencies: 273
-- Data for Name: ChuongTrinhMarketing; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5323 (class 0 OID 16995)
-- Dependencies: 247
-- Data for Name: CongNo; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5309 (class 0 OID 16895)
-- Dependencies: 233
-- Data for Name: HoSoBangCap; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5343 (class 0 OID 17130)
-- Dependencies: 267
-- Data for Name: HoatDongNgoaiKhoa; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5333 (class 0 OID 17057)
-- Dependencies: 257
-- Data for Name: HocVien; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, trang_thai) VALUES (1, 'Trần Thị Thu Hà', '2005-05-20 00:00:00', NULL, '0912345678', 'thuha@gmail.com', NULL, NULL);
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, trang_thai) VALUES (2, 'Lê Văn Nam', '2004-10-15 00:00:00', NULL, '0988776655', 'vannam.le@gmail.com', NULL, NULL);
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, trang_thai) VALUES (3, 'Nguyễn Minh Anh', '2005-08-12 00:00:00', 'Nữ', NULL, NULL, NULL, NULL);
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, trang_thai) VALUES (4, 'Phạm Hoàng Long', '2006-03-22 00:00:00', 'Nam', NULL, NULL, NULL, NULL);
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, trang_thai) VALUES (5, 'Đỗ Thùy Chi', '2004-12-05 00:00:00', 'Nữ', NULL, NULL, NULL, NULL);
INSERT INTO public."HocVien" (ma_hoc_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, trang_thai) VALUES (6, 'Bùi Văn Mạnh', '2005-01-30 00:00:00', 'Nam', NULL, NULL, NULL, NULL);


--
-- TOC entry 5311 (class 0 OID 16907)
-- Dependencies: 235
-- Data for Name: HopDongLaoDong; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5339 (class 0 OID 17094)
-- Dependencies: 263
-- Data for Name: KeHoachGiangDay; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5327 (class 0 OID 17019)
-- Dependencies: 251
-- Data for Name: KhoaHoc; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5331 (class 0 OID 17043)
-- Dependencies: 255
-- Data for Name: LopHoc; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5305 (class 0 OID 16872)
-- Dependencies: 229
-- Data for Name: NhanSu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_phong_ban, ma_chuc_vu) VALUES (1, 'Nguyễn Văn Trường', NULL, NULL, '0987654321', NULL, 1, 1);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_phong_ban, ma_chuc_vu) VALUES (2, 'Lê Văn Nam', '1995-05-10 00:00:00', 'Nam', '0912334455', 'Ngô Quyền, Hải Phòng', 2, 3);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_phong_ban, ma_chuc_vu) VALUES (3, 'Trần Thị Thu Hà', '1998-11-20 00:00:00', 'Nữ', '0988776655', 'Lê Chân, Hải Phòng', 3, 6);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_phong_ban, ma_chuc_vu) VALUES (4, 'Phạm Minh Đức', '1990-03-15 00:00:00', 'Nam', '0904556677', 'Hồng Bàng, Hải Phòng', 1, 2);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_phong_ban, ma_chuc_vu) VALUES (5, 'Đỗ Thùy Linh', '2000-07-25 00:00:00', 'Nữ', '0936112233', 'Thủy Nguyên, Hải Phòng', 4, 8);


--
-- TOC entry 5347 (class 0 OID 17152)
-- Dependencies: 271
-- Data for Name: PhanCongHoatDong; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5351 (class 0 OID 17435)
-- Dependencies: 275
-- Data for Name: PhanCongMarketing; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5301 (class 0 OID 16851)
-- Dependencies: 225
-- Data for Name: PhanQuyen; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (1, 1, 1);


--
-- TOC entry 5321 (class 0 OID 16981)
-- Dependencies: 245
-- Data for Name: PhieuChi; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5313 (class 0 OID 16920)
-- Dependencies: 237
-- Data for Name: PhieuLuong; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5319 (class 0 OID 16966)
-- Dependencies: 243
-- Data for Name: PhieuThu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (2, 2000000.000000000000000000000000000000, '2026-04-10 23:32:08.962', 'Học phí khóa Giao tiếp cấp tốc', 2, 1, NULL, NULL);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (1, 1500000.000000000000000000000000000000, '2026-04-10 00:00:00', 'Thu học phí khóa IELTS cơ bản - Tháng 04/2026', 1, 1, NULL, NULL);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (3, 2000000.000000000000000000000000000000, '2026-04-15 00:00:00', 'Thu học phí khóa TOEIC cơ bản', 1, 1, NULL, NULL);


--
-- TOC entry 5317 (class 0 OID 16952)
-- Dependencies: 241
-- Data for Name: PhieuThuong; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5303 (class 0 OID 16861)
-- Dependencies: 227
-- Data for Name: PhongBan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (1, 'Ban Quản Trị', 'Điều hành toàn bộ hệ thống HP English Homestay', '2026-04-10 22:47:10.979');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (2, 'Phòng Đào tạo', 'Quản lý giáo viên, chương trình giảng dạy và chất lượng học viên.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (3, 'Phòng Tuyển sinh', 'Tư vấn khóa học, tìm kiếm học viên và chăm sóc khách hàng.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (4, 'Phòng Kế toán', 'Quản lý thu chi học phí, quỹ homestay và bảng lương nhân sự.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (5, 'Phòng Marketing', 'Truyền thông, quảng bá hình ảnh và tổ chức sự kiện ngoại khóa.', '2026-04-10 22:47:10');


--
-- TOC entry 5329 (class 0 OID 17032)
-- Dependencies: 253
-- Data for Name: PhongHoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (1, 'Phòng Lý Thuyết A101', 45);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (2, 'Phòng Thực Hành IT 01', 30);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (3, 'Hội Trường Lớn B2', 150);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (4, 'Phòng Học Nhóm G3', 15);
INSERT INTO public."PhongHoc" (ma_phong_hoc, ten_phong_hoc, suc_chua) VALUES (6, 'phòng đào tạo quốc tế', 50);


--
-- TOC entry 5297 (class 0 OID 16826)
-- Dependencies: 221
-- Data for Name: Quyen; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (1, 'ADMIN', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (2, 'GIAO_VIEN', 'Hoạt động');


--
-- TOC entry 5299 (class 0 OID 16837)
-- Dependencies: 223
-- Data for Name: TaiKhoan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, email, trang_thai, ma_nhan_su) VALUES (1, 'admin', '123456', 'admin@hp-homestay.edu.vn', 'Hoạt động', 1);


--
-- TOC entry 5335 (class 0 OID 17068)
-- Dependencies: 259
-- Data for Name: ThamGiaLop; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5345 (class 0 OID 17142)
-- Dependencies: 269
-- Data for Name: ThamGiaNgoaiKhoa; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5295 (class 0 OID 16810)
-- Dependencies: 219
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5390 (class 0 OID 0)
-- Dependencies: 230
-- Name: BangCap_ma_bang_cap_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BangCap_ma_bang_cap_seq"', 1, false);


--
-- TOC entry 5391 (class 0 OID 0)
-- Dependencies: 238
-- Name: BangLuong_ma_bang_luong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BangLuong_ma_bang_luong_seq"', 1, false);


--
-- TOC entry 5392 (class 0 OID 0)
-- Dependencies: 260
-- Name: CamKet_ma_cam_ket_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CamKet_ma_cam_ket_seq"', 1, false);


--
-- TOC entry 5393 (class 0 OID 0)
-- Dependencies: 276
-- Name: ChucVu_ma_chuc_vu_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChucVu_ma_chuc_vu_seq"', 11, true);


--
-- TOC entry 5394 (class 0 OID 0)
-- Dependencies: 248
-- Name: ChuongTrinhHoc_ma_chuong_trinh_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChuongTrinhHoc_ma_chuong_trinh_seq"', 1, false);


--
-- TOC entry 5395 (class 0 OID 0)
-- Dependencies: 264
-- Name: ChuongTrinhKhuyenMai_ma_khuyen_mai_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"', 1, false);


--
-- TOC entry 5396 (class 0 OID 0)
-- Dependencies: 272
-- Name: ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq"', 1, false);


--
-- TOC entry 5397 (class 0 OID 0)
-- Dependencies: 246
-- Name: CongNo_ma_cong_no_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CongNo_ma_cong_no_seq"', 1, false);


--
-- TOC entry 5398 (class 0 OID 0)
-- Dependencies: 232
-- Name: HoSoBangCap_ma_ho_so_bang_cap_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."HoSoBangCap_ma_ho_so_bang_cap_seq"', 1, false);


--
-- TOC entry 5399 (class 0 OID 0)
-- Dependencies: 266
-- Name: HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq"', 1, false);


--
-- TOC entry 5400 (class 0 OID 0)
-- Dependencies: 256
-- Name: HocVien_ma_hoc_vien_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."HocVien_ma_hoc_vien_seq"', 7, true);


--
-- TOC entry 5401 (class 0 OID 0)
-- Dependencies: 234
-- Name: HopDongLaoDong_ma_hop_dong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."HopDongLaoDong_ma_hop_dong_seq"', 1, false);


--
-- TOC entry 5402 (class 0 OID 0)
-- Dependencies: 262
-- Name: KeHoachGiangDay_ma_ke_hoach_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."KeHoachGiangDay_ma_ke_hoach_seq"', 1, false);


--
-- TOC entry 5403 (class 0 OID 0)
-- Dependencies: 250
-- Name: KhoaHoc_ma_khoa_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."KhoaHoc_ma_khoa_hoc_seq"', 1, false);


--
-- TOC entry 5404 (class 0 OID 0)
-- Dependencies: 254
-- Name: LopHoc_ma_lop_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LopHoc_ma_lop_hoc_seq"', 1, false);


--
-- TOC entry 5405 (class 0 OID 0)
-- Dependencies: 228
-- Name: NhanSu_ma_nhan_su_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."NhanSu_ma_nhan_su_seq"', 1, true);


--
-- TOC entry 5406 (class 0 OID 0)
-- Dependencies: 270
-- Name: PhanCongHoatDong_ma_phan_cong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhanCongHoatDong_ma_phan_cong_seq"', 1, false);


--
-- TOC entry 5407 (class 0 OID 0)
-- Dependencies: 274
-- Name: PhanCongMarketing_ma_phan_cong_marketing_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhanCongMarketing_ma_phan_cong_marketing_seq"', 1, false);


--
-- TOC entry 5408 (class 0 OID 0)
-- Dependencies: 224
-- Name: PhanQuyen_ma_phan_quyen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhanQuyen_ma_phan_quyen_seq"', 1, true);


--
-- TOC entry 5409 (class 0 OID 0)
-- Dependencies: 244
-- Name: PhieuChi_ma_phieu_chi_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhieuChi_ma_phieu_chi_seq"', 1, false);


--
-- TOC entry 5410 (class 0 OID 0)
-- Dependencies: 236
-- Name: PhieuLuong_ma_phieu_luong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhieuLuong_ma_phieu_luong_seq"', 1, false);


--
-- TOC entry 5411 (class 0 OID 0)
-- Dependencies: 242
-- Name: PhieuThu_ma_phieu_thu_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhieuThu_ma_phieu_thu_seq"', 5, true);


--
-- TOC entry 5412 (class 0 OID 0)
-- Dependencies: 240
-- Name: PhieuThuong_ma_phieu_thuong_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhieuThuong_ma_phieu_thuong_seq"', 1, false);


--
-- TOC entry 5413 (class 0 OID 0)
-- Dependencies: 226
-- Name: PhongBan_ma_phong_ban_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres

--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public."BangCap" DISABLE TRIGGER ALL;


--
-- TOC entry 5414 (class 0 OID 0)
-- Dependencies: 252
-- Name: PhongHoc_ma_phong_hoc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhongHoc_ma_phong_hoc_seq"', 6, true);


ALTER TABLE public."BangCap" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."BangLuong" DISABLE TRIGGER ALL;



--
-- TOC entry 5416 (class 0 OID 0)
-- Dependencies: 222
-- Name: TaiKhoan_ma_tai_khoan_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TaiKhoan_ma_tai_khoan_seq"', 1, true);


ALTER TABLE public."BangLuong" ENABLE TRIGGER ALL;

--

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

--

ALTER TABLE public."CamKet" DISABLE TRIGGER ALL;

INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (4, '2026-04-03 00:00:00', '2026-07-30 00:00:00', 'Cam kết của học viên về việc tuân thủ nội quy học bán trú cùng người nước ngoài', 'Đã hủy bỏ', 4);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (1, '2026-04-16 00:00:00', '2026-10-16 00:00:00', 'Cam kết đầu ra chứng chỉ IELTS 6.0, hoàn trả 100% học phí nếu không đạt.', 'Đang hiệu lực', 1);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (5, '2026-04-05 00:00:00', '2026-09-30 00:00:00', 'Cam kết tuân thủ nội quy và làm đầu đủ btvn', 'Đang hiệu lực', 3);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (8, '2026-01-20 00:00:00', '2026-03-20 00:00:00', 'Cam kết tiếng anh', 'Đã hết hạn', 5);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (2, '2026-04-18 00:00:00', '2026-09-20 00:00:00', 'Cam kết học viên tuân thủ nội quy trung tâm và hoàn thành đủ bài tập về nhà.', 'Đã hết hạn', 2);
INSERT INTO public."CamKet" (ma_cam_ket, ngay_ky, ngay_het_han, noi_dung_cam_ket, trang_thai, ma_hoc_vien) VALUES (10, '2026-04-08 00:00:00', '2026-09-30 00:00:00', 'Cam kết', 'Đã hủy bỏ', 2);


--
-- TOC entry 5069 (class 2606 OID 16950)
-- Name: BangLuong BangLuong_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BangLuong"
    ADD CONSTRAINT "BangLuong_pkey" PRIMARY KEY (ma_bang_luong);


ALTER TABLE public."CamKet" ENABLE TRIGGER ALL;

--

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

--
-- TOC entry 5112 (class 2606 OID 17478)
-- Name: ChucVu ChucVu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--



ALTER TABLE public."ChucVu" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."ChuongTrinhHoc" DISABLE TRIGGER ALL;




ALTER TABLE public."ChuongTrinhHoc" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."ChuongTrinhKhuyenMai" DISABLE TRIGGER ALL;



ALTER TABLE ONLY public."ChuongTrinhMarketing"
    ADD CONSTRAINT "ChuongTrinhMarketing_pkey" PRIMARY KEY (ma_chuong_trinh_marketing);


ALTER TABLE public."ChuongTrinhKhuyenMai" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."KhoaHoc" DISABLE TRIGGER ALL;



ALTER TABLE public."KhoaHoc" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."ChuongTrinhMarketing" DISABLE TRIGGER ALL;



ALTER TABLE ONLY public."HocVien"
    ADD CONSTRAINT "HocVien_pkey" PRIMARY KEY (ma_hoc_vien);


ALTER TABLE public."ChuongTrinhMarketing" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."CongNo" DISABLE TRIGGER ALL;




ALTER TABLE public."CongNo" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."PhongBan" DISABLE TRIGGER ALL;

INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (1, 'Ban Quản Trị', 'Điều hành toàn bộ hệ thống HP English Homestay', '2026-04-10 22:47:10.979');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (2, 'Phòng Đào tạo', 'Quản lý giáo viên, chương trình giảng dạy và chất lượng học viên.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (3, 'Phòng Tuyển sinh', 'Tư vấn khóa học, tìm kiếm học viên và chăm sóc khách hàng.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (5, 'Phòng Marketing', 'Truyền thông, quảng bá hình ảnh và tổ chức sự kiện ngoại khóa.', '2026-04-10 22:47:10');
INSERT INTO public."PhongBan" (ma_phong_ban, ten_phong_ban, mo_ta, ngay_thanh_lap) VALUES (4, 'Phòng Kế toán', 'Quản lý thu chi học phí, quỹ homestay và bảng lương nhân sự công ty.', '2026-04-10 00:00:00');



ALTER TABLE ONLY public."LopHoc"
    ADD CONSTRAINT "LopHoc_pkey" PRIMARY KEY (ma_lop_hoc);


ALTER TABLE public."PhongBan" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."NhanSu" DISABLE TRIGGER ALL;


INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (1, 'Nguyễn Văn Trường', NULL, NULL, '0987654321', NULL, 1, 1);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (2, 'Lê Văn Nam', '1995-05-10 00:00:00', 'Nam', '0912334455', 'Ngô Quyền, Hải Phòng', 3, 2);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (3, 'Trần Thị Thu Hà', '1998-11-20 00:00:00', 'Nữ', '0988776655', 'Lê Chân, Hải Phòng', 6, 3);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (4, 'Phạm Minh Đức', '1990-03-15 00:00:00', 'Nam', '0904556677', 'Hồng Bàng, Hải Phòng', 2, 1);
INSERT INTO public."NhanSu" (ma_nhan_su, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, ma_chuc_vu, ma_phong_ban) VALUES (5, 'Đỗ Thùy Linh', '2000-07-25 00:00:00', 'Nữ', '0936112233', 'Thủy Nguyên, Hải Phòng', 8, 4);

--
-- TOC entry 5106 (class 2606 OID 17160)
-- Name: PhanCongHoatDong PhanCongHoatDong_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres



ALTER TABLE public."NhanSu" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."HoSoBangCap" DISABLE TRIGGER ALL;



ALTER TABLE ONLY public."PhanQuyen"
    ADD CONSTRAINT "PhanQuyen_pkey" PRIMARY KEY (ma_phan_quyen);


ALTER TABLE public."HoSoBangCap" ENABLE TRIGGER ALL;

--


ALTER TABLE public."HoatDongNgoaiKhoa" DISABLE TRIGGER ALL;




ALTER TABLE public."HoatDongNgoaiKhoa" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."HopDongLaoDong" DISABLE TRIGGER ALL;




ALTER TABLE ONLY public."PhieuThuong"
    ADD CONSTRAINT "PhieuThuong_pkey" PRIMARY KEY (ma_phieu_thuong);


ALTER TABLE public."HopDongLaoDong" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."KeHoachGiangDay" DISABLE TRIGGER ALL;




ALTER TABLE public."KeHoachGiangDay" ENABLE TRIGGER ALL;

--


ALTER TABLE public."PhongHoc" DISABLE TRIGGER ALL;



ALTER TABLE ONLY public."TaiKhoan"
    ADD CONSTRAINT "TaiKhoan_pkey" PRIMARY KEY (ma_tai_khoan);


ALTER TABLE public."PhongHoc" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."LopHoc" DISABLE TRIGGER ALL;



ALTER TABLE public."LopHoc" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."PhanCongHoatDong" DISABLE TRIGGER ALL;




CREATE UNIQUE INDEX "BangCap_ten_bang_cap_key" ON public."BangCap" USING btree (ten_bang_cap);


ALTER TABLE public."PhanCongHoatDong" ENABLE TRIGGER ALL;

--


ALTER TABLE public."PhanCongMarketing" DISABLE TRIGGER ALL;




ALTER TABLE public."PhanCongMarketing" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."Quyen" DISABLE TRIGGER ALL;

INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (1, 'ADMIN', 'Hoạt động');
INSERT INTO public."Quyen" (ma_quyen, ten_quyen, trang_thai) VALUES (2, 'GIAO_VIEN', 'Hoạt động');



CREATE UNIQUE INDEX "PhanQuyen_ma_tai_khoan_ma_quyen_key" ON public."PhanQuyen" USING btree (ma_tai_khoan, ma_quyen);


ALTER TABLE public."Quyen" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."TaiKhoan" DISABLE TRIGGER ALL;


INSERT INTO public."TaiKhoan" (ma_tai_khoan, ten_dang_nhap, mat_khau, email, trang_thai, ma_nhan_su) VALUES (1, 'admin', '123456', 'admin@hp-homestay.edu.vn', 'Hoạt động', 1);

--
-- TOC entry 5045 (class 1259 OID 17161)
-- Name: Quyen_ten_quyen_key; Type: INDEX; Schema: public; Owner: postgres
--



ALTER TABLE public."TaiKhoan" ENABLE TRIGGER ALL;

--


ALTER TABLE public."PhanQuyen" DISABLE TRIGGER ALL;


INSERT INTO public."PhanQuyen" (ma_phan_quyen, ma_tai_khoan, ma_quyen) VALUES (1, 1, 1);



ALTER TABLE public."PhanQuyen" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."PhieuChi" DISABLE TRIGGER ALL;




ALTER TABLE public."PhieuChi" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."PhieuLuong" DISABLE TRIGGER ALL;



ALTER TABLE public."PhieuLuong" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."PhieuThu" DISABLE TRIGGER ALL;

INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (1, 1500000.000000000000000000000000000000, '2026-04-10 00:00:00', 'Thu học phí khóa IELTS cơ bản - Tháng 04/2026', 1, 1, NULL, NULL);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (2, 2000000.000000000000000000000000000000, '2026-04-10 23:32:08.962', 'Học phí khóa Giao tiếp cấp tốc', 2, 1, NULL, NULL);
INSERT INTO public."PhieuThu" (ma_phieu_thu, so_tien, ngay_thu, noi_dung, ma_hoc_vien, ma_nhan_su, ma_khuyen_mai, ma_cam_ket) VALUES (3, 2000000.000000000000000000000000000000, '2026-04-15 00:00:00', 'Thu học phí khóa TOEIC nâng cao', 1, 1, NULL, NULL);


ALTER TABLE public."PhieuThu" ENABLE TRIGGER ALL;

--

ALTER TABLE ONLY public."ChuongTrinhMarketing"
    ADD CONSTRAINT "ChuongTrinhMarketing_ma_khoa_hoc_fkey" FOREIGN KEY (ma_khoa_hoc) REFERENCES public."KhoaHoc"(ma_khoa_hoc) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5131 (class 2606 OID 17248)
-- Name: CongNo CongNo_ma_hoc_vien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres

--

ALTER TABLE public."PhieuThuong" DISABLE TRIGGER ALL;



ALTER TABLE public."PhieuThuong" ENABLE TRIGGER ALL;

--

--

ALTER TABLE public."ThamGiaLop" DISABLE TRIGGER ALL;



ALTER TABLE public."ThamGiaLop" ENABLE TRIGGER ALL;

--


ALTER TABLE public."ThamGiaNgoaiKhoa" DISABLE TRIGGER ALL;



ALTER TABLE public."ThamGiaNgoaiKhoa" ENABLE TRIGGER ALL;

--


SELECT pg_catalog.setval('public."BangCap_ma_bang_cap_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."BangLuong_ma_bang_luong_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."CamKet_ma_cam_ket_seq"', 10, true);


--

--

SELECT pg_catalog.setval('public."ChucVu_ma_chuc_vu_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."ChuongTrinhHoc_ma_chuong_trinh_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."ChuongTrinhKhuyenMai_ma_khuyen_mai_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."ChuongTrinhMarketing_ma_chuong_trinh_marketing_seq"', 1, false);


--


ALTER TABLE ONLY public."NhanSu"
    ADD CONSTRAINT "NhanSu_ma_chuc_vu_fkey" FOREIGN KEY (ma_chuc_vu) REFERENCES public."ChucVu"(ma_chuc_vu) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5119 (class 2606 OID 17188)
-- Name: NhanSu NhanSu_ma_phong_ban_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres

--

SELECT pg_catalog.setval('public."CongNo_ma_cong_no_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."HoSoBangCap_ma_ho_so_bang_cap_seq"', 1, false);


--


SELECT pg_catalog.setval('public."HoatDongNgoaiKhoa_ma_hoat_dong_ngoai_khoa_seq"', 1, false);


--


ALTER TABLE ONLY public."PhanCongMarketing"
    ADD CONSTRAINT "PhanCongMarketing_ma_chuong_trinh_marketing_fkey" FOREIGN KEY (ma_chuong_trinh_marketing) REFERENCES public."ChuongTrinhMarketing"(ma_chuong_trinh_marketing) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5147 (class 2606 OID 17509)
-- Name: PhanCongMarketing PhanCongMarketing_ma_nhan_su_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhanCongMarketing"
    ADD CONSTRAINT "PhanCongMarketing_ma_nhan_su_fkey" FOREIGN KEY (ma_nhan_su) REFERENCES public."NhanSu"(ma_nhan_su) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5116 (class 2606 OID 17183)
-- Name: PhanQuyen PhanQuyen_ma_quyen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres


SELECT pg_catalog.setval('public."HocVien_ma_hoc_vien_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."HopDongLaoDong_ma_hop_dong_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."KeHoachGiangDay_ma_ke_hoach_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."KhoaHoc_ma_khoa_hoc_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."LopHoc_ma_lop_hoc_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."NhanSu_ma_nhan_su_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."PhanCongHoatDong_ma_phan_cong_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."PhanCongMarketing_ma_phan_cong_marketing_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."PhanQuyen_ma_phan_quyen_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."PhieuChi_ma_phieu_chi_seq"', 1, false);


--


SELECT pg_catalog.setval('public."PhieuLuong_ma_phieu_luong_seq"', 1, false);


--


SELECT pg_catalog.setval('public."PhieuThu_ma_phieu_thu_seq"', 3, true);


--

--

SELECT pg_catalog.setval('public."PhieuThuong_ma_phieu_thuong_seq"', 1, false);


--

--

SELECT pg_catalog.setval('public."PhongBan_ma_phong_ban_seq"', 7, true);


--

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

-- TOC entry 5360 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-04-18 21:52:36
--
-- PostgreSQL database dump complete
--




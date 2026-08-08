--
-- PostgreSQL database dump
--

\restrict ydNU4WLPqcxNBk2cnkZ1wqLrSOQRo29NzcyNyWiZradBgtlOFM94Xc4ctGE5QKq

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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
-- Name: claims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.claims (
    id integer NOT NULL,
    post_id integer,
    claimant_id integer,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.claims OWNER TO postgres;

--
-- Name: claims_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.claims_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.claims_id_seq OWNER TO postgres;

--
-- Name: claims_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.claims_id_seq OWNED BY public.claims.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    user_id integer,
    title character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    building character varying(255) NOT NULL,
    room character varying(100),
    image_url character varying(500),
    status character varying(20) NOT NULL,
    is_resolved boolean DEFAULT false,
    handed_to_security boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_claimed boolean DEFAULT false,
    pickup_location character varying(255),
    description text
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    student_id character varying(100),
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    course character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    messenger_link character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: claims id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claims ALTER COLUMN id SET DEFAULT nextval('public.claims_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: claims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.claims (id, post_id, claimant_id, status, created_at) FROM stdin;
3	2	2	READY FOR PICKUP	2026-06-13 18:52:01.067658
5	2	2	PENDING VERIFICATION	2026-07-13 18:37:08.965759
6	2	2	PENDING VERIFICATION	2026-07-13 20:20:18.108802
7	3	2	PENDING VERIFICATION	2026-07-13 20:21:58.153337
8	5	2	PENDING VERIFICATION	2026-07-13 20:22:33.056717
9	4	4	PENDING VERIFICATION	2026-07-30 20:14:41.998236
10	6	2	PENDING VERIFICATION	2026-08-01 08:08:42.260182
11	7	4	PENDING VERIFICATION	2026-08-05 07:37:52.60145
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, user_id, title, category, building, room, image_url, status, is_resolved, handed_to_security, created_at, is_claimed, pickup_location, description) FROM stdin;
2	2	iPhone 14 Pro	Electronics	BLDG. 9 - ICT Building	2nd Floor	\N	Found	f	f	2026-06-13 18:51:16.604011	t	\N	\N
3	2	iPhone 14 Pro	Electronics	BLDG. 9 - ICT Building	2nd Floor	\N	Found	f	f	2026-06-13 18:54:08.567436	t	\N	\N
5	2	Blue Backpack	Clothing / Apparel	BLDG. 9 - ICT Building	2nd Floor	\N	Found	f	f	2026-06-14 10:21:20.34277	t	\N	\N
4	2	Blue Backpack	Clothing / Apparel	BLDG. 9 - ICT Building	2nd Floor	\N	Found	f	f	2026-06-14 10:21:05.875699	t	\N	\N
6	4	Fish	Electronics	BLDG. 9 - ICT Building	2nd Floor	\N	Found	t	f	2026-07-31 08:39:26.412367	t	\N	\N
7	2	fish 2	Electronics	BLDG. 24 - Girl's Trade Building	2nd Floor	\N	Found	f	t	2026-07-31 12:16:40.126916	t	\N	\N
10	4	meep 2	Electronics	BLDG. 1 - Arts and Culture Building	f	\N	Found	f	t	2026-08-05 09:27:02.073458	f	\N	\N
9	4	meep	Electronics	BLDG. 1 - Arts and Culture Building	2nd	\N	Found	f	f	2026-08-05 09:23:17.883812	f	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, student_id, email, password, course, created_at, messenger_link) FROM stdin;
1	John Doe	2021-1234	john@ustp.edu.ph	secret123	\N	2026-06-09 10:47:00.575705	\N
3	Juliet	789127847836	juliet@gmail.com	$2b$10$vyLZ/PUNa53qETwdas.w6ubB.ZNm93JVdS13tIsOffJNbLkBx2R1W	BS CpE	2026-06-21 13:04:44.215541	\N
4	Mia	1627126371	mia@a.com	$2b$10$g2Df/dM0kKYqTxebsM9rcOFy4uvPv/ptNSc.y/f3IXX9vSvlS7w06	BSCS	2026-06-21 13:09:09.741933	\N
5	Mia	723894832	mia@b.com	$2b$10$IXKkfHFgO.NVmuA4yaMqK.odPI4Yftl7w7lLewIqX1ft./.PFQNcq	BSCS	2026-06-21 13:10:14.317571	\N
6	mia	1278127831	mia@c.com	$2b$10$6eJaZF0WdLyhtb2zmAs8LOsWdx966HfGg703cAzP5MylJn/IYq0nS	bscs	2026-06-21 13:11:20.04399	\N
2	Jane Doe	2021-5678	jane@ustp.edu.ph	$2b$10$Y8EZsigCeB7reCTdaBJrmOkhclhufrbuB/YVZlph.6K96cxb6GjWy	\N	2026-06-09 11:51:15.244177	meep
8	Mia	\N	mia@ustp.edu.ph	$2b$10$2CezfpcoQOFMgmuU8iAH..xx6ZsgeqwlTWXm/uc3FMeUDkMbqQCyS	BS CpE	2026-07-25 20:06:43.270176	\N
\.


--
-- Name: claims_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.claims_id_seq', 12, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 10, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: claims claims_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claims
    ADD CONSTRAINT claims_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_student_id_key UNIQUE (student_id);


--
-- Name: claims fk_posts; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claims
    ADD CONSTRAINT fk_posts FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: claims fk_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claims
    ADD CONSTRAINT fk_users FOREIGN KEY (claimant_id) REFERENCES public.users(id);


--
-- Name: posts fk_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict ydNU4WLPqcxNBk2cnkZ1wqLrSOQRo29NzcyNyWiZradBgtlOFM94Xc4ctGE5QKq


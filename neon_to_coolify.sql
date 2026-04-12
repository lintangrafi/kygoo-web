--
-- PostgreSQL database dump
--

\restrict dVwjy44NME2ZxdV3hCXfYL7WKM8xCxlLscLgRGXnDDIxtSBPX7V36I4BoBZhTjM

-- Dumped from database version 17.8 (a48d9ca)
-- Dumped by pg_dump version 18.1

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
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA neon_auth;


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.account (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" uuid NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    scope text,
    password text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: invitation; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.invitation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "organizationId" uuid NOT NULL,
    email text NOT NULL,
    role text,
    status text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "inviterId" uuid NOT NULL
);


--
-- Name: jwks; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.jwks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "publicKey" text NOT NULL,
    "privateKey" text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "expiresAt" timestamp with time zone
);


--
-- Name: member; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.member (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "organizationId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    role text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);


--
-- Name: organization; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.organization (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo text,
    "createdAt" timestamp with time zone NOT NULL,
    metadata text
);


--
-- Name: project_config; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.project_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    endpoint_id text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    trusted_origins jsonb NOT NULL,
    social_providers jsonb NOT NULL,
    email_provider jsonb,
    email_and_password jsonb,
    allow_localhost boolean NOT NULL,
    plugin_configs jsonb,
    webhook_config jsonb
);


--
-- Name: session; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.session (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" uuid NOT NULL,
    "impersonatedBy" text,
    "activeOrganizationId" text
);


--
-- Name: user; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean NOT NULL,
    image text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role text,
    banned boolean,
    "banReason" text,
    "banExpires" timestamp with time zone
);


--
-- Name: verification; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.verification (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: business_project_audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_project_audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    action character varying(20) NOT NULL,
    before_data jsonb,
    after_data jsonb,
    changed_by character varying(120) NOT NULL,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT business_project_audit_logs_action_check CHECK (((action)::text = ANY ((ARRAY['create'::character varying, 'update'::character varying, 'delete'::character varying])::text[])))
);


--
-- Name: business_project_media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_project_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    file_url text NOT NULL,
    file_name character varying(255) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    is_cover boolean DEFAULT false NOT NULL
);


--
-- Name: business_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_line character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    year character varying(4) NOT NULL,
    impact text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT business_projects_business_line_check CHECK (((business_line)::text = ANY ((ARRAY['studio'::character varying, 'photobooth'::character varying, 'digital'::character varying, 'coffee'::character varying])::text[])))
);


--
-- Name: coffee_landing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coffee_landing (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    subtitle character varying(255),
    description text,
    cta_text character varying(100),
    status character varying(20) DEFAULT 'draft'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: contact_inquiries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_inquiries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20),
    business_line character varying(50),
    message text NOT NULL,
    status character varying(20) DEFAULT 'new'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    event_type character varying(150),
    event_date character varying(20),
    location character varying(255),
    guest_count character varying(50),
    budget_range character varying(100),
    notes text,
    source character varying(50) DEFAULT 'contact_page'::character varying
);


--
-- Name: digital_landing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.digital_landing (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    subtitle character varying(255),
    description text,
    cta_text character varying(100),
    status character varying(20) DEFAULT 'draft'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: module_access; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.module_access (
    id integer NOT NULL,
    role_id integer NOT NULL,
    module_name character varying(100) NOT NULL,
    can_view boolean DEFAULT false,
    can_create boolean DEFAULT false,
    can_edit boolean DEFAULT false,
    can_delete boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: module_access_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.module_access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: module_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.module_access_id_seq OWNED BY public.module_access.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    module character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: photobooth_event_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.photobooth_event_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    image_url text NOT NULL,
    caption text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone
);


--
-- Name: photobooth_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.photobooth_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_name character varying(255) NOT NULL,
    event_type character varying(50),
    event_date date,
    location character varying(255),
    description text,
    featured_image_url text,
    status character varying(20) DEFAULT 'draft'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone
);


--
-- Name: photobooth_packages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.photobooth_packages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    features jsonb DEFAULT '[]'::jsonb,
    tos_url text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    id integer NOT NULL,
    role_id integer NOT NULL,
    permission_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.role_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.role_permissions_id_seq OWNED BY public.role_permissions.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_system boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version bigint NOT NULL,
    dirty boolean NOT NULL
);


--
-- Name: studio_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.studio_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    theme_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    template_image_url text NOT NULL,
    result_image_url text NOT NULL,
    description text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone
);


--
-- Name: studio_themes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.studio_themes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    background_image_url text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    access_token text NOT NULL,
    refresh_token text NOT NULL,
    access_token_expires_at timestamp without time zone NOT NULL,
    refresh_token_expires_at timestamp without time zone NOT NULL,
    user_agent text,
    ip_address character varying(45),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255),
    name character varying(255) NOT NULL,
    avatar_url text,
    is_oauth boolean DEFAULT false,
    oauth_provider character varying(50),
    oauth_id character varying(255),
    is_active boolean DEFAULT true,
    email_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: module_access id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.module_access ALTER COLUMN id SET DEFAULT nextval('public.module_access_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions ALTER COLUMN id SET DEFAULT nextval('public.role_permissions_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: invitation; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.invitation (id, "organizationId", email, role, status, "expiresAt", "createdAt", "inviterId") FROM stdin;
\.


--
-- Data for Name: jwks; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.jwks (id, "publicKey", "privateKey", "createdAt", "expiresAt") FROM stdin;
\.


--
-- Data for Name: member; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.member (id, "organizationId", "userId", role, "createdAt") FROM stdin;
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.organization (id, name, slug, logo, "createdAt", metadata) FROM stdin;
\.


--
-- Data for Name: project_config; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.project_config (id, name, endpoint_id, created_at, updated_at, trusted_origins, social_providers, email_provider, email_and_password, allow_localhost, plugin_configs, webhook_config) FROM stdin;
16cabca3-43ae-40b0-b407-60cc204a1f34	kygoo-web	ep-rough-smoke-a1l5wb45	2026-03-28 06:08:03.672+00	2026-03-28 06:08:03.672+00	[]	[{"id": "google", "isShared": true}]	{"type": "shared"}	{"enabled": true, "disableSignUp": false, "emailVerificationMethod": "otp", "requireEmailVerification": false, "autoSignInAfterVerification": true, "sendVerificationEmailOnSignIn": false, "sendVerificationEmailOnSignUp": false}	t	{"organization": {"config": {"creatorRole": "owner", "membershipLimit": 100, "organizationLimit": 10, "sendInvitationEmail": false}, "enabled": true}}	{"enabled": false, "enabledEvents": [], "timeoutSeconds": 5}
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId", "impersonatedBy", "activeOrganizationId") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", role, banned, "banReason", "banExpires") FROM stdin;
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: business_project_audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.business_project_audit_logs (id, project_id, action, before_data, after_data, changed_by, changed_at) FROM stdin;
efe3264a-7ee5-42c0-bbae-9e0deff943db	b6617194-87cf-4ec6-9bc7-e52e7d39242b	create	null	{"ID": "b6617194-87cf-4ec6-9bc7-e52e7d39242b", "Name": "Wedding Difa", "Year": "2026", "Impact": "Classic Photobooth", "IsActive": true, "CreatedAt": "2026-04-09T16:31:25.157368Z", "DeletedAt": {"V": "0001-01-01T00:00:00Z", "Valid": false}, "SortOrder": 100, "UpdatedAt": "2026-04-09T16:31:25.157368Z", "BusinessLine": "photobooth"}	72ef8005-e110-4f43-b932-834a4333017d	2026-04-09 16:31:12.161761+00
b352745a-96e1-4311-84e9-b3bafd1d06cf	b6617194-87cf-4ec6-9bc7-e52e7d39242b	update	{"ID": "b6617194-87cf-4ec6-9bc7-e52e7d39242b", "Name": "Wedding Difa", "Year": "2026", "Impact": "Classic Photobooth", "Gallery": [{"ID": "60eb6f4d-1baf-4590-9a02-0f1e77e06ee5", "FileURL": "http://localhost:8080/uploads/business-projects/b6617194-87cf-4ec6-9bc7-e52e7d39242b/ab24553f-674d-41ea-9979-a4fb86e44765.png", "IsCover": true, "FileName": "SW  STRIP WEDDING.png", "CreatedAt": "2026-04-09T16:50:43.695492Z", "DeletedAt": {"V": "0001-01-01T00:00:00Z", "Valid": false}, "ProjectID": "b6617194-87cf-4ec6-9bc7-e52e7d39242b", "SortOrder": 0}, {"ID": "0b1e6096-8e0b-41a0-930e-2900eef65a2d", "FileURL": "http://localhost:8080/uploads/business-projects/b6617194-87cf-4ec6-9bc7-e52e7d39242b/4ee16386-86d6-443a-97a5-752765551408.png", "IsCover": false, "FileName": "9.png", "CreatedAt": "2026-04-09T17:14:24.66497Z", "DeletedAt": {"V": "0001-01-01T00:00:00Z", "Valid": false}, "ProjectID": "b6617194-87cf-4ec6-9bc7-e52e7d39242b", "SortOrder": 1}, {"ID": "611039b3-ec2b-4285-a79b-a576b63747c2", "FileURL": "http://localhost:8080/uploads/business-projects/b6617194-87cf-4ec6-9bc7-e52e7d39242b/6daad8db-7245-4175-ba44-994cf20e8fd7.png", "IsCover": false, "FileName": "PAKET A.png", "CreatedAt": "2026-04-09T16:57:32.359866Z", "DeletedAt": {"V": "0001-01-01T00:00:00Z", "Valid": false}, "ProjectID": "b6617194-87cf-4ec6-9bc7-e52e7d39242b", "SortOrder": 2}], "IsActive": true, "CreatedAt": "2026-04-09T16:31:25.157368Z", "DeletedAt": {"V": "0001-01-01T00:00:00Z", "Valid": false}, "SortOrder": 100, "UpdatedAt": "2026-04-09T16:31:25.157368Z", "BusinessLine": "photobooth"}	{"ID": "b6617194-87cf-4ec6-9bc7-e52e7d39242b", "Name": "Wedding Difa", "Year": "2026", "Impact": "Classic Photobooth", "Gallery": [{"ID": "60eb6f4d-1baf-4590-9a02-0f1e77e06ee5", "FileURL": "http://localhost:8080/uploads/business-projects/b6617194-87cf-4ec6-9bc7-e52e7d39242b/ab24553f-674d-41ea-9979-a4fb86e44765.png", "IsCover": true, "FileName": "SW  STRIP WEDDING.png", "CreatedAt": "2026-04-09T16:50:43.695492Z", "DeletedAt": {"V": "0001-01-01T00:00:00Z", "Valid": false}, "ProjectID": "b6617194-87cf-4ec6-9bc7-e52e7d39242b", "SortOrder": 0}, {"ID": "0b1e6096-8e0b-41a0-930e-2900eef65a2d", "FileURL": "http://localhost:8080/uploads/business-projects/b6617194-87cf-4ec6-9bc7-e52e7d39242b/4ee16386-86d6-443a-97a5-752765551408.png", "IsCover": false, "FileName": "9.png", "CreatedAt": "2026-04-09T17:14:24.66497Z", "DeletedAt": {"V": "0001-01-01T00:00:00Z", "Valid": false}, "ProjectID": "b6617194-87cf-4ec6-9bc7-e52e7d39242b", "SortOrder": 1}, {"ID": "611039b3-ec2b-4285-a79b-a576b63747c2", "FileURL": "http://localhost:8080/uploads/business-projects/b6617194-87cf-4ec6-9bc7-e52e7d39242b/6daad8db-7245-4175-ba44-994cf20e8fd7.png", "IsCover": false, "FileName": "PAKET A.png", "CreatedAt": "2026-04-09T16:57:32.359866Z", "DeletedAt": {"V": "0001-01-01T00:00:00Z", "Valid": false}, "ProjectID": "b6617194-87cf-4ec6-9bc7-e52e7d39242b", "SortOrder": 2}], "IsActive": true, "CreatedAt": "2026-04-09T16:31:25.157368Z", "DeletedAt": {"V": "0001-01-01T00:00:00Z", "Valid": false}, "SortOrder": 100, "UpdatedAt": "2026-04-09T16:31:25.157368Z", "BusinessLine": "photobooth"}	72ef8005-e110-4f43-b932-834a4333017d	2026-04-09 17:44:06.340306+00
\.


--
-- Data for Name: business_project_media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.business_project_media (id, project_id, file_url, file_name, sort_order, created_at, deleted_at, is_cover) FROM stdin;
c9a3ac4b-420a-4dad-8956-c4fcdde635c6	b6617194-87cf-4ec6-9bc7-e52e7d39242b	http://localhost:8080/uploads/business-projects/b6617194-87cf-4ec6-9bc7-e52e7d39242b/62b647cf-24ed-4e33-aac1-e080cf5fac35.png	PAKET A.png	1	2026-04-09 16:50:58.525365+00	2026-04-09 16:55:43.50129+00	f
0b1e6096-8e0b-41a0-930e-2900eef65a2d	b6617194-87cf-4ec6-9bc7-e52e7d39242b	http://localhost:8080/uploads/business-projects/b6617194-87cf-4ec6-9bc7-e52e7d39242b/4ee16386-86d6-443a-97a5-752765551408.png	9.png	1	2026-04-09 17:14:24.66497+00	\N	f
60eb6f4d-1baf-4590-9a02-0f1e77e06ee5	b6617194-87cf-4ec6-9bc7-e52e7d39242b	http://localhost:8080/uploads/business-projects/b6617194-87cf-4ec6-9bc7-e52e7d39242b/ab24553f-674d-41ea-9979-a4fb86e44765.png	SW  STRIP WEDDING.png	0	2026-04-09 16:50:43.695492+00	\N	t
611039b3-ec2b-4285-a79b-a576b63747c2	b6617194-87cf-4ec6-9bc7-e52e7d39242b	http://localhost:8080/uploads/business-projects/b6617194-87cf-4ec6-9bc7-e52e7d39242b/6daad8db-7245-4175-ba44-994cf20e8fd7.png	PAKET A.png	2	2026-04-09 16:57:32.359866+00	\N	f
\.


--
-- Data for Name: business_projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.business_projects (id, business_line, name, year, impact, sort_order, is_active, created_at, updated_at, deleted_at) FROM stdin;
b6617194-87cf-4ec6-9bc7-e52e7d39242b	photobooth	Wedding Difa	2026	Classic Photobooth	100	t	2026-04-09 16:31:25.157368+00	2026-04-09 17:44:06.060289+00	\N
\.


--
-- Data for Name: coffee_landing; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coffee_landing (id, title, subtitle, description, cta_text, status, created_at, updated_at) FROM stdin;
04383262-4a8c-452a-b0e5-272c3a4fb038	Kygoo Coffee	Premium Coffee Experience	Coming Soon - Experience our premium coffee services and specialty beverages.	Notify Me	draft	2026-04-04 15:25:22.626762+00	2026-04-04 15:25:22.626762+00
\.


--
-- Data for Name: contact_inquiries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_inquiries (id, name, email, phone, business_line, message, status, created_at, updated_at, event_type, event_date, location, guest_count, budget_range, notes, source) FROM stdin;
\.


--
-- Data for Name: digital_landing; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.digital_landing (id, title, subtitle, description, cta_text, status, created_at, updated_at) FROM stdin;
152ba58a-1484-46c1-9019-bd3b02303828	Kygoo Digital	Digital Transformation Solutions	Coming Soon - Discover our comprehensive digital transformation and development services.	Notify Me	draft	2026-04-04 15:25:22.626762+00	2026-04-04 15:25:22.626762+00
\.


--
-- Data for Name: module_access; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.module_access (id, role_id, module_name, can_view, can_create, can_edit, can_delete, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, name, module, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: photobooth_event_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.photobooth_event_images (id, event_id, image_url, caption, display_order, created_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: photobooth_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.photobooth_events (id, event_name, event_type, event_date, location, description, featured_image_url, status, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: photobooth_packages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.photobooth_packages (id, name, description, price, features, tos_url, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_permissions (id, role_id, permission_id, created_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, description, is_system, created_at, updated_at) FROM stdin;
1	Super Admin	Super administrator	t	2026-04-09 16:09:42.924499	2026-04-09 16:09:42.924499
2	Admin	Administrator	t	2026-04-09 16:09:42.924499	2026-04-09 16:09:42.924499
3	User	Default user	t	2026-04-09 16:09:42.924499	2026-04-09 16:09:42.924499
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schema_migrations (version, dirty) FROM stdin;
10	f
\.


--
-- Data for Name: studio_templates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.studio_templates (id, theme_id, name, template_image_url, result_image_url, description, display_order, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: studio_themes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.studio_themes (id, name, description, background_image_url, display_order, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (id, user_id, role_id, created_at) FROM stdin;
1	72ef8005-e110-4f43-b932-834a4333017d	1	2026-04-09 16:09:43.130599
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_sessions (id, user_id, access_token, refresh_token, access_token_expires_at, refresh_token_expires_at, user_agent, ip_address, is_active, created_at, updated_at) FROM stdin;
b7e9d666-0553-4258-9279-8fe18168e55c	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzQwNywiaWF0IjoxNzc1NzUxMDA3fQ.-sSTE2BNPebPm2DR_iMygVbtBAC1Fz7q_0o_NqxXu6o	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzQwNywiaWF0IjoxNzc1NzUxMDA3fQ.wsMaOBoWt2-JAWuU-NTOEBD2CRJYlEBswTCXbiOmYxE	2026-04-10 16:10:07.608488	2026-04-10 16:10:07.608488	\N	\N	f	2026-04-09 16:10:21.164542	2026-04-09 16:35:56.231027
c89b098b-1169-4806-9d31-6873f03160d1	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzQwOSwiaWF0IjoxNzc1NzUxMDA5fQ.cd3S5C6l7hjHS_VArKnk8_fHbQk17eJjViApBu5nIsw	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzQwOSwiaWF0IjoxNzc1NzUxMDA5fQ.0uaCAadmVTUGZRkV2_iQLO6LT8QUBTyVqAErgdzoRws	2026-04-10 16:10:09.511711	2026-04-10 16:10:09.511711	\N	\N	f	2026-04-09 16:10:22.987523	2026-04-09 16:35:56.231027
5d5e4b68-f741-4f20-ac9a-acad11ca0d22	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzQzMywiaWF0IjoxNzc1NzUxMDMzfQ.y0rMSkTbGskWb-3OaosgD9vPtY1rDofkzxlFPMBOjJE	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzQzMywiaWF0IjoxNzc1NzUxMDMzfQ.SzgvIrICQMraEEYUZSF_r2oHlbZniF34ct2h5HxnPIY	2026-04-10 16:10:33.226087	2026-04-10 16:10:33.226087	\N	\N	f	2026-04-09 16:10:46.683937	2026-04-09 16:35:56.231027
1435ef84-9374-439a-833c-15d9873a4527	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzQ4MCwiaWF0IjoxNzc1NzUxMDgwfQ.ZJWkLsSRauj96S6sfE9P9FRQox2XNV65oaTYPL0bWL4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzQ4MCwiaWF0IjoxNzc1NzUxMDgwfQ.0QejlPzwgdXNv7rSAdA4NKNUTImDfLOQYs8bStZ-i3o	2026-04-10 16:11:20.556899	2026-04-10 16:11:20.556899	\N	\N	f	2026-04-09 16:11:34.18644	2026-04-09 16:35:56.231027
f2ae81f1-16d1-4b5e-9875-4b820a30e1b1	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzUxMSwiaWF0IjoxNzc1NzUxMTExfQ.ui4j9DG8OEn8bP_FtI9OV_uCBz4S2iRyicsYq3wTktA	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzUxMSwiaWF0IjoxNzc1NzUxMTExfQ.rIIRW4cuXbovAaGD_trI7Lo-Brx1y0HqTMJehYgZVQ8	2026-04-10 16:11:51.02182	2026-04-10 16:11:51.02182	\N	\N	f	2026-04-09 16:12:04.581061	2026-04-09 16:35:56.231027
0290cd3b-7ef8-429c-96b8-5544f367f109	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzUzNCwiaWF0IjoxNzc1NzUxMTM0fQ.VuCLspd37taGdaZnZU2VcUplvYcT5Ynyl4_rQoNnuT8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzUzNCwiaWF0IjoxNzc1NzUxMTM0fQ.m8uycBaKhPOFULL3HEXPbTiyEKppTDGXhP5acowEIao	2026-04-10 16:12:14.011049	2026-04-10 16:12:14.011049	\N	\N	f	2026-04-09 16:12:27.497097	2026-04-09 16:35:56.231027
030b07fb-8f8a-4b48-888c-468336d19e94	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzU3MCwiaWF0IjoxNzc1NzUxMTcwfQ.d3DD1tSz-rD9eAEpH5gBXDSrtF85eofSyAggFU4KjcU	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzU3MCwiaWF0IjoxNzc1NzUxMTcwfQ.1fQzlzDUpeY-aE1DQnLZwNG72gSa8QQJCAYuN0Mwd_c	2026-04-10 16:12:50.295459	2026-04-10 16:12:50.295459	\N	\N	f	2026-04-09 16:13:03.775155	2026-04-09 16:35:56.231027
c513f079-f88b-4139-ba70-e42d279d1ffa	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzU5NSwiaWF0IjoxNzc1NzUxMTk1fQ.39CHmrUpcDnIdFB8HOMM1W-lcHbHo_2r10KjKJ1LMes	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzU5NSwiaWF0IjoxNzc1NzUxMTk1fQ.Fmh0lI7AtFZ6QtSoA8ChV4TYKGLoY5byaAWbZIS9H0Y	2026-04-10 16:13:15.218723	2026-04-10 16:13:15.218723	\N	\N	f	2026-04-09 16:13:28.675673	2026-04-09 16:35:56.231027
061fd041-90ac-45ec-a707-a9fcfdc849e0	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzcyMywiaWF0IjoxNzc1NzUxMzIzfQ.rUpWJpsn5NgGg881YlXGuNCg6-5_QfLdoAjwNCuJWs4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzcyMywiaWF0IjoxNzc1NzUxMzIzfQ.T8PokMvG2Ytyk3ljKqcMJZPwRRI83UN6r5jHszUS-Lw	2026-04-10 16:15:23.471769	2026-04-10 16:15:23.471769	\N	\N	f	2026-04-09 16:15:36.928128	2026-04-09 16:35:56.231027
de4e2cde-b6c4-4e65-bdc5-6e639472c06c	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzczNCwiaWF0IjoxNzc1NzUxMzM0fQ.uAOsxa9xwmOEOzi8xZPM_j-rTohuEEGsMo6XReiQBOs	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzczNCwiaWF0IjoxNzc1NzUxMzM0fQ.Yxko9toTGfrWZhMcM5ryIqBa1fP_VsfEREd4V3MN8xQ	2026-04-10 16:15:34.850543	2026-04-10 16:15:34.850543	\N	\N	f	2026-04-09 16:15:48.312343	2026-04-09 16:35:56.231027
ae35f1a8-a565-4fe7-85d9-74e266a6f42c	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzc2NSwiaWF0IjoxNzc1NzUxMzY1fQ.IAmi1AhUpHST9OeY4OEJZQexY1EeR9JHtvyySVkR71I	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzc2NSwiaWF0IjoxNzc1NzUxMzY1fQ.yNxDPdj11oQANEQuf_ayxawTOzLQsGdVIs-JYqb9nAw	2026-04-10 16:16:05.273293	2026-04-10 16:16:05.273293	\N	\N	f	2026-04-09 16:16:18.754847	2026-04-09 16:35:56.231027
74b66abd-e3e2-41b4-8a8d-23abbd274c8c	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzgwOSwiaWF0IjoxNzc1NzUxNDA5fQ.d4bONUy97HgHVFa_882x0GsfawiCoAY4gT4-ohSkCKE	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzgwOSwiaWF0IjoxNzc1NzUxNDA5fQ.faZZZTI0qyVB_A58RgeQ8qo7KQnLD_XDAxPqC1k-Ljs	2026-04-10 16:16:49.881642	2026-04-10 16:16:49.881642	\N	\N	f	2026-04-09 16:17:03.441757	2026-04-09 16:35:56.231027
d91efb7b-7beb-47f3-94dc-3bf3f1f512ae	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzgyNCwiaWF0IjoxNzc1NzUxNDI0fQ.sbxncbAbOnT0pSHIcbvCogX5WGoB1eexTwK1N2KP73A	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzgyNCwiaWF0IjoxNzc1NzUxNDI0fQ._rCM7X5V6QWogs7AbQP_Fmd4yKUWIiBxCXjI9BX289c	2026-04-10 16:17:04.487264	2026-04-10 16:17:04.487264	\N	\N	f	2026-04-09 16:17:18.079803	2026-04-09 16:35:56.231027
ebbb43af-ad6d-45f2-a199-46c16eeed565	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzg0OSwiaWF0IjoxNzc1NzUxNDQ5fQ.pIErLLDokvAREowHaGmgTQoRqrb8w0pEr7axCVn1Y04	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzg0OSwiaWF0IjoxNzc1NzUxNDQ5fQ.HFw3-p7tSh46U8JNF9oD3qbizP63fFkirPoSxwlKD6U	2026-04-10 16:17:29.255458	2026-04-10 16:17:29.255458	\N	\N	f	2026-04-09 16:17:42.800547	2026-04-09 16:35:56.231027
aedfb54f-61ef-4f95-8528-fc3b47f503b5	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzk2NiwiaWF0IjoxNzc1NzUxNTY2fQ.Uxq-k1aBFWMoPF-YslcuTBclYzN9lgEk-TO6LhuNhHY	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzk2NiwiaWF0IjoxNzc1NzUxNTY2fQ.cwnXDLIKl8gEEACdNGj1akmoFZ0B1r-5ODAcfRjl6Ds	2026-04-10 16:19:26.075129	2026-04-10 16:19:26.075129	\N	\N	f	2026-04-09 16:19:39.532841	2026-04-09 16:35:56.231027
2d58df6b-6138-4eb8-b61e-8d3df43d2746	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzk2OCwiaWF0IjoxNzc1NzUxNTY4fQ.7iBymJWZFK_ua_5JwwVbEWL7jfUvhMuqNmDc22q6aXs	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzk2OCwiaWF0IjoxNzc1NzUxNTY4fQ.hIeH6EPKMa0jeBeKYHJ9Iv6ypgb5OZSzQG-1dDwq2WA	2026-04-10 16:19:28.712404	2026-04-10 16:19:28.712404	\N	\N	f	2026-04-09 16:19:42.18559	2026-04-09 16:35:56.231027
5a78a750-e1fa-49d7-a2d9-37c75f756199	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzk4OCwiaWF0IjoxNzc1NzUxNTg4fQ.T4GP7uUAdSYz85xCsFOefJnqujxhD8aGYCcaYVn4F4M	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzNzk4OCwiaWF0IjoxNzc1NzUxNTg4fQ.bIjDSi3JNcZtCDDaXDGKmV71AyWQazTroN23o7cWoXg	2026-04-10 16:19:48.738563	2026-04-10 16:19:48.738563	\N	\N	f	2026-04-09 16:20:02.188379	2026-04-09 16:35:56.231027
04b6af3b-5eb9-46b5-ac26-6572e9c1d9f1	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzODAxNiwiaWF0IjoxNzc1NzUxNjE2fQ.14kLqWwfir-6KWFunPXsBu9AGhkmlHncKWCt8yqGhFk	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzODAxNiwiaWF0IjoxNzc1NzUxNjE2fQ.XrKnD8AmZ-3DOnIMKeHEXDhn5nYSk2qLaDny-0wBNzY	2026-04-10 16:20:16.751298	2026-04-10 16:20:16.751298	\N	\N	f	2026-04-09 16:20:30.200931	2026-04-09 16:35:56.231027
5081b017-d5f3-481e-80f0-81653c296715	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzODA1NiwiaWF0IjoxNzc1NzUxNjU2fQ.esN3AiFU21CfDe4_0TWptkjFmYGk6en-CZrjArDHywM	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzODA1NiwiaWF0IjoxNzc1NzUxNjU2fQ.CgFE8262j2B8zBfuY7Z1e2GlBCUZm6Z2KuH3uXRL3j0	2026-04-10 16:20:56.93561	2026-04-10 16:20:56.93561	\N	\N	f	2026-04-09 16:21:10.447281	2026-04-09 16:35:56.231027
63827429-f2c3-44af-93ef-996452be8d17	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzODA3NywiaWF0IjoxNzc1NzUxNjc3fQ.nFdnyiCU0K6A-1kGEUAulIbdqU9-JEeRs3B1Fx3FNaM	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzODA3NywiaWF0IjoxNzc1NzUxNjc3fQ._sKm0f6Jv3wcr68oIquR802dgp187GAVGg-w36TeNmg	2026-04-10 16:21:17.694605	2026-04-10 16:21:17.694605	\N	\N	f	2026-04-09 16:21:31.151245	2026-04-09 16:35:56.231027
74cd38b0-6caa-4a06-ad45-2a1327f0a935	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzODYxNCwiaWF0IjoxNzc1NzUyMjE0fQ.Kd2CX8e7T0s6r9y9Ho20PGR7-U_CntXqx7rEJIX8eIE	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzODYxNCwiaWF0IjoxNzc1NzUyMjE0fQ.hEcyA8hIIer2qzoFi_nuKgziVRWsounNSvOZMSJ3j4w	2026-04-10 16:30:14.477033	2026-04-10 16:30:14.477033	\N	\N	f	2026-04-09 16:30:27.960525	2026-04-09 16:35:56.231027
5d77cc27-b413-47f3-9100-8a143d15275d	72ef8005-e110-4f43-b932-834a4333017d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzODk1NywiaWF0IjoxNzc1NzUyNTU3fQ.XwIKJqZQ3s-o_3srmLuPH7xajwIMW7HKeI6QCofeq3A	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzJlZjgwMDUtZTExMC00ZjQzLWI5MzItODM0YTQzMzMwMTdkIiwiZW1haWwiOiJhZG1pbkBnbnMuY29tIiwicm9sZSI6IlN1cGVyIEFkbWluIiwiaXNzIjoiYmFja2VuZCIsImV4cCI6MTc3NTgzODk1NywiaWF0IjoxNzc1NzUyNTU3fQ.XA6Bo03_4ekEiQNFE5TNROeMgLBlnO4IwqCcHHx_a9A	2026-04-10 16:35:57.091942	2026-04-10 16:35:57.091942	\N	\N	t	2026-04-09 16:36:10.560594	2026-04-09 16:36:10.560594
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password_hash, name, avatar_url, is_oauth, oauth_provider, oauth_id, is_active, email_verified, created_at, updated_at, deleted_at) FROM stdin;
72ef8005-e110-4f43-b932-834a4333017d	admin@gns.com	$2a$10$AKJF3WM8oUmiwc/vkQ3Rde90W6604rh1s6AjYzIcIHa9GfT3yqIR2	Super Admin	\N	f	\N	\N	t	t	2026-04-09 16:09:42.989359	2026-04-09 16:09:42.989359	\N
\.


--
-- Name: module_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.module_access_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.permissions_id_seq', 1, false);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 1, true);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: invitation invitation_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT invitation_pkey PRIMARY KEY (id);


--
-- Name: jwks jwks_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.jwks
    ADD CONSTRAINT jwks_pkey PRIMARY KEY (id);


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- Name: organization organization_slug_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.organization
    ADD CONSTRAINT organization_slug_key UNIQUE (slug);


--
-- Name: project_config project_config_endpoint_id_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.project_config
    ADD CONSTRAINT project_config_endpoint_id_key UNIQUE (endpoint_id);


--
-- Name: project_config project_config_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.project_config
    ADD CONSTRAINT project_config_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT session_token_key UNIQUE (token);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: business_project_audit_logs business_project_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_project_audit_logs
    ADD CONSTRAINT business_project_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: business_project_media business_project_media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_project_media
    ADD CONSTRAINT business_project_media_pkey PRIMARY KEY (id);


--
-- Name: business_projects business_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_projects
    ADD CONSTRAINT business_projects_pkey PRIMARY KEY (id);


--
-- Name: coffee_landing coffee_landing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coffee_landing
    ADD CONSTRAINT coffee_landing_pkey PRIMARY KEY (id);


--
-- Name: contact_inquiries contact_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_inquiries
    ADD CONSTRAINT contact_inquiries_pkey PRIMARY KEY (id);


--
-- Name: digital_landing digital_landing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_landing
    ADD CONSTRAINT digital_landing_pkey PRIMARY KEY (id);


--
-- Name: module_access module_access_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.module_access
    ADD CONSTRAINT module_access_pkey PRIMARY KEY (id);


--
-- Name: module_access module_access_role_id_module_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.module_access
    ADD CONSTRAINT module_access_role_id_module_name_key UNIQUE (role_id, module_name);


--
-- Name: permissions permissions_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key UNIQUE (name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: photobooth_event_images photobooth_event_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photobooth_event_images
    ADD CONSTRAINT photobooth_event_images_pkey PRIMARY KEY (id);


--
-- Name: photobooth_events photobooth_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photobooth_events
    ADD CONSTRAINT photobooth_events_pkey PRIMARY KEY (id);


--
-- Name: photobooth_packages photobooth_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photobooth_packages
    ADD CONSTRAINT photobooth_packages_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: studio_templates studio_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.studio_templates
    ADD CONSTRAINT studio_templates_pkey PRIMARY KEY (id);


--
-- Name: studio_themes studio_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.studio_themes
    ADD CONSTRAINT studio_themes_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: account_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "account_userId_idx" ON neon_auth.account USING btree ("userId");


--
-- Name: invitation_email_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX invitation_email_idx ON neon_auth.invitation USING btree (email);


--
-- Name: invitation_organizationId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "invitation_organizationId_idx" ON neon_auth.invitation USING btree ("organizationId");


--
-- Name: member_organizationId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "member_organizationId_idx" ON neon_auth.member USING btree ("organizationId");


--
-- Name: member_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "member_userId_idx" ON neon_auth.member USING btree ("userId");


--
-- Name: organization_slug_uidx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE UNIQUE INDEX organization_slug_uidx ON neon_auth.organization USING btree (slug);


--
-- Name: session_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "session_userId_idx" ON neon_auth.session USING btree ("userId");


--
-- Name: verification_identifier_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX verification_identifier_idx ON neon_auth.verification USING btree (identifier);


--
-- Name: idx_business_project_audit_changed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_project_audit_changed_at ON public.business_project_audit_logs USING btree (changed_at DESC);


--
-- Name: idx_business_project_audit_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_project_audit_project_id ON public.business_project_audit_logs USING btree (project_id);


--
-- Name: idx_business_project_media_is_cover; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_project_media_is_cover ON public.business_project_media USING btree (project_id, is_cover);


--
-- Name: idx_business_project_media_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_project_media_project_id ON public.business_project_media USING btree (project_id);


--
-- Name: idx_business_project_media_sort; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_project_media_sort ON public.business_project_media USING btree (project_id, sort_order);


--
-- Name: idx_business_projects_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_projects_active ON public.business_projects USING btree (is_active);


--
-- Name: idx_business_projects_line; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_projects_line ON public.business_projects USING btree (business_line);


--
-- Name: idx_business_projects_sort; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_projects_sort ON public.business_projects USING btree (business_line, sort_order);


--
-- Name: idx_contact_inquiries_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_inquiries_created_at ON public.contact_inquiries USING btree (created_at DESC);


--
-- Name: idx_contact_inquiries_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_inquiries_email ON public.contact_inquiries USING btree (email);


--
-- Name: idx_contact_inquiries_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_inquiries_status ON public.contact_inquiries USING btree (status);


--
-- Name: idx_module_access_module_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_module_access_module_name ON public.module_access USING btree (module_name);


--
-- Name: idx_module_access_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_module_access_role_id ON public.module_access USING btree (role_id);


--
-- Name: idx_permissions_module; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permissions_module ON public.permissions USING btree (module);


--
-- Name: idx_photobooth_event_images_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_photobooth_event_images_deleted_at ON public.photobooth_event_images USING btree (deleted_at);


--
-- Name: idx_photobooth_event_images_event_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_photobooth_event_images_event_id ON public.photobooth_event_images USING btree (event_id);


--
-- Name: idx_photobooth_events_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_photobooth_events_deleted_at ON public.photobooth_events USING btree (deleted_at);


--
-- Name: idx_photobooth_events_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_photobooth_events_status ON public.photobooth_events USING btree (status);


--
-- Name: idx_photobooth_packages_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_photobooth_packages_deleted_at ON public.photobooth_packages USING btree (deleted_at);


--
-- Name: idx_role_permissions_permission_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_permissions_permission_id ON public.role_permissions USING btree (permission_id);


--
-- Name: idx_role_permissions_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_permissions_role_id ON public.role_permissions USING btree (role_id);


--
-- Name: idx_studio_templates_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_studio_templates_deleted_at ON public.studio_templates USING btree (deleted_at);


--
-- Name: idx_studio_templates_theme_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_studio_templates_theme_id ON public.studio_templates USING btree (theme_id);


--
-- Name: idx_studio_themes_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_studio_themes_deleted_at ON public.studio_themes USING btree (deleted_at);


--
-- Name: idx_studio_themes_display_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_studio_themes_display_order ON public.studio_themes USING btree (display_order);


--
-- Name: idx_user_roles_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_role_id ON public.user_roles USING btree (role_id);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: idx_user_sessions_access_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_sessions_access_token ON public.user_sessions USING btree (access_token);


--
-- Name: idx_user_sessions_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_sessions_active ON public.user_sessions USING btree (is_active);


--
-- Name: idx_user_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions USING btree (user_id);


--
-- Name: idx_users_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_active ON public.users USING btree (is_active);


--
-- Name: idx_users_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_deleted_at ON public.users USING btree (deleted_at);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_oauth; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_oauth ON public.users USING btree (oauth_provider, oauth_id) WHERE (oauth_provider IS NOT NULL);


--
-- Name: uq_business_projects_identity; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_business_projects_identity ON public.business_projects USING btree (business_line, name, year) WHERE (deleted_at IS NULL);


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: invitation invitation_inviterId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: invitation invitation_organizationId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES neon_auth.organization(id) ON DELETE CASCADE;


--
-- Name: member member_organizationId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES neon_auth.organization(id) ON DELETE CASCADE;


--
-- Name: member member_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: business_project_audit_logs business_project_audit_logs_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_project_audit_logs
    ADD CONSTRAINT business_project_audit_logs_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.business_projects(id);


--
-- Name: business_project_media business_project_media_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_project_media
    ADD CONSTRAINT business_project_media_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.business_projects(id);


--
-- Name: module_access module_access_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.module_access
    ADD CONSTRAINT module_access_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: photobooth_event_images photobooth_event_images_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photobooth_event_images
    ADD CONSTRAINT photobooth_event_images_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.photobooth_events(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: studio_templates studio_templates_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.studio_templates
    ADD CONSTRAINT studio_templates_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES public.studio_themes(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict dVwjy44NME2ZxdV3hCXfYL7WKM8xCxlLscLgRGXnDDIxtSBPX7V36I4BoBZhTjM


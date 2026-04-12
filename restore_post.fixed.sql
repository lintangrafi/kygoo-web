--
-- PostgreSQL database dump
--

\restrict n5JTeh0S7ccNWIqXfgCNQOBXelwga4AEeRhdmQXLtEuptczLzQv5ykg4nfbai6p

-- Dumped from database version 17.8 (a48d9ca)
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

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

\unrestrict n5JTeh0S7ccNWIqXfgCNQOBXelwga4AEeRhdmQXLtEuptczLzQv5ykg4nfbai6p


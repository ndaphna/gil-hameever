CREATE TABLE public.link_clicks (
  id          BIGSERIAL PRIMARY KEY,
  slug        TEXT        NOT NULL,
  destination TEXT        NOT NULL,
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term    TEXT,
  referrer    TEXT,
  user_agent  TEXT,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_insert" ON public.link_clicks
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "service_role_select" ON public.link_clicks
  FOR SELECT TO service_role USING (true);

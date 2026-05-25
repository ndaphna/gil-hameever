-- Curated catalog of Inbal's site resources that Aliza may recommend.
-- 10 hand-picked landing pages mapped to symptom enums from daily_entries so
-- topic detection is deterministic (no extra LLM call needed).
--
-- Aliza recommends by embedding [RESOURCE:<slug>] in her response; the
-- frontend swaps the marker for a rich ResourceCard.

create extension if not exists "uuid-ossp";

create table if not exists newsletter.aliza_resources (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  url           text not null,
  hebrew_title  text not null,
  short_desc    text not null,
  format        text not null check (format in ('guide','checklist','protocol','tool','video')),
  topic_tags    text[] not null default '{}',
  gated         boolean not null default false,
  priority      int not null default 50 check (priority between 0 and 100),
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists aliza_resources_tags_idx
  on newsletter.aliza_resources using gin (topic_tags);

create or replace function newsletter.aliza_resources_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists aliza_resources_touch on newsletter.aliza_resources;
create trigger aliza_resources_touch
  before update on newsletter.aliza_resources
  for each row execute function newsletter.aliza_resources_touch_updated_at();

alter table newsletter.aliza_resources enable row level security;

drop policy if exists aliza_resources_public_read on newsletter.aliza_resources;
create policy aliza_resources_public_read
  on newsletter.aliza_resources
  for select
  using (is_active = true);

grant select on newsletter.aliza_resources to authenticated, anon;

insert into newsletter.aliza_resources (slug, url, hebrew_title, short_desc, format, topic_tags, gated, priority) values
  ('brain-fog-guide-landing',    '/brain-fog-guide-landing',    'עזרה ראשונה לערפל מוחי',                'מדריך 5 שלבים לחזור לחדות מוחית בגיל המעבר',                       'guide',     array['brain_fog','concentration_difficulty','memory','focus'], true, 80),
  ('sleep-guide-landing',        '/sleep-guide-landing',        'המדריך להחזיר לעצמך את הלילה',          '5 צעדים מבוססי מחקר לשינה ארוכה ועמוקה יותר',                      'guide',     array['sleep_issues','insomnia','woke_up_night','night_sweats'],  true, 90),
  ('mood-guide-landing',         '/mood-guide-landing',         'עזרה ראשונה לנפילת מצב רוח',            'פרוטוקול מיידי כשמצב הרוח צונח באמצע היום',                        'protocol',  array['mood','sad','frustrated','irritated','emotional'],         true, 85),
  ('hot-flash-zoom-landing',     '/hot-flash-zoom-landing',     'עזרה ראשונה לגל חום באמצע זום',         'מה לעשות בדיוק כשגל חום תוקף ואת באמצע משהו',                      'tool',      array['hot_flashes','night_sweats','flushing'],                  false, 75),
  ('morning-reset-landing',      '/morning-reset-landing',      'פרוטוקול הבוקר של הגיבורה',             'שגרת בוקר 12 דקות שמכוונת את היום',                                'protocol',  array['energy','low_energy','morning_routine','focus'],          true, 70),
  ('walking-guide-landing',      '/walking-guide-landing',      'פרוטוקול ההליכה',                       'איך מתחילים ללכת בגיל המעבר, ולמה זו התרופה החזקה ביותר',          'guide',     array['movement','exercise','energy','mood','low_energy'],       true, 65),
  ('strength-home-landing',      '/strength-home-landing',      'גיל המעבר קורא לך להרים משקולות',       'למה אימוני כוח חיוניים בגיל המעבר + מאיפה להתחיל בבית',            'guide',     array['movement','strength','bones','pain','osteoporosis'],      true, 60),
  ('protein-guide-landing',      '/protein-guide-landing',      'רשימת הגיבורה לחלבון',                  'כמה חלבון את צריכה בגיל המעבר ואיך להגיע ליעד',                    'checklist', array['nutrition','protein','muscle','energy'],                  true, 55),
  ('heroine-checklist-landing',  '/heroine-checklist-landing',  'הצ׳קליסט של הגיבורה',                   'רשימת הבדיקות, ההרגלים והתמיכה שכל אישה בגיל המעבר זקוקה להם',     'checklist', array['general','onboarding','overwhelm'],                       true, 50),
  ('identity-guide-landing',     '/identity-guide-landing',     'לא גברת, גיבורה',                       'מי את אחרי שהילדים גדלו, הקריירה השתנתה והגוף החליט מחדש',         'guide',     array['identity','purpose','meaning','transition','emotional'],   true, 45)
on conflict (slug) do update set
  url           = excluded.url,
  hebrew_title  = excluded.hebrew_title,
  short_desc    = excluded.short_desc,
  format        = excluded.format,
  topic_tags    = excluded.topic_tags,
  gated         = excluded.gated,
  priority      = excluded.priority,
  is_active     = true;

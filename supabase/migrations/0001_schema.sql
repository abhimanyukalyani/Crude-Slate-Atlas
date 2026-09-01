-- Crude Slate Atlas schema. All tables are public read-only via RLS; writes are
-- done by a maintainer through the Supabase dashboard or a service-role key.

create table if not exists regions (
  code text primary key,
  name text not null,
  color_token text not null,
  sort_order int not null default 0
);

create table if not exists slates (
  code text primary key,
  name text not null,
  sort_order int not null default 0
);

create table if not exists countries (
  id bigserial primary key,
  name text not null unique,
  slug text not null unique,
  region_code text not null references regions(code),
  capacity_kbd int not null,
  slate_code text not null references slates(code),
  slate_detail text not null default '',
  note text not null default ''
);

create table if not exists refineries (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  country_name text not null,
  region_code text not null references regions(code),
  operator text not null default '',
  capacity_kbd int not null,
  slate_code text not null references slates(code),
  slate_detail text not null default '',
  nelson_index numeric,
  note text not null default ''
);

create table if not exists crude_grades (
  id bigserial primary key,
  name text not null unique,
  api_gravity numeric not null,
  sulphur_pct numeric not null,
  origin text not null,
  sanctioned boolean not null default false
);

create table if not exists sources (
  id bigserial primary key,
  title text not null,
  url text not null,
  sort_order int not null default 0
);

create index if not exists countries_region_idx on countries(region_code);
create index if not exists countries_capacity_idx on countries(capacity_kbd desc);
create index if not exists refineries_region_idx on refineries(region_code);
create index if not exists refineries_capacity_idx on refineries(capacity_kbd desc);

alter table regions enable row level security;
alter table slates enable row level security;
alter table countries enable row level security;
alter table refineries enable row level security;
alter table crude_grades enable row level security;
alter table sources enable row level security;

create policy "public read regions" on regions for select to anon, authenticated using (true);
create policy "public read slates" on slates for select to anon, authenticated using (true);
create policy "public read countries" on countries for select to anon, authenticated using (true);
create policy "public read refineries" on refineries for select to anon, authenticated using (true);
create policy "public read crude_grades" on crude_grades for select to anon, authenticated using (true);
create policy "public read sources" on sources for select to anon, authenticated using (true);

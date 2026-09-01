-- Regions, slates, crude grades and sources.

insert into regions (code, name, color_token, sort_order) values
  ('NA',   'North America',    's1', 1),
  ('LAT',  'Latin America',    's2', 2),
  ('EUR',  'Europe',           's3', 3),
  ('RUS',  'Russia & Caspian', 's4', 4),
  ('ME',   'Middle East',      's5', 5),
  ('AFR',  'Africa',           's6', 6),
  ('APAC', 'Asia-Pacific',     's7', 7)
on conflict (code) do update set name = excluded.name, color_token = excluded.color_token, sort_order = excluded.sort_order;

insert into slates (code, name, sort_order) values
  ('sweet', 'Light sweet',    1),
  ('mixed', 'Mixed / medium', 2),
  ('sour',  'Medium sour',    3),
  ('heavy', 'Heavy sour',     4),
  ('cond',  'Condensate-led', 5)
on conflict (code) do update set name = excluded.name, sort_order = excluded.sort_order;

insert into crude_grades (name, api_gravity, sulphur_pct, origin, sanctioned)
select name, api_gravity, sulphur_pct, origin, sanctioned
from jsonb_to_recordset($json$
[
{"name":"Tapis","api_gravity":45.5,"sulphur_pct":0.03,"origin":"Malaysia","sanctioned":false},
{"name":"Saharan Blend","api_gravity":45.0,"sulphur_pct":0.09,"origin":"Algeria","sanctioned":false},
{"name":"CPC Blend","api_gravity":45.0,"sulphur_pct":0.55,"origin":"Kazakhstan","sanctioned":false},
{"name":"Sharara","api_gravity":43.0,"sulphur_pct":0.07,"origin":"Libya","sanctioned":false},
{"name":"WTI Midland","api_gravity":41.0,"sulphur_pct":0.30,"origin":"United States","sanctioned":false},
{"name":"Murban","api_gravity":40.0,"sulphur_pct":0.75,"origin":"UAE","sanctioned":false},
{"name":"Forties","api_gravity":40.0,"sulphur_pct":0.60,"origin":"North Sea","sanctioned":false},
{"name":"Brent (dated)","api_gravity":38.3,"sulphur_pct":0.40,"origin":"North Sea","sanctioned":false},
{"name":"Olmeca","api_gravity":38.5,"sulphur_pct":0.80,"origin":"Mexico","sanctioned":false},
{"name":"Es Sider","api_gravity":37.0,"sulphur_pct":0.45,"origin":"Libya","sanctioned":false},
{"name":"Qua Iboe","api_gravity":36.0,"sulphur_pct":0.13,"origin":"Nigeria","sanctioned":false},
{"name":"Bonny Light","api_gravity":35.4,"sulphur_pct":0.15,"origin":"Nigeria","sanctioned":false},
{"name":"Minas","api_gravity":35.0,"sulphur_pct":0.08,"origin":"Indonesia","sanctioned":false},
{"name":"Azeri Light","api_gravity":35.0,"sulphur_pct":0.15,"origin":"Azerbaijan","sanctioned":false},
{"name":"Medanito","api_gravity":34.7,"sulphur_pct":0.48,"origin":"Argentina","sanctioned":false},
{"name":"ESPO","api_gravity":34.8,"sulphur_pct":0.62,"origin":"Russia","sanctioned":true},
{"name":"Upper Zakum","api_gravity":34.0,"sulphur_pct":1.70,"origin":"UAE","sanctioned":false},
{"name":"Oman Blend","api_gravity":33.0,"sulphur_pct":1.20,"origin":"Oman","sanctioned":false},
{"name":"Arab Light","api_gravity":33.0,"sulphur_pct":1.80,"origin":"Saudi Arabia","sanctioned":false},
{"name":"Isthmus","api_gravity":32.5,"sulphur_pct":1.80,"origin":"Mexico","sanctioned":false},
{"name":"Girassol","api_gravity":31.5,"sulphur_pct":0.33,"origin":"Angola","sanctioned":false},
{"name":"Dubai","api_gravity":31.0,"sulphur_pct":2.00,"origin":"UAE","sanctioned":false},
{"name":"Kuwait Export","api_gravity":31.0,"sulphur_pct":2.52,"origin":"Kuwait","sanctioned":false},
{"name":"Urals","api_gravity":31.0,"sulphur_pct":1.60,"origin":"Russia","sanctioned":true},
{"name":"Arab Medium","api_gravity":30.5,"sulphur_pct":2.50,"origin":"Saudi Arabia","sanctioned":false},
{"name":"Iranian Heavy","api_gravity":30.0,"sulphur_pct":1.95,"origin":"Iran","sanctioned":true},
{"name":"Tupi (Lula)","api_gravity":29.0,"sulphur_pct":0.35,"origin":"Brazil","sanctioned":false},
{"name":"Basrah Medium","api_gravity":29.0,"sulphur_pct":2.90,"origin":"Iraq","sanctioned":false},
{"name":"Johan Sverdrup","api_gravity":28.0,"sulphur_pct":0.80,"origin":"Norway","sanctioned":false},
{"name":"Arab Heavy","api_gravity":27.0,"sulphur_pct":2.90,"origin":"Saudi Arabia","sanctioned":false},
{"name":"Basrah Heavy","api_gravity":24.0,"sulphur_pct":4.00,"origin":"Iraq","sanctioned":false},
{"name":"Vasconia","api_gravity":24.0,"sulphur_pct":0.85,"origin":"Colombia","sanctioned":false},
{"name":"Maya","api_gravity":21.5,"sulphur_pct":3.60,"origin":"Mexico","sanctioned":false},
{"name":"Duri","api_gravity":21.0,"sulphur_pct":0.20,"origin":"Indonesia","sanctioned":false},
{"name":"WCS","api_gravity":20.5,"sulphur_pct":3.50,"origin":"Canada","sanctioned":false},
{"name":"Castilla Blend","api_gravity":18.8,"sulphur_pct":1.97,"origin":"Colombia","sanctioned":false},
{"name":"Merey 16","api_gravity":16.0,"sulphur_pct":2.50,"origin":"Venezuela","sanctioned":true},
{"name":"Altamira","api_gravity":16.0,"sulphur_pct":5.70,"origin":"Mexico","sanctioned":false},
{"name":"Boscan","api_gravity":10.1,"sulphur_pct":5.50,"origin":"Venezuela","sanctioned":true}
]
$json$) as x(name text, api_gravity numeric, sulphur_pct numeric, origin text, sanctioned boolean)
on conflict (name) do update set
  api_gravity = excluded.api_gravity,
  sulphur_pct = excluded.sulphur_pct,
  origin = excluded.origin,
  sanctioned = excluded.sanctioned;

delete from sources;
insert into sources (title, url, sort_order)
select title, url, sort_order
from jsonb_to_recordset($json$
[
{"title":"Energy Factbook — refining capacity by country (Energy Institute Statistical Review)","url":"https://energyfactbook.com/world/refining/","sort_order":1},
{"title":"energtx — refinery capacity, global rankings","url":"https://energtx.com/indicators/refinery-capacity-thousand-barrels-day","sort_order":2},
{"title":"EIA — US refining capacity decreased during 2025","url":"https://www.eia.gov/todayinenergy/detail.php?id=67807","sort_order":3},
{"title":"EIA — Petroleum refineries vary by level of complexity","url":"https://www.eia.gov/todayinenergy/detail.php?id=8330","sort_order":4},
{"title":"EIA — Crude oil attributes at US refineries vary by region","url":"https://www.eia.gov/todayinenergy/detail.php?id=8130","sort_order":5},
{"title":"Oil Sands Magazine — matching crude to refinery complexity","url":"https://www.oilsandsmagazine.com/technical/marketability-explained-matching-crude-to-refinery-complexity","sort_order":6},
{"title":"RBN Energy — USGC access to heavier crude","url":"https://rbnenergy.com/daily-posts/blog/us-gulf-coast-refiners-face-challenges-accessing-heavier-crude-oil","sort_order":7},
{"title":"Wikipedia — List of oil refineries","url":"https://en.wikipedia.org/wiki/List_of_oil_refineries","sort_order":8},
{"title":"Hydrocarbon Engineering — A reset for Europe's refineries","url":"https://www.hydrocarbonengineering.com/special-reports/29122025/a-reset-for-europes-refineries/","sort_order":9},
{"title":"Meduza — Russian refineries struck by drones","url":"https://meduza.io/en/feature/2026/06/29/ukrainian-drones-have-struck-nearly-every-major-russian-refinery-which-facilities-have-yet-to-be-hit","sort_order":10},
{"title":"Columbia CGEP — Where China gets its oil, 2025","url":"https://www.energypolicy.columbia.edu/where-china-gets-its-oil-crude-imports-in-2025-reveal-stockpiling-and-changing-fortunes-of-certain-suppliers-including-those-sanctioned/","sort_order":11},
{"title":"Hydrocarbon Processing — Dangote crude supply costs","url":"https://www.hydrocarbonprocessing.com/news/2026/08/as-nigerias-dangote-refinery-nears-record-ipo-investors-focus-on-oil-supply-costs/","sort_order":12},
{"title":"OIES — East of Suez refining outlook","url":"https://www.oxfordenergy.org/wpcms/wp-content/uploads/2025/02/East-of-Suez-Refining-Outlook-in-2025-and-Beyond.pdf","sort_order":13},
{"title":"EIA — Dangote drives Nigerian product shipments","url":"https://www.eia.gov/todayinenergy/detail.php?id=68004","sort_order":14}
]
$json$) as x(title text, url text, sort_order int);

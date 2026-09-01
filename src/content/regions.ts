import type { RegionCode } from '@/lib/atlas'

export interface RegionEssay {
  /** Short label used in nav and cards. */
  tag: string
  headline: string
  standfirst: string
  paragraphs: string[]
}

export const regionEssays: Record<RegionCode, RegionEssay> = {
  RUS: {
    tag: 'Russia & Caspian',
    headline: 'A fleet that cannot be repaired faster than it is hit',
    standfirst:
      'Russia can still sell its crude. What it is losing is the margin it used to earn by refining it at home.',
    paragraphs: [
      'Nameplate capacity is around 6.7 mb/d, but by mid-2026 Ukrainian long-range drones had struck essentially every major refinery in European Russia — Ryazan, Kirishi, Volgograd, Kstovo, Perm, Ufa, Moscow, Yaroslavl, Tuapse, Novokuibyshevsk. Only Omsk and Angarsk, deep in Siberia, remained untouched. Reported losses have run to roughly a quarter of capacity at times, forcing fuel export bans and domestic rationing.',
      'The strategic point is that Russia’s crude is easy to place but its refined product is not. Urals is an ordinary medium sour barrel; Indian and Chinese cokers will always take it at a discount. Refining margin, by contrast, has to be earned at home — and that is the part being destroyed.',
      'The Caspian states sit in the same gravitational field for different reasons. Kazakhstan’s Pavlodar refinery was configured for West Siberian crude and still leans on it, while the country’s own light sweet CPC Blend is exported. Belarus is wholly dependent on Druzhba. Design decisions taken decades ago now read as political exposure.',
    ],
  },
  NA: {
    tag: 'North America',
    headline: 'The wrong crude in the right country',
    standfirst:
      'The United States produces more light sweet crude than any nation in history — and built the world’s best heavy sour refineries.',
    paragraphs: [
      'The two do not match. Gulf Coast plants averaging above 13 on the Nelson index want 21–25° API sour feed and get it from Canada (WCS), Mexico (Maya) and, when sanctions permit, Venezuela — while shale barrels are exported to Europe and Asia. The result is a country that is simultaneously the largest crude exporter and a large crude importer, moving different barrels in opposite directions for sound engineering reasons.',
      'Capacity is also shrinking: 18.45 mb/d at the start of 2025 to 18.2 mb/d at the start of 2026, after LyondellBasell shut Houston (264 kb/d) and Phillips 66 closed Los Angeles (139 kb/d). 130 operable refineries remain, down from 132.',
      'Canada is the mirror image. It produces the heavy barrel but its average Nelson index sits just above 8, and its largest refinery — Irving’s Saint John — faces the Atlantic and runs imported grades rather than oil sands crude.',
    ],
  },
  APAC: {
    tag: 'Asia-Pacific',
    headline: 'Complexity as a sanctions arbitrage',
    standfirst:
      'Sanctioned crude only flows if someone can process it. Increasingly, that someone is east of Suez.',
    paragraphs: [
      'India and China now hold roughly 24 mb/d between them, much of it new, coastal and deeply converted. Reliance’s Jamnagar, at a Nelson index of about 21, was designed from the outset to run whatever the market least wanted. That design decision turned into a geopolitical position: in 2025 India was absorbing a large share of discounted Russian crude, and China imported at least 2.6 mb/d of sanctioned Iranian, Venezuelan and Russian barrels — over a fifth of its intake.',
      'Conversion capacity, not shipping, is the real bottleneck. A tanker can carry any grade; only a coker can turn the cheap one into diesel. Essentially all net capacity added since 2020 sits in China, India and the Gulf.',
      'The rest of the region is moving the other way. Japan’s capacity has fallen by roughly a third since 2000, Australia is down to two refineries after four closures since 2020, and New Zealand stopped refining altogether in 2022. Korea, Taiwan and Singapore remain — large, complex and built to export.',
    ],
  },
  EUR: {
    tag: 'Europe',
    headline: 'Simple plants, expensive crude, closing gates',
    standfirst:
      'Roughly 13–14 mb/d at an average complexity near 6.5 — much of it built in the 1970s or earlier.',
    paragraphs: [
      'Losing Urals in 2022 forced a switch to costlier WTI, Norwegian and Kazakh CPC barrels without the conversion depth to offset it. More than 400 kb/d was confirmed shut in 2025 alone — Grangemouth stopped processing crude, Shell closed Wesseling, BP cut a third of Gelsenkirchen, and Prax Lindsey went into administration. Roughly 30 European refineries have closed or converted since 2009.',
      'The exceptions prove the rule. Spain’s Repsol and Moeve run real coking capacity at Cartagena and Bilbao; Italy’s ISAB Priolo, forcibly divested from Lukoil in 2023, is genuinely deep-conversion. Those plants can buy the discounted barrel. Most of the continent cannot, and so competes for the same light sweet crude as everyone else.',
      'A handful of inland refineries still run Russian crude under exemption — MOL’s Százhalombatta and Slovnaft, engineered specifically for Urals via Druzhba. Converting them to seaborne supply is a multi-year capital programme, which is why the exemptions persist.',
    ],
  },
  AFR: {
    tag: 'Africa',
    headline: 'Dangote inverts a trade flow',
    standfirst:
      'At 650 kb/d, the largest single-train refinery ever built turned Nigeria from a gasoline importer into a product exporter.',
    paragraphs: [
      'Its constraint is feedstock, not kit: Dangote was built for light sweet crude, and domestic supply has been unreliable enough that it has been buying US WTI Midland and Libyan Sharara, and looking as far as Guyana. A refinery that must import its crude is exposed to exactly the freight and quality spreads its owner built it to escape.',
      'Elsewhere the continent’s nameplate capacity flatters reality. Nigeria’s NNPC plants at Port Harcourt, Warri and Kaduna have been largely non-operational for years. Morocco’s Samir has been idle since 2015. South Africa’s Sapref is shut and Engen’s Durban plant is now a terminal. Libya’s Zawia and Ras Lanuf are damaged and partly idle.',
      'Where African refining does work, it works because the crude is easy: Algeria’s Saharan Blend at 45° API and 0.09% sulphur needs no conversion depth at all, and Sonatrach’s simple fleet is correctly sized to it.',
    ],
  },
  LAT: {
    tag: 'Latin America',
    headline: 'Extra-heavy barrels with nowhere close to go',
    standfirst:
      'Canada, Mexico and Venezuela produce the world’s heaviest commercial crudes. Only a handful of refineries anywhere can take them.',
    paragraphs: [
      'WCS at 20.5° API, Maya at 21.5°, Merey at 16°, Boscan at barely 10°. Each is landlocked into a small set of buyers: US Gulf and Midwest cokers, Indian and Chinese deep-conversion plants, and almost nobody else. Mexico’s Olmeca refinery at Dos Bocas was meant to keep Maya at home; its slow ramp has instead kept those barrels moving north.',
      'Venezuela’s nameplate is fiction. The Paraguaná complex and Puerto La Cruz have run at a small fraction of capacity for years, and the crude itself needs upgraders as much as refineries. Curaçao’s Isla refinery, leased by PDVSA for decades, has been effectively idle since 2019.',
      'The region’s brighter spots are lighter. Argentina’s Vaca Muerta shale is displacing Escalante heavy and pushing refiners toward lighter feed, while Brazil’s pre-salt is an oddity — medium density at 29° API but unusually sweet at around 0.3% sulphur, and increasingly exported to China while Brazil imports products.',
    ],
  },
  ME: {
    tag: 'Middle East',
    headline: 'Producers buying their own downstream',
    standfirst:
      'The Gulf’s new refineries are not built to serve local demand. They are built to place a specific barrel.',
    paragraphs: [
      'Aramco’s strategy is the clearest case: SATORP and Jazan at home, and equity stakes abroad at Motiva Port Arthur, S-Oil’s Onsan and Fujian. Each is a guaranteed outlet for Arab Heavy and Arab Medium — grades that would otherwise have to compete for buyers on price alone. Owning the coker is how a producer stops discounting its own crude.',
      'Kuwait’s Al-Zour, at 615 kb/d, was purpose-built to convert high-sulphur residue into IMO 2020-compliant low-sulphur fuel oil, arriving precisely as the bunker specification changed. Oman and Kuwait’s joint Duqm plant sits on the Arabian Sea, deliberately outside the Strait of Hormuz.',
      'The UAE took the other route: Murban is light and only slightly sour, and its promotion to a futures benchmark in 2021 was a deliberate move to price the country’s own barrel rather than accept someone else’s marker.',
    ],
  },
}

export const complexityTiers = [
  {
    range: '< 4',
    name: 'Topping / hydroskimming',
    description:
      'Distillation, reforming, light hydrotreating. Light sweet crude only. Yields a lot of fuel oil. Mostly domestic-supply plants in Africa, Central Asia and the Caribbean.',
  },
  {
    range: '4 – 6',
    name: 'Simple conversion',
    description:
      'Adds a modest cat cracker or visbreaker. Can take some medium sour if blended. Much of the older European and Japanese fleet sits here or just above.',
  },
  {
    range: '6 – 10',
    name: 'Cracking',
    description:
      'Full FCC plus hydrotreating. Comfortable on medium sour grades — Arab Light, Urals, Dubai. The global workhorse configuration.',
  },
  {
    range: '10 – 15',
    name: 'Coking',
    description:
      'Delayed coker and hydrocracker: residue becomes distillate. Built for Maya, Western Canadian Select, Basrah Heavy. US Gulf Coast standard.',
  },
  {
    range: '> 15',
    name: 'Deep conversion + petrochemical integration',
    description:
      'Coking plus residue hydrocracking and direct crude-to-chemicals routes. Jamnagar, Ulsan, Zhoushan, Al-Zour. Buys the world’s least wanted barrels.',
  },
]

export const axes = [
  {
    key: 'Axis 1 — density',
    title: 'Light ↔ heavy',
    description:
      'Measured as API gravity. Above ~35° is light and yields gasoline and naphtha straight off the distillation tower. Below ~25° is heavy: mostly residue, worthless without conversion units.',
  },
  {
    key: 'Axis 2 — sulphur',
    title: 'Sweet ↔ sour',
    description:
      'Below 0.5% sulphur is sweet. Above ~1.5% is sour and needs hydrotreating capacity plus hydrogen supply to hit modern 10 ppm road-fuel specs and IMO 2020 bunker limits.',
  },
  {
    key: 'Axis 3 — kit',
    title: 'Nelson complexity',
    description:
      'An index of secondary processing relative to plain distillation (=1). Cokers and hydrocrackers are what let a refiner buy the cheap barrel. Complexity is the option; the crude discount is the payoff.',
  },
]

export const methodologyCaveat =
  'Capacity figures are nameplate atmospheric distillation, blended from Energy Institute (2025), EIA (Jan 2026) and national sources; different compilers disagree by a few percent because of condensate splitters, idled trains and calendar-day versus stream-day conventions. Assay values are typical, not contractual — a “grade” is a blend whose quality drifts. Nelson indices are published or widely reported figures where available and omitted where not. Nameplate capacity is a poor guide to actual runs in Russia, Venezuela, Iran, Mexico, Nigeria, Libya and Ukraine; the notes column flags these.'

export type CommunityId =
  | "lepcha"
  | "bhutia"
  | "limbu"
  | "tamang"
  | "rai"
  | "gurung"
  | "sherpa"
  | "mangar"
  | "newar"
  | "sunwar";

export interface Community {
  id: CommunityId;
  slug: CommunityId;
  name: string;
  nativeName: string;
  language: string;
  script: string;
  tagline: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    surface: string;
    text: string;
  };
  gradient: string;
  emoji: string;
  region: string;
  speakers: number;
  learners: number;
  lessons: number;
  contributors: number;
  preservationLevel: number;
  colorTheme: string;
  tags: string[];
  cultural: {
    symbol: string;
    pattern: string;
    element: string;
  };
}

export const COMMUNITIES: Community[] = [
  {
    id: "lepcha",
    slug: "lepcha",
    name: "Lepcha",
    nativeName: "ᰛᰦᰵᰧᰶ",
    language: "Lepcha (Róng)",
    script: "Lepcha Script (Róng)",
    tagline: "The First Children of Sikkim",
    description:
      "The indigenous Lepcha people, known as Róng, are the original inhabitants of Sikkim. Their unique script, animistic traditions, and deep bond with the forests make them a treasure of the Himalayas.",
    colors: {
      primary: "#2d6a2d",
      secondary: "#5a8c3c",
      accent: "#8bc34a",
      bg: "#0a1a0a",
      surface: "#121f12",
      text: "#d8f0c8",
    },
    gradient: "linear-gradient(135deg, #1a4a1a 0%, #2d6a2d 50%, #8bc34a 100%)",
    emoji: "🌿",
    region: "North & West Sikkim",
    speakers: 38400,
    learners: 3200,
    lessons: 38,
    contributors: 124,
    preservationLevel: 45,
    colorTheme: "pine",
    tags: ["Indigenous", "Forest", "Animistic", "Unique Script", "Sacred"],
    cultural: {
      symbol: "Deer (sacred animal)",
      pattern: "Floral vine motifs",
      element: "Forest green & Bamboo yellow",
    },
  },
  {
    id: "bhutia",
    slug: "bhutia",
    name: "Bhutia",
    nativeName: "དྲེ་ཇོང་སྐད།",
    language: "Sikkimese (Drenjongké)",
    script: "Tibetan Script (Uchen)",
    tagline: "The Soul of the Himalayas",
    description:
      "Originating from Tibet, the Bhutia people brought with them a rich tradition of art, religion, and language. Their monasteries and silk weaves speak of centuries of Himalayan wisdom.",
    colors: {
      primary: "#5a2d6e",
      secondary: "#8c3a9a",
      accent: "#c87ce0",
      bg: "#0d0418",
      surface: "#1a0828",
      text: "#e8d0ff",
    },
    gradient: "linear-gradient(135deg, #2d0a4a 0%, #5a2d6e 50%, #c87ce0 100%)",
    emoji: "🏯",
    region: "North & East Sikkim",
    speakers: 41825,
    learners: 3800,
    lessons: 44,
    contributors: 156,
    preservationLevel: 52,
    colorTheme: "monastery",
    tags: ["Tibetan Buddhist", "Monastery", "Silk Weaving", "Thangka Art", "Sacred"],
    cultural: {
      symbol: "Choktse (sacred table)",
      pattern: "Tibetan cloud & lotus patterns",
      element: "Monastery purple & Gold",
    },
  },
  {
    id: "limbu",
    slug: "limbu",
    name: "Limbu",
    nativeName: "ᤕᤠᤰᤌᤢᤱ",
    language: "Limbu (Yakthungpan)",
    script: "Sirijonga / Kirtipur Script",
    tagline: "Guardians of the Eastern Hills",
    description:
      "The Limbu, known as Yakthung, are an ancient Kirati people with a rich tradition of the Mundhum oral scripture. Their unique Sirijonga script and sacred rituals connect them deeply to the land.",
    colors: {
      primary: "#1a5c8c",
      secondary: "#2d7ab5",
      accent: "#5ab0d4",
      bg: "#040e1a",
      surface: "#0a1c2d",
      text: "#c8e8ff",
    },
    gradient: "linear-gradient(135deg, #0a2040 0%, #1a5c8c 50%, #5ab0d4 100%)",
    emoji: "🦅",
    region: "East Sikkim",
    speakers: 56650,
    learners: 4600,
    lessons: 42,
    contributors: 198,
    preservationLevel: 58,
    colorTheme: "glacier",
    tags: ["Kirati", "Mundhum", "Sirijonga Script", "Sacred", "Warrior"],
    cultural: {
      symbol: "Tongba (millet beer vessel)",
      pattern: "Geometric warrior patterns",
      element: "Glacier blue & Silver",
    },
  },
  {
    id: "tamang",
    slug: "tamang",
    name: "Tamang",
    nativeName: "तामाङ",
    language: "Tamang",
    script: "Devanagari / Pracalit Script",
    tagline: "Drumbeats of the Mountains",
    description:
      "The Tamang are one of the largest Tibeto-Burman groups in the Himalayas, renowned for their damphu drum music, shamanistic Bon traditions, and intricate thangka paintings.",
    colors: {
      primary: "#c4701a",
      secondary: "#d4aa4a",
      accent: "#f0c040",
      bg: "#1a0f00",
      surface: "#2a1a05",
      text: "#ffe8b0",
    },
    gradient: "linear-gradient(135deg, #4a2000 0%, #c4701a 50%, #f0c040 100%)",
    emoji: "🥁",
    region: "West & South Sikkim",
    speakers: 31700,
    learners: 2900,
    lessons: 36,
    contributors: 142,
    preservationLevel: 61,
    colorTheme: "saffron",
    tags: ["Damphu Drum", "Bon Tradition", "Thangka", "Mountain", "Shamanic"],
    cultural: {
      symbol: "Damphu drum",
      pattern: "Saffron & geometric mountain ridge",
      element: "Saffron gold & Ochre",
    },
  },
  {
    id: "rai",
    slug: "rai",
    name: "Rai / Khambu",
    nativeName: "राई / खाम्बु",
    language: "Rai (Bantawa / Chamling)",
    script: "Kirat Rai Script / Devanagari",
    tagline: "Ancient Songs of the Kirati",
    description:
      "The Rai people are a collection of Kirati clans with diverse dialects and rich oral traditions. Their Mundhum scripture, Sakela dances, and deep connection to nature define their identity.",
    colors: {
      primary: "#8c3a20",
      secondary: "#c4501a",
      accent: "#e87840",
      bg: "#180800",
      surface: "#281208",
      text: "#ffd8b0",
    },
    gradient: "linear-gradient(135deg, #3a1000 0%, #8c3a20 50%, #e87840 100%)",
    emoji: "🌾",
    region: "East & South Sikkim",
    speakers: 32120,
    learners: 2600,
    lessons: 32,
    contributors: 118,
    preservationLevel: 48,
    colorTheme: "monastery",
    tags: ["Kirati", "Sakela Dance", "Mundhum", "Oral Tradition", "Nature"],
    cultural: {
      symbol: "Dhol-Nagara drum pair",
      pattern: "Rice paddy & sun motifs",
      element: "Terracotta & Harvest gold",
    },
  },
  {
    id: "gurung",
    slug: "gurung",
    name: "Gurung",
    nativeName: "गुरुङ / तमु",
    language: "Gurung (Tamu Kwi)",
    script: "Tamu Script / Devanagari",
    tagline: "People of the Highlands",
    description:
      "The Gurung, known as Tamu, are celebrated for their bravery as Gurkha soldiers and their rich shamanistic Ghyabre and Poju traditions. Their round Ghatu dance is mesmerising.",
    colors: {
      primary: "#5c2d8c",
      secondary: "#8c4ab8",
      accent: "#c87ce0",
      bg: "#080414",
      surface: "#12081e",
      text: "#e8d8ff",
    },
    gradient: "linear-gradient(135deg, #2a0a50 0%, #5c2d8c 50%, #c87ce0 100%)",
    emoji: "🌸",
    region: "West Sikkim",
    speakers: 21440,
    learners: 1900,
    lessons: 28,
    contributors: 87,
    preservationLevel: 42,
    colorTheme: "glacier",
    tags: ["Shamanic", "Gurkha", "Highland", "Ghatu Dance", "Ancient"],
    cultural: {
      symbol: "Shaman drum & beads",
      pattern: "Highland floral motifs",
      element: "Royal violet & Petal pink",
    },
  },
  {
    id: "sherpa",
    slug: "sherpa",
    name: "Sherpa",
    nativeName: "ཤར་པ།",
    language: "Sherpa",
    script: "Tibetan Script",
    tagline: "Roof of the World Wisdom",
    description:
      "The Sherpa, renowned as the world's greatest mountaineers, carry profound Buddhist traditions, ecological knowledge, and a language rich with names for every peak, glacier, and wind.",
    colors: {
      primary: "#3d3d3d",
      secondary: "#5a5a5a",
      accent: "#d4aa4a",
      bg: "#0a0a0a",
      surface: "#141414",
      text: "#f0e8d0",
    },
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 50%, #d4aa4a 100%)",
    emoji: "🏔️",
    region: "North Sikkim",
    speakers: 13900,
    learners: 1400,
    lessons: 24,
    contributors: 62,
    preservationLevel: 55,
    colorTheme: "ink",
    tags: ["Buddhist", "Mountaineering", "Ecological", "Tibetan", "Wisdom"],
    cultural: {
      symbol: "Prayer flag (Lungta)",
      pattern: "Mountain silhouette & snowflake",
      element: "Charcoal & Summit gold",
    },
  },
  {
    id: "mangar",
    slug: "mangar",
    name: "Mangar",
    nativeName: "मङार",
    language: "Magar (Dhut)",
    script: "Akkha Script / Devanagari",
    tagline: "Warriors and Weavers of the Hills",
    description:
      "The Mangar (Magar) are an ancient Tibeto-Burman people known for their Kaura dance, Dhikri drums, and exquisite dhaka weaving. Their oral epics carry millennia of mountain wisdom.",
    colors: {
      primary: "#c4401a",
      secondary: "#d4704a",
      accent: "#f0a060",
      bg: "#1a0800",
      surface: "#2a1000",
      text: "#ffe0c0",
    },
    gradient: "linear-gradient(135deg, #4a1000 0%, #c4401a 50%, #f0a060 100%)",
    emoji: "⚔️",
    region: "West & South Sikkim",
    speakers: 18220,
    learners: 1600,
    lessons: 26,
    contributors: 72,
    preservationLevel: 38,
    colorTheme: "saffron",
    tags: ["Warrior", "Dhaka Weaving", "Kaura Dance", "Ancient", "Oral Epic"],
    cultural: {
      symbol: "Kukri & Dhaka cloth",
      pattern: "Dhaka weave geometric",
      element: "Rust red & Saffron",
    },
  },
  {
    id: "newar",
    slug: "newar",
    name: "Newar",
    nativeName: "नेवाः",
    language: "Newari (Nepal Bhasa)",
    script: "Ranjana / Pracalit Script",
    tagline: "Artisans of the Valley Civilisation",
    description:
      "The Newar are the original inhabitants of Kathmandu Valley who also settled in Sikkim. Master craftspeople, traders, and builders, their festivals, cuisine, and art are legendary.",
    colors: {
      primary: "#7b1c3c",
      secondary: "#c4401a",
      accent: "#d4aa4a",
      bg: "#1a0810",
      surface: "#2d1020",
      text: "#f5e8d0",
    },
    gradient: "linear-gradient(135deg, #3a0818 0%, #7b1c3c 50%, #d4aa4a 100%)",
    emoji: "🏛️",
    region: "South Sikkim",
    speakers: 9400,
    learners: 980,
    lessons: 20,
    contributors: 48,
    preservationLevel: 60,
    colorTheme: "monastery",
    tags: ["Artisan", "Festivals", "Architecture", "Trade", "Buddhist-Hindu"],
    cultural: {
      symbol: "Peacock window (Mayur Jhya)",
      pattern: "Peacock & lotus carvings",
      element: "Crimson & Temple gold",
    },
  },
  {
    id: "sunwar",
    slug: "sunwar",
    name: "Sunwar",
    nativeName: "सुनुवार",
    language: "Sunwar (Koits)",
    script: "Jenticha Script",
    tagline: "Keepers of the Ancient Script",
    description:
      "The Sunwar, known as Koits, possess one of the world's rarest indigenous scripts — Jenticha. Their oral epics, blacksmithing traditions, and shamanic practices are unique in the region.",
    colors: {
      primary: "#2d6a2d",
      secondary: "#4a8c20",
      accent: "#a0c840",
      bg: "#080e04",
      surface: "#101808",
      text: "#d8f0a0",
    },
    gradient: "linear-gradient(135deg, #0a2004 0%, #2d6a2d 50%, #a0c840 100%)",
    emoji: "📜",
    region: "East Sikkim",
    speakers: 4900,
    learners: 520,
    lessons: 18,
    contributors: 32,
    preservationLevel: 35,
    colorTheme: "pine",
    tags: ["Jenticha Script", "Blacksmith", "Shamanic", "Endangered", "Ancient"],
    cultural: {
      symbol: "Jenticha manuscript",
      pattern: "Vine & geometric script patterns",
      element: "Forest green & Lime gold",
    },
  },
];

export const getCommunity = (id: string): Community | undefined =>
  COMMUNITIES.find((c) => c.id === id || c.slug === id);

export const communityGradientClass: Record<CommunityId, string> = {
  lepcha: "gradient-lepcha",
  bhutia: "gradient-bhutia",
  limbu: "gradient-limbu",
  tamang: "gradient-tamang",
  rai: "gradient-rai",
  gurung: "gradient-gurung",
  sherpa: "gradient-sherpa",
  mangar: "gradient-mangar",
  newar: "gradient-newar",
  sunwar: "gradient-sunwar",
};

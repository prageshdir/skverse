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

export interface CommunityColors {
  bg: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export interface CommunityCultural {
  symbol: string;
  pattern: string;
  element: string;
}

export interface Community {
  id: CommunityId;
  name: string;
  nativeName: string;
  emoji: string;
  speakers: number;
  region: string;
  preservation: number;
  script: string;
  theme: string;
  colorDescription: string;
  colors: CommunityColors;
  gradient: string;
  tags: string[];
  cultural: CommunityCultural;
}

export const COMMUNITIES: Community[] = [
  {
    id: "lepcha",
    name: "Lepcha",
    nativeName: "ᰛᰦᰵᰧᰶ",
    emoji: "🌿",
    speakers: 38400,
    region: "North & West Sikkim",
    preservation: 45,
    script: "Lepcha Script (Róng)",
    theme: "pine",
    colorDescription: "Forest green & Bamboo yellow",
    colors: {
      bg: "#0a1a0e",
      surface: "#0f2414",
      primary: "#22c55e",
      secondary: "#86efac",
      accent: "#bef264",
      text: "#dcfce7",
    },
    gradient: "linear-gradient(135deg, #0a1a0e 0%, #14532d 50%, #166534 100%)",
    tags: ["endangered", "indigenous", "nature"],
    cultural: {
      symbol: "Bamboo",
      pattern: "Leaf weave",
      element: "Forest",
    },
  },
  {
    id: "bhutia",
    name: "Bhutia",
    nativeName: "དྲེ་ཇོང་སྐད།",
    emoji: "🏯",
    speakers: 41825,
    region: "North & East Sikkim",
    preservation: 52,
    script: "Tibetan Script (Uchen)",
    theme: "monastery",
    colorDescription: "Monastery purple & Gold",
    colors: {
      bg: "#13071f",
      surface: "#1e0f2e",
      primary: "#a855f7",
      secondary: "#d8b4fe",
      accent: "#fbbf24",
      text: "#f3e8ff",
    },
    gradient: "linear-gradient(135deg, #13071f 0%, #3b0764 50%, #581c87 100%)",
    tags: ["tibetan", "buddhist", "highland"],
    cultural: {
      symbol: "Prayer wheel",
      pattern: "Thangka motif",
      element: "Mountain monastery",
    },
  },
  {
    id: "limbu",
    name: "Limbu",
    nativeName: "ᤕᤠᤰᤌᤢᤱ",
    emoji: "🦅",
    speakers: 56650,
    region: "East Sikkim",
    preservation: 58,
    script: "Sirijonga Script",
    theme: "glacier",
    colorDescription: "Glacier blue & Ice white",
    colors: {
      bg: "#071828",
      surface: "#0c2240",
      primary: "#38bdf8",
      secondary: "#7dd3fc",
      accent: "#e0f2fe",
      text: "#e0f2fe",
    },
    gradient: "linear-gradient(135deg, #071828 0%, #0c4a6e 50%, #075985 100%)",
    tags: ["kirat", "indigenous", "eastern"],
    cultural: {
      symbol: "Eagle feather",
      pattern: "Sirijonga weave",
      element: "Glacier peak",
    },
  },
  {
    id: "tamang",
    name: "Tamang",
    nativeName: "तामाङ",
    emoji: "🥁",
    speakers: 31700,
    region: "West & South Sikkim",
    preservation: 61,
    script: "Pracalit Script",
    theme: "saffron",
    colorDescription: "Saffron & Gold",
    colors: {
      bg: "#1c0f00",
      surface: "#2d1800",
      primary: "#f97316",
      secondary: "#fdba74",
      accent: "#fbbf24",
      text: "#fff7ed",
    },
    gradient: "linear-gradient(135deg, #1c0f00 0%, #7c2d12 50%, #9a3412 100%)",
    tags: ["tibeto-burman", "buddhist", "drum"],
    cultural: {
      symbol: "Damphu drum",
      pattern: "Tamang weave",
      element: "Saffron flame",
    },
  },
  {
    id: "rai",
    name: "Rai",
    nativeName: "राई / खाम्बु",
    emoji: "🌾",
    speakers: 32120,
    region: "East & South Sikkim",
    preservation: 48,
    script: "Kirat Rai Script",
    theme: "monastery",
    colorDescription: "Terracotta & Harvest gold",
    colors: {
      bg: "#1a0a00",
      surface: "#2c1200",
      primary: "#dc6b2f",
      secondary: "#f0a070",
      accent: "#fbbf24",
      text: "#fef3c7",
    },
    gradient: "linear-gradient(135deg, #1a0a00 0%, #7c1d12 50%, #9f2d1a 100%)",
    tags: ["kirat", "indigenous", "agriculture"],
    cultural: {
      symbol: "Millet stalk",
      pattern: "Rai basket weave",
      element: "Harvest field",
    },
  },
  {
    id: "gurung",
    name: "Gurung",
    nativeName: "गुरुङ / तमु",
    emoji: "🌸",
    speakers: 21440,
    region: "West Sikkim",
    preservation: 42,
    script: "Tamu Script",
    theme: "glacier",
    colorDescription: "Violet & Rhododendron pink",
    colors: {
      bg: "#110820",
      surface: "#1c0d34",
      primary: "#8b5cf6",
      secondary: "#c4b5fd",
      accent: "#f9a8d4",
      text: "#faf5ff",
    },
    gradient: "linear-gradient(135deg, #110820 0%, #4c1d95 50%, #5b21b6 100%)",
    tags: ["gurung", "warrior", "highland"],
    cultural: {
      symbol: "Rhododendron",
      pattern: "Tamu cross-stitch",
      element: "Alpine bloom",
    },
  },
  {
    id: "sherpa",
    name: "Sherpa",
    nativeName: "ཤར་པ།",
    emoji: "🏔️",
    speakers: 13900,
    region: "North Sikkim",
    preservation: 55,
    script: "Tibetan Script",
    theme: "ink",
    colorDescription: "Charcoal & Summit gold",
    colors: {
      bg: "#0d0d0d",
      surface: "#1a1a1a",
      primary: "#94a3b8",
      secondary: "#cbd5e1",
      accent: "#fbbf24",
      text: "#f1f5f9",
    },
    gradient: "linear-gradient(135deg, #0d0d0d 0%, #1e293b 50%, #334155 100%)",
    tags: ["tibetan", "mountaineer", "highland"],
    cultural: {
      symbol: "Ice axe",
      pattern: "Tibetan knot",
      element: "Summit",
    },
  },
  {
    id: "mangar",
    name: "Mangar",
    nativeName: "मङार",
    emoji: "⚔️",
    speakers: 18220,
    region: "West & South Sikkim",
    preservation: 38,
    script: "Akkha Script",
    theme: "saffron",
    colorDescription: "Rust & Saffron",
    colors: {
      bg: "#1a0800",
      surface: "#2e1000",
      primary: "#b45309",
      secondary: "#d97706",
      accent: "#f97316",
      text: "#fff7ed",
    },
    gradient: "linear-gradient(135deg, #1a0800 0%, #7c2d12 50%, #92400e 100%)",
    tags: ["magar", "warrior", "indigenous"],
    cultural: {
      symbol: "Khukuri blade",
      pattern: "Akkha script border",
      element: "Forge fire",
    },
  },
  {
    id: "newar",
    name: "Newar",
    nativeName: "नेवाः",
    emoji: "🏛️",
    speakers: 9400,
    region: "South Sikkim",
    preservation: 60,
    script: "Ranjana Script",
    theme: "monastery",
    colorDescription: "Crimson & Temple gold",
    colors: {
      bg: "#1a0008",
      surface: "#2d0010",
      primary: "#be123c",
      secondary: "#fb7185",
      accent: "#fbbf24",
      text: "#fff1f2",
    },
    gradient: "linear-gradient(135deg, #1a0008 0%, #881337 50%, #9f1239 100%)",
    tags: ["newari", "artisan", "urban"],
    cultural: {
      symbol: "Peacock window",
      pattern: "Ranjana filigree",
      element: "Temple spire",
    },
  },
  {
    id: "sunwar",
    name: "Sunwar",
    nativeName: "सुनुवार",
    emoji: "📜",
    speakers: 4900,
    region: "East Sikkim",
    preservation: 35,
    script: "Jenticha Script",
    theme: "pine",
    colorDescription: "Forest green & Parchment",
    colors: {
      bg: "#081408",
      surface: "#0f1f0f",
      primary: "#16a34a",
      secondary: "#4ade80",
      accent: "#d9f99d",
      text: "#f0fdf4",
    },
    gradient: "linear-gradient(135deg, #081408 0%, #14532d 50%, #166534 100%)",
    tags: ["kirat", "script", "endangered"],
    cultural: {
      symbol: "Scroll",
      pattern: "Jenticha letterform",
      element: "Forest glade",
    },
  },
];

export function getCommunity(id: CommunityId): Community | undefined {
  return COMMUNITIES.find((c) => c.id === id);
}

export type CommunityId = "bhutia" | "lepcha" | "limbu" | "tamang" | "nepali" | "gurung";

export interface Community {
  id: CommunityId;
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
  preservationLevel: number; // 0-100
  tags: string[];
  cultural: {
    symbol: string;
    pattern: string;
    element: string;
  };
}

export const COMMUNITIES: Community[] = [
  {
    id: "bhutia",
    name: "Bhutia",
    nativeName: "དྲེ་ཇོང་སྐད།",
    language: "Sikkimese",
    script: "Tibetan Script",
    tagline: "The Soul of the Himalayas",
    description:
      "Originating from Tibet, the Bhutia people brought with them a rich tradition of art, religion, and language. Their monasteries and silk weaves speak of centuries of wisdom.",
    colors: {
      primary: "#7b1c3c",
      secondary: "#c4401a",
      accent: "#d4aa4a",
      bg: "#0d0408",
      surface: "#1a0810",
      text: "#f5e8d0",
    },
    gradient: "linear-gradient(135deg, #7b1c3c 0%, #c4401a 50%, #d4aa4a 100%)",
    emoji: "🏯",
    region: "North & East Sikkim",
    speakers: 70000,
    learners: 4200,
    lessons: 48,
    contributors: 156,
    preservationLevel: 62,
    tags: ["Tibetan Script", "Buddhist", "Monastery", "Silk", "Mountain"],
    cultural: {
      symbol: "Dorje (Thunderbolt)",
      pattern: "Silk brocade weave",
      element: "Maroon & Gold monastery walls",
    },
  },
  {
    id: "lepcha",
    name: "Lepcha",
    nativeName: "ᰛᰦᰴᰥᰜ",
    language: "Rong",
    script: "Lepcha Script",
    tagline: "Children of the Forest",
    description:
      "The Lepchas are Sikkim's indigenous people, the 'Rong.' Their language, written in a unique script, reflects their deep harmony with the forests and rivers of the Eastern Himalayas.",
    colors: {
      primary: "#1a5c2a",
      secondary: "#2d8c3c",
      accent: "#7cbf4a",
      bg: "#040d06",
      surface: "#0a1f0c",
      text: "#d4f0c4",
    },
    gradient: "linear-gradient(135deg, #0d3018 0%, #1a5c2a 50%, #5a9c3c 100%)",
    emoji: "🌿",
    region: "West Sikkim & Darjeeling Hills",
    speakers: 50000,
    learners: 2800,
    lessons: 36,
    contributors: 98,
    preservationLevel: 48,
    tags: ["Indigenous Script", "Nature", "Forest", "Sacred", "Endangered"],
    cultural: {
      symbol: "Sacred bamboo groves",
      pattern: "Woven bamboo motifs",
      element: "Forest green & Leaf gold",
    },
  },
  {
    id: "limbu",
    name: "Limbu",
    nativeName: "ᤕᤠᤰᤌᤢᤱ",
    language: "Limbu (Yakthung)",
    script: "Sirijonga Script",
    tagline: "Warriors of the Mountains",
    description:
      "The Limbu people carry a proud martial and agricultural heritage. Their Sirijonga script and vibrant woven patterns tell stories of valour and community.",
    colors: {
      primary: "#b84a00",
      secondary: "#e07820",
      accent: "#f5c040",
      bg: "#100800",
      surface: "#1e1000",
      text: "#fff0d0",
    },
    gradient: "linear-gradient(135deg, #6b2800 0%, #b84a00 50%, #f5c040 100%)",
    emoji: "⚔️",
    region: "East Sikkim & Taplejung",
    speakers: 380000,
    learners: 8600,
    lessons: 52,
    contributors: 210,
    preservationLevel: 74,
    tags: ["Sirijonga", "Warrior", "Agriculture", "Vibrant", "Festival"],
    cultural: {
      symbol: "Kukri & crossed swords",
      pattern: "Woven geometric warrior motifs",
      element: "Saffron & Bronze energy",
    },
  },
  {
    id: "tamang",
    name: "Tamang",
    nativeName: "तामाङ",
    language: "Tamang",
    script: "Devanagari / Tamang Script",
    tagline: "Mountain Horsemen",
    description:
      "The Tamang, whose name means 'horse soldier,' are one of Nepal's and Sikkim's largest indigenous groups. Their music, Damphu drumming, and warm hospitality define their culture.",
    colors: {
      primary: "#1a4a7c",
      secondary: "#2e7ab8",
      accent: "#5ab8e0",
      bg: "#040810",
      surface: "#081220",
      text: "#c8e8ff",
    },
    gradient: "linear-gradient(135deg, #0a2040 0%, #1a4a7c 50%, #5ab8e0 100%)",
    emoji: "🐴",
    region: "West & South Sikkim",
    speakers: 1500000,
    learners: 12400,
    lessons: 44,
    contributors: 284,
    preservationLevel: 81,
    tags: ["Damphu Drum", "Mountain", "Hospitality", "Buddhist", "Music"],
    cultural: {
      symbol: "Damphu drum",
      pattern: "Mountain ridge geometric patterns",
      element: "Deep sky blue & Silver",
    },
  },
  {
    id: "nepali",
    name: "Nepali / Gorkhali",
    nativeName: "नेपाली",
    language: "Nepali",
    script: "Devanagari",
    tagline: "The Lingua Franca of the Hills",
    description:
      "Nepali is the common thread weaving through Sikkim's diverse communities. As a bridge language, it carries the collective stories, songs, and aspirations of the hill communities.",
    colors: {
      primary: "#8b1a1a",
      secondary: "#c44444",
      accent: "#f0a830",
      bg: "#100404",
      surface: "#200808",
      text: "#ffe8d8",
    },
    gradient: "linear-gradient(135deg, #4a0c0c 0%, #8b1a1a 50%, #f0a830 100%)",
    emoji: "🏔️",
    region: "All of Sikkim",
    speakers: 17000000,
    learners: 22000,
    lessons: 60,
    contributors: 420,
    preservationLevel: 94,
    tags: ["Devanagari", "Bridge Language", "Literature", "Poetry", "Common"],
    cultural: {
      symbol: "Khukuri (national emblem)",
      pattern: "Dhaka fabric patterns",
      element: "Crimson & Marigold",
    },
  },
  {
    id: "gurung",
    name: "Gurung",
    nativeName: "गुरुङ",
    language: "Gurung (Tamu)",
    script: "Tamu Script",
    tagline: "People of the Highlands",
    description:
      "The Gurung people, known as Tamu, are celebrated for their bravery as Gurkha soldiers and their rich shamanistic Ghyabre and Poju traditions.",
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
    speakers: 230000,
    learners: 3100,
    lessons: 30,
    contributors: 87,
    preservationLevel: 55,
    tags: ["Shamanic", "Gurkha", "Highland", "Festival", "Ancient"],
    cultural: {
      symbol: "Shaman drum & beads",
      pattern: "Highland floral motifs",
      element: "Royal violet & Petal pink",
    },
  },
];

export const getCommunity = (id: string): Community | undefined =>
  COMMUNITIES.find((c) => c.id === id);

export const communityGradientClass: Record<CommunityId, string> = {
  bhutia: "gradient-bhutia",
  lepcha: "gradient-lepcha",
  limbu: "gradient-limbu",
  tamang: "gradient-tamang",
  nepali: "gradient-brand",
  gurung: "gradient-brand",
};

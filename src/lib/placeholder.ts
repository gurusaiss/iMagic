/**
 * Generates an ultra-premium, photorealistic SVG smartphone mockup
 * inspired by Apple iPhone Pro & flagship industrial design.
 * Uses transparent backgrounds, metallic chassis reflections, glass sheen,
 * dynamic island, bezel curves, and vivid OLED wallpapers.
 */

interface PhoneStyle {
  bodyGrad: [string, string, string];
  frameStroke: string;
  wallpaperGrad: [string, string, string];
  accentGlow: string;
}

const COLOR_MAP: Record<string, PhoneStyle> = {
  "Midnight Black": {
    bodyGrad: ["#2d3238", "#181a1d", "#0c0d0f"],
    frameStroke: "#3e444c",
    wallpaperGrad: ["#1e293b", "#0f172a", "#020617"],
    accentGlow: "#38bdf8",
  },
  "Jet Black": {
    bodyGrad: ["#22252a", "#121417", "#050608"],
    frameStroke: "#343a42",
    wallpaperGrad: ["#18181b", "#09090b", "#000000"],
    accentGlow: "#a855f7",
  },
  "Ocean Blue": {
    bodyGrad: ["#2c4a6f", "#172d47", "#0c1827"],
    frameStroke: "#48729f",
    wallpaperGrad: ["#0284c7", "#1e40af", "#0f172a"],
    accentGlow: "#38bdf8",
  },
  "Coral Red": {
    bodyGrad: ["#8b2e2e", "#5c1818", "#2c0909"],
    frameStroke: "#b34848",
    wallpaperGrad: ["#f43f5e", "#be123c", "#4c0519"],
    accentGlow: "#fb7185",
  },
  "Pearl White": {
    bodyGrad: ["#f5f6f8", "#e3e6ec", "#ccd1db"],
    frameStroke: "#b5bcc8",
    wallpaperGrad: ["#e0e7ff", "#c7d2fe", "#93c5fd"],
    accentGlow: "#60a5fa",
  },
  "Graphite Grey": {
    bodyGrad: ["#4a4f56", "#2c3036", "#191c20"],
    frameStroke: "#666d77",
    wallpaperGrad: ["#475569", "#334155", "#0f172a"],
    accentGlow: "#94a3b8",
  },
  "Titanium Silver": {
    bodyGrad: ["#c5cbd4", "#8e97a4", "#5e6673"],
    frameStroke: "#dbe0e8",
    wallpaperGrad: ["#cbd5e1", "#64748b", "#1e293b"],
    accentGlow: "#e2e8f0",
  },
  "Sunset Orange": {
    bodyGrad: ["#9c431d", "#6b270a", "#381102"],
    frameStroke: "#c25e31",
    wallpaperGrad: ["#ea580c", "#c2410c", "#431407"],
    accentGlow: "#fb923c",
  },
  "Emerald Green": {
    bodyGrad: ["#1e533e", "#0e3324", "#051810"],
    frameStroke: "#2f7a5d",
    wallpaperGrad: ["#059669", "#047857", "#022c22"],
    accentGlow: "#34d399",
  },
  "Lavender Purple": {
    bodyGrad: ["#5b3d7a", "#3a2252", "#1d0e2c"],
    frameStroke: "#7f59a6",
    wallpaperGrad: ["#9333ea", "#6b21a8", "#2e1065"],
    accentGlow: "#c084fc",
  },
};

export function phonePlaceholder(model: string, color = "Midnight Black", _legacyAccent?: string): string {
  const style = COLOR_MAP[color] ?? {
    bodyGrad: ["#2d3238", "#181a1d", "#0c0d0f"],
    frameStroke: "#3e444c",
    wallpaperGrad: ["#2563eb", "#1e40af", "#0f172a"],
    accentGlow: "#38bdf8",
  };

  const id = model.replace(/[^a-zA-Z0-9]/g, "");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 440" width="100%" height="100%">
    <defs>
      <!-- Titanium Chassis Outer Bezel -->
      <linearGradient id="frameGrad_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${style.bodyGrad[0]}"/>
        <stop offset="50%" stop-color="${style.bodyGrad[1]}"/>
        <stop offset="100%" stop-color="${style.bodyGrad[2]}"/>
      </linearGradient>

      <!-- Chassis Rim Metallic Highlight -->
      <linearGradient id="rimGrad_${id}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
        <stop offset="30%" stop-color="#ffffff" stop-opacity="0.05"/>
        <stop offset="70%" stop-color="#000000" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.25"/>
      </linearGradient>

      <!-- OLED Fluid Wallpaper -->
      <radialGradient id="oledGlow_${id}" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stop-color="${style.wallpaperGrad[0]}"/>
        <stop offset="55%" stop-color="${style.wallpaperGrad[1]}"/>
        <stop offset="100%" stop-color="${style.wallpaperGrad[2]}"/>
      </radialGradient>

      <!-- Organic Fluid Wave Layer 1 -->
      <linearGradient id="wave1_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${style.accentGlow}" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="${style.wallpaperGrad[0]}" stop-opacity="0"/>
      </linearGradient>

      <!-- Organic Fluid Wave Layer 2 -->
      <linearGradient id="wave2_${id}" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="${style.wallpaperGrad[1]}" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </linearGradient>

      <!-- Glass Reflection Sheen -->
      <linearGradient id="glassSheen_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
        <stop offset="35%" stop-color="#ffffff" stop-opacity="0.06"/>
        <stop offset="60%" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>

      <!-- Drop Shadow Filter -->
      <filter id="phoneShadow_${id}" x="-20%" y="-15%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.22"/>
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.14"/>
      </filter>

      <!-- Clip Screen to Bezel Border -->
      <clipPath id="screenClip_${id}">
        <rect x="74" y="24" width="192" height="392" rx="36" ry="36"/>
      </clipPath>
    </defs>

    <!-- Side Buttons (Left Volume & Action, Right Power) -->
    <!-- Action Button -->
    <rect x="66" y="80" width="3.5" height="18" rx="1.75" fill="${style.frameStroke}"/>
    <!-- Volume Up -->
    <rect x="66" y="110" width="3.5" height="34" rx="1.75" fill="${style.frameStroke}"/>
    <!-- Volume Down -->
    <rect x="66" y="152" width="3.5" height="34" rx="1.75" fill="${style.frameStroke}"/>
    <!-- Power Button -->
    <rect x="270.5" y="115" width="3.5" height="48" rx="1.75" fill="${style.frameStroke}"/>

    <!-- Outer Phone Body (Titanium Enclosure with Drop Shadow) -->
    <g filter="url(#phoneShadow_${id})">
      <rect x="70" y="20" width="200" height="400" rx="40" ry="40"
            fill="url(#frameGrad_${id})" stroke="${style.frameStroke}" stroke-width="2"/>
      <rect x="70" y="20" width="200" height="400" rx="40" ry="40"
            fill="url(#rimGrad_${id})" pointer-events="none"/>
    </g>

    <!-- Inner Screen Display Bezel -->
    <rect x="72" y="22" width="196" height="396" rx="38" ry="38" fill="#030712"/>

    <!-- Active OLED Display Content (Clipped) -->
    <g clip-path="url(#screenClip_${id})">
      <!-- Background OLED Gradient -->
      <rect x="74" y="24" width="192" height="392" fill="url(#oledGlow_${id})"/>

      <!-- Fluid Artwork Curves (Apple-style organic ribbon) -->
      <path d="M 60,180 C 120,120 180,260 280,200 L 280,420 L 60,420 Z"
            fill="url(#wave1_${id})" opacity="0.85"/>
      <circle cx="170" cy="220" r="85" fill="${style.accentGlow}" opacity="0.3" filter="blur(20px)"/>
      <path d="M 70,300 C 140,240 190,360 280,280 L 280,420 L 70,420 Z"
            fill="url(#wave2_${id})" opacity="0.7"/>

      <!-- Lockscreen / Clock Subtle Elements -->
      <text x="170" y="78" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
            font-size="11" font-weight="500" fill="#ffffff" opacity="0.8" text-anchor="middle" letter-spacing="0.5">
        MON, 9 NOV
      </text>
      <text x="170" y="118" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
            font-size="34" font-weight="700" fill="#ffffff" opacity="0.95" text-anchor="middle" letter-spacing="-0.5">
        09:41
      </text>

      <!-- Glass Diagonal Reflection Sheen -->
      <polygon points="74,24 160,24 74,280" fill="url(#glassSheen_${id})" pointer-events="none"/>
      <polygon points="120,24 230,24 74,400" fill="url(#glassSheen_${id})" opacity="0.5" pointer-events="none"/>

      <!-- Bottom Home Bar Indicator -->
      <rect x="135" y="404" width="70" height="3.5" rx="1.75" fill="#ffffff" opacity="0.75"/>
    </g>

    <!-- Dynamic Island / Pill Notch (Front Camera + Face Sensor) -->
    <g>
      <rect x="142" y="32" width="56" height="16" rx="8" ry="8" fill="#000000"/>
      <!-- Front Camera Lens Glow -->
      <circle cx="188" cy="40" r="3.5" fill="#0f172a"/>
      <circle cx="188" cy="40" r="1.5" fill="#1e3a8a" opacity="0.8"/>
      <circle cx="188.5" cy="39.5" r="0.6" fill="#60a5fa"/>
      <!-- Sensor Dot -->
      <circle cx="152" cy="40" r="2" fill="#090d16"/>
    </g>

    <!-- Top Speaker Ear Piece Micro-Grill -->
    <rect x="156" y="24" width="28" height="1.5" rx="0.75" fill="#1f2937" opacity="0.6"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

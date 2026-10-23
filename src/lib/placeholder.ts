export function phonePlaceholder(label: string, bg: string, accent: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <rect width="400" height="400" fill="${bg}"/>
    <rect x="140" y="40" width="120" height="320" rx="24" fill="${accent}" stroke="#00000022" stroke-width="3"/>
    <rect x="152" y="66" width="96" height="220" rx="4" fill="#ffffffcc"/>
    <circle cx="200" cy="330" r="10" fill="#ffffffcc"/>
    <text x="200" y="380" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#333" text-anchor="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

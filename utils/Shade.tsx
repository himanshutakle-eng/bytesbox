export function lightenColor(hex: string, percent: number): string {
  // Remove the # if present
  hex = hex.replace(/^#/, "");

  // Parse r,g,b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Increase each channel by the percent (0–100)
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  // Convert back to hex and return
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

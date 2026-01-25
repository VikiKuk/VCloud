export function truncateMiddle(text, max = 22) {
  if (!text) return "";
  if (text.length <= max) return text;
  const part = Math.floor((max - 3) / 2);
  return text.slice(0, part) + "..." + text.slice(-part);
}
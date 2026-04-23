export function toPascalCase(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w): w is string => w.length > 0)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}
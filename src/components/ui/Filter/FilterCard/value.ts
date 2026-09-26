export function isFilterValueActive(value: unknown): boolean {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "boolean") return value;
  if (typeof value === "object" && !isPlainObject(value)) return true;
  if (typeof value === "object") {
    return Object.values(value).some(isFilterValueActive);
  }
  return true;
}

/** آیا شیء از نوع plain object است (نه Date/Map/کلاس سفارشی)؟ */
function isPlainObject(value: object): value is Record<string, unknown> {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

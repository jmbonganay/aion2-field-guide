/** Dates are stored in UTC; display as `YYYY-MM-DD` (UTC) to stay deterministic. */
export function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function formatFactValue(fact: { value: string | number | boolean | string[]; unit?: string }): string {
  // Lists of short names read best with commas; lists of phrases with semicolons.
  const value = Array.isArray(fact.value)
    ? fact.value.join(fact.value.some((v) => v.split(' ').length > 5) ? '; ' : ', ')
    : typeof fact.value === 'number'
      ? fact.value.toLocaleString('en-US')
      : typeof fact.value === 'boolean'
        ? fact.value
          ? 'Yes'
          : 'No'
        : fact.value;
  return fact.unit ? `${value} ${fact.unit}` : value;
}

export function humanizeProperty(property: string): string {
  const spaced = property.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

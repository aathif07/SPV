/** Formats a post date in both languages so either can be shown client-side. */
export function formatPostDate(value: Date | null): { en: string; ta: string } {
  if (!value) return { en: "", ta: "" };
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return {
    en: new Intl.DateTimeFormat("en-GB", options).format(value),
    ta: new Intl.DateTimeFormat("ta-IN", options).format(value),
  };
}

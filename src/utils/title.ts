const HOME_TITLE = "ทันเทค | TanTech News";
const BRAND_SUFFIX = " | TanTech News";
const ALT_SUFFIXES = [" | TanTech News", " | ทันเทค"];
/** Soft SERP-friendly budget for Thai + Latin titles */
const MAX_TITLE_LENGTH = 60;

export function stripBrandSuffix(title: string): string {
  let clean = title.trim();
  for (const suffix of ALT_SUFFIXES) {
    if (clean.endsWith(suffix)) {
      clean = clean.slice(0, -suffix.length).trimEnd();
    }
  }
  return clean;
}

export function formatPageTitle(title?: string): string {
  if (!title || title === HOME_TITLE || title === "TanTech News" || title === "ทันเทค") {
    return HOME_TITLE;
  }

  const clean = stripBrandSuffix(title);
  const withBrand = `${clean}${BRAND_SUFFIX}`;

  if (withBrand.length <= MAX_TITLE_LENGTH) {
    return withBrand;
  }

  if (clean.length <= MAX_TITLE_LENGTH) {
    return clean;
  }

  const truncated = clean.slice(0, MAX_TITLE_LENGTH - 1).trimEnd();
  return `${truncated}…`;
}

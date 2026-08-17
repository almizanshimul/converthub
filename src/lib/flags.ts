/**
 * Path to a country's flag SVG in public/flags/. Flag emoji were tried
 * first, but Chromium on Windows renders the underlying Regional Indicator
 * Symbol pairs as plain boxed letters ("BD") instead of an actual flag
 * glyph, so real SVG files are used instead.
 *
 * Files came from the `flag-icons` npm package (MIT-licensed, 4x3 set) —
 * to add a new country: `npm i -D flag-icons`, copy
 * `node_modules/flag-icons/flags/4x3/{code}.svg` into public/flags/, then
 * uninstall the package again (nothing else in the app depends on it).
 */
export function getFlagSrc(isoCode: string): string {
  return `/flags/${isoCode.toLowerCase()}.svg`;
}

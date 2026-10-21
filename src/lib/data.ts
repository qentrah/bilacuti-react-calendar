import rawData from "../data.json";
import type { HolidayDataset } from "./types.js";
/** Source-derived Malaysian holidays for 2026 and 2027. */
export const malaysiaHolidayData = rawData as HolidayDataset;
export const states = [
  { slug: "johor", name: "Johor" },
  { slug: "kedah", name: "Kedah" },
  { slug: "kelantan", name: "Kelantan" },
  { slug: "kuala-lumpur", name: "Kuala Lumpur" },
  { slug: "labuan", name: "Labuan" },
  { slug: "melaka", name: "Melaka" },
  { slug: "negeri-sembilan", name: "Negeri Sembilan" },
  { slug: "pahang", name: "Pahang" },
  { slug: "pulau-pinang", name: "Pulau Pinang" },
  { slug: "perak", name: "Perak" },
  { slug: "perlis", name: "Perlis" },
  { slug: "putrajaya", name: "Putrajaya" },
  { slug: "sabah", name: "Sabah" },
  { slug: "sarawak", name: "Sarawak" },
  { slug: "selangor", name: "Selangor" },
  { slug: "terengganu", name: "Terengganu" },
];
export const schoolGroupA = ["kedah", "kelantan", "terengganu"];
export const schoolGroupB = states
  .map((s) => s.slug)
  .filter((s) => !schoolGroupA.includes(s));
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export function regionName(region: string): string {
  return region === "nationwide"
    ? "Nationwide"
    : (states.find((s) => s.slug === region)?.name ?? region);
}

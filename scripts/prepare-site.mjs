import { mkdir, readFile, writeFile } from "node:fs/promises";
import { routePaths, parseDocRoute } from "../src/docs/routes.ts";
const template = await readFile("dist/index.html", "utf8");
const base = process.env.SITE_BASE_PATH || "/";
const origin = process.env.SITE_ORIGIN || "https://qentrah.github.io";
const escape = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const urls = [new URL(base, origin).href];
for (const path of routePaths) {
  const route = parseDocRoute(path);
  const name = route.component
    ? `${route.component.name} · ${route.view === "api" ? "API reference" : route.view}`
    : route.guide?.title || "Documentation";
  const description =
    route.component?.description ||
    route.guide?.description ||
    "Install and use Bila Cuti React Calendar. Component previews, configuration, typed API reference, and custom holiday data patterns.";
  const canonical = new URL(`${base}library/${path}${path ? "/" : ""}`, origin)
    .href;
  const html = template
    .replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${escape(name)} · Bila Cuti</title>`,
    )
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escape(description)}" />`,
    )
    .replace("</head>", `<link rel="canonical" href="${canonical}" /></head>`);
  const folder = `dist/library/${path}`;
  await mkdir(folder, { recursive: true });
  await writeFile(`${folder}/index.html`, html);
  urls.push(canonical);
}
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${escape(url)}</loc></url>`).join("")}</urlset>`,
);
console.log(
  `Created ${routePaths.length} directly loadable documentation pages.`,
);

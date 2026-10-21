import { mkdir, copyFile } from "node:fs/promises";
await mkdir("dist/library", { recursive: true });
await copyFile("dist/index.html", "dist/library/index.html");

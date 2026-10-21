import { mkdir, copyFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const [result] = JSON.parse(execFileSync('npm', ['pack', '--json'], { encoding: 'utf8' }));
await mkdir('public/downloads', { recursive: true });
await copyFile(result.filename, `public/downloads/${result.filename}`);

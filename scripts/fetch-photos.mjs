// Downloads every café photo into public/photos so the demo works without Unsplash.
// Run once from the project folder:  node scripts/fetch-photos.mjs
import { mkdir, writeFile, access } from 'node:fs/promises';
import { PHOTOS, SCENE_PHOTOS } from '../src/data/cafes.js';

const ids = [...new Set([...Object.values(PHOTOS).flat(), ...Object.values(SCENE_PHOTOS)])];
const dir = new URL('../public/photos/', import.meta.url);
await mkdir(dir, { recursive: true });

let ok = 0;
for (const id of ids) {
  const file = new URL(`${id}.jpg`, dir);
  try { await access(file); ok++; console.log('have ', id); continue; } catch {}
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=72&fm=jpg`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    ok++; console.log('saved', id);
  } catch (e) {
    console.log('FAIL ', id, e.message);
  }
}
console.log(`\n${ok}/${ids.length} photos in public/photos`);

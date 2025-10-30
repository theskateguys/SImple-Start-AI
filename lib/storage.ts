import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export async function loadBrandPack(handle: string): Promise<any|null> {
  const f = path.join(process.cwd(), 'brandpacks', `${handle}.json`);
  if (fs.existsSync(f)) {
    const raw = fs.readFileSync(f, 'utf8');
    const pack = JSON.parse(raw);
    return { handle, ...pack };
  }
  return null;
}

const leadsFile = path.join(dataDir, 'leads.json');
const messagesFile = path.join(dataDir, 'messages.json');

function readJsonArray(file: string) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}
function writeJsonArray(file: string, arr: any[]) {
  fs.writeFileSync(file, JSON.stringify(arr, null, 2), 'utf8');
}

export async function saveLead(brandHandle: string, lead: any) {
  const arr = readJsonArray(leadsFile);
  arr.push({ brandHandle, ...lead, createdAt: new Date().toISOString() });
  writeJsonArray(leadsFile, arr);
}
export async function saveMessage(brandHandle: string, message: any) {
  const arr = readJsonArray(messagesFile);
  arr.push({ brandHandle, ...message, createdAt: new Date().toISOString() });
  writeJsonArray(messagesFile, arr);
}

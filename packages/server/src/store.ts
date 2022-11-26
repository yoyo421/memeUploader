import path from "node:path";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import shortid from "shortid";

if (process.env.DB_PATH === undefined) {
  throw Error("Must set env.DB_PATH to a folder");
}
export const dbPath = path.resolve(__dirname, "..", process.env.DB_PATH);
const dbPathStore = path.resolve(dbPath, "store.json");

if (!existsSync(dbPath)) fs.mkdir(dbPath);

export declare interface LogEntry {
  mimetype: string;
  TTL: number;
  /** More data can be added here, like who uploaded it..., when got uploaded */
}

export declare type FileLog<T> = { [path: string]: T }; // Record<string, LogEntry>

/**
 * this is good only for small projects like this, for bigger thing i will
 * use some sort of db / db manager, postgresql, mongo, sqlite, with prisma
 *
 * because i have more then 1 access to this file in the code
 */
async function readStoreFile(): Promise<FileLog<LogEntry>> {
  if (!existsSync(dbPathStore)) return {};
  try {
    const store = JSON.parse(
      await fs.readFile(dbPathStore, { encoding: "utf8" })
    ) as FileLog<LogEntry>;
    return store;
  } catch (e) {
    // If invalid json, forget everything
    return {};
  }
}

async function saveStoreFile(store: FileLog<LogEntry>): Promise<void> {
  return await fs.writeFile(dbPathStore, JSON.stringify(store));
}

export async function _remove() {
  try {
    const store = (await readStoreFile()) as FileLog<LogEntry>;

    let hasChanged = false;
    const now = new Date().valueOf();
    Object.keys(store).forEach((key) => {
      if (store[key].TTL < now) {
        if (!hasChanged) hasChanged = true;
        delete store[key];

        const filename = path.resolve(dbPath, key);
        if (existsSync(dbPathStore)) fs.rm(filename);
      }
    });

    // Special case: store in empty, delete all images, for leaks
    if (Object.keys(store).length === 0) {
      const allFiles = (await fs.readdir(dbPath)).map((name) =>
        path.resolve(dbPath, name)
      );
      for (const _file of allFiles) {
        if (_file !== dbPathStore) fs.rm(_file);
      }
    }

    hasChanged && (await saveStoreFile(store));
  } catch (e) {
    console.warn(
      `crashed while trying to remove data: ${e}`,
      (e as Error).stack
    );
  }
}

let interval: null | NodeJS.Timer = null;
export function removeLoop(ms = 1000) {
  if (interval) clearInterval(interval);
  const _inter = (interval = setInterval(_remove, ms));
  return () => clearInterval(_inter);
}

/**
 * @param {number} ttl it is seconds while valueOf is in miliseconds
 * @returns {string} id for the item to be accessed with
 */
export async function addFile(
  file: Pick<Express.Multer.File, "buffer" | "mimetype">,
  ttl: number
): Promise<[id: string, entry: LogEntry]> {
  const store = await readStoreFile();
  const id = shortid();
  const filename = path.resolve(dbPath, id);
  const now = new Date().valueOf();
  const item = (store[id] = {
    mimetype: file.mimetype,
    TTL: now + ttl * 1000,
  });
  await saveStoreFile(store);
  await fs.writeFile(filename, file.buffer);
  return [id, item];
}

export async function getFilePath(
  id: string
): Promise<{ path: string; mimetype: string }> {
  const store = await readStoreFile();
  if (!(id in store)) throw Error("File not found");
  const item = store[id];
  return { path: path.join(dbPath, id), mimetype: item.mimetype };
}

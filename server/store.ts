import path from "node:path";
import { constants, existsSync } from "node:fs";
import fs from "node:fs/promises";
import shortid from "shortid";
import fileUpload from "express-fileupload";

const dbPath = path.resolve(__dirname, "db");
const dbPathStore = path.resolve(dbPath, "store.json");

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

  await fs.access(dbPathStore, constants.R_OK);
  const store = JSON.parse(
    await fs.readFile(dbPathStore, { encoding: "utf8" })
  ) as FileLog<LogEntry>;
  return store;
}

async function saveStoreFile(store: FileLog<LogEntry>): Promise<void> {
  return await fs.writeFile(dbPathStore, JSON.stringify(store));
}

let interval: null | NodeJS.Timer = null;
export function removeLoop() {
  if (interval) clearInterval(interval);
  interval = setInterval(async () => {
    try {
      const store = (await readStoreFile()) as FileLog<LogEntry>;

      let hasChanged = false;
      const now = new Date().valueOf();
      Object.keys(store).forEach((key) => {
        if (store[key].TTL < now) {
          if (!hasChanged) hasChanged = true;
          delete store[key];

          const filename = path.resolve(dbPath, key);
          fs.access(filename, fs.constants.F_OK).then(() => {
            try {
              fs.rm(filename);
            } catch (e) {}
          });
        }
      });

      hasChanged && (await saveStoreFile(store));
    } catch (e) {
      console.warn(
        `crashed while trying to remove data: ${e}`,
        (e as Error).stack
      );
    }
  }, 1000);
}

/**
 * @param {number} ttl it is seconds while valueOf is in miliseconds
 * @returns {string} id for the item to be accessed with
 */
export async function addFile(
  file: fileUpload.UploadedFile,
  ttl: number
): Promise<string> {
  const store = await readStoreFile();
  const id = shortid();
  const filename = path.resolve(dbPath, id);
  const now = new Date().valueOf();
  store[id] = { mimetype: file.mimetype, TTL: now + ttl * 1000 };
  await saveStoreFile(store);
  await fs.writeFile(filename, file.data);
  return id;
}

export async function getFile(
  id: string
): Promise<{ data: Buffer; mimetype: string }> {
  const store = await readStoreFile();
  if (!(id in store)) throw Error("File not found");
  const blob = (await fs.readFile(
    path.join(dbPath, id),
    "binary"
  )) as unknown as Buffer;
  return { data: blob, mimetype: store[id].mimetype };
}

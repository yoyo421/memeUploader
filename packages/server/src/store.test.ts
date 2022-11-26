process.env.DB_PATH = "db.test";
import * as store from "./store";
import fs from "node:fs";

describe("Store Logic", () => {
  let id: string;
  test("Adding a file", async () => {
    [id] = await store.addFile(
      { buffer: Buffer.from("Text to check"), mimetype: "plain/text" },
      2
    );
    const entry = await store.getFilePath(id);
    expect(fs.existsSync(entry.path)).toBe(true);
  });
  test("Getting a file", async () => {
    await store._remove();
    await expect(store.getFilePath(id)).toBeTruthy();
  });
  test("Removing a file", async () => {
    await new Promise((r) => setTimeout(r, 2000));
    await store._remove();
    await expect(store.getFilePath(id)).rejects.toThrowError("File not found");
  });
});

describe("Store Logic Automatically", () => {
  let id: string;
  test("Adding a file", async () => {
    [id] = await store.addFile(
      { buffer: Buffer.from("Text to check"), mimetype: "plain/text" },
      2
    );
    const entry = await store.getFilePath(id);
    expect(fs.existsSync(entry.path)).toBe(true);
  });
  test("Remove loop", async () => {
    const listener = store.removeLoop(100);
    await expect(store.getFilePath(id)).toBeTruthy();
    await new Promise((r) => setTimeout(r, 2500));
    await expect(store.getFilePath(id)).rejects.toThrowError("File not found");
    listener();
  });
});

afterAll(() => {
  fs.rmSync(store.dbPath, { recursive: true, force: true });
});

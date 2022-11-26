import express from "express";
import { addFile, getFilePath, removeLoop } from "./store";
import multer from "multer";

export type ErrorTypesV1 =
  | "InvalidFileAmount"
  | "TTLUndefined"
  | "TTLBiggerThanAllowed";

declare module "@api/errors-api" {
  interface PUTV1File {
    message: string;
    type: ErrorTypesV1;
  }
}

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
removeLoop();
const MAX_FILE_TTL = () => Number(process.env.FILE_TTL_MAX);

router.put("/file", upload.single("image"), async (req, res) => {
  const file = req?.file;
  if (!file || (Array.isArray(file) && file.length > 1))
    return res.status(406).send({
      message: "Invalid amount of files, need 1",
      type: "InvalidFileAmount",
    }); // Not Acceptable
  /** Time To Last */
  const fileTTL = Number(req.header("file-ttl"));
  if (isNaN(fileTTL))
    return res
      .status(406)
      .send({ message: "Must set TTL for the file", type: "TTLUndefined" }); // Not Acceptable
  if (MAX_FILE_TTL() < fileTTL)
    return res.status(406).send({
      message: "Cannot set TTL greater then what is allowed",
      type: "TTLBiggerThanAllowed",
    }); // Not Acceptable

  const [id, entry] = await addFile(file, fileTTL);
  const url = new URL(req.originalUrl, `http://${req.headers.host}`);
  url.pathname = url.pathname.replace("file", id);
  res
    .status(200)
    .header({ "content-type": "text/plain" })
    .send({ url: url.toString(), deleteAt: new Date(entry.TTL).toJSON() });
});
router.get("/:id", async (req, res) => {
  try {
    const file = await getFilePath(req.params.id);
    res.sendFile(file.path, { headers: { "Content-Type": file.mimetype } });
  } catch (e) {
    if ((e as Error).message === "File not found") return res.sendStatus(404);
    else return res.status(500).send(JSON.stringify(e));
  }
});

export default router;

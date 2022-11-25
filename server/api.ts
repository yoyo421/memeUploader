import express from "express";
import fileUpload from "express-fileupload";
import { getFile, removeLoop } from "./store";

const router = express.Router();
removeLoop();
const MAX_FILE_TTL = Number(process.env.FILE_TTL_MAX);

router.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
router.put("/file", async (req, res) => {
  if (!req?.files?.image)
    return res.status(406).send("Invalid amount of files, need 1"); // Not Acceptable
  /** Time To Last */
  const fileTTL = Number(req.header("file-ttl"));
  if (isNaN(fileTTL)) return res.status(406).send("Must set TTL for the file"); // Not Acceptable
  if (MAX_FILE_TTL < fileTTL)
    return res.status(406).send("Cannot set TTL greater then what is allowed"); // Not Acceptable

  res.json({ greeting: "Hello world!" });
});
router.get("/:id", async (req, res) => {
  try {
    const file = await getFile(req.params.id);
    res.status(200).header({ "content-type": file.mimetype }).send(file.data);
  } catch (e) {
    if ((e as Error).message === "File not found") return res.sendStatus(404);
    else return res.status(500).send(JSON.stringify(e));
  }
});

export default router;

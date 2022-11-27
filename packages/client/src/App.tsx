import React from "react";
import useAsyncFn from "react-use/lib/useAsyncFn";
import isNil from "lodash/isNil";
import { PUTV1File } from "@local/server";
import "./App.css";
import isUrl from "./lib/isUrl";
import { Dialog, FlexRow, InlineSpan } from "./components";
import DnDFile from "./components/DnDFile";
import ModalTextCopy from "./components/ModalTextCopy";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import UploadMemes from "../public/UploadMemes.svg";

function App() {
  const [file, setFile] = React.useState<File>();
  const [error, setError] = React.useState<string>();

  const [{ loading, value }, Submit] = useAsyncFn(
    async (file: File, TTL: number) => {
      const fileData = new FormData();
      fileData.set("image", file);

      const res = await fetch("/v1/file", {
        method: "PUT",
        headers: {
          "file-ttl": TTL.toString(),
        },
        body: fileData,
      });

      if (res.ok) return (await res.json()).url;
      const errorMsg = (await res.json()) as PUTV1File;
      setError(errorMsg.message);
    },
    []
  );

  const formSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      if (e.defaultPrevented) return;
      e.preventDefault();
      const file = (
        e.currentTarget.elements.namedItem("image") as HTMLInputElement | null
      )?.files?.[0];
      const time = (
        e.currentTarget.elements.namedItem("time") as HTMLInputElement | null
      )?.valueAsNumber;
      const unit = parseInt(
        (e.currentTarget.elements.namedItem("unit") as HTMLInputElement | null)
          ?.value || ""
      );

      if (isNil(time) || isNil(unit) || isNil(file)) {
        return setError("Not all values are set");
      }

      Submit(file, time * unit);
    },
    [Submit]
  );

  return (
    <div className="App">
      <h1>
        <img src={UploadMemes} style={{ height: "1em", padding: 5 }} />
        Meme Uploader
      </h1>
      <ModalTextCopy copyText={value} />
      <form
        action="/v1/file"
        onSubmit={formSubmit}
        method="PUT"
        encType="multipart/form-data"
      >
        <InlineSpan style={{ color: "red" }}>{error}</InlineSpan>
        <DnDFile name="image" file={file} onFile={setFile} />
        <FlexRow dir="row" gap={"1em"} padding={"1em"} center>
          <span style={{ alignSelf: "center" }}>Delete After</span>
          <TextField defaultValue={1} type="number" name="time" />
          <Select defaultValue={60} name="unit">
            <MenuItem value={1}>Seconds</MenuItem>
            <MenuItem value={60}>Minues</MenuItem>
            <MenuItem value={3600}>Hours</MenuItem>
          </Select>
        </FlexRow>
        <Button variant="outlined" type="submit" disabled={loading}>
          Upload
        </Button>
      </form>
    </div>
  );
}

export default App;

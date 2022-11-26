import React from "react";
import useAsyncFn from "react-use/lib/useAsyncFn";
import isNil from "lodash/isNil";
import { PUTV1File } from "@local/server";
import "./App.css";
import isUrl from "./lib/isUrl";
import { Dialog, InlineSpan } from "./components";
import DnDFile from "./components/DnDFile";
import Modal from "./components/Modal";

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
      <h1>Meme Uploader</h1>
      <Modal copyText={value} />
      <form
        action="/v1/file"
        onSubmit={formSubmit}
        method="PUT"
        encType="multipart/form-data"
      >
        <InlineSpan style={{ color: "red" }}>{error}</InlineSpan>
        <DnDFile name="image" file={file} onFile={setFile} />
        <div>
          <span>Delete After</span>
          <input defaultValue={1} type="number" name="time" />
          <select defaultValue={60} name="unit">
            <option value={1}>S</option>
            <option value={60}>M</option>
            <option value={3600}>H</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          Upload
        </button>
      </form>
    </div>
  );
}

export default App;

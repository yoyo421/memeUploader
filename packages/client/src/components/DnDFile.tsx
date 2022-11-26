import React from "react";
import { lookup } from "mrmime";
import humanFormat from "human-format";
import {
  InlineSpan,
  HiddenFileInputContainer,
  DropZone,
  HiddenFileInput,
} from ".";

export default function DnDFile(props: {
  name: string;
  file: File | undefined;
  onFile(file: File | undefined): void;
}) {
  const { name, file, onFile } = props;
  const inputId = React.useId();
  const [dndState, setDndState] = React.useState<"none" | "hover" | "drop">(
    "none"
  );
  const [error, setError] = React.useState<string>();

  const onInputFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.defaultPrevented) return;
      e.preventDefault();

      const _setError = (text: string) => {
        onFile(undefined);
        setError(text);
      };

      if (e.currentTarget.files === null) {
        return;
      }
      if (e.currentTarget.files.length > 1) {
        return _setError("Cannot upload more then 1 file");
      }

      const image = e.currentTarget.files.item(0);
      if (!image) {
        return _setError("File is not available");
      }

      const meta = lookup(image.name);
      if (!meta) {
        return _setError("Couldn't determend the file type");
      }

      if (!meta.startsWith("image")) {
        return _setError("Not an image file");
      }

      setError(undefined);
      onFile(image);
    },
    [onFile]
  );

  const dropZoneNode = React.useMemo<React.ReactNode>(() => {
    if (error) {
      return (
        <>
          <InlineSpan>{"Drop / Click to upload an image"}</InlineSpan>
          <InlineSpan style={{ color: "red" }}>{error}</InlineSpan>
        </>
      );
    }
    if (file) {
      return (
        <>
          <InlineSpan>{`Selected ${file.name}`}</InlineSpan>
          <InlineSpan>{`size ${humanFormat.bytes(file.size)}`}</InlineSpan>
        </>
      );
    }
    return <InlineSpan>{"Drop / Click to upload an image"}</InlineSpan>;
  }, [file, error]);

  React.useEffect(() => {
    onFile(file);
  }, [onFile, file]);

  return (
    <>
      <HiddenFileInputContainer>
        <DropZone>{dropZoneNode}</DropZone>
        <HiddenFileInput
          name={name}
          id={inputId}
          type="file"
          onChange={onInputFileChange}
          required
        />
      </HiddenFileInputContainer>
    </>
  );
}

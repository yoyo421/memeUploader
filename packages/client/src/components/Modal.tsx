import React from "react";
import isUrl from "../lib/isUrl";
import copy from "copy-to-clipboard";
import { Dialog, FlexRow } from ".";

export default function Modal(props: {
  copyText: string | undefined;
}): JSX.Element | null {
  const { copyText } = props;

  const [open, setOpen] = React.useState(false);
  const isurl = isUrl(copyText);

  React.useEffect(() => {
    !!copyText && setOpen(true);
  }, [copyText]);

  if (!copyText) return null;

  return (
    <Dialog role="dialog" open={open} style={{ zIndex: 1 }}>
      <p>Successfuly generated a link</p>
      <FlexRow dir="row">
        <div>
          {isurl ? (
            <a role="link" target={"_blank"} href={copyText}>
              {copyText}
            </a>
          ) : (
            <span role="link">{copyText}</span>
          )}
        </div>
        <button onClick={() => copy(copyText)}>Copy</button>
      </FlexRow>
      <button role="button" onClick={() => setOpen(false)}>
        Close
      </button>
    </Dialog>
  );
}

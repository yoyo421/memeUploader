import React from "react";
import isUrl from "../lib/isUrl";
import copy from "copy-to-clipboard";
import { FlexRow } from ".";
import {
  Dialog,
  DialogTitle,
  Button,
  Link,
  DialogActions,
} from "@mui/material";

export default function ModalTextCopy(props: {
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
    <Dialog
      onClose={() => setOpen(false)}
      role="dialog"
      open={open}
      style={{ zIndex: 1 }}
    >
      <DialogTitle>Successfuly generated a link</DialogTitle>
      <FlexRow dir="row" gap={"1em"} padding={"1em"}>
        <div style={{ alignSelf: "center" }}>
          {isurl ? (
            <Link role="link" target={"_blank"} href={copyText}>
              {copyText}
            </Link>
          ) : (
            <span role="link">{copyText}</span>
          )}
        </div>
        <Button variant="outlined" onClick={() => copy(copyText)}>
          Copy
        </Button>
      </FlexRow>
      <DialogActions>
        <Button variant="outlined" role="button" onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

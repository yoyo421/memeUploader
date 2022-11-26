import React from "react";
import styled from "styled-components";

export const DropZone = styled.div({
  position: "relative",
  width: "10em",
  height: "10em",
  borderColor: "black",
  borderWidth: 1,
  borderRadius: "0.2em",
});

export const HiddenFileInputContainer = styled.div({
  position: "relative",
});

export const HiddenFileInput = styled.input({
  position: "absolute",
  top: 0,
  left: 0,
  opacity: 0,
  width: "100%",
  height: "100%",
});

export const InlineSpan = styled.div({
  whiteSpace: "nowrap",
});

export const Dialog = styled.dialog({
  zIndex: 1,
  borderRadius: "1em",
});

export const FlexRow = styled.div(
  (props: { dir: React.CSSProperties["flexDirection"] }) => ({
    display: "flex",
    flexDirection: props.dir,
  })
);

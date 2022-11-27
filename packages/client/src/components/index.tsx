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

export const FileInputContainer = styled.div(
  (props: { isHover?: boolean }) =>
    ({
      transition: "0.2s",
      position: "relative",
      padding: "1em",
      outline: "dashed 2px",
      boxShadow: props.isHover ? "0 0 1em white" : undefined,
    } as const)
);

export const HiddenFileInput = styled.input({
  position: "absolute",
  top: 0,
  left: 0,
  opacity: 0,
  width: "100%",
  height: "100%",
  cursor: "pointer",
});

export const InlineSpan = styled.div({
  whiteSpace: "nowrap",
});

export const Dialog = styled.dialog({
  zIndex: 1,
  borderRadius: "1em",
});

export const FlexRow = styled.div(
  (props: {
    dir?: React.CSSProperties["flexDirection"];
    gap?: React.CSSProperties["gap"];
    padding?: React.CSSProperties["padding"];
    center?: boolean;
  }) => ({
    display: "flex",
    flexDirection: props.dir,
    gap: props.gap,
    padding: props.padding,
    placeContent: props.center ? "center" : undefined,
  })
);

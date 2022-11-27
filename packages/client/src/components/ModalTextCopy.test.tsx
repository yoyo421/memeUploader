import ModalCopy from "./ModalTextCopy";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Modal", () => {
  test("Modal empty", () => {
    render(<ModalCopy copyText={undefined} />);
    expect(screen.queryByRole("dialog")).toBeFalsy();
  });
  test("Modal with text", () => {
    const _render = render(<ModalCopy copyText={"123"} />);

    let elem = screen.getByRole("link");
    expect(elem.tagName).toBe("SPAN");

    _render.rerender(<ModalCopy copyText={"http://link"} />);
    elem = screen.getByRole("link");
    expect(elem.tagName).toStrictEqual("A");
  });
});

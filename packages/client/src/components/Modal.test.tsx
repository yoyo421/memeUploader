import Modal from "./Modal";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Modal", () => {
  test("Modal empty", () => {
    render(<Modal copyText={undefined} />);
    expect(screen.queryByRole("dialog")).toBeFalsy();
  });
  test("Modal with text", () => {
    const _render = render(<Modal copyText={"123"} />);

    let elem = screen.getByRole("link");
    expect(elem.tagName).toBe("SPAN");

    _render.rerender(<Modal copyText={"http://link"} />);
    elem = screen.getByRole("link");
    expect(elem.tagName).toStrictEqual("A");
  });
  test("Modal close & open", () => {
    const _render = render(<Modal copyText={"http://link"} />);
    let elem = screen.getByRole("link");
    expect(elem.tagName).toStrictEqual("A");

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByRole("dialog")).toBeFalsy();

    _render.rerender(<Modal copyText={"123"} />);
    expect(screen.queryByRole("dialog")).toBeTruthy();
  });
});

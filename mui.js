// src/components/molecules/EvalMessage.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EvalMessage from "../EvalMessage";

// mock Carousel so we can detect "rendered vs not rendered" and onRetry forwarding
jest.mock("../Carousel", () => (props) => (
  <button data-testid="carousel" onClick={props.onRetry}>
    carousel({Array.isArray(props.list) ? props.list.length : 0})
  </button>
));

describe("EvalMessage", () => {
  test("returns null for empty latest", () => {
    const { container } = render(<EvalMessage latest={{}} />);
    expect(container).toBeTruthy();
    expect(screen.queryByTestId("carousel")).not.toBeInTheDocument();
  });

  test("shows comment and single suggestion inline (no carousel)", () => {
    const latest = {
      result: "Pass",
      comment: "Looks good",
      suggestion: ["A concise title"],
    };
    render(<EvalMessage latest={latest} />);

    // comment present
    expect(screen.getByText(/Looks good/i)).toBeInTheDocument();

    // no carousel for a single item
    expect(screen.queryByTestId("carousel")).not.toBeInTheDocument();

    // suggestion text present (robust match across nested nodes)
    expect(
      screen.getByText((_, node) => node?.textContent?.includes("A concise title"))
    ).toBeInTheDocument();
  });

  test("renders Carousel for multiple suggestions and forwards onRetry", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    const latest = {
      result: "Fail",
      comment: "Too long",
      suggestion: ["shorten this", "or try that"],
    };

    render(<EvalMessage latest={latest} onRetry={onRetry} />);
    const carouselBtn = screen.getByTestId("carousel");
    expect(carouselBtn).toHaveTextContent("carousel(2)");
    await user.click(carouselBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

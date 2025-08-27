import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EvalMessage from "../EvalMessage";

// Mock Carousel so we can assert it renders and receives onRetry
jest.mock("../Carousel", () => {
  // eslint-disable-next-line react/display-name
  return (props) => (
    <button data-testid="carousel" onClick={props.onRetry}>
      carousel({Array.isArray(props.list) ? props.list.length : 0})
    </button>
  );
});

describe("EvalMessage", () => {
  test("returns null when latest is empty", () => {
    const { container } = render(<EvalMessage latest={{}} />);
    // nothing meaningful rendered
    expect(container).toBeTruthy();
    expect(screen.queryByText(/GenAI Output:/i)).not.toBeInTheDocument();
  });

  test("shows comment and single suggestion inline (no carousel)", () => {
    const latest = {
      result: "Pass",
      comment: "Looks good",
      suggestion: ["A concise title"],
    };
    render(<EvalMessage latest={latest} />);

    // comment is displayed
    expect(screen.getByText(/Looks good/i)).toBeInTheDocument();

    // single suggestion shown as inline caption, not carousel
    expect(screen.getByText(/GenAI Output:/i)).toBeInTheDocument();
    expect(screen.getByText(/A concise title/i)).toBeInTheDocument();
    expect(screen.queryByTestId("carousel")).not.toBeInTheDocument();
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

    // Carousel is rendered
    const carousel = screen.getByTestId("carousel");
    expect(carousel).toBeInTheDocument();
    expect(carousel).toHaveTextContent("carousel(2)");

    // onRetry is forwarded via Carousel
    await user.click(carousel);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

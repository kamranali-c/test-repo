// src/components/molecules/EvalMessage.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EvalMessage from "../EvalMessage";

// Mock Carousel: proves it's rendered and onRetry is forwarded
jest.mock("../Carousel", () => (props) => (
  <button data-testid="carousel" onClick={props.onRetry}>
    carousel({Array.isArray(props.list) ? props.list.length : 0})
  </button>
));

describe("EvalMessage", () => {
  test("returns null when latest is empty", () => {
    const { container } = render(<EvalMessage latest={{}} />);
    expect(container).toBeTruthy();
    expect(screen.queryByTestId("carousel")).not.toBeInTheDocument();
  });

  test("shows comment and renders carousel even for a single suggestion", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    const latest = {
      result: "Pass",
      comment: "Looks good",
      suggestion: ["A concise title"],
    };

    render(<EvalMessage latest={latest} onRetry={onRetry} />);

    expect(screen.getByText(/looks good/i)).toBeInTheDocument();

    const car = screen.getByTestId("carousel");
    expect(car).toHaveTextContent("carousel(1)");
    await user.click(car);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test("renders carousel for multiple suggestions and forwards onRetry", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    const latest = {
      result: "Fail",
      comment: "Too long",
      suggestion: ["shorten this", "or try that"],
    };

    render(<EvalMessage latest={latest} onRetry={onRetry} />);
    const car = screen.getByTestId("carousel");
    expect(car).toHaveTextContent("carousel(2)");
    await user.click(car);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegenerateMINDialog from "../RegenerateMINDialog";

// mock constants map (adjust the path if your relative import differs)
jest.mock("../../modules/im001/consants", () => ({
  FIELD_LABELS: {
    latestUpdate: "Latest update",
    whatDoesThisMean: "What does this mean for our customers and colleagues?",
  },
}));

describe("RegenerateMINDialog", () => {
  test("shows mapped field label from FIELD_LABELS", () => {
    render(
      <RegenerateMINDialog
        open
        fieldName="latestUpdate"
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    expect(
      screen.getByText(/You’ve chosen to regenerate the answer to/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Latest update/i)).toBeInTheDocument();
  });

  test("blocks empty submit and shows helper text", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <RegenerateMINDialog open fieldName="latestUpdate" onClose={jest.fn()} onSubmit={onSubmit} />
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/This field is required\./i)).toBeInTheDocument();
  });

  test("returns trimmed reason on confirm", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <RegenerateMINDialog open fieldName="whatDoesThisMean" onClose={jest.fn()} onSubmit={onSubmit} />
    );

    const textarea = screen.getByRole("textbox", { name: /regeneration notes/i });
    await user.type(textarea, "   try again please   ");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(onSubmit).toHaveBeenCalledWith("try again please");
  });
});




import { formatMajorIncidentData } from "../formatter";

describe("formatMajorIncidentData", () => {
  test("normalizes single-field payload", () => {
    const prev = {};
    const resp = {
      data: {
        field: "title",
        result: "Pass",
        comment: "ok",
        suggestion: "A concise title",
      },
    };

    const out = formatMajorIncidentData(prev, resp);
    expect(out.title).toEqual({
      result: "Pass",
      comment: "ok",
      suggestion: ["A concise title"],
    });
  });

  test("normalizes list payload", () => {
    const prev = {};
    const resp = {
      evaluations: [
        { field: "latestUpdate", result: "Fail", comment: "too long", suggestion: ["shorten it"] },
        { field: "summary", result: "Pass", comment: "", suggestion: "" },
      ],
    };

    const out = formatMajorIncidentData(prev, resp);
    expect(out.latestUpdate.result).toBe("Fail");
    expect(out.latestUpdate.suggestion).toEqual(["shorten it"]);
    expect(out.summary.suggestion).toEqual([]); // empty is normalized to []
  });

  test("normalizes map payload", () => {
    const prev = {};
    const resp = {
      title: { result: "Pass", comment: "good", suggestion: ["ok"] },
      knownRootCause: { result: "Fail", comment: "missing", value: "TBD" },
    };

    const out = formatMajorIncidentData(prev, resp);
    expect(out.title.comment).toBe("good");
    expect(out.title.suggestion).toEqual(["ok"]);
    expect(out.knownRootCause.suggestion).toEqual(["TBD"]); // value mapped into suggestion[]
  });

  test("merges into previous state", () => {
    const prev = {
      title: { result: "Pass", comment: "old", suggestion: ["x"] },
    };
    const resp = {
      data: { field: "summary", result: "Pass", comment: "good", suggestion: "s" },
    };

    const out = formatMajorIncidentData(prev, resp);
    expect(out.title.comment).toBe("old");
    expect(out.summary.suggestion).toEqual(["s"]);
  });
});



import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Carousel from "../../molecules/Carousel";

// We don't need to mock react-slick for these assertions.
// If your environment struggles, you can mock it to a passthrough div.

describe("Carousel", () => {
  test("shows loop button and calls onRetry", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();

    render(<Carousel list={["a"]} onRetry={onRetry} />);

    const loop = screen.getByRole("button", { name: /regenerate suggestions/i });
    await user.click(loop);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test("arrows disabled when only one item", () => {
    render(<Carousel list={["one"]} />);
    const prev = screen.getByRole("button", { name: /previous suggestion/i });
    const next = screen.getByRole("button", { name: /next suggestion/i });
    expect(prev).toBeDisabled();
    expect(next).toBeDisabled();
  });

  test("with 3 items and 2 visible, prev disabled and next enabled initially", () => {
    render(<Carousel list={["a", "b", "c"]} />);
    const prev = screen.getByRole("button", { name: /previous suggestion/i });
    const next = screen.getByRole("button", { name: /next suggestion/i });
    expect(prev).toBeDisabled();
    expect(next).not.toBeDisabled();
  });
});

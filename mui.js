// src/components/molecules/__tests__/EvalMessage.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EvalMessage from "../EvalMessage";

describe("EvalMessage", () => {
  it("renders nothing when result is falsy", () => {
    const { container } = render(<EvalMessage result={null} comment="x" suggestion="y" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders PASS state with comment and suggestion", () => {
    render(
      <EvalMessage
        result="pass"
        comment="Title looks good"
        suggestion="GenAI title suggestion"
      />
    );
    expect(screen.getByText("Title looks good")).toBeInTheDocument();
    expect(screen.getByText(/GenAI Output:/i)).toBeInTheDocument();
    expect(screen.getByText(/GenAI title suggestion/i)).toBeInTheDocument();
  });

  it("renders FAIL state with comment", () => {
    render(
      <EvalMessage
        result="fail"
        comment="Latest update is too short"
        suggestion=""
      />
    );
    expect(screen.getByText("Latest update is too short")).toBeInTheDocument();
    expect(screen.queryByText(/GenAI Output:/i)).not.toBeInTheDocument();
  });
});




// src/pages/__tests__/IM001Form.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

// Mock the POST API used by the form
jest.mock("../../services/api", () => ({
  submitIncidentReview: jest.fn(),
}));
import { submitIncidentReview } from "../../services/api";

 it("submits form, calls API, and displays evaluation messages", async () => {
    const user = userEvent.setup();

    render(<IM001Form statusOptions={statusOptions} countriesOptions={countriesOptions} />);

    await fillRequiredFields(user);

    // Submit
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // API called with mapped payload
    await waitFor(() => {
      expect(submitIncidentReview).toHaveBeenCalledTimes(1);
    });

    // Title evaluation shows
    expect(await screen.findByText("Title looks good")).toBeInTheDocument();
    expect(screen.getByText(/GenAI Output:/i)).toBeInTheDocument();
    expect(screen.getByText(/Consider adding system name/i)).toBeInTheDocument();

    // Summary evaluation shows (fail)
    expect(screen.getByText("Summary is missing customer impact detail")).toBeInTheDocument();
    expect(screen.getByText(/Add affected channels and duration/i)).toBeInTheDocument();

    // Latest update evaluation shows
    expect(screen.getByText("Latest update is recent and actionable")).toBeInTheDocument();

    // Root cause evaluation shows
    expect(screen.getByText("Root cause lacks technical specifics")).toBeInTheDocument();
    expect(screen.getByText(/Add component and config key changed/i)).toBeInTheDocument();
  });

  it("clears evaluation messages when Clear All is clicked", async () => {
    const user = userEvent.setup();

    render(<IM001Form statusOptions={statusOptions} countriesOptions={countriesOptions} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Ensure one eval message visible
    expect(await screen.findByText("Title looks good")).toBeInTheDocument();

    // Clear all
    await user.click(screen.getByRole("button", { name: /clear all/i }));

    // Messages should be gone
    await waitFor(() => {
      expect(screen.queryByText("Title looks good")).not.toBeInTheDocument();
    });
  });

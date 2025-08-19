// src/pages/__tests__/IM001Form.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import IM001Form from "../IM001Form";

jest.mock("../../services/api", () => ({ submitIncidentReview: jest.fn() }));
import { submitIncidentReview } from "../../services/api";

const statusOptions = ["New", "Resolved Under Monitoring", "Resolved"];
const countriesOptions = ["United Kingdom (UK)", "Ireland", "Hong Kong"];

async function fillRequired(user) {
  await user.type(screen.getByLabelText(/incident number/i), "INC1234567");
  await user.type(screen.getByLabelText(/^title$/i), "A valid incident title");
  await user.selectOptions(screen.getByTestId("status-select"), "New");
  await user.type(screen.getByLabelText(/what does this mean/i), "Impact text");
  await user.type(screen.getByLabelText(/latest update/i), "Latest update");
  await user.type(screen.getByLabelText(/known root cause/i), "Root cause");
  await user.type(screen.getByLabelText(/^summary$/i), "Summary");
}

beforeEach(() => {
  jest.clearAllMocks();
  submitIncidentReview.mockResolvedValue({
    titleResult: "pass",
    titleComment: "Title looks good",
    titleSuggestion: "Add system name",
    summaryResult: "fail",
    summaryComment: "Missing detail",
    knownRootCauseResult: "pass",
    latestUpdateResult: "pass",
    whatDoesThisMeanResult: "pass",
  });
});

it("submits and shows EvalMessage without act warnings", async () => {
  const user = userEvent.setup();
  render(<IM001Form statusOptions={statusOptions} countriesOptions={countriesOptions} />);

  await act(async () => { await fillRequired(user); });
  await act(async () => { await user.click(screen.getByRole("button", { name: /submit/i })); });

  await waitFor(() => expect(submitIncidentReview).toHaveBeenCalledTimes(1));
  expect(await screen.findByText("Title looks good")).toBeInTheDocument();
});

it("Clear All removes EvalMessages and errors", async () => {
  const user = userEvent.setup();
  render(<IM001Form statusOptions={statusOptions} countriesOptions={countriesOptions} />);

  await act(async () => { await fillRequired(user); });
  await act(async () => { await user.click(screen.getByRole("button", { name: /submit/i })); });
  expect(await screen.findByText("Title looks good")).toBeInTheDocument();

  // Clear All: prevent blur-driven validation (your component already does this)
  await act(async () => { await user.click(screen.getByRole("button", { name: /clear all/i })); });

  await waitFor(() => {
    expect(screen.queryByText("Title looks good")).not.toBeInTheDocument();
    // no required errors visible after clear
    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
  });
});

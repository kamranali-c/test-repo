// src/components/RegenerateMINDialog.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegenerateMINDialog from "./RegenerateMINDialog";

// Match the import path used inside RegenerateMINDialog
jest.mock("./molecules/TextArea", () => {
  return function MockTextArea(props) {
    const { ariaLabel, placeholder = "Enter your text here...", value, onChange } = props || {};
    return (
      <textarea
        aria-label={ariaLabel || "Regeneration notes"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  };
});

// Match the exact import string used in your dialog for FIELD_LABELS
jest.mock("../modules/im001/consants", () => ({
  FIELD_LABELS: {
    latestUpdate: "Latest update",
    whatDoesThisMean: "What does this mean for our customers and colleagues?",
  },
}));

test("returns trimmed reason on confirm", async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();

  render(
    <RegenerateMINDialog
      open
      fieldName="latestUpdate"
      onClose={jest.fn()}
      onSubmit={onSubmit}
    />
  );

  // We can grab the textarea by its placeholder or role
  const textarea = screen.getByRole("textbox"); // or: getByPlaceholderText(/enter your text here/i)

  // Empty submit shows helper text
  await user.click(screen.getByRole("button", { name: /confirm/i }));
  expect(screen.getByText(/this field is required\./i)).toBeInTheDocument();

  // Now type and confirm; should be trimmed
  await user.type(textarea, "   try again please   ");
  await user.click(screen.getByRole("button", { name: /confirm/i }));
  expect(onSubmit).toHaveBeenCalledWith("try again please");
});

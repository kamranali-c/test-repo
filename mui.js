// src/components/ModelSelector.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModelSelector from "./ModelSelector";

jest.mock("../hooks/useAuth", () => ({ useAuth: jest.fn() }));
import { useAuth } from "../hooks/useAuth";

const openSelect = () => {
  const trigger = screen.getByLabelText(/model/i);
  fireEvent.mouseDown(trigger);
};

describe("ModelSelector (RBAC filtered, no AD lock)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows only Claude when only model:claude is permitted", () => {
    useAuth.mockReturnValue({
      userInfo: { roles: [] },
      hasPermission: (p) => p === "model:claude",
    });

    render(<ModelSelector />);
    openSelect();

    expect(
      screen.getByRole("option", { name: /claude 3\.5 sonnet/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /mistral large/i })
    ).not.toBeInTheDocument();
  });

  test("shows both Claude and Mistral when both permissions are granted", () => {
    useAuth.mockReturnValue({
      userInfo: { roles: [] },
      hasPermission: (p) => p === "model:claude" || p === "model:mistral",
    });

    render(<ModelSelector />);
    openSelect();

    expect(
      screen.getByRole("option", { name: /claude 3\.5 sonnet/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /mistral large/i })
    ).toBeInTheDocument();
  });

  test("falls back to Mistral when no model permissions are granted", () => {
    useAuth.mockReturnValue({
      userInfo: { roles: [] },
      hasPermission: () => false,
    });

    render(<ModelSelector />);
    openSelect();

    expect(
      screen.getByRole("option", { name: /mistral large/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /claude 3\.5 sonnet/i })
    ).not.toBeInTheDocument();
  });

  test("calls onChange with selected model id", () => {
    const handleChange = jest.fn();
    useAuth.mockReturnValue({
      userInfo: { roles: [] },
      hasPermission: (p) => p === "model:claude" || p === "model:mistral",
    });

    render(<ModelSelector onChange={handleChange} />);
    openSelect();
    fireEvent.click(screen.getByRole("option", { name: /mistral large/i }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("mistral-large-latest");
  });

  test("keeps selection valid when permissions change (resets to first allowed)", () => {
    // Start with both allowed, select Mistral
    useAuth.mockReturnValue({
      userInfo: { roles: [] },
      hasPermission: (p) => p === "model:claude" || p === "model:mistral",
    });
    const { rerender } = render(<ModelSelector />);
    openSelect();
    fireEvent.click(screen.getByRole("option", { name: /mistral large/i }));

    // Now only Claude is permitted
    useAuth.mockReturnValue({
      userInfo: { roles: [] },
      hasPermission: (p) => p === "model:claude",
    });
    rerender(<ModelSelector />);

    openSelect();
    // After permissions change, the selected option should be Claude
    expect(
      screen.getByRole("option", { name: /claude 3\.5 sonnet/i })
    ).toHaveAttribute("aria-selected", "true");
  });
});

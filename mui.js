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

    // comment shown
    expect(screen.getByText(/Looks good/i)).toBeInTheDocument();

    // Carousel is rendered with one item (matches current component behavior)
    const car = screen.getByTestId("carousel");
    expect(car).toHaveTextContent("carousel(1)");

    // onRetry is forwarded
    await user.click(car);
    expect(onRetry).toHaveBeenCalledTimes(1);

    // suggestion text appears somewhere in the node tree
    expect(
      screen.getByText((_, node) => node?.textContent?.includes("A concise title"))
    ).toBeInTheDocument();
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

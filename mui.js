beforeAll(() => {
  Object.defineProperty(window, "open", { value: jest.fn(), writable: true });
});

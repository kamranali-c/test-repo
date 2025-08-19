async function fillRequiredFields(user) {
  // Incident Number (min 10 chars)
  await user.type(screen.getByLabelText(/incident number/i), "INC1234567");
  // Title
  await user.type(screen.getByLabelText(/^title$/i), "A valid incident title");
  // Status (from mocked Dropdown)
  await user.selectOptions(screen.getByTestId("status-select"), "New");
  // Impact description
  await user.type(
    screen.getByLabelText(/what does this mean/i),
    "Customers in UK cannot access mobile app"
  );
  // Latest update
  await user.type(
    screen.getByLabelText(/latest update/i),
    "Rollback deployed; monitoring errors"
  );
  // Known root cause
  await user.type(
    screen.getByLabelText(/known root cause/i),
    "Config change on auth gateway"
  );
  // Summary
  await user.type(
    screen.getByLabelText(/^summary$/i),
    "Auth outage impacting sign-in for 20 mins"
  );
}

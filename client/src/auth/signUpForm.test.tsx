import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SignUp, { SignUpProps } from "./signUp";
import { SignUpForm } from "./singUpForm";

const defaultProps: SignUpProps = {
  errors: {},
  onCancel: vi.fn(),
  onSubmit: vi.fn(),
};

it("calls cancel when cancel is pressed", async () => {
  const onCancel = vi.fn();
  render(<SignUp {...defaultProps} onCancel={onCancel} />);

  await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

  expect(onCancel).toHaveBeenCalled();
});

it("submits correct values", async () => {
  const onSubmit = vi.fn();
  const username = "test user";
  const password = "Password1";
  render(<SignUp {...defaultProps} onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText(/username/i), username);
  await userEvent.type(screen.getByLabelText(/^password$/i), password);
  await userEvent.type(screen.getByLabelText(/confirm password/i), password);
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(onSubmit).toHaveBeenCalledWith<SignUpForm[]>({
    username,
    password,
    confirmPassword: password,
  });
});

it("requires that passwords match", async () => {
  const onSubmit = vi.fn();
  render(<SignUp {...defaultProps} onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText(/username/i), "username");
  await userEvent.type(screen.getByLabelText(/^password$/i), "Password1");
  await userEvent.type(screen.getByLabelText(/confirm password/i), "Password2");
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(screen.getByText("Passwords must match")).toBeVisible();
  expect(onSubmit).not.toHaveBeenCalled();
});

it("requires username, password and confirm password", async () => {
  const onSubmit = vi.fn();
  render(<SignUp {...defaultProps} onSubmit={onSubmit} />);

  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(screen.getByText("Username is required")).toBeVisible();
  expect(screen.getByText("Password is required")).toBeVisible();
  expect(screen.getByText("Confirm password is required")).toBeVisible();
  expect(onSubmit).not.toHaveBeenCalled();
});

it.each([
  { password: "2short", error: "Password must be at least 8 characters" },
  { password: "No number", error: "Password must contain at least one number" },
  {
    password: "n0 capital",
    error: "Password must contain at least one uppercase letter",
  },
])("has strong password validation $error", async ({ password, error }) => {
  const onSubmit = vi.fn();
  render(<SignUp {...defaultProps} onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText(/^password$/i), password);
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));
  expect(screen.getByText(error)).toBeVisible();

  expect(onSubmit).not.toHaveBeenCalled();
});

it("automatically focuses username field", async () => {
  render(<SignUp {...defaultProps} />);

  const usernameInput = screen.getByLabelText(/username/i);

  expect(usernameInput).toHaveFocus();
});

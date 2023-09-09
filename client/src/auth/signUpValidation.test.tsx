import { schema } from "./signUpValidation";
import { SignUpForm } from "./singUpForm";

const validValues: SignUpForm = {
  username: "testi",
  password: "Salasana1",
  confirmPassword: "Salasana1",
};

it("valid values does not throw error", async () => {
  const act = schema.validate(validValues);

  await expect(act).resolves.not.toThrow();
});

it.each([
  { username: "", error: "Username is required" },
  { username: "sm", error: "Username must be at least 3 characters" },
  {
    username: "very loooooooooooooooooooooooooooooooooooooooooooooooong name",
    error: "Username must be at most 20 characters",
  },
])("username $username throws $error", async ({ username, error }) => {
  const form: SignUpForm = { ...validValues, username };

  const act = schema.validate(form);

  await expect(act).rejects.toThrow(error);
});

it("requires password", async () => {
  const form: SignUpForm = {
    ...validValues,
    password: "",
    confirmPassword: "",
  };

  const act = schema.validate(form);

  await expect(act).rejects.toThrow(/Password is required/i);
});

it.each([
  { password: "short", error: "Password must be at least 8 characters" },
  {
    password: "n0 uppercase",
    error: "Password must contain at least one uppercase letter",
  },
  { password: "No number", error: "Password must contain at least one number" },
])("password $password throws $error", async ({ password, error }) => {
  const form: SignUpForm = {
    ...validValues,
    password,
    confirmPassword: password,
  };

  const act = schema.validate(form);

  await expect(act).rejects.toThrow(error);
});

it("confirmPassword throws error if not matching password", async () => {
  const form: SignUpForm = {
    ...validValues,
    password: "password",
    confirmPassword: "not matching",
  };

  const act = schema.validate(form);

  await expect(act).rejects.toThrow("Passwords must match");
});

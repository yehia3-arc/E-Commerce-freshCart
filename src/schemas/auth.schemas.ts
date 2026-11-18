import * as zod from "zod";

export const myRegisterSchemas = zod
  .object({
    name: zod
      .string("name must be text")
      .nonempty("name is required")
      .min(3, "min length is 3 chars")
      .max(15, "max length is 15 chars"),

    email: zod
      .email()
      .nonempty("email is required")
      .regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/),
    // phone: zod
    //   .string("must be egyptian phone number")
    //   .nonempty("phone is required")
    //   .regex(/^01[0125][0-9]{8}$/),
    // --- TEMPORARILY OPTIONAL ---
    // To make it required again later, replace this block with the old code above
    phone: zod
      .string()
      .refine((val) => val === "" || /^01[0125][0-9]{8}$/.test(val), {
        message: "must be egyptian phone number",
      }),

    password: zod
      .string()
      .nonempty("password is required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character (#?!@$%^&*-)",
      ),
    rePassword: zod.string().nonempty("repassword is required"),
    terms: zod.boolean(),
  })
  .refine((data) => data.terms === true, {
    message: "You must agree to the terms and conditions",
    path: ["terms"],
  })
  .refine(
    (object) => {
      return object.password === object.rePassword;
    },
    {
      error: "password & repassword not match!",
      path: ["rePassword"],
    },
  );

export type RegisterSchemaType = zod.infer<typeof myRegisterSchemas>;

export const myLoginSchemas = zod.object({
  email: zod.string().nonempty("email is required"),
  password: zod.string().nonempty("password is required"),
});
export type LoginSchemaType = zod.infer<typeof myLoginSchemas>;

export const myProfileSchemas = zod.object({
  name: zod
    .string("name must be text")
    .nonempty("name is required")
    .min(3, "min length is 3 chars")
    .max(15, "max length is 15 chars"),
  email: zod
    .string()
    .nonempty("email is required")
    .email()
    .regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/),
  phone: zod
    .string("must be egyptian phone number")
    .nonempty("phone is required") // ✅ blocks empty submit
    .regex(/^01[0125][0-9]{8}$/, "must be egyptian phone number"), // ✅ your regex
});
export type ProfileSchemaType = zod.infer<typeof myProfileSchemas>;

export const myPasswordSchemas = zod
  .object({
    currentPassword: zod.string().nonempty("current password is required"),
    newPassword: zod
      .string()
      .nonempty("new password is required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character (#?!@$%^&*-)",
      ),
    confirmPassword: zod.string().nonempty("confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });
export type PasswordSchemaType = zod.infer<typeof myPasswordSchemas>;
export const forgotEmailSchema = zod.object({
  email: zod
    .string()
    .nonempty("email is required")
    .email()
    .regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/),
});
export type ForgotEmailType = zod.infer<typeof forgotEmailSchema>;

export const resetCodeSchema = zod.object({
  resetCode: zod
    .string()
    .nonempty("code is required")
    .regex(/^\d{6}$/, "code must be exactly 6 digits"),
});
export type ResetCodeType = zod.infer<typeof resetCodeSchema>;

export const newPasswordSchema = zod
  .object({
    newPassword: zod
      .string()
      .nonempty("password is required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character (#?!@$%^&*-)",
      ),
    confirmPassword: zod.string().nonempty("confirm password is required"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });
export type NewPasswordType = zod.infer<typeof newPasswordSchema>;

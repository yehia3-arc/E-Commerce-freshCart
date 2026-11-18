import * as zod from "zod";

export const CheckoutSchemas = zod.object({
  details: zod.string().nonempty("details is required"),
  phone: zod
    .string()
    .regex(/^01[0125][0-9]{8}$/, "must be egyptian phone number")
    .nonempty("phone is required"),
  city: zod
    .string()

    .nonempty("city is required"),
});
export type checkoutSchemaType = zod.infer<typeof CheckoutSchemas>;

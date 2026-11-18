import * as zod from "zod";

export const myContactSchemas = zod.object({
  name: zod
    .string("name must be text")
    .nonempty("name is required")
    .min(3, "min length is 3 chars")
    .max(50, "max length is 50 chars"),
  email: zod
    .string()
    .nonempty("email is required")
    .email()
    .regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/),
  subject: zod.string().nonempty("please select a subject"),
  message: zod
    .string()
    .nonempty("message is required")
    .min(10, "message must be at least 10 chars"),
});

export type ContactSchemaType = zod.infer<typeof myContactSchemas>;

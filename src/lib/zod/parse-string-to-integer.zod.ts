import { z } from 'zod';

// this schema will parse strings to integers
//if NAN, it will parse to null instead

export default function getParseStringToIntegerSchema() {
  return (
    z
      .string()
      // this can also be nullish
      // nullish = can be null or undefined
      // optional = can be undefined
      .transform((value, ctx) => {
        const number = parseInt(value);

        if (isNaN(number)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Cannot be parsed to an integer',
          });
          return z.NEVER;
        }
        return number;
      })
  );
}

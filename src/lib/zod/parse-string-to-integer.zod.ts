import { z } from 'zod';

// this schema will parse strings to integers
//if NAN, it will parse to null instead

export default function getParseStringToIntegerSchema(
  defaultValue: number | null = null,
) {
  return (
    z
      .string()
      // this can also be nullish
      // nullish = can be null or undefined
      // optional = can be undefined
      .optional()
      .transform((value) => {
        if (!value) {
          return defaultValue;
        }

        const number = parseInt(value);

        if (isNaN(number)) {
          return null;
        }
        return number;
      })
  );
}

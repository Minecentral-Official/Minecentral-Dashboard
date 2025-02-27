// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getChangedFields<T extends Record<string, any>>(
  defaultValues: T,
  currentValues: T,
): Partial<T> {
  const changedData: Partial<T> = {};

  Object.entries(currentValues).forEach(([key, value]) => {
    if (value !== defaultValues[key as keyof T]) {
      changedData[key as keyof T] = value;
    }
  });

  return changedData;
}

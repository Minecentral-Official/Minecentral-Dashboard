import { useRouter, useSearchParams } from 'next/navigation';

export function useUpdateSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    SearchParamsConsume(params, updates);

    router.push(`?${params.toString()}`, { scroll: false });
  };
}

/* This will take current URLSearchParams object, then a normal object
 * Example {search: null, page: 20}
 * Any null values will be deleted from the params object, else adds it to the params
 * */
export function SearchParamsConsume(
  params: URLSearchParams,
  values: Record<string, string | string[] | null>,
) {
  Object.entries(values).forEach(([key, value]) => {
    params.delete(key); // Remove existing key before setting new values

    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v)); // Append multiple values
    } else if (value) {
      params.set(key, value); // Set single value
    }
  });
}

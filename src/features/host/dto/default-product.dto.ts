import type hostGetProducts from '@/features/host/queries/products/products.get';

export function DTOProductDefault({
  metadata,
  ...restProduct
}: Awaited<ReturnType<typeof hostGetProducts>>[number]) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isDefaultPlan, ...restMetadata } = metadata;

  return {
    ...restProduct,
    metadata: restMetadata,
  };
}

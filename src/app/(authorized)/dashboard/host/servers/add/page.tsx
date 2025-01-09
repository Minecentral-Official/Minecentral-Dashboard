import Link from 'next/link';

import { Button } from '@/components/ui/button';
import hostGetProducts from '@/features/host/queries/products.get';

export default async function Page() {
  const products = await hostGetProducts();
  return (
    <div>
      {products.map(({ name, prices, id }) => (
        <div key={id}>
          <h5>{name}</h5>
          <div>
            {prices.map(({ id, price }) => (
              <Button key={id}>
                <Link href={`/dashboard/host/servers/add/${id}`}>{price}</Link>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

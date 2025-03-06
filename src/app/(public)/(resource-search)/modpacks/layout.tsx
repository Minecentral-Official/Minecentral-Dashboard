import { PropsWithChildren } from 'react';

import ResourceLayout from '@/features/resources/shared-routes/layout';

export default async function Page({ children }: PropsWithChildren) {
  return <ResourceLayout {...{ children }} />;
}

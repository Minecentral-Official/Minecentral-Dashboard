'use client';

import { Button } from '@/components/ui/button';
import resourcePublishAction from '@/features/resources/actions/publish-resource.action';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceButtonPublish({
  status,
  id,
}: Pick<T_DTOResource, 'status' | 'id'> & {
  liked: boolean;
}) {
  const handleClick = async () => {
    await resourcePublishAction(id);
  };
  if (status === 'accepted') return <></>;
  return <Button onClick={handleClick}>Publish Resource</Button>;
}

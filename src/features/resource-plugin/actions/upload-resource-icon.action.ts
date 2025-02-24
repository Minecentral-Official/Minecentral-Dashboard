'use server';

import resourceUploadImage from '@/features/resource-plugin/mutations/upload-image.resource';
import {
  ACTIVITY,
  activityAddAction,
} from '@/lib/activity/mutations/activity.add';

export default async function resourceUploadIconAction(
  userId: string,
  resourceId: number,
  imageUrl: string,
) {
  const pluginData = await resourceUploadImage(resourceId, imageUrl);

  await activityAddAction(
    userId,
    ACTIVITY.EDIT_RESOURCE,
    `${pluginData[0].title}`,
    `Uploaded New Icon`,
  );

  return;

  // redirect(
  //   `/resources/${pluginData[0].id}/?toast-success=true&toast-message=Resource%20icon%20updated&toast-id=icon-upload`,
  // );
}

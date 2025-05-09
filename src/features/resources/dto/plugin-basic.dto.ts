import { z } from 'zod';

import { T_ResourceDBData } from '@/features/resources/types/t-resource-db-data.type';
import { C_ResourceType } from '@/lib/configs/c-resource-type.config';

const ResourceTypeSchema = z.enum(C_ResourceType);

export default function DTOResource({
  id,
  title,
  subtitle,
  categories,
  description,
  languages,
  linkSource,
  linkSupport,
  linkDiscord,
  linkDonation,
  linkIssues,
  slug,
  status,
  updatedAt,
  createdAt,
  user,
  iconUrl,
  downloads,
  likes,
  type,
}: T_ResourceDBData) {
  return {
    id,
    title,
    subtitle,
    categories,
    description,
    languages,
    linkSource,
    linkSupport,
    linkDiscord,
    linkDonation,
    linkIssues,
    slug,
    status,
    updatedAt,
    createdAt,
    iconUrl,
    downloads,
    likes,
    type: ResourceTypeSchema.parse(type),
    author: {
      image: user.image,
      name: user.name,
      id: user.id,
    },
  };
}

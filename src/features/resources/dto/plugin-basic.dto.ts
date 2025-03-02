import { T_ResourceDBData } from '@/features/resources/types/t-resource-db-data.type';

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
    type,
    author: {
      image: user.image,
      name: user.name,
      id: user.id,
    },
  };
}

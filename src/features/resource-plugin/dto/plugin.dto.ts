import { Resource } from '@/features/resource-plugin/types/resource.type';

export default function DTOResourcePlugin({
  id,
  title,
  subtitle,
  categories,
  description,
  discord,
  downloads,
  language,
  linkSource,
  linkSupport,
  releaseId,
  updatedAt,
  createdAt,
  versionSupport,
  user,
}: Resource) {
  return {
    id,
    title,
    subtitle,
    categories,
    description,
    discord,
    downloads,
    language,
    linkSource,
    linkSupport,
    releaseId,
    updatedAt,
    createdAt,
    versionSupport,
    author: {
      image: user.image,
      name: user.name,
      id: user.id,
    },
  };
}

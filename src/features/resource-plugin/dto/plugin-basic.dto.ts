import { PluginDataBase } from '@/features/resource-plugin/types/resource.type';

export default function DTOResourcePluginBasic({
  id,
  title,
  subtitle,
  categories,
  description,
  discord,
  downloads,
  languages,
  linkSource,
  linkSupport,
  updatedAt,
  createdAt,
  versionSupport,
  user,
  tags,
  iconUrl,
}: PluginDataBase) {
  return {
    id,
    title,
    subtitle,
    categories,
    description,
    discord,
    downloads,
    languages,
    linkSource,
    linkSupport,
    updatedAt,
    createdAt,
    versionSupport,
    tags,
    iconUrl,
    author: {
      image: user.image,
      name: user.name,
      id: user.id,
    },
  };
}

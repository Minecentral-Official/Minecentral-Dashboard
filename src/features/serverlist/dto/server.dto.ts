import { T_ServerDBData } from '@/features/serverlist/types/t-server-datebase.type';

export default function DTOServer({
  id,
  title,
  ip,
  port,
  categories,
  description,
  languages,
  linkDiscord,
  slug,
  updatedAt,
  createdAt,
  user,
  iconUrl,
  votes,
}: T_ServerDBData) {
  return {
    id,
    title,
    ip,
    port,
    categories,
    description,
    languages,
    linkDiscord,
    slug,
    updatedAt,
    createdAt,
    iconUrl,
    votes,
    author: {
      image: user.image,
      name: user.name,
      id: user.id,
    },
  };
}

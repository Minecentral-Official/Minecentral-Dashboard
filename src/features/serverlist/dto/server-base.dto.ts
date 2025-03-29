import { T_ServerDBData_Base } from '@/features/serverlist/types/t-server-db.type';

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
}: T_ServerDBData_Base) {
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
    author: {
      image: user.image,
      name: user.name,
      id: user.id,
    },
  };
}

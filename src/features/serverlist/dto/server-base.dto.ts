import { T_ServerDBData_Base } from '@/features/serverlist/types/t-server-db.type';

export default function DTOServer({
  id,
  title,
  ip,
  port,
  categories,
  platforms,
  status,
  description,
  languages,
  linkDiscord,
  slug,
  updatedAt,
  createdAt,
  user,
  iconUrl,
  voteCooldownHours,
}: T_ServerDBData_Base) {
  return {
    id,
    title,
    ip,
    port,
    categories,
    platforms,
    status,
    description,
    languages,
    linkDiscord,
    slug,
    updatedAt,
    createdAt,
    iconUrl,
    voteCooldownHours,
    author: {
      image: user.image,
      name: user.name,
      id: user.id,
    },
  };
}

import { PanelServer } from 'pterodactyl.ts';

export function pteroServerDTO({
  id,
  identifier,
  feature_limits,
  egg,
  allocation,
  name,
  limits,
  node,
  created_at,
  description,
  nest,
  container,
}: Awaited<PanelServer>) {
  return {
    id,
    identifier,
    feature_limits,
    egg,
    allocation,
    name,
    limits,
    node,
    created_at,
    description,
    nest,
    container,
  };
}

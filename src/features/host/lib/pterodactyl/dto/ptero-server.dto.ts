import { PanelServer } from 'pterodactyl.ts';

export function pteroServerDTO(pteroServerData: Awaited<PanelServer>) {
  const {
    id,
    identifier,
    feature_limits,
    name,
    limits,
    node,
    created_at,
    description,
  } = pteroServerData as unknown as Awaited<
    PanelServer & {
      feature_limits: PanelServer['feature_limits'] & { splits: number };
    }
  >;
  return {
    id,
    identifier,
    feature_limits,
    name,
    limits,
    node,
    created_at,
    description,
  };
}

import DTOResourcePluginBasic from '@/features/resource-plugin/dto/plugin-basic.dto';
import { PluginData } from '@/features/resource-plugin/types/resource.type';

export default function DTOResourcePlugin({ releases, ...rest }: PluginData) {
  return {
    ...DTOResourcePluginBasic(rest),
    releases,
    release: {
      ...releases[0],
    },
  };
}

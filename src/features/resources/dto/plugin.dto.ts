import DTOResourcePluginBasic from '@/features/resources/dto/plugin-basic.dto';
import { PluginData_All } from '@/features/resources/types/resource.type';

export default function DTOResourcePlugin({
  releases,
  ...rest
}: PluginData_All) {
  return {
    ...DTOResourcePluginBasic(rest),
    releases,
    release: {
      ...releases[0],
    },
  };
}

import DTOResource from '@/features/resources/dto/plugin-basic.dto';
import DTOResource_WithReleases from '@/features/resources/dto/plugin.dto';

export type T_DTOResource = ReturnType<typeof DTOResource>;
//Will return the type of the DTOResource_WithReleases function
//Used to determine the input types for front end components
export type T_DTOResource_WithReleases = ReturnType<
  typeof DTOResource_WithReleases
>;

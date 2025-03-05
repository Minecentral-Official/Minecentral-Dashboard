import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export type T_ResourcesResponse = {
  resources: T_DTOResource[] | [];
  totalPages: number;
};

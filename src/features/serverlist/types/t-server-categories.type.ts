import { C_ServerCategories } from '@/features/serverlist/config/c-server-categories.config';

export type T_ServerCategories = typeof C_ServerCategories;
export type T_ServerCategory = T_ServerCategories[number];

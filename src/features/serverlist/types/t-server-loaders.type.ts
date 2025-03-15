import { C_ServerLoaders } from '@/features/serverlist/config/c-server-loaders.config';

export type T_ServerLoaders = typeof C_ServerLoaders;
export type T_ServerLoader = T_ServerLoaders[number];

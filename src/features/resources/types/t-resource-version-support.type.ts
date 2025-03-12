import { C_GameVersions } from '@/features/resources/config/c-game-versions.config';

export type TPluginVersions = typeof C_GameVersions;
export type TPluginVersion = TPluginVersions[number];

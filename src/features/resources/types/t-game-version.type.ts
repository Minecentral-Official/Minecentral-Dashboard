import { C_GameVersions } from '@/features/resources/config/c-game-versions.config';

export type T_GameVersions = typeof C_GameVersions;
export type T_GameVersion = T_GameVersions[number];

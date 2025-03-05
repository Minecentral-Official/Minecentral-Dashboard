import { C_ResourceVersionSupport } from '@/features/resources/config/resource-version-support.config';

export type TPluginVersions = typeof C_ResourceVersionSupport;
export type TPluginVersion = TPluginVersions[number];

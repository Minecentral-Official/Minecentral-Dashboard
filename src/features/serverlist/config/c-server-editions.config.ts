export const C_ServerEditions = ['java', 'bedrock'] as const;

export type T_ServerEdition = (typeof C_ServerEditions)[number];

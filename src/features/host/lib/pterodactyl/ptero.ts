import { ApplicationClient } from 'pterodactyl.ts';

export const pteroServer = new ApplicationClient({
  apikey: process.env.PTERO_API_KEY || '',
  panel: process.env.PTERO_API_URL || '',
});

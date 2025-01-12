import { ApplicationClient, UserClient } from 'pterodactyl.ts';

import { serverEnv } from '@/lib/env/server.env';

export const pteroServer = new ApplicationClient({
  apikey: serverEnv.HOST_PTERO_API_KEY,
  panel: serverEnv.HOST_PTERO_API_URL,
});

export const pteroClient = new UserClient({
  apikey: 'ptlc_GZo3pyedNJbSgV23fDYkmmF9DuUQbaCDPIhdJfzfYOr',
  panel: serverEnv.HOST_PTERO_API_URL,
});

import { User } from 'better-auth';
import { UserBuilder } from 'pterodactyl.ts';

import { pteroServer } from '@/features/host/pterodactyl/ptero';

export async function pterodactylCreateUser(user: User) {
  try {
    const pteroUserBuilder: UserBuilder = new UserBuilder();

    // Use user or names to set first and last names
    pteroUserBuilder.setFirstName(user.name);
    pteroUserBuilder.setLastName(`N/A`);

    // Generate a username
    pteroUserBuilder.setUsername(
      `${user.name}_${Math.floor(Math.random() * 1000)}`,
    );

    // Set email (assuming customer.email is defined elsewhere)
    pteroUserBuilder.setEmail(user.email);

    return await pteroServer.createUser(pteroUserBuilder);
  } catch {
    //User might already be created
    const allPteroUsers = await pteroServer.getUsers();
    const currentPteroUser = allPteroUsers.find(
      (pteroUser) => pteroUser.email === user.email,
    );
    if (!currentPteroUser) {
      throw new Error('No current ptero user found');
    }
    return currentPteroUser;
  }
}

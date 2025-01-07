'use server';
// This one we'd want it to be a server action, so just 'use server at the top'
// import 'server-only';

//Adds a server for a user

export default async function updateHostServerMutation({
  userId,
  pterodactylId,
}: {
  userId: string;
  pterodactylId: string;
}) {
  // just returning here to satisfy eslint unused vars rule. Eventually this will connect to db and create a server for a userr
  return {
    userId,
    pterodactylId,
  };
}

import 'server-only';

//Adds a server for a user
export default async function addHostServer({
  user_id,
  server_id,
}: {
  user_id: string;
  server_id: string;
}) {
  // just returning here to satisfy eslint unused vars rule. Eventually this will connect to db and create a server for a userr
  return {
    user_id,
    server_id,
  };
}

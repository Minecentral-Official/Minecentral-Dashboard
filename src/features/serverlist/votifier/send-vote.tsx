import * as net from 'net';

import { serverlist_EncryptVote } from '@/features/serverlist/votifier/encrypt-vote';

interface VotifierServer {
  ip: string;
  port: number;
  publicKey: string;
}

interface VoteData {
  serviceName: string;
  username: string;
  address: string;
  timestamp: number;
}

/**
 * Sends a vote to a Minecraft server using the Votifier protocol
 */
export async function serverlist_sendVotifierVote(
  server: VotifierServer,
  vote: VoteData,
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    try {
      // Format the vote data according to Votifier protocol
      const voteString = [
        'VOTE',
        vote.serviceName,
        vote.username,
        vote.address,
        vote.timestamp.toString(),
      ].join('\n');

      // Encrypt the vote data with the server's public key
      const encryptedVote = serverlist_EncryptVote(
        voteString,
        server.publicKey,
      );

      // Create a socket connection to the server
      const client = new net.Socket();
      // let responseData = '';

      // Set a timeout for the connection
      client.setTimeout(10000); // 10 seconds

      // client.on('data', (data) => {
      //   responseData += data.toString();
      // });

      client.on('close', () => {
        resolve({
          success: true,
          message: 'Vote successfully sent to server',
        });
      });

      client.on('error', (err) => {
        resolve({
          success: false,
          message: `Failed to connect to server: ${err.message}`,
        });
      });

      client.on('timeout', () => {
        client.destroy();
        resolve({
          success: false,
          message: 'Connection to server timed out',
        });
      });

      // Connect to the server and send the encrypted vote
      client.connect(server.port, server.ip, () => {
        client.write(encryptedVote);
      });
    } catch (error) {
      resolve({
        success: false,
        message: `Error sending vote: ${(error as Error).message}`,
      });
    }
  });
}

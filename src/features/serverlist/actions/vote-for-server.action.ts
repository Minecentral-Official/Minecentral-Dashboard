'use server';

import { revalidateTag } from 'next/cache';

import serverSaveUserVote from '@/features/serverlist/mutations/vote.user';
import { serverUserHasVoted } from '@/features/serverlist/queries/user-has-voted.boolean';
import { serverGetVotifierByServerId } from '@/features/serverlist/queries/votifier-by-server-id';
import { serverlist_sendVotifierVote } from '@/features/serverlist/votifier/send-vote';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function serverVoteForServer(
  serverId: string,
  mc_username: string,
) {
  //Validate user
  const { user } = await validateSession();
  if (!user)
    return { success: false, message: 'Please sign-in to register your vote!' };
  // Validate username
  if (!mc_username || mc_username.trim().length < 3) {
    return {
      success: false,
      message:
        'Please enter a valid Minecraft username (at least 3 characters)',
    };
  }

  // Check if the user has voted recently
  const hasVoted = await serverUserHasVoted(serverId, user.id);

  if (hasVoted) {
    return {
      success: false,
      message: 'You can only vote once every 24 hours for each server.',
    };
  }

  // Get server details to check for Votifier
  const votifier = await serverGetVotifierByServerId(serverId);
  if (!votifier || !votifier.enabled) {
    return {
      success: false,
      message: 'Server does not have votifier enabled!',
    };
  }

  // Save the vote in our database
  await serverSaveUserVote(serverId, user.id);
  // await saveVote(serverId, currentUserId!, username);

  // If the server has Votifier enabled, send the vote to the Minecraft server

  try {
    const votifierResult = await serverlist_sendVotifierVote(
      {
        ip: votifier.ip,
        port: votifier.port!,
        publicKey: votifier.publicKey!,
      },
      {
        serviceName: 'Minecentral',
        username: mc_username,
        address: 'minecentral.net', // IP address of voter (optional, can be your website's IP)
        timestamp: Math.floor(Date.now() / 1000),
      },
    );

    if (!votifierResult.success) {
      console.error('Votifier error:', votifierResult.message);
      // We still count the vote on our site even if Votifier fails
    }
  } catch (error) {
    console.error('Error sending Votifier vote:', error);
    // We still count the vote on our site even if Votifier fails
  }

  // Revalidate the page to show updated vote count
  revalidateTag(`server-id-${serverId}`);

  return {
    success: true,
    message: 'Vote successful!',
  };
}

'use server';

import crypto from 'crypto';

import { and, desc, eq, gte, or } from 'drizzle-orm';
import { cookies, headers } from 'next/headers';

import serverSaveUserVote from '@/features/serverlist/mutations/vote.user';
import { serverGetById } from '@/features/serverlist/queries/server-by-id.get';
import { serverGetVotifierByServerId } from '@/features/serverlist/queries/votifier-by-server-id';
import { serverlist_sendVotifierVote } from '@/features/serverlist/votifier/send-vote';
import getSession from '@/lib/auth/helpers/get-session';
import { db } from '@/lib/db';
import { serverVotesTable } from '@/lib/db/schema';
import { serverEnv } from '@/lib/env/server.env';

const VOTER_COOKIE = 'minecentral_server_voter';

function hashValue(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function validMinecraftUsername(username: string) {
  return /^[A-Za-z0-9_]{3,16}$/.test(username);
}

export default async function serverVoteForServer(
  serverId: string,
  mcUsername?: string,
) {
  const server = await serverGetById(serverId);
  if (!server || server.status !== 'published')
    return { success: false, message: 'Server listing not found.' };

  const votifier = await serverGetVotifierByServerId(serverId);
  const rewardDeliveryEnabled = votifier?.enabled === true;
  const minecraftUsername = mcUsername?.trim();

  if (rewardDeliveryEnabled) {
    if (!minecraftUsername)
      return { success: false, message: 'Minecraft username is required.' };
    if (!validMinecraftUsername(minecraftUsername))
      return { success: false, message: 'Enter a valid Minecraft username.' };
  }

  const cookieStore = await cookies();
  let anonymousVoterId = cookieStore.get(VOTER_COOKIE)?.value;
  if (!anonymousVoterId) {
    anonymousVoterId = crypto.randomUUID();
    cookieStore.set(VOTER_COOKIE, anonymousVoterId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: serverEnv.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }

  const headerStore = await headers();
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerStore.get('x-real-ip') ||
    'unknown';
  const userAgent = headerStore.get('user-agent') || 'unknown';
  const ipHash = hashValue(ip);
  const userAgentHash = hashValue(userAgent);
  const session = await getSession();

  const cooldownHours = server.voteCooldownHours || 24;
  const cooldownStart = new Date(Date.now() - cooldownHours * 60 * 60 * 1000);
  const latestVote = await db.query.serverVotesTable.findFirst({
    where: and(
      eq(serverVotesTable.serverId, serverId),
      gte(serverVotesTable.voteTime, cooldownStart),
      or(
        eq(serverVotesTable.anonymousVoterId, anonymousVoterId),
        and(
          eq(serverVotesTable.ipHash, ipHash),
          eq(serverVotesTable.userAgentHash, userAgentHash),
        ),
      ),
    ),
    orderBy: desc(serverVotesTable.voteTime),
  });

  if (latestVote) {
    const nextAllowedAt = new Date(
      latestVote.voteTime.getTime() + cooldownHours * 60 * 60 * 1000,
    );
    return {
      success: false,
      message: `You can vote again at ${nextAllowedAt.toLocaleString()}.`,
      nextAllowedAt,
    };
  }

  const vote = await serverSaveUserVote({
    serverId,
    anonymousVoterId,
    ipHash,
    userAgentHash,
    userId: session?.user.id,
    minecraftUsername: rewardDeliveryEnabled ? minecraftUsername : undefined,
    votifierEnabledAtVote: rewardDeliveryEnabled,
    votifierDeliveryStatus:
      rewardDeliveryEnabled ? 'failed' : 'not_configured',
  });

  if (
    rewardDeliveryEnabled &&
    votifier?.ip &&
    votifier.port &&
    votifier.publicKey &&
    minecraftUsername
  ) {
    const result = await serverlist_sendVotifierVote(
      {
        ip: votifier.ip,
        port: votifier.port,
        publicKey: votifier.publicKey,
      },
      {
        serviceName: 'Minecentral',
        username: minecraftUsername,
        address: ip,
        timestamp: Math.floor(Date.now() / 1000),
      },
    );

    await db
      .update(serverVotesTable)
      .set({
        votifierDeliveryStatus: result.success ? 'sent' : 'failed',
        votifierDeliveryError: result.success ? null : result.message,
      })
      .where(eq(serverVotesTable.id, vote.id));
  }

  return {
    success: true,
    message: 'Vote counted.',
  };
}

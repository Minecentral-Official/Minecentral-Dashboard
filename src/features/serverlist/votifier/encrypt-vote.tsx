import * as crypto from 'crypto';

/**
 * Encrypts vote data with the server's public key
 */
export function serverlist_EncryptVote(
  voteData: string,
  publicKey: string,
): Buffer {
  try {
    // Convert PEM format if needed
    const formattedKey =
      publicKey.includes('-----BEGIN PUBLIC KEY-----') ? publicKey : (
        `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`
      );

    // Encrypt the vote data
    const encrypted = crypto.publicEncrypt(
      {
        key: formattedKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(voteData),
    );

    return encrypted;
  } catch (error) {
    throw new Error(`Encryption failed: ${(error as Error).message}`);
  }
}

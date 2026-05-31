import { Keypair } from "@solana/web3.js";
import { encryptPrivateKey } from "./crypto";

export interface ManagedWallet {
  publicKey: string;
  encryptedPrivateKey: string;
}

/**
 * Generate a fresh Solana keypair for a managed-wallet user.
 * The private key is AES-256-GCM encrypted before being returned.
 * It should be stored in the DB; the user never sees the raw secret key.
 */
export function generateManagedWallet(): ManagedWallet {
  const keypair = Keypair.generate();

  return {
    publicKey: keypair.publicKey.toBase58(),
    encryptedPrivateKey: encryptPrivateKey(keypair.secretKey),
  };
}

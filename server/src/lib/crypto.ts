import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_HEX = process.env.WALLET_ENCRYPTION_SECRET!;

function getKey(): Buffer {
  if (!KEY_HEX || KEY_HEX.length !== 64) {
    throw new Error(
      "WALLET_ENCRYPTION_SECRET must be a 64-character hex string (32 bytes). " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }
  return Buffer.from(KEY_HEX, "hex");
}

/**
 * Encrypt a Solana private key (Uint8Array) → returns a hex string
 * Format: iv(24 hex) + ":" + authTag(32 hex) + ":" + ciphertext(hex)
 */
export function encryptPrivateKey(secretKeyBytes: Uint8Array): string {
  const key = getKey();
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const plaintext = Buffer.from(secretKeyBytes);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

/**
 * Decrypt an encrypted private key string → returns Uint8Array
 */
export function decryptPrivateKey(encryptedStr: string): Uint8Array {
  const key = getKey();
  const [ivHex, authTagHex, ciphertextHex] = encryptedStr.split(":");

  if (!ivHex || !authTagHex || !ciphertextHex) {
    throw new Error("Invalid encrypted private key format");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return new Uint8Array(decrypted);
}

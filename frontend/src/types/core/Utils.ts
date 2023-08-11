import { PublicKey } from "@solana/web3.js";

/**
 * Takes a list and chunks it into smaller lists of size `size`.
 * 
 * @param list 
 * @param size 
 * @returns A list of lists
 */
export function chunk<T>(list: T[], size: number): T[][] {
  return list.reduce((acc, cur, i) => {
    const idx = Math.floor(i / size);
    acc[idx] = acc[idx] || [];
    acc[idx].push(cur);
    return acc;
  }, [] as T[][]);
}

/**
 * Shortens a signature to a given length.
 * 
 * @param sig 
 * @param len 
 * @returns A shortened signature
 */
export function shortenSignature(sig: string, len: number = 16): string {
  return `${sig.substring(0, len)}...${sig.substring(sig.length - len)}`;
}

/**
 * Shortens a public key to a given length.
 * 
 * @param pubkey 
 * @param len 
 * @returns A shortened public key
 */
export function shortenPubkey(pubkey: PublicKey, len: number = 6): string {
  const address = pubkey.toBase58();
  return `${address.substring(0, len)}...${address.substring(address.length - len)}`;
}
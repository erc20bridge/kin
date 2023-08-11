import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getProvider } from "./Provider";
import * as program from "../program/swap_and_burn";

const PREFIX_POOL_STATE = "pool_state";
const PREFIX_POOL_VAULT = "pool_vault";

export async function getPool(address: PublicKey) : Promise<program.Pool> {
    const { connection } = getProvider();
    return await program.Pool.fromAccountAddress(connection(), address)
}

export async function getPoolStatePda(burnMint: PublicKey, swapMint: PublicKey) : Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(PREFIX_POOL_STATE),
      SystemProgram.programId.toBuffer(),
      burnMint.toBuffer(),
      swapMint.toBuffer(),
    ],
    program.PROGRAM_ID
  )
}

export async function getPoolVaultPda(pool: PublicKey, mint: PublicKey) : Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(PREFIX_POOL_VAULT),
      pool.toBuffer(),
      mint.toBuffer(),
    ],
    program.PROGRAM_ID
  )
}
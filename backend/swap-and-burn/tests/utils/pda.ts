import { PublicKey, SystemProgram } from "@solana/web3.js";
import { 
  PREFIX_POOL_STATE,
  PREFIX_POOL_VAULT,
} from "../utils/config";
import { TestEnv } from "../utils/env";

export async function getPoolStatePda(env: TestEnv) : Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(PREFIX_POOL_STATE),
      SystemProgram.programId.toBuffer(),
      env.burnMint.toBuffer(),
      env.swapMint.toBuffer(),
    ],
    env.program.programId
  )
}

export async function getPoolVaultPda(env: TestEnv, pool: PublicKey, mint: PublicKey) : Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(PREFIX_POOL_VAULT),
      pool.toBuffer(),
      mint.toBuffer(),
    ],
    env.program.programId
  )
}
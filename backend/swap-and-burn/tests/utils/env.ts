import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SwapAndBurn } from "../../target/types/swap_and_burn";
import { createMint, createAccount, mintTo } from "@solana/spl-token";
import { PublicKey, Keypair } from "@solana/web3.js";
import { SAFE_REQ_TIMEOUT, } from "../utils/config"
import { getTokenAccount, } from "../utils/spl";
import { api_wait } from "../utils/wait";

export interface TestEnv {
  provider: anchor.AnchorProvider;
  program: anchor.Program<SwapAndBurn>;

  burnMint: PublicKey;
  swapMint: PublicKey;

  reserves: Keypair;
  reservesTokenAccount: PublicKey;

  user: Keypair,
  userOldTokenAccount: PublicKey,
  userNewTokenAccount: PublicKey,

  pool?: PublicKey,
  sendVault?: PublicKey,
  receiveVault?: PublicKey,
}

export async function NewTestEnv(provider: anchor.AnchorProvider, burnMintDecimals: number, swapMintDecimals: number) : Promise<TestEnv> {
  const program = anchor.workspace.SwapAndBurn as Program<SwapAndBurn>;

  const burnMintAuthority = Keypair.generate();
  const swapMintAuthority = Keypair.generate();

  const reserves = Keypair.generate();
  const user = Keypair.generate();

  // Give reserves some SOL to pay for things
  await api_wait(SAFE_REQ_TIMEOUT);
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(reserves.publicKey, 100000000)
    , "confirmed"
  );

  // Give user some SOL to pay for things
  await api_wait(SAFE_REQ_TIMEOUT);
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(user.publicKey, 100000000)
    , "confirmed"
  );


  // Create the mints
  await api_wait(SAFE_REQ_TIMEOUT);
  const burnMint = await createMint(provider.connection, reserves, burnMintAuthority.publicKey, null, burnMintDecimals);
  await api_wait(SAFE_REQ_TIMEOUT);
  const swapMint = await createMint(provider.connection, reserves, swapMintAuthority.publicKey, null, swapMintDecimals);
  
  // Create the token accounts
  await api_wait(SAFE_REQ_TIMEOUT);
  const reservesTokenAccount = await createAccount(provider.connection, reserves, swapMint, reserves.publicKey)
  await api_wait(SAFE_REQ_TIMEOUT);
  const userOldTokenAccount = await createAccount(provider.connection, user, burnMint, user.publicKey)
  await api_wait(SAFE_REQ_TIMEOUT);
  const userNewTokenAccount = await createAccount(provider.connection, user, swapMint, user.publicKey)
  
  // Mint tokens
  await api_wait(SAFE_REQ_TIMEOUT);
  await mintTo(provider.connection, reserves, burnMint, userOldTokenAccount, burnMintAuthority, 123 * Math.pow(10, burnMintDecimals))
  await api_wait(SAFE_REQ_TIMEOUT);
  await mintTo(provider.connection, reserves, swapMint, reservesTokenAccount, swapMintAuthority, 123 * Math.pow(10, swapMintDecimals))

  const env = {
    provider,
    program,

    burnMint: burnMint,
    swapMint: swapMint,

    reserves: reserves,
    reservesTokenAccount: reservesTokenAccount,

    user: user,
    userOldTokenAccount: userOldTokenAccount,
    userNewTokenAccount: userNewTokenAccount,
  } as TestEnv;

  return env;
}

export async function printEnvState(env: TestEnv) {
  await api_wait(SAFE_REQ_TIMEOUT);

  var tokenAccount = await getTokenAccount(env, env.userOldTokenAccount)
  var res = JSON.stringify(tokenAccount);
  console.log(`\t user token account (burn mint):\n ${res}`);

  tokenAccount = await getTokenAccount(env, env.userNewTokenAccount)
  res = JSON.stringify(tokenAccount);
  console.log(`\t user token account (swap mint):\n ${res}`);

  if (env.sendVault != null) {
    tokenAccount = await getTokenAccount(env, env.sendVault)
    res = JSON.stringify(tokenAccount);
    console.log(`\t send vault:\n ${res}`);
  }

  if (env.receiveVault != null) {
    tokenAccount = await getTokenAccount(env, env.receiveVault)
    res = JSON.stringify(tokenAccount);
    console.log(`\t receive vault:\n ${res}`);
  }
}
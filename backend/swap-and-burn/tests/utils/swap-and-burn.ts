import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
    sendAndConfirmRawTransaction,
    SystemProgram,
    SYSVAR_RENT_PUBKEY
} from "@solana/web3.js";
import { TestEnv } from "./env";
import { getPoolStatePda, getPoolVaultPda } from "./pda";
import { createAndSignTransaction, Result } from "./transaction";

export async function initializePool(env: TestEnv): Promise<String> {
    const [pool] = await getPoolStatePda(env);
    const [sendVault] = await getPoolVaultPda(env, pool, env.swapMint);
    const [receiveVault] = await getPoolVaultPda(env, pool, env.burnMint);

    env.pool = pool;
    env.sendVault = sendVault;
    env.receiveVault = receiveVault

    const ix = await env.program.methods.initializePool(
    ).accounts({
        pool: pool,
        sendVault: sendVault,
        receiveVault: receiveVault,
        nonce: SystemProgram.programId,
        burnFromMint: env.burnMint,
        swapToMint: env.swapMint,
        payer: env.reserves.publicKey, 
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
    }).instruction();

    const tx = await createAndSignTransaction(env,
        env.reserves,
        [ ix ],
        [ ]
    );

    return sendAndConfirm(env, tx);
}

export async function swapAndBurn(env: TestEnv): Promise<String> {
    const ix = await env.program.methods.swapAndBurn(
    ).accounts({
        pool: env.pool,
        sendVault: env.sendVault,
        receiveVault: env.receiveVault,
        burnFromMint: env.burnMint,
        swapToMint: env.swapMint,
        source: env.userOldTokenAccount,
        destination: env.userNewTokenAccount,
        owner: env.user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
    }).instruction();

    const tx = await createAndSignTransaction(env,
        env.user,
        [ ix ],
        [ ]
    );

    return sendAndConfirm(env, tx);
}

async function sendAndConfirm(env: TestEnv, tx: Result): Promise<String> {
    await sendAndConfirmRawTransaction(env.provider.connection, tx.rawTx, {
        skipPreflight: false,
        commitment: "recent",
    });

    return tx.signatures[0];
}

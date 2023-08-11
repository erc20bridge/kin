import { createAssociatedTokenAccountIdempotentInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { Transaction, TransactionInstruction } from "@solana/web3.js";
import { getProvider, getWallet, getConfig } from "./Provider";
import * as program from "../program/swap_and_burn";
import { getPoolStatePda } from "./Pool";

export async function signSwapAndBurnTx(): Promise<Transaction> {
    const { swapMint, burnMint } = getConfig().value;
    const { connection } = getProvider();

    const [poolAddress, _] = await getPoolStatePda(burnMint, swapMint);
    const poolState = await program.Pool.fromAccountAddress(connection(), poolAddress);
    const pool = poolAddress;
    const {
        sendVault,
        receiveVault,
        burnFromMint,
        swapToMint,
    } = poolState;

    const { feePayer, signTransaction } = getWallet();

    const owner = feePayer;
    const source = await getAssociatedTokenAddress(burnFromMint, owner);
    const destination = await getAssociatedTokenAddress(swapToMint, owner);

    const ix: TransactionInstruction[] = [
        createAssociatedTokenAccountIdempotentInstruction(
            feePayer,
            destination,
            owner,
            swapToMint,
        ),
        program.createSwapAndBurnInstruction(
            {
                pool,
                sendVault,
                receiveVault,
                burnFromMint,
                swapToMint,
                source,
                destination,
                owner,
            },
        )
    ];

    const bh = await connection().getRecentBlockhash();
    const tx = new Transaction();
    tx.add(...ix);
    tx.feePayer = feePayer;
    tx.recentBlockhash = bh.blockhash;

    // Add the payee signature and submit the transaction
    return await signTransaction(tx);
}


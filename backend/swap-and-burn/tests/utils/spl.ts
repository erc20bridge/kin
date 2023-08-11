import { PublicKey } from "@solana/web3.js";
import { Account, transfer, getAccount, } from "@solana/spl-token";
import { TestEnv } from "../utils/env";
import { SAFE_REQ_TIMEOUT, } from "../utils/config"
import { api_wait } from "../utils/wait";

export async function depositIntoPool(env: TestEnv): Promise<String> {
    const tokenAccount = await getTokenAccount(env, env.reservesTokenAccount)
    return transfer(env.provider.connection, env.reserves, env.reservesTokenAccount, env.sendVault, env.reserves, tokenAccount.amount)
}

export async function getTokenAccount(env: TestEnv, address: PublicKey): Promise<Account> {
    await api_wait(SAFE_REQ_TIMEOUT);
    return getAccount(env.provider.connection, address, "confirmed")
}

// TypeError: Do not know how to serialize a BigInt
BigInt.prototype.toJSON = function() { return this.toString() }

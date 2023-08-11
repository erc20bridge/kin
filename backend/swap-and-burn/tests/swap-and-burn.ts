import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";
import { NewTestEnv, printEnvState } from './utils/env';
import { initializePool, swapAndBurn } from "./utils/swap-and-burn";
import { depositIntoPool, getTokenAccount, } from "./utils/spl";


describe("swap-and-burn", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  it("test it", async () => {
    for (let burnMintDecimals = 0; burnMintDecimals < 5; burnMintDecimals++) {
      for (let swapMintDecimals = 0; swapMintDecimals < 5; swapMintDecimals++) {
        const env = await NewTestEnv(provider, burnMintDecimals, swapMintDecimals);

        await initializePool(env)
        await depositIntoPool(env)

        await printEnvState(env)

        await swapAndBurn(env)

        await printEnvState(env)

        var tokenAccount = await getTokenAccount(env, env.userOldTokenAccount)
        assert.equal(tokenAccount.amount, BigInt(0))
        var tokenAccount = await getTokenAccount(env, env.userNewTokenAccount)
        assert.equal(tokenAccount.amount, BigInt(123 * Math.pow(10, swapMintDecimals)))

        var tokenAccount = await getTokenAccount(env, env.sendVault)
        assert.equal(tokenAccount.amount, BigInt(0))
        var tokenAccount = await getTokenAccount(env, env.receiveVault)
        assert.equal(tokenAccount.amount, BigInt(123 * Math.pow(10, burnMintDecimals)))
      }
    }
  });
});

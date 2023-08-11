/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category InitializePool
 * @category generated
 */
const initializePoolStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'InitializePoolInstructionArgs'
)
/**
 * Accounts required by the _initializePool_ instruction
 * @category Instructions
 * @category InitializePool
 * @category generated
 */
export type InitializePoolInstructionAccounts = {
  pool: web3.PublicKey
  sendVault: web3.PublicKey
  receiveVault: web3.PublicKey
  nonce: web3.PublicKey
  burnFromMint: web3.PublicKey
  swapToMint: web3.PublicKey
  payer: web3.PublicKey
}

const initializePoolInstructionDiscriminator = [
  95, 180, 10, 172, 84, 174, 232, 40,
]

/**
 * Creates a _InitializePool_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 *
 * @category Instructions
 * @category InitializePool
 * @category generated
 */
export function createInitializePoolInstruction(
  accounts: InitializePoolInstructionAccounts
) {
  const {
    pool,
    sendVault,
    receiveVault,
    nonce,
    burnFromMint,
    swapToMint,
    payer,
  } = accounts

  const [data] = initializePoolStruct.serialize({
    instructionDiscriminator: initializePoolInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: pool,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: sendVault,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: receiveVault,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: nonce,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: burnFromMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: swapToMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: payer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
  ]

  const ix = new web3.TransactionInstruction({
    programId: new web3.PublicKey(
      'v32YSnVQDJfpVZm21APm5V7j1R3xCKU6VbsZRtAXb9A'
    ),
    keys,
    data,
  })
  return ix
}

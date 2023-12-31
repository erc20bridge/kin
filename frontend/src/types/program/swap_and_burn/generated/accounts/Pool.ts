/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import { DataVersion, dataVersionBeet } from '../types/DataVersion'

/**
 * Arguments used to create {@link Pool}
 * @category Accounts
 * @category generated
 */
export type PoolArgs = {
  dataVersion: DataVersion
  bump: number
  nonce: web3.PublicKey
  burnFromMint: web3.PublicKey
  swapToMint: web3.PublicKey
  sendVault: web3.PublicKey
  sendVaultBump: number
  receiveVault: web3.PublicKey
  receiveVaultBump: number
}

const poolDiscriminator = [241, 154, 109, 4, 17, 177, 109, 188]
/**
 * Holds the data for the {@link Pool} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class Pool implements PoolArgs {
  private constructor(
    readonly dataVersion: DataVersion,
    readonly bump: number,
    readonly nonce: web3.PublicKey,
    readonly burnFromMint: web3.PublicKey,
    readonly swapToMint: web3.PublicKey,
    readonly sendVault: web3.PublicKey,
    readonly sendVaultBump: number,
    readonly receiveVault: web3.PublicKey,
    readonly receiveVaultBump: number
  ) {}

  /**
   * Creates a {@link Pool} instance from the provided args.
   */
  static fromArgs(args: PoolArgs) {
    return new Pool(
      args.dataVersion,
      args.bump,
      args.nonce,
      args.burnFromMint,
      args.swapToMint,
      args.sendVault,
      args.sendVaultBump,
      args.receiveVault,
      args.receiveVaultBump
    )
  }

  /**
   * Deserializes the {@link Pool} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [Pool, number] {
    return Pool.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Pool} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey
  ): Promise<Pool> {
    const accountInfo = await connection.getAccountInfo(address)
    if (accountInfo == null) {
      throw new Error(`Unable to find Pool account at ${address}`)
    }
    return Pool.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Deserializes the {@link Pool} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [Pool, number] {
    return poolBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link Pool} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return poolBeet.serialize({
      accountDiscriminator: poolDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Pool}
   */
  static get byteSize() {
    return poolBeet.byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Pool} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      Pool.byteSize,
      commitment
    )
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link Pool} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === Pool.byteSize
  }

  /**
   * Returns a readable version of {@link Pool} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      dataVersion: 'DataVersion.' + DataVersion[this.dataVersion],
      bump: this.bump,
      nonce: this.nonce.toBase58(),
      burnFromMint: this.burnFromMint.toBase58(),
      swapToMint: this.swapToMint.toBase58(),
      sendVault: this.sendVault.toBase58(),
      sendVaultBump: this.sendVaultBump,
      receiveVault: this.receiveVault.toBase58(),
      receiveVaultBump: this.receiveVaultBump,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const poolBeet = new beet.BeetStruct<
  Pool,
  PoolArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['dataVersion', dataVersionBeet],
    ['bump', beet.u8],
    ['nonce', beetSolana.publicKey],
    ['burnFromMint', beetSolana.publicKey],
    ['swapToMint', beetSolana.publicKey],
    ['sendVault', beetSolana.publicKey],
    ['sendVaultBump', beet.u8],
    ['receiveVault', beetSolana.publicKey],
    ['receiveVaultBump', beet.u8],
  ],
  Pool.fromArgs,
  'Pool'
)
